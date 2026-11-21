#!/usr/bin/env node
// Capture PNG screenshots of pages with a locally installed Chrome/Chromium, over the DevTools protocol.
// No npm packages: needs Node 22+ (global WebSocket) and a Chrome, Chromium, Edge or Brave binary.
//
//   node shoot.mjs shots.json            # a shot list (see templates/shots.example.json)
//   node shoot.mjs --url http://localhost:4173/ --out assets/01-home.png [--size 1440x900] [--scale 2]
//                  [--wait 1500] [--until "window.ready === true"] [--setup "localStorage.clear()"]
//                  [--eval "document.querySelector('#start').click()"] [--full] [--dark] [--lang zh-CN]
//
// Each shot: open url → run `setup` (before reload, e.g. seed localStorage) → reload → run each `steps` entry
// (JS strings or {click, type, wait, until}) → wait until `until` is true and the page has stopped changing →
// capture. Shots in one list share one browser profile, so state set by an earlier shot carries over.
// Optional per shot: "log" (a JS expression printed at capture time, e.g. the status text shown), "hide"
// (CSS selectors hidden just before capture), "clip" ({x, y, width, height} in CSS px), "still": false.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].filter(Boolean);

function parseArgs(argv) {
  if (argv[0] && !argv[0].startsWith('--')) {
    const file = resolve(argv[0]);
    const list = JSON.parse(readFileSync(file, 'utf8'));
    const base = dirname(file);
    const defaults = list.defaults || {};
    return (list.shots || list).map((s) => ({ ...defaults, ...s, out: resolve(base, s.out) }));
  }
  const o = { steps: [] };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i].replace(/^--/, ''), v = argv[i + 1];
    if (k === 'full' || k === 'dark') { o[k] = true; continue; }
    if (k === 'still') { o.still = v !== 'false'; i++; continue; }
    if (k === 'eval') o.steps.push(v); else o[k] = v;
    i++;
  }
  if (!o.url || !o.out) { console.error('need --url and --out, or a shot list file'); process.exit(2); }
  o.out = resolve(o.out);
  return [o];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch() {
  const bin = CANDIDATES.find((p) => existsSync(p));
  if (!bin) throw new Error('No Chrome found. Set CHROME_PATH to a Chrome/Chromium binary.');
  const profile = mkdtempSync(join(tmpdir(), 'shoot-'));
  const port = 9300 + Math.floor(Math.random() * 500);
  const proc = spawn(bin, [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio',
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist', 'about:blank',
  ], { stdio: 'ignore' });
  let ws;
  for (let i = 0; i < 80 && !ws; i++) {
    await sleep(150);
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = tabs.find((t) => t.type === 'page');
      if (page) ws = page.webSocketDebuggerUrl;
    } catch {}
  }
  if (!ws) { proc.kill(); throw new Error('Chrome did not open a DevTools port'); }
  return { proc, ws, profile };
}

function client(url) {
  const sock = new WebSocket(url);
  let id = 0;
  const pending = new Map(), listeners = [];
  sock.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    else listeners.forEach((f) => f(m));
  };
  const ready = new Promise((r, j) => { sock.onopen = r; sock.onerror = j; });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); sock.send(JSON.stringify({ id: i, method, params })); });
  const once = (method, ms = 30000) => new Promise((res) => { const t = setTimeout(res, ms); listeners.push((m) => { if (m.method === method) { clearTimeout(t); res(m.params); } }); });
  return { ready, send, once, close: () => sock.close() };
}

async function evaluate(c, expr) {
  const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
  if (r.exceptionDetails) throw new Error(`page error in: ${expr.slice(0, 80)}\n${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
  return r.result.value;
}

async function waitFor(c, expr, ms = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { try { if (await evaluate(c, `!!(${expr})`)) return true; } catch {} await sleep(200); }
  throw new Error(`timed out waiting for: ${expr}`);
}

// Wait until two consecutive low-res frames match: catches entrance animations and growing 3D scenes.
async function waitStill(c, ms = 15000) {
  const t0 = Date.now();
  let prev = null;
  while (Date.now() - t0 < ms) {
    const { data } = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 30, clip: await viewportClip(c, 0.25) });
    if (data === prev) return true;
    prev = data;
    await sleep(400);
  }
  return false;
}

async function viewportClip(c, scale = 1) {
  const m = await c.send('Page.getLayoutMetrics');
  const v = m.cssLayoutViewport || m.layoutViewport;
  return { x: 0, y: 0, width: v.clientWidth, height: v.clientHeight, scale };
}

async function step(c, s) {
  if (typeof s === 'string') return evaluate(c, s);
  if (s.wait) return sleep(s.wait);
  if (s.until) return waitFor(c, s.until, s.timeout);
  if (s.click) return evaluate(c, `(() => { const el = document.querySelector(${JSON.stringify(s.click)}); if (!el) throw new Error('no element ' + ${JSON.stringify(s.click)}); el.scrollIntoView({block:'center'}); el.click(); })()`);
  if (s.type) return evaluate(c, `(() => { const el = document.querySelector(${JSON.stringify(s.type)}); el.focus(); el.value = ${JSON.stringify(s.text || '')}; el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); })()`);
  throw new Error('unknown step ' + JSON.stringify(s));
}

async function shoot(c, s) {
  const [w, h] = String(s.size || '1440x900').split('x').map(Number);
  const scale = Number(s.scale || 2);
  await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: scale, mobile: !!s.mobile });
  const lang = s.lang || 'en-US';
  await c.send('Network.setUserAgentOverride', { userAgent: (await evaluate(c, 'navigator.userAgent')).replace('HeadlessChrome', 'Chrome'), acceptLanguage: lang });
  try { await c.send('Emulation.setLocaleOverride', { locale: lang }); } catch {}
  await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: s.dark ? 'dark' : 'light' }, { name: 'prefers-reduced-motion', value: s.reducedMotion ? 'reduce' : 'no-preference' }] });
  let loaded = c.once('Page.loadEventFired');
  await c.send('Page.navigate', { url: s.url });
  await loaded;
  if (s.setup) {
    await evaluate(c, s.setup);
    loaded = c.once('Page.loadEventFired');
    await c.send('Page.reload', { ignoreCache: true });
    await loaded;
  }
  await evaluate(c, 'document.fonts ? document.fonts.ready.then(() => true) : true');
  for (const st of s.steps || []) await step(c, st);
  if (s.until) await waitFor(c, s.until, s.timeout || 30000);
  if (s.wait) await sleep(Number(s.wait));
  const still = s.still === false ? true : await waitStill(c, Number(s.stillTimeout || 15000));
  if (s.hide) await evaluate(c, `(() => { const st = document.createElement('style'); st.textContent = ${JSON.stringify(s.hide)} + '{visibility:hidden !important}'; document.head.appendChild(st); })()`);
  const jpg = /\.jpe?g$/i.test(s.out);   // .jpg/.jpeg outputs are saved as JPEG (quality 88), everything else as PNG
  const params = { format: jpg ? 'jpeg' : 'png', ...(jpg ? { quality: 88 } : {}), captureBeyondViewport: !!s.full };
  if (s.clip) params.clip = { ...s.clip, scale: 1 };
  if (s.full && !s.clip) { const m = await c.send('Page.getLayoutMetrics'); const cs = m.cssContentSize || m.contentSize; params.clip = { x: 0, y: 0, width: cs.width, height: cs.height, scale: 1 }; }
  const { data } = await c.send('Page.captureScreenshot', params);
  mkdirSync(dirname(s.out), { recursive: true });
  writeFileSync(s.out, Buffer.from(data, 'base64'));
  if (s.log) console.log(`       log: ${JSON.stringify(await evaluate(c, s.log))}`);
  const errors = await evaluate(c, 'window.__shootErrors || []');
  console.log(`${still ? 'ok   ' : 'MOVING'} ${Math.round((params.clip?.width ?? w) * scale)}x${Math.round((params.clip?.height ?? h) * scale)}  ${s.out}${errors.length ? '  page errors: ' + errors.join(' | ') : ''}`);
  if (!still) console.log('       the page was still changing when captured; raise "wait" or add an "until" condition, then look at the image');
}

const shots = parseArgs(process.argv.slice(2));
const { proc, ws, profile } = await launch();
const c = client(ws);
let failed = 0;
try {
  await c.ready;
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('Network.enable');
  await c.send('Page.addScriptToEvaluateOnNewDocument', { source: "window.__shootErrors = []; addEventListener('error', e => window.__shootErrors.push(String(e.message)));" });
  for (const s of shots) {
    try { await shoot(c, s); } catch (e) { failed++; console.log(`FAIL  ${s.out}\n      ${e.message}`); }
  }
} finally {
  c.close(); proc.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
process.exit(failed ? 1 : 0);

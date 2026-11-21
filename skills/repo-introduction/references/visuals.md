# Visuals: covers and screenshots

A cover has two separate tests: **does the user like how it looks**, and **does it say the right thing about this project**. Passing one is not passing the other. A screenshot has one test: **is it a true, finished picture of the real app**.

## 1. Decide what the cover must say

Before choosing a style, write one sentence about the relationship the picture must show, in the project's own terms:

| Project | Weak subject | Relationship to show |
|---|---|---|
| ringcay (ring → island of memories) | a ring; a cute island | every part of the ring has a reason: the bench, the table, the stones and the engraving each lead to a photo or story |
| Script → video segments | a play button | one performance that stays continuous across cuts |
| Spreadsheet → decision UI | a bar chart | numbers that change for a traceable reason |
| This skill | a README icon | every line on the homepage points to its source |

Check it against the project's own design rules before going further. If the project says previews must come from the real renderer, the cover must too. If the owner moved away from a style (luma-tape's direction rejects nostalgic watercolour), keep that style off the cover even if the product still offers it. Borrow the product's fonts, colour tokens and recurring marks (luma-tape: Instrument Serif, DM Mono, crop marks, "( fig. 01 )" labels, colour chips with hex values) so the cover reads as the same product.

Then decide the subject, composition, palette and type. Fill [the cover brief](../templates/cover-brief.md): what to express, what could mislead, which dimensions the user already liked or rejected, and how this cover must differ from the owner's other projects.

## 2. Choose how to make it

### a. Render from the project's own code (default when it has a visual core)

If the product draws something (3D, maps, charts, generated images, a distinctive UI), draw the cover **with the product's own code**: import its modules, build a staged scene with real objects, and compose the result in an editorial layout with type, annotations and callouts.

Why this wins over image generation:
- It is the actual product. Shapes, materials and proportions cannot drift into something the product cannot make.
- Feedback maps to parameters. "The band is too plain" becomes "add a bezel stone, five accent stones, a vine engraving and milgrain edges"; nothing else moves.
- Text is real type in real fonts, in any language.
- It is reproducible: commit the script, re-render after the product changes, export 2× by URL flag.

How it was done for ringcay: a separate `hero.html` + `hero.js` imported the app's ring and island kit (Three.js), staged one ring with an island inside, rendered a main view and two close-ups (used as "photos" in polaroid frames), and composed everything on a 1920×1080 canvas: headline, handwritten captions, callout lines from each object to its story, a soft leaf shadow and film grain. A tiny local server saved the canvas output to `out/`. `?scale=2` produced 3840×2160.

When the product's code needs a bundler (Vite, webpack), put the cover page inside the project (for example `assets-src/cover.html`) and open it through the project's dev server, so `import { drawPattern } from '/src/patterns.js'` just works. The first load of a dev server can take a minute while it optimises dependencies; give `shoot.mjs` a `--timeout 120000`.

Real exports from the app are good material too (a PNG the user exported from their own design). If an export has a white background baked in, make the white transparent before reprinting it on a coloured base.

### b. Compose real material in HTML (default otherwise)

For CLIs, libraries, skills, and apps without a strong visual core, compose real material (screenshots, terminal output, code lines, real data) in [the cover template](../templates/cover.html): a 1920×1080 HTML page with absolutely positioned blocks, SVG callouts computed from element positions, and a grain overlay. Capture it:

```sh
node scripts/shoot.mjs --url "file://$PWD/assets-src/cover.html" --out assets/hero.png \
  --size 1920x1080 --scale 1 --until "window.coverReady"
```

Use `--scale 2` for 3840×2160. A WebGL scene embedded in the page is captured too (the script enables SwiftShader).

### c. AI image generation (only for what code cannot draw)

Use it for photographic people, lifestyle scenes or textures. Rules:
- Ask before using paid credits, and say which tool.
- Never let it draw UI, product screens, logos or text. Add text afterwards as real type.
- Composite the generated element into a layout from (a) or (b) rather than shipping a raw generation.
- Label the result as a concept illustration.

Generated covers drifted repeatedly in past work: wrong product category, cute or toy-like scenes, grey palettes, unrelated subjects that "looked nice". Those are the failure modes to check for.

## 3. The render → review loop

Never send the first render. For every iteration:

1. Render and **open the PNG yourself** at full size.
2. Write down the weaknesses, concretely: "the grass reads as a game", "the caption almost touches the edge", "the callout crosses body text", "the figures in the close-up are crude".
3. Fix the worst ones; render again.
4. When it holds up, send **one** numbered candidate (`01`, then `01b` for a revision of it, `02` for a new direction). Say which project it is for, what it expresses, how it was made, and the weaknesses you still see.

When the user replies:
- Change **only** what they named. "The band is too plain" → change the band; keep the scene, layout, captions and palette.
- Record what they liked and what they rejected separately for style and for subject.
- "I like this style" is not approval of the image. Only an explicit "this one" selects it.
- One project at a time. Do not prepare candidates for other repositories in the same round.

## 4. Composition rules that have worked

- 16:9, 1920×1080, with a 3840×2160 export when the cover may be reused elsewhere.
- One clear subject, large enough to read on a phone in the README.
- Callouts that connect an element to its meaning make an abstract product concrete: element → line → photo, note or code.
- A short headline is fine; the title must not overpower the subject. Real type only.
- Editorial, mature, Pinterest/Instagram-like rather than cute: real materials, film grain, handwritten notes, generous space.
- Each of the owner's projects gets its own metaphor, composition and palette; do not reuse one template look.
- When a callout line crosses text or a card touches the frame edge, fix it. These read as sloppy at once.

## 5. Screenshots of the real app

Use `scripts/shoot.mjs`. It launches the local Chrome headless, sets the viewport, device scale, language, colour scheme and reduced motion, runs setup steps, waits, checks that the page has stopped changing, and writes a PNG.

```json
{
  "defaults": { "size": "1440x1000", "scale": 2, "lang": "en-US" },
  "shots": [
    { "url": "http://127.0.0.1:4173/?theme=day", "out": "../assets/01-home.png", "setup": "localStorage.clear()", "wait": 2000 },
    { "url": "http://127.0.0.1:4173/#/editor", "out": "../assets/02-editor.png",
      "steps": [{ "click": "[data-act=start]" }, { "type": "#title", "text": "The Long Way Home" }, { "wait": 800 }],
      "until": "document.querySelector('.island.ready')" }
  ]
}
```

Rules:
- **Wait for the finished state.** The script compares frames and prints `MOVING` if the page was still changing. Raise `wait`, add an `until` condition that matches the app's ready state, or click through to the end of an animation. A Codex screenshot of ringcay was taken while the island was still growing and showed a bare green blob; it had to be dropped.
- Continuously animated pages (spinning 3D, video) never stand still: set `"still": false` and choose the moment with `until`/`wait`, then look at the image.
- **Fictional sample data, entered through the real UI**, or seeded with `setup` into the app's own storage format (read the app's save/normalise code to get the keys right; this reaches a precise state such as one theme in one print style without clicking through the UI). Never real user data or private paths. Say in the README that the example is fictional.
- Same viewport and scale for the whole set (1440×1000 at 2× → 2880×2000 is a good default; phones: `390x844`, scale 3, `"mobile": true`).
- Capture in the README's language (`lang`) and the theme the README describes (`dark`, or the app's own `?theme=`).
- Hide debug overlays and cookie banners with `"hide": ".selector, .other"`.
- If one shot looks different from the others (buttons missing, a dimmed screen), find out why before calling it a bug or a bad capture. EverPaw fades its buttons after 7 seconds without input on purpose; that became a point in its README.
- To caption a capture with what the app really said at that moment, add `"log": "document.querySelector('.status').textContent"`; it prints at capture time. Use `textContent`, not `innerText`, when the element is hidden for the shot. To catch a behaviour that happens at random (a pet falling asleep), wait for it with an `until` on that text.
- **Making pieces in a creative app.** When the app makes something (a glass tree, a drawing), make the sample through its real input: dispatch pointer and keyboard events from the page (a held button that calls `setPointerCapture` on a synthetic pointer may silently fail; its keyboard shortcut works). Then save the app's own draft from storage to `assets-src/` (a page cannot write files: post it to a tiny local receiver), and seed that draft in `setup` for every later shot. The pieces stay the same across re-renders.
- Heavy WebGL (transmission, thousands of meshes) can crawl under the default software renderer, so time-based animations never finish. Run with `SHOOT_ANGLE=metal` (macOS) to use the real GPU.
- For cover material, capture the same states again with the interface hidden (`"hide"`), in a separate shot list, so the cover can crop freely without UI text inside the frame.
- Output names ending in `.jpg` are saved as JPEG (quality 88). Prefer JPEG for screenshots when the repository is also a live site, so the deploy stays light.
- Open every PNG before using it. Reject empty states, half-loaded fonts, spinners, overlapping toasts and wrong language.
- Name them `01-…png`, `02-…png` in reading order and reference them with relative paths.

The built-in browser pane is good for exploring the app and finding selectors, but its screenshots are not saved as files; use `shoot.mjs` for anything that goes into the repository.

## 6. Final assets

- Copy the selected render to `assets/hero.png` and confirm it is byte-identical to the approved candidate (`cmp`).
- Convert very large 2× exports to JPEG (macOS: `sips -s format jpeg -s formatOptions 90 in.png --out out.jpg`).
- Keep the cover's source and render command in the repository; delete rejected candidates from the public tree or keep them outside it.
- Alt text describes what the picture shows and why it matters, not "cover image".
- Under a concept cover that shows people, places or UI-like scenes, add: *Concept illustration, not a screenshot; the people and stories in it are made up.* Use the same line in both languages.

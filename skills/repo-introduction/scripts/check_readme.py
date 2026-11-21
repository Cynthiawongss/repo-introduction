#!/usr/bin/env python3
"""Check a bilingual README pair before publishing. Standard library only.

    python3 check_readme.py [REPO_DIR] [--pair README.md README.zh-CN.md] [--source app/ --source src/]

Reports:
  FAIL  broken relative links or images, local absolute paths, unfilled {{placeholders}}, missing language switch
  WARN  numbers, images, commands or code that differ between the two languages; images without alt text,
        large or oddly sized images; quoted UI labels / identifiers not found in the source folders
Exit code 1 if any FAIL. WARN lines are things to look at, not proof of a problem.
"""
import argparse, os, re, struct, sys
from urllib.parse import unquote

LINK = re.compile(r'(!?)\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)')
HTML_SRC = re.compile(r'<(?:img|source|a)\b[^>]*?(?:src|href|srcset)="([^"]+)"', re.I)
FENCE = re.compile(r'^(```|~~~)[^\n]*\n(.*?)^\1\s*$', re.S | re.M)
LOCAL_PATH = re.compile(r'(/Users/[^\s)\]]+|/private/(?:tmp|var)/[^\s)\]]+|/home/[a-z][^\s)\]]+|[A-Z]:\\\\[^\s)\]]+|file://[^\s)\]]+)')
NUMBER = re.compile(r'(?<![\w.#/-])(\d+(?:[.,]\d+)?)(?![\w/-])')

out = {'FAIL': 0, 'WARN': 0}
def say(level, msg):
    if level in out: out[level] += 1
    print(f'{level:5} {msg}')

def strip_code(md):
    md = FENCE.sub('', md)
    return re.sub(r'`[^`\n]+`', '', md)

def image_size(path):
    with open(path, 'rb') as f:
        head = f.read(32)
        if head[:8] == b'\x89PNG\r\n\x1a\n':
            return struct.unpack('>II', head[16:24])
        if head[:2] == b'\xff\xd8':
            f.seek(2)
            while True:
                b = f.read(1)
                while b and b != b'\xff': b = f.read(1)
                while b == b'\xff': b = f.read(1)
                if not b: return None
                if b[0] in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    f.read(3); h, w = struct.unpack('>HH', f.read(4)); return (w, h)
                seg = struct.unpack('>H', f.read(2))[0]; f.seek(seg - 2, 1)
        if head[:6] in (b'GIF87a', b'GIF89a'):
            return struct.unpack('<HH', head[6:10])
        if head[:4] == b'RIFF' and head[8:12] == b'WEBP':
            return None
    return None

def check_file(repo, name):
    path = os.path.join(repo, name)
    if not os.path.isfile(path):
        say('FAIL', f'{name} does not exist'); return None
    md = open(path, encoding='utf-8').read()
    prose = FENCE.sub('', md)
    targets = [(m.group(1) == '!', m.group(2), m.group(3)) for m in LINK.finditer(prose)]
    targets += [(True, 'html', s.split()[0]) for s in HTML_SRC.findall(prose)]
    images = []
    for is_img, alt, t in targets:
        if re.match(r'^(https?:|mailto:|#)', t):
            continue
        rel = unquote(t.split('#')[0].split('?')[0])
        if not rel:
            continue
        full = os.path.normpath(os.path.join(os.path.dirname(path), rel))
        if not os.path.exists(full):
            say('FAIL', f'{name}: broken {"image" if is_img else "link"} -> {t}')
            continue
        if is_img:
            images.append(rel)
            if not alt.strip():
                say('WARN', f'{name}: image without alt text -> {t}')
            size_mb = os.path.getsize(full) / 1e6
            dim = image_size(full)
            note = f'{dim[0]}x{dim[1]}' if dim else 'unknown size'
            if size_mb > 5:
                say('WARN', f'{name}: {rel} is {size_mb:.1f} MB ({note}); GitHub pages load slowly above ~5 MB')
            print(f'ok    {name}: image {rel}  {note}  {size_mb:.1f} MB')
    for m in LOCAL_PATH.finditer(md):
        say('FAIL', f'{name}: local absolute path {m.group(1)[:80]}')
    for m in re.finditer(r'\{\{[^}]+\}\}', md):
        say('FAIL', f'{name}: unfilled placeholder {m.group(0)}')
    if re.search(r'\b(TODO|TBD|lorem ipsum)\b', strip_code(md), re.I):
        say('WARN', f'{name}: contains TODO/TBD/lorem ipsum')
    return {'md': md, 'images': images}

def numbers(md):
    return sorted(set(NUMBER.findall(strip_code(re.sub(r'\([^)]*\)', '', md)))))

def code_blocks(md):
    return [b.strip() for _, b in FENCE.findall(md)]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('repo', nargs='?', default='.')
    ap.add_argument('--pair', nargs=2, default=['README.md', 'README.zh-CN.md'])
    ap.add_argument('--source', action='append', default=[], help='folder to search for quoted UI labels and identifiers')
    a = ap.parse_args()
    repo = os.path.abspath(a.repo)
    en_name, zh_name = a.pair
    en, zh = check_file(repo, en_name), check_file(repo, zh_name)
    if en and zh:
        if zh_name not in en['md']: say('FAIL', f'{en_name} has no link to {zh_name}')
        if en_name not in zh['md']: say('FAIL', f'{zh_name} has no link to {en_name}')
        ne, nz = numbers(en['md']), numbers(zh['md'])
        only_en, only_zh = sorted(set(ne) - set(nz)), sorted(set(nz) - set(ne))
        if only_en or only_zh:
            say('WARN', f'numbers differ: only in {en_name}: {only_en or "-"}; only in {zh_name}: {only_zh or "-"}')
        else:
            print(f'ok    numbers match across languages ({len(ne)} distinct)')
        if sorted(en['images']) != sorted(zh['images']):
            say('WARN', f'images differ: {sorted(set(en["images"]) ^ set(zh["images"]))}')
        else:
            print(f'ok    same {len(en["images"])} images in both languages')
        ce, cz = code_blocks(en['md']), code_blocks(zh['md'])
        cmd_e = [b for b in ce if not re.search(r'[一-鿿]', b)]
        cmd_z = [b for b in cz if not re.search(r'[一-鿿]', b)]
        if cmd_e != cmd_z:
            say('WARN', 'code blocks / commands differ between languages (fine if one side is translated prose)')
        else:
            print(f'ok    same {len(cmd_e)} code blocks in both languages')
    if a.source and en:
        corpus = []
        for src in a.source:
            for root, dirs, files in os.walk(os.path.join(repo, src)):
                dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist', 'build', '.next')]
                for f in files:
                    if f.endswith(('.js', '.mjs', '.ts', '.tsx', '.jsx', '.vue', '.svelte', '.html', '.py', '.json', '.swift', '.kt', '.go', '.rs', '.css', '.md')) and 'README' not in f:
                        try: corpus.append(open(os.path.join(root, f), encoding='utf-8', errors='ignore').read().lower())
                        except OSError: pass
        blob = '\n'.join(corpus)
        for name, doc in ((en_name, en), (zh_name, zh)):
            if not doc: continue
            prose = FENCE.sub('', doc['md'])
            claims = set(re.findall(r'\*\*([^*\n]{2,40})\*\*', prose)) | set(re.findall(r'`([^`\n]{2,60})`', prose))
            names = set()
            for root, dirs, files in os.walk(repo):
                dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
                names.update(files); names.update(dirs)
            def known(c):
                c = c.strip()
                if c.endswith((':', '：')): return True          # a lead-in label, not a claim
                if os.path.basename(c.rstrip('/')) in names: return True
                if re.match(r'^(https?://|localhost|[\w.-]+\.(com|org|io|dev|app)\b)', c): return True
                if '/' in c or re.search(r'\.[a-z]{1,5}$', c):
                    if os.path.exists(os.path.join(repo, c.lstrip('./'))): return True
                return c.lower() in blob
            missing = sorted(c for c in claims if not known(c))
            found = len(claims) - len(missing)
            print(f'ok    {name}: {found}/{len(claims)} bold/code terms found in source')
            for c in missing:
                say('WARN', f'{name}: "{c}" not found in {", ".join(a.source)}; confirm it is a real label, file or value')
    print(f'\n{out["FAIL"]} FAIL, {out["WARN"]} WARN')
    sys.exit(1 if out['FAIL'] else 0)

if __name__ == '__main__':
    main()

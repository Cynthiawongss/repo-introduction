# Validation

What was actually run for v0.1.0 (2026-11-21, macOS, Chrome, Node 22, Python 3). Nothing here claims more than these runs.

| Check | Result |
|---|---|
| `SKILL.md` front matter (`name`, `description` ≤ 1024 chars) | passed; description 463 chars |
| Relative links inside `SKILL.md` and `references/` | all resolve |
| `check_readme.py` on this repository (`--source skills --source assets-src`) | 0 FAIL; 3 WARN, all reviewed: two emphasised phrases and the release ZIP name, which exists only on the release page |
| `check_readme.py` on ringcay (`--source app`) | 0 FAIL; 5 WARN, all fictional example values entered in the app (OUR LITTLE PLACE, The Long Way Home, cigar band in silver), correct to confirm by hand |
| `shoot.mjs` single shot, ringcay home page, 1440×1000 @2× | 2880×2000 PNG written; reported `MOVING` because the island was still growing, which is the intended warning |
| `shoot.mjs` shot list, ringcay: day theme in English, plus a 390×844 @3× mobile shot | both written; locale override confirmed (English UI) |
| `shoot.mjs` on `templates/cover.html` and `assets-src/cover.html` (file://, `--until window.coverReady`) | 1920×1080 PNGs written, opened and reviewed; the cover went through two fix rounds (callout crossing text, polaroid clipped at the frame edge) |

Not tested: Windows or Linux, Chromium/Edge/Brave binaries, the Claude apps upload path, Codex hosts, and a full fresh-project run from start to publish by a new session. The ringcay case was done before this skill existed; the skill was written from it.

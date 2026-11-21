# repo-introduction

English · [简体中文](README.zh-CN.md) · [Install](docs/INSTALL.md) · [Worked example](examples/ringcay.md)

**Turn a real project into a GitHub homepage a stranger understands: an English and Chinese README, a cover made from the project itself, and real screenshots, with every claim checked against the code.**

![The cover of this repository: a README page for the ringcay project, with lines from its caption, a button label, a number and a screenshot to the evidence behind each one: the concept cover, the line of code with that label, the catalogue count and the real app screenshot.](assets/hero.png)

*Concept illustration made with this skill's own cover template. The page and screenshots in it are from [ringcay](https://github.com/Cynthiawongss/ringcay).*

A skill for Claude (and other agents that read `SKILL.md`). You ask it to write, review or redo a project's introduction. It reads the code, writes the README pair, makes the cover and screenshots, checks everything, and publishes only when you have said so.

## What it does differently

| Usual result | With this skill |
|---|---|
| A feature list | The user's outcome first, then one concrete example built in the real app |
| Button names and numbers from memory | Every bold label and count found in the source (`check_readme.py --source`) |
| An AI-generated cover that drifts from the product | A cover rendered from the project's own code, or composed from real material, with real type |
| Screenshots taken whenever | Captured by script after the page stops moving, at a fixed viewport, in the README's language |
| Six images to choose from at once | One numbered candidate, reviewed by the agent first; feedback changes only what you named |
| "Published!" | Remote README, image URLs, About and Pages checked after pushing |

## Example: ringcay

[ringcay](https://github.com/Cynthiawongss/ringcay) is a web prototype where a ring grows into a small 3D island that holds a couple's or friends' memories. Earlier AI-generated covers were rejected as too cute, too grey or off-topic.

| Step | What happened |
|---|---|
| Brief | Read the handoff and the owner's own words: couples and friends, daytime, warm, mature rather than cute; keep the "world inside a ring" idea |
| Cover | Rendered with the app's own Three.js ring and island code. Callouts link the bench, the long table, the engraving and the stones to their stories |
| Review loop | Several render → look → fix rounds before showing candidate 01, with its remaining weaknesses listed |
| Feedback | "The band is a bit plain." Only the band changed: an aquamarine, five small stones, a vine engraving, beaded edges. Approved |
| README | The existing draft was kept after its labels and counts were checked against the code; the unapproved cover was replaced and a screenshot taken mid-animation was dropped |
| Publish | Merged two new remote commits, pushed, verified the served README and images |

[Read the whole case →](examples/ringcay.md)

## Install

**Claude Code:** copy the skill folder into your skills directory.

```sh
git clone https://github.com/Cynthiawongss/repo-introduction.git
cp -R repo-introduction/skills/repo-introduction ~/.claude/skills/
```

**Claude apps:** download `repo-introduction-skill.zip` from the [latest release](https://github.com/Cynthiawongss/repo-introduction/releases/latest) and upload it under Settings → Capabilities → Skills.

Other hosts and updating: [docs/INSTALL.md](docs/INSTALL.md).

## Use it

Ask in plain words:

> Write the README for this project, English and Chinese, with a cover and two screenshots. Don't publish yet.

> Codex wrote this README. Is it good? Fix what's wrong and push it.

Or name it: `/repo-introduction`.

## What is inside

| Path | Purpose |
|---|---|
| [`SKILL.md`](skills/repo-introduction/SKILL.md) | The workflow: scope → read → write → visuals → assemble → check → publish → report |
| [`references/visuals.md`](skills/repo-introduction/references/visuals.md) | How covers and screenshots are made and reviewed |
| [`references/method.md`](skills/repo-introduction/references/method.md) | Positioning, page structure, examples, two languages |
| [`references/readme-review.md`](skills/repo-introduction/references/readme-review.md) | Reviewing a README as a product manager |
| [`templates/cover.html`](skills/repo-introduction/templates/cover.html) | 1920×1080 editorial cover layout with computed callouts and grain |
| [`scripts/shoot.mjs`](skills/repo-introduction/scripts/shoot.mjs) | Screenshots and cover capture through your local Chrome |
| [`scripts/check_readme.py`](skills/repo-introduction/scripts/check_readme.py) | Links, images, local paths, language parity, labels found in source |

## Requirements and limits

- The scripts need **Node 22+** and a local **Chrome, Chromium, Edge or Brave** (`shoot.mjs`), and **Python 3** (`check_readme.py`). No packages to install.
- Fonts in the cover template load from Google Fonts, so rendering needs internet access.
- `check_readme.py` finds mechanical problems only. It cannot judge whether the writing is good or the cover fits.
- Tested so far on two projects: ringcay (cover, README review, publishing) and this repository (cover, README, checks). `shoot.mjs` was tested with Chrome on macOS only.
- The owner preference file reflects one person's taste. Edit or delete it for your own use.
- AI image generation is optional and never used without asking first; the skill does not bundle any image model.

## Credits and licence

The method grew from a handoff kit written with Codex for five earlier skill repositories, then reworked after the ringcay cover and README were finished with Claude. MIT licence; see [LICENSE](LICENSE).

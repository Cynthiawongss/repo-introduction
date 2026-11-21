---
name: repo-introduction
description: Write, review or rebuild a project's GitHub introduction from the real project - an English README.md plus a Chinese README.zh-CN.md, a cover illustration, real screenshots, About/topics - and publish it when authorised. Use when the user asks for a README, project introduction, release notes or GitHub homepage (项目说明, 项目介绍, 仓库说明, 发布说明, 首页图, 封面, 截图), wants a repo cover or screenshots, or asks you to judge or improve a README someone else (or another AI) wrote.
---

# Introduce a repository so a stranger gets it

A README is the project's front door. A stranger should be able to say, after one read: what it does, for whom, what they get, how to start, and what is not real yet. The cover should make them understand the product faster, not mistake it for another kind of product.

Work from the project, not from memory or from the conversation. Every label, number, path and claim on the page must be traceable to the code, the running app or a document. Talk to the user in their language; write the README pair in English and Chinese.

## 0. Settle the scope

From the request, decide which of these are in scope: **content** (README pair, About), **cover**, **screenshots**, **publish**. If publishing is in scope, note exactly what was authorised (new repository or an existing one, account, visibility). Explicit current instructions beat everything in this skill. Read [owner preferences](references/owner-preferences.zh-CN.md) when working for this owner; they are defaults, not rules for other people.

## 1. Read the project

Read the source, the existing README and any handoff notes. Run the app or the tool when possible. Fill [the project brief](templates/project-brief.md) as working notes: user and situation, input, actual behaviour, output, how to start, dependencies, what is simulated or sample data, what is untested, licence. Unknown stays unknown. Keep names the user already accepted.

**Find the design idea, not only the features.** Every project has a few ideas that explain why it is the way it is. Look for them in the project's own rules (AGENTS.md, CLAUDE.md, handoff notes), in code comments that state principles, in the owner's stated aesthetic, and in the UI itself (fonts, colour tokens, recurring marks and labels). Write them down in a sentence each, for example "a cover is a real crop of the theme's own print, never a separate illustration", or "the island floats inside the band so the engraving stays visible". These ideas shape the README (explain them to the visitor), and they are hard constraints for the cover (never contradict them, and borrow the product's own type, colours and marks).

When another assistant already wrote a draft or a handoff, read it, then verify it against the code before reusing anything. Reuse what holds up; do not rewrite good work for the sake of it. If a README and a cover are already published and approved, change what is wrong and propose a new cover as a candidate; the approved one stays until the user picks the new one.

If the local checkout has unpushed work from someone else (or another session), or has diverged from the remote, do the introduction in a separate worktree from the remote branch (`git worktree add -b docs/… <path> origin/main`) so neither line of work is touched.

## 2. Write the README pair

Use [the English template](templates/README.en.md) and [the Chinese template](templates/README.zh-CN.md) as scaffolds and delete what does not apply. Default order: name → language switch → one-line outcome → cover → what you can do (a table) → one concrete worked example → get started → limits. Method and wording rules: [method](references/method.md).

- Lead with the user's outcome and one real example (input → what happens → result), not a feature list.
- Explain the design idea in a short section when the product has one: what makes it different and why it looks the way it does, with a screenshot that proves it.
- Quote UI labels exactly as the app shows them, and check them in the source.
- Say plainly what is not real yet: local-only storage, demo checkout, sample data, untested platforms.
- English first in `README.md`, Chinese in `README.zh-CN.md`; same facts, numbers, commands and images, each written naturally.
- No chat history, assistant credits, model names or internal approvals on the public page.

## 3. Make the visuals

Read [visuals](references/visuals.md) before making any image. There are three kinds of picture and they are never passed off as each other:

| Kind | What it is | Label |
|---|---|---|
| Cover | Concept illustration of what the product means | "Concept illustration, not a screenshot" when it could be mistaken for one |
| Screenshot | Pixels from the real running app | Say the data is fictional sample data |
| Diagram | Structure or flow | none needed |

**Cover, in order of preference:**
1. **Render it from the project itself.** Use the project's own 3D code, components, CSS, icons or real output, composed in an editorial HTML layout ([cover template](templates/cover.html)) and captured with `scripts/shoot.mjs`. It is accurate to the product by construction, every detail can be tuned by parameter, and text is real type.
2. **Compose real screenshots** with callouts, annotations and type in the same template, for CLIs, libraries, skills and apps without a strong visual core.
3. **AI image generation** only for what code cannot draw (photographic people, lifestyle scenes). Ask before spending paid credits. Never let it draw UI or text, and never present it as the product.

Before showing anything: render, open the PNG yourself, write down what is weak, fix it, render again. Show **one numbered candidate** at a time, say which project it is for and what it is meant to express. When the user gives feedback, change only that dimension and keep everything they approved. A liked style is not an approved image; only "this one" is.

**Screenshots:** write a shot list ([example](templates/shots.example.json)) and capture with `node scripts/shoot.mjs shots.json`. Enter fictional sample data through the real UI. Capture only after the page has stopped moving (the script checks and prints `MOVING` otherwise), at a fixed viewport, in the README's language and theme. Open every image and reject half-finished animations, empty states, debug overlays and wrong language.

## 4. Assemble

- Cover at `assets/hero.png`, 1920×1080 (keep a 3840×2160 copy when useful); screenshots at `assets/01-….png` onward.
- Keep the cover source in the repository (for example `assets-src/` or the folder the project already uses) with a one-line render command, so it can be re-rendered later. Candidates and prompts stay out of the public README.
- Prepare GitHub About, topics and homepage with [repository metadata](templates/repository-metadata.md).

## 5. Check

Run `python3 scripts/check_readme.py <repo> --source <code folder>`. It fails on broken links or images, local absolute paths, placeholders and missing language switches. It warns on numbers, images or commands that differ between languages and on bold or code terms it cannot find in the source. Resolve every FAIL; look at every WARN. Then apply [the acceptance checklist](references/acceptance-checklist.md). Record visual checks and functional checks separately, and never report a check you did not run.

## 6. Publish, only as authorised

- Asked for a **new repository**: create it (`gh repo create`), then push. Do not reuse or overwrite an existing repository.
- Existing repository: `git fetch` first; if the remote is ahead, merge before pushing and say so.
- After pushing, verify the remote state: the README GitHub serves (`gh api repos/OWNER/REPO/readme`), image and file URLs return 200, About and topics are set, and Pages or CI runs have started or passed.
- If something failed part-way, report which stage succeeded and which did not.

## 7. Report

In the user's language: what changed, the files, what was verified and how, what was not verified, the selected cover number, and the git state (committed? pushed? which commit?). Do not ask for confirmation of ordinary reversible edits that are already in scope.

## Reviewing an existing README

When asked whether a README (yours, the user's or another AI's) is good, review it as a product manager with [the review rubric](references/readme-review.md): check claims against the code, look at every image it uses, list what works, fix what does not, and say exactly what you changed.

## Files

- [references/method.md](references/method.md): positioning, page structure, examples, bilingual writing
- [references/visuals.md](references/visuals.md): covers, screenshots, the render-review loop, tools
- [references/readme-review.md](references/readme-review.md): product review rubric
- [references/acceptance-checklist.md](references/acceptance-checklist.md): delivery checks
- [references/lessons.md](references/lessons.md): six real cases and the corrections that mattered
- [references/owner-preferences.zh-CN.md](references/owner-preferences.zh-CN.md): this owner's defaults
- `templates/`: README pair, project brief, cover brief, cover.html, shots.example.json, repository metadata
- `scripts/shoot.mjs`: screenshots and cover capture through local Chrome (Node 22+, no packages)
- `scripts/check_readme.py`: README pair checks (Python 3, standard library)

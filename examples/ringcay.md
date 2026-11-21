# Worked example: the ringcay cover and README

[ringcay](https://github.com/Cynthiawongss/ringcay) is a browser prototype: pick a ring, it grows a small 3D island, and each object on the island holds a photo and a story. It is for couples and for friends.

## Starting point

- A working app, and a README draft written by another assistant.
- Several AI-generated covers, all rejected. The owner's words: the original promo was good but "a bit too cute"; wanted "the Instagram style"; "you need that couples-and-friends feeling"; "daytime is enough, why is it so un-warm?"
- A handoff document stating that no existing image was approved.

## 1. Brief

The relationship to show: **couples and friends → shared moments → meaningful elements → a place you can open.** Keep the "world inside a ring" idea from the promo the owner liked; lose the toy-like cuteness. Daytime, warm, mature. A plain band must keep its inner engraving visible, so the island floats inside the band instead of sealing it.

## 2. Method: render, don't generate

The app already had a Three.js kit for rings and islands. A separate `style-options/hero.html` + `hero.js` imported it and:

- staged one silver ring with an island floating inside the band;
- placed a couple on a bench and five friends at a long table, plus trees, a pond and lavender;
- rendered the main view plus two close-ups that became polaroid "photos";
- composed everything on a 1920×1080 canvas: headline, handwritten captions, callout lines from the bench, the table, the engraving and the stone to their stories, sunlight, a leaf shadow and film grain;
- saved the canvas through a small local server; `?scale=2` exported 3840×2160.

## 3. Review before showing

Each render was opened and criticised before the next: the silver read as grey on a white page (built a brighter studio environment), the island was too tall, the greens looked like a game, a tree covered the engraving, a caption almost touched the edge, and a callout pointed at the wrong spot. One round broke on a syntax error, found in the browser console.

Candidate 01 went to the owner with its weaknesses listed.

## 4. One change at a time

Feedback: "this is good, but the band is a bit plain."

Only the band changed: it swells at the front to hold a bezel-set aquamarine, five small coloured stones sit beside it (one for each friend at the table), an olive vine is engraved all the way round, and both edges are beaded (milgrain). The stone caption became "THE STONES · aquamarine, for the two of us. and a little one for each friend." Everything else stayed.

Answer: "This works."

## 5. The README

The existing draft was reviewed as a product manager:

- **Kept:** the outcome first; one concrete example (a cigar band in silver, the engraving OUR LITTLE PLACE, a bench holding the story of a missed bus); an honest table of what is local-only, demo or sample; natural Chinese.
- **Verified:** the quoted labels **start our ring**, **grow the island**, **share** and **see it as a stranger would** in `app/js/main.js` and `app/js/zh.js`; the 24 rings in `app/js/catalog.js`.
- **Changed:** the unapproved cover was replaced with the selected one, with a concept-illustration note; the home screenshot was dropped because it had been captured while the island was still growing and showed an empty green patch.

## 6. Publishing

GitHub had two commits the local copy lacked (a Pages workflow and analytics). They touched different files, so they were merged, then pushed. Checked afterwards: the README GitHub serves, `assets/hero.png`, `README.zh-CN.md` and `LICENSE` returning 200, and the Pages run starting.

## Result

![The selected ringcay cover](https://raw.githubusercontent.com/Cynthiawongss/ringcay/main/assets/hero.png)

Live README: [github.com/Cynthiawongss/ringcay](https://github.com/Cynthiawongss/ringcay)

## What became part of the skill

| From this case | In the skill |
|---|---|
| Rendering from the app's own code | the cover method ladder in `references/visuals.md` |
| Render → look → fix before showing | the review loop |
| "The band is plain" changed only the band | "change only what the user named" |
| The mid-animation screenshot | `shoot.mjs` refuses to call a moving page finished |
| Labels checked by hand with grep | `check_readme.py --source` |
| Remote ahead of local | fetch and merge before pushing; verify after |

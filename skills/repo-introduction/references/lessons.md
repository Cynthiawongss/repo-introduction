# Six cases and the corrections that mattered

These come from real work for this owner in November 2026: five skill repositories introduced with Codex, then ringcay, where the cover and README were finished with Claude. They illustrate decisions, not a look to copy.

| Project | What it had to say | Cover that was chosen | Transferable judgement |
|---|---|---|---|
| Purpose-led resource research | check sources and conditions from the purpose | thin lines connecting sources to a choice, dark | decoration should carry "why this was chosen"; a tick must not imply runtime testing |
| Restructure complex materials | keep detail, build an understandable structure | a light sieve with information fragments | a metaphor must not imply deletion |
| Reference to demo | reference traits become a working interface | translucent material translation | show the link between input and result, not just a pretty UI |
| Spreadsheet to decision UI | see relationships, causes and scenarios in numbers | white pixel terrain, mint background, wine-red path | 3D is a means, not a required style |
| Script to video segments | segments generated separately still connect | photo collage of one person's continuous actions | keep the liked style, replace the off-topic subject |
| ringcay | every part of the ring has a reason | a ring rendered with the app's own 3D code, island inside, callouts to the stories | render from the product; change only what the user names |
| Luma Tape (review, Nov 2026) | remix a print or draw your own; one print everywhere | candidate: four strips printed by the app's own `paintFlat` (Blur, Stitch, Symbol, a drawn blank roll) | the project's own rules are cover rules; explain the design idea in the README |

## The ringcay case in detail

**Codex's attempts.** Several AI-generated covers (night scene, dark ring, a daytime couple-and-friends lifestyle photo) were all rejected: too cute, too grey, not warm, or not about the product. The owner stopped the image work and handed it over. Its README draft was good: the outcome first, one concrete example, an honest limits table, natural Chinese, correct button labels. It also used an unapproved cover and a home screenshot taken while the island was still growing.

**What worked.**
1. Read the handoff and the owner's latest words, then the code. The brief: the relationship (couples and friends → shared moments → meaningful elements → a place you can open), daytime, warm, mature Instagram rather than cute; keep the "world inside a ring" idea from the original promo the owner liked.
2. No image generation. The cover was rendered from the app's own Three.js ring and island kit: one silver ring with an island floating inside the band so the inner engraving stays visible; a couple's bench and five friends at a long table; close-ups of each became polaroids; callouts linked the bench, the table, the engraving and the stone to their stories; editorial type, handwritten captions, sunlight, leaf shadow, grain.
3. Before showing it, several render → look → fix rounds: brighter silver, flatter island, calmer greens, trees moved off the engraving, captions pulled away from the edge.
4. Candidate 01 was shown with its weaknesses listed. Feedback: "the band is a bit plain". Only the band changed: a bezel-set aquamarine, five small stones (one per friend at the table), a vine engraving and milgrain edges, with the stone caption updated to match. Approved: "This works".
5. A 3840×2160 export was made from the same script, and the README referenced `assets/hero.png` with a concept-illustration note in both languages.
6. Codex's README was kept, after verifying labels and counts against the code. Two fixes: the new cover, and the mid-animation screenshot dropped. Merged the remote's two new commits, pushed, and checked the served README and image URLs.

## The Luma Tape review

Codex had already published a README and an AI-generated cover the owner approved. The README was good and stayed. What a design reading added:
- The code says "Covers, the flat preview, the 3D roll and the exports all call this one function" and "A cover is a real crop of the theme's own print, never a separate illustration". The AI cover broke that: its stitch shells were shapeless blobs the app cannot print, and its hand-drawn strip was nicer than the app's brush can make. Candidate 01 printed every strip with the app's own `paintFlat`.
- The first render included the Classic watercolour print. The project's direction explicitly moves away from nostalgic watercolour, so it came off the cover, replaced by a real drawn design from the blank roll, which the owner had asked to lead with.
- The README never explained the four prints. Reading the code showed that Symbol typesets each shape from the letters of the tape's own name (PEARLCOAST); a fresh screenshot of that went in.
- A count was wrong: the prints redraw 37 illustrations (36-cell sheet + koi), not 39; the 39 are stickers.
- The local checkout had another session's unpushed feature work, so the review was done in a worktree from the remote.

## Failures to learn from

- Six images across three projects in one round: the user could not tell what belonged where. One project per round.
- Meaning right, style wrong (3D station spheres): change the visual language, not just the colours.
- "I like 3D" does not mean every cover is 3D.
- Liked style, wrong subject (shoes for a video project): keep the grain, collage and neon; replace the subject.
- Liking a reference is not approving an image; apply it to the project, then let them choose.
- Too much text: move real correspondences into a table, but don't delete limits for brevity.
- Build notes in a public README: remove assistant information; keep dependencies, verification scope and limits.
- A screenshot taken mid-animation reads as a bug. Wait for the finished state and look at every image.
- A generated image that is "pretty but not warm" or "cute": these are the owner's two most common rejections. Check for them before showing anything.

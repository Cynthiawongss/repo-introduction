# Reviewing a README as a product manager

Use this when asked "is this README good?", when taking over a draft from another assistant, or before publishing your own.

## Read it as a stranger first

Read only the first screen (title, one-liner, cover). Can you say what the product is and who it is for? Then read the whole page once without the code open, and note where you got lost or doubtful.

## Then check it against the project

| Check | How | Typical finding |
|---|---|---|
| UI labels | grep each bold label in the source, including the translation file | a button renamed since the draft was written |
| Numbers | count in code (catalogue arrays, constants), not in old docs | "20 rings" when the catalogue has 24 |
| Paths and commands | run them; check files exist | a port or folder that changed |
| Links | open live demo links; `curl -s -o /dev/null -w "%{http_code}"` | demo URL moved |
| Images | open every image the README uses | a screenshot taken mid-animation; an unapproved cover |
| Limits | compare against storage, payment, sharing and auth code | "private" implies accounts that do not exist |
| Language pair | `check_readme.py` and a side-by-side read | a limit present in English but missing in Chinese |

`python3 scripts/check_readme.py <repo> --source <code folder>` does the mechanical part; the rest needs eyes.

## Judge the product writing

| Question | Good sign | Bad sign |
|---|---|---|
| Does it lead with the outcome? | "Turn the story behind a ring into a place of your own" | "A 3D web app built with Three.js" |
| Is there one concrete example? | a named, fictional example built in the real app, with a real screenshot | a list of features |
| Does it cover both kinds of user it serves? | couples **and** friends | only one, implicitly |
| Is it honest about limits? | a table of what is local-only, demo, sample | silence, or limits buried in a footnote |
| Can I start in under a minute? | 3 to 5 numbered steps with real labels | prose describing the architecture |
| Do the visuals help? | the cover explains the idea; screenshots prove it | decorative images, or a concept image presented as the product |
| Is anything there that should not be? | none | chat history, assistant credits, model names, local paths |

## Report the verdict

- **What works**: specific, with the reason (so it survives the next rewrite).
- **What you changed**: each change and why, e.g. "replaced the unapproved cover with the selected one; dropped the home screenshot because it was captured while the island was still growing".
- **What you verified**: e.g. "button labels and the counts 24 and 19 checked against main.js, zh.js and catalog.js".
- **What is still open**: anything you could not check.

Don't rewrite a good draft into your own style. Keep what is correct, fix what is wrong, and say which is which.

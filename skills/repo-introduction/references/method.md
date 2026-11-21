# Method: the homepage is the user's way in

## 1. Know what you are introducing

A visitor needs to know, in order: is this for me, what do I get, how do I start, what is not real yet. The README is not the place for the build story, every technical detail or the conversation that produced it.

Read the actual source, skills, examples and run instructions, and fill [the project brief](../templates/project-brief.md). Be able to say in one sentence: **who it helps, in what situation, turning what input into what usable result.** Not every sentence must follow that pattern, but all five facts must be clear.

| Layer | Good | Weak |
|---|---|---|
| The user's problem | You inherit someone else's organised material and can't follow its categories | An efficient, intelligent information management solution |
| What the project does | Separates categories from attributes; keeps details, conflicts and source mapping | Improves efficiency, empowers collaboration |
| What you get | A searchable entry point, a field dictionary, open questions, a handover pack | Solves all complex information in one click |
| Limits | Recommendations are documented, not run | Treating a passed check as "reliable everywhere" |

Keep names the user has accepted. If the positioning genuinely changes, update the title, folders, examples and descriptions together.

## 2. Organise the page as a reading path

Default: name → language switch → one-line value → cover → what you can do / get → one concrete example → get started → verification and limits. Reorder when the project calls for it.

- The first screen explains value and sets the visual impression; details live further down or in linked files.
- Use tables where comparison helps: input vs output, situation vs result, current behaviour vs what it means. Numbered lists for steps. Short paragraphs for reasons. Don't force everything into tables.
- Quote UI labels in **bold** exactly as the app shows them.
- Keep on the page anything that affects whether someone can use it: dependencies, costs, privacy behaviour, licence, product limits.
- Keep off the page: who said what in chat, how the assistant reasoned, which model made the cover, assistant credits, temporary local paths, internal approvals.

## 3. One complete example beats abstract promises

An example gives: the starting input, key constraints, what was done, the concrete output, and whether it actually ran. "Supports A, supports B" is not an example.

ringcay's README works because of one example built in the live app: a cigar band in silver, the engraving OUR LITTLE PLACE, and a bench on an island called The Long Way Home that holds the story of missing a bus. A real screenshot of that island follows.

Public examples are fictional and say so. Don't carry the user's real data, people or private paths into them. An example can be smaller than real use, but must keep the key logic.

## 4. Two languages, one set of facts

This owner's default: `README.md` in English, `README.zh-CN.md` in Chinese, each with a switch link at the top.

Process: settle facts and terms → write English → write natural Chinese → compare line by line. If the Chinese exists first, use it as the fact base.

| Compare | Must match |
|---|---|
| Positioning | users, problem, result, scope |
| Capabilities | implemented / planned / simulated |
| Example | numbers, units, names, conditions, output |
| Usage | commands, folders, dependencies, versions, external services |
| Limits | untested items, unguaranteed effects, permissions |

English should read like a natural product page; Chinese should not be a word-for-word translation. Code identifiers, file paths and quoted UI labels stay identical (quote the Chinese UI label in the Chinese README when the app has one). `check_readme.py` compares numbers, images and code blocks across the pair.

## 5. Make the repository usable

| Project type | Get started must answer | Fitting evidence |
|---|---|---|
| Skill / method | the full skill folder, host requirements, a natural request and an explicit invocation | behaviour examples, format checks, existing checkers |
| App / website | live demo or local start, configuration, whether data is real or sample | real screenshots of the core journey |
| Library / CLI | install command, smallest runnable call, input/output, version | runnable sample and related tests |
| Research / data | method, sources, environment, how to reproduce | traceable link from data to result |

GitHub About is the short positioning, the README is the full entry, a Release is a version with downloads. Keep them consistent. Keep the source link and the live demo link distinct.

Licence follows what the project already has or what the user chooses; never default to MIT because an earlier repository used it. Paid features, logins and API keys go before the user starts.

## 6. Judge done by evidence

Text review doesn't prove the software works; scripts don't prove users understand; a plan doesn't prove a video is continuous. Report as: what was checked, what was observed, what was not checked.

After publishing, confirm the remote README, cover, default branch and release match the local final state. If a network step failed, say which stage succeeded; an empty repository is not a published project.

## The test

Someone who never saw the conversation reads the page and can say what it solves, what they get, how to start and what its limits are, and looking at the cover they would not mistake it for a different kind of product. That matters more than "premium copy" or "trendy colours".

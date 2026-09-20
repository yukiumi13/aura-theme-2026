# Overall theme review — 2026-09-19

## Scope and conclusion

Reviewed the generated VS Code package at version **0.7.0**, corresponding to
the current preview2 colors. The complete inventory contains eight themes,
3,776 UI entries, 368 TextMate rules, and 240 semantic tokens. Exact payload
hashes are in [the initial inventory](2026-09-19-initial-inventory.json).
The [browsable configuration specimens](resolved-themes.html) track the latest
generated build and may include subsequent corrections.

**Aqua's current hierarchy fits the accepted direction:** cyan carries actions
and navigation, mint marks small counts, and citrus stays in details. Its light
reading surfaces remain cool paper; its dark appearance uses the accepted Aura
Dark foundation. Lime is a coherent separate exploration, with more green in
its light surfaces and interactions. Its final light/dark UI coverage remains
incomplete.

The audit found two concrete mapping inconsistencies and additional visual
follow-ups below. This review records the existing payload; it does not change
theme colors or declare every runtime state approved.

## Reference and design intent

The supplied summer game UI is documented in
[lime-color-sampling.json](../lime-color-sampling.json), source SHA-256
`8cce1c0fa9c51d0e515c75305518fbc0bca0483624c328eaeb4e4588b1e88612`.
Its ordinary task controls and progress use cyan around `#00DDDF`; the bottom
claim-all control moves from mint toward cyan. The drink illustration supplies
small yellow highlights. These are screenshot samples, not original design
tokens.

The useful relationship is the distribution of cool cyan, greener mint, and
small warm accents on calm surfaces. Large green functional buttons throughout
Aqua would change that balance. The reference's artwork, lettering, and button
scale are not requirements for the editor. Aura and Azure retain their own
accepted foundations and references.

| Appearance | Assessment of the resolved design |
| --- | --- |
| Aqua Light | `#F8FCFE` editor, `#F5F9FB` chrome, cyan actions, and mint badges restore the intended emphasis. Dark activity icons remain visible on an unfilled rail during hover. |
| Aqua Dark | `#09080D` reading surfaces and Aura syntax give it a cleaner foundation. Cyan controls and a subdued selected activity surface distinguish interaction without tinting the whole editor green. |
| Lime Light | Green-white surfaces and mint actions create a deliberately greener sibling. Cyan and citrus provide useful variation. Check repeated buttons and floating panels together in the final native UI. |
| Lime Dark | Aura Dark surfaces keep the foundation calm. Mint, green-cyan, and citrus form a plausible companion palette; large focus outlines need a native UI check before judging their prominence. |
| Aura / Azure | Their generated configs are included in this audit. Existing screenshots and earlier acceptance do not establish fresh runtime coverage of every state. Apply their own design references when addressing the shared mapping findings. |

## Findings

### 1. Chart purple is mapped to green

**Category: configuration defect; correction pending.**

Every theme maps `charts.purple` to a companion green. In all four light
appearances it is exactly the same value as `charts.green`, removing a
categorical distinction.

| Family / appearance | `charts.purple` | `charts.green` |
| --- | --- | --- |
| Aura, Aqua, Lime — Light | `#006B4D` | `#006B4D` |
| Aura, Aqua, Lime — Dark | `#9FFFE2` | `#61FFCA` |
| Azure Light | `#00723B` | `#00723B` |
| Azure Dark | `#A8F0CD` | `#5AE0A0` |

The shared template uses `uiCompanionBright` for `charts.purple`. Give chart
purple a family-appropriate purple role and inspect the full categorical set.
This is a shared mapping problem; it is not evidence that the newly added
summer colors alone caused it.

### 2. Modified-tab indicators change hue when focus moves

**Category: configuration inconsistency; correction pending.**

The affected values are:

| Theme | `tab.activeModifiedBorder` | `tab.unfocusedActiveModifiedBorder` |
| --- | --- | --- |
| Aqua Dark | `#C4B5FD` | `#76E9EC7F` |
| Lime Dark | `#C4B5FD` | `#00FED77F` |
| Azure Light | `#0F6CBD` | `#6656D17F` |
| Azure Dark | `#62ABF5` | `#A79CF17F` |

`tab.unfocusedInactiveModifiedBorder` has the same mismatch. Focused borders
use `ui.status.modified`; unfocused borders use `ui.accentBright` with alpha.
Keep the modification hue consistent and reduce its emphasis with opacity.
The payload mismatch is verified; the native focus transition itself has not
been exercised in this audit.

### 3. Syntax and runtime defaults can outweigh small UI decoration

**Category: accepted inheritance plus visual coverage gap.**

Aura, Aqua, and Lime Dark inherit CSS selector green `#9DFF65`. It is brighter
and greener than the decorative citrus accent. A CSS-heavy screen can therefore
look substantially more lime than its UI alone suggests. This is inherited
Aura syntax, so changing it needs a whole-code-view judgment rather than an
assumption that it is accidental accent leakage.

All eight generated configs omit `editorBracketHighlight` entries. Bracket
coloring therefore needs a runtime/default review, alongside grammar rule
precedence and user overrides. A palette-only audit cannot account for these
visible colors.

### 4. Layered Aura Dark diffs need a real code review

**Category: inherited readability follow-up.**

Compositing the stored inserted line and word backgrounds over Aura Dark gives
approximately `#1E443B`. Comment text has a calculated contrast of 2.09:1 there;
type purple has 3.41:1. The corresponding Aqua/Lime Dark inserted composite is
`#142725`, with 3.02:1 comments and 4.92:1 types.

This identifies a place to inspect actual changed code, not an instruction to
raise every foreground's contrast. The general test result from the previous
iteration does not establish aesthetic approval of this particular combination.

## Accepted choices

- White on vivid light controls is intentional: approximately 1.74:1 on Aqua
  primary cyan and 1.50:1 on mint badges. Preserve the user's soft visual
  character and assess practical reading in context. White hover icons on a
  pale unfilled activity rail were a separate unintended failure.
- Mint badges are a useful small contrast against Aqua navigation. Their
  repetition and size matter more than the number of tokens using mint.
- Citrus can work along short active edges. A shared focus token may also draw
  long outlines around large widgets, so token counts cannot prove restraint.
- Dark appearances retain the accepted Aura Dark reading foundation. They do
  not need to reproduce a light reference's surface tint.

## Evidence and remaining coverage

The preceding implementation pass inspected actual Aqua Light in the isolated
fictional VS Code workspace: Extensions, CSS, functional buttons, sign-in,
selected navigation, and an unchecked Search icon under hover. It also
inspected Aqua Dark's Extensions/CSS view, actions, and selected navigation.
The hover evidence is the local `aqua-light-hover-fixed.png` capture from that
pass. This audit also visually checked the generated Aqua Light state sheet;
that sheet is a configuration aid, not a VS Code screenshot.

Still requiring final native inspection: the Lime pair, keyboard focus,
modified-tab focus transitions, disabled actions, floating widgets, real
layered diffs, and broader language/terminal examples. Remote colors are
reviewed as stored values; a connected SSH session was not used as evidence.

The next design correction should address findings 1 and 2, regenerate this
inventory, and inspect the affected states. Use [THEME_REVIEW.md](../THEME_REVIEW.md)
for the same review after subsequent iterations.

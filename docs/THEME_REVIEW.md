# Reviewing a theme as a whole

Required after each theme design iteration. The output is a design judgment
supported by the resolved configuration and real UI observations.

## 1. Establish the intended relationships

Read the current user feedback and the relevant reference. Separate direct
samples, designed adaptations, and deliberately retained Aura colors. Describe
what should dominate, what should recede, and where decoration belongs.

For the summer reference, ordinary task buttons and progress are cyan; the
claim-all control shifts from mint toward cyan, while the drink artwork supplies
small yellow highlights. The user prefers Aqua to retain cyan dominance, with
mint badges and citrus detail. Lime deliberately explores a greener balance.
The illustration's dark artwork, lettering weight, and button scale are not
requirements for the editor theme.

Compare Aura against the accepted Aura foundation and Azure against its Fluent
reference. A paired dark theme must be designed on its own dark foundation;
do not invert the light reference mechanically.

## 2. Decode the shipped result

Build the VS Code package, then run:

```sh
node scripts/review-vscode-themes.js
```

Open `docs/reviews/resolved-themes.html`. It reads the generated manifest and
every generated JSON file, records their hashes, displays explicit state pairs,
and includes **every UI color, TextMate rule in source order, and semantic
token**. It makes no aesthetic pass/fail decision.

Read RGBA as a composited color on the actual receiving surface. Check stacked
diff backgrounds and syntax foregrounds together. Generic color chips show raw
colors over a checkerboard; they do not assert the actual UI parent surface.
Configuration coverage does not establish runtime coverage: omitted VS Code
tokens, syntax grammar precedence, extensions, user overrides, and OS rendering
can still change the result.

## 3. Apply design judgment

| Lens | Questions |
| --- | --- |
| Identity | At first glance, is the family still recognizable? Does the accent hierarchy match the reference and accepted feedback? |
| Distribution | Are large surfaces calm? Has a small accent spread across repeated or persistent controls? Evaluate area, repetition, brightness, and location in real UI. |
| Surfaces | Do editor, sidebar, tabs, panels, inputs, and floating widgets have a coherent hierarchy? Do dark neutrals look clean? |
| Interactions | Is hover distinct from selection? Can one token unexpectedly affect both? Do inactive/disabled states recede without vanishing? |
| Semantics | Do actions, counts, links, success, warnings, errors, and modifications retain distinct roles? Does focus change emphasis without changing meaning? |
| Syntax | Does a real page of code harmonize with the chrome? Include CSS selectors, punctuation, brackets, Markdown, and token-rule overrides. |
| Pairing | Do light/dark appearances share a language while using appropriate surfaces and ink for each background? |
| Restraint | Would removing one accent improve the whole? Does the reference still feel present without reproducing its artwork or scale? |

Contrast ratios support diagnosis. They are not a score for beauty or an excuse
to discard the user's accepted low-contrast character. White on vivid Aqua/Mint
controls is an explicit preference; white hover icons on an unfilled pale rail
are an unintended broken state.

## 4. Inspect actual UI

Use the same fictional workspace in an isolated profile. For each changed
appearance inspect:

- Explorer plus a representative code file, and Extensions with functional
  buttons and badges; Command Palette/autocomplete as floating surfaces.
- An unchecked activity icon under hover and keyboard focus, selected/inactive
  navigation, focused/unfocused tabs, primary/secondary button hover, and
  disabled controls.
- A notification and available local status items. Check Remote/SSH colors in
  configuration when no connection exists; do not establish a connection just
  to manufacture evidence.
- Find matches, selections, layered diffs, and terminal text. Include additional
  languages when their tokens or shared syntax mappings changed.

For unchanged families, compare generated payloads against the accepted
baseline. Do not label their old screenshots as a fresh runtime review.

## 5. Record the conclusion

Each review should identify the version, exact payload hashes, reference,
inspected states, and findings. Use these categories:

- **Regression:** a reproducible broken or inconsistent state to fix within the
  authorized scope.
- **Design adjustment:** a reasoned proposal based on hierarchy or reference fit.
- **Accepted choice:** a deliberate aesthetic tradeoff already confirmed by the
  user.
- **Coverage gap:** a surface, language, appearance, or fallback not yet observed.

After a correction, regenerate the package and inspect the affected state
again. The final note should say what improved and what remains unverified.
Tests and the review sheet cannot replace this judgment.

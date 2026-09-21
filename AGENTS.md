# Theme design workflow

The user requires an overall design review after every theme design iteration.
Review the compiled, resolved theme configuration, not only the source palette,
individual diffs, or test results. Follow `docs/THEME_REVIEW.md`.

- Read every shipped theme's generated `colors`, `tokenColors`, and
  `semanticTokenColors` in `packages/vscode/themes`, including transparency,
  terminal ANSI slots, less common UI surfaces, and inherited/default behavior.
- Compare changed families with their relevant references and the previous
  accepted design. For Aqua/Lime, use the supplied summer UI and the sampling
  records in `docs`; for Azure, use the documented Fluent sources. Do not impose
  Aqua's visual language on Aura or Azure.
- Judge color distribution, surface hierarchy, emphasis, syntax harmony, and
  state transitions. Token counts are not screen-area proportions. Do not treat
  passing contrast checks as proof of aesthetic quality.
- Preserve the user's deliberate soft contrast and white-on-color light
  controls. Inspect their real usability without arbitrarily increasing all
  contrast. Invisible icons on hover/focus are bugs, not a style preference.
- In Modern UI, Aqua/Lime Light use white selected activity icons and dark
  unchecked hover icons. Preserve the classic foreground fallback for keyboard
  focus and older UI. Verify the Modern UI setting is enabled before judging
  the independent activity state tokens.
- Aqua keeps cyan actions/navigation, mint badges, and small citrus accents.
  Citrus edges should remain subtle at normal viewing size. Modern UI hides
  several legacy tab/selection borders; verify rendered controls before
  increasing color intensity or spreading decoration into reading surfaces.
  Preserve the reference's sampled accent hues when revising summer details;
  first adjust their placement, area, adjacency, and interaction state. The
  user rejected making new darker/desaturated lime hues just to reveal edges.
  Distinguish direct pixel samples from earlier designed adaptations. Read the
  actual regional pairing: cyan or mint fills with white inner edges, neutral
  cards, and small isolated lemon highlights; do not infer a universal yellow
  border from the palette alone.
  Its reading surfaces stay cold white or Aura Dark. Lime is a separate pair
  with green-white light surfaces and mint/green-cyan/citrus interactions;
  its dark reading foundation stays Aura Dark.
- Review normal, hover without selection, selected, focus, unfocused, disabled,
  notification, remote, search, and layered diff states. Check TS/TSX, CSS,
  JSON/TOML, Markdown, and terminal examples for colors outside the main six
  syntax roles. Check omitted VS Code tokens rather than assuming defaults fit.
- Inspect actual VS Code in the isolated fictional sample profile for changed
  interactions. Avoid personal data in screenshots. Label config swatches and
  illustrations accurately; they are not real editor screenshots.
- Record concrete findings, resolved token names/values, decisions, tested
  states, and remaining visual coverage in `docs/reviews/`. Fix confirmed
  regressions within the authorized scope and rebuild/review those changes.
  Keep aesthetic suggestions distinct from verified bugs and accepted choices.
- Include a short review conclusion with delivered design changes. Say which
  parts were actually inspected and which remain unverified. Do not claim
  complete visual approval because unit tests passed.

Generate the full resolved-color review sheet with:

```sh
node scripts/review-vscode-themes.js
```

This is a workflow for design iterations, not a background scheduled task.

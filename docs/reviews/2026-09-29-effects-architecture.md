# Review: optional effects and the layered color compiler

Follow-up: the findings below were addressed in the local 0.9.4 refactor.
See [implementation and verification](2026-09-29-effect-roles.md). This document
preserves the original 0.9.3 assessment and proposal.

Reviewed local 0.9.3 on 2026-09-29 against `docs/COLOR_ARCHITECTURE.md`,
`AGENTS.md`, and `docs/THEME_REVIEW.md`. This is a static architecture review;
it does not change the design or claim new native visual coverage.

## Conclusion

The ordinary theme pipeline still follows source colors, semantic/role
resolution, template variables, port mappings, and generated theme JSON.
The optional effects do not yet follow that full pipeline. They are a
hand-authored CSS asset copied from `extra`, with some runtime references to
VS Code theme variables and some independent color literals. The level-marker
effect should become an optional composite badge role; button effects need the
same treatment. Keeping optional CSS as a separate output is compatible with
the architecture once its design values are compiled from the shared roles.

## Findings

### P2: effect colors bypass source and role resolution

`src/ports/vscode/extra/extension/aqua-gradients.css:23` declares the marker's
new cyan/green anchors directly. Lines 34–58 also decide edge, glow, and shadow
colors and opacities in CSS. `src/ports/vscode/index.ts:67` copies this file as
an extra asset; the subsequent template compilation only renders the manifest,
theme JSON, and README. The source/role interfaces therefore cannot describe
the complete delivered design. Updating a palette or inspecting its resolved
roles cannot account for these colors.

### P2: action decoration depends on the badge role

`aqua-gradients.css:7` and its other endpoint stops use
`--vscode-badge-background` to choose a primary button's mint endpoints. A
badge-specific palette adjustment or user override therefore also changes
buttons despite no change to their action roles. The button-focus glow instead
has hard-coded `#64EBAF60`, so it does not follow that same change. Separate
action and badge effect roles should reference shared source colors explicitly,
making their inheritance intentional and independently adjustable.

### P2: the resolved review omits the optional design output

`scripts/review-vscode-themes.js:186` inventories contributed theme JSON files;
it does not resolve the delivered CSS gradients, edges, or shadows. The
gradient tests validate loader orchestration and exact payload installation,
not source-to-role-to-CSS derivation. Nine unchanged JSON payloads establish
base-theme stability, not effects architecture compliance or complete design
coverage. The review should inventory both ordinary and enhanced states from
generated outputs, including their scope and fallback behavior.

### P3: enhancement scope is duplicated outside variant inheritance

The two theme-derived class names are repeated in CSS. Aqua Lime correctly
inherits Aqua's UI in `create-aqua-lime-roles.ts`, but that inheritance cannot
automatically carry an optional effect to a future supported derivative. A
theme-path change also requires an unrelated hand edit to the stylesheet.
Keep platform selectors in the VS Code renderer and generate the eligible
theme scopes from the registered schemes with optional effect roles. Explicit
opt-in remains necessary; do not automatically enable effects for all themes.

### P3: older small boundary leaks and stale documentation remain

The existing role resolver still contains a few raw dark-theme literals, for
example `create-aura-roles.ts:103` and `:108`. The template-variable adapter
also derives an opacity at `create-template-vars.ts:252` instead of consuming
a resolved unfocused-status role. These are older cleanup items, not regressions
introduced by 0.9.3. `AQUA_DESIGN.md` stops at the 0.9.1 buttons-only description,
while 0.9.3 also styles badges. Architecture and current-design documentation
should distinguish the ordinary theme from the optional enhancement output.

## Proposed model (not implemented by this review)

- Source: own the marker samples and shadow/edge anchors, with reference
  provenance. Derive opacity within role resolution as elsewhere in the code.
- Roles: extend `ui.badge` with optional `emphasis` fields describing gradient
  stops, edge color, glow color, and label-shadow color. Existing foreground and
  background remain the ordinary/fallback pair. Define action enhancement
  independently under `ui.action`, with normal, hover, and focus states.
- Inheritance: Aqua Light enables the roles; Aqua Lime Light inherits them by
  deriving Aqua. Dark and other families retain their existing behavior until
  a deliberate design chooses their effect roles.
- Adapter: expose named effect variables/data from the resolved roles. No
  primitive color selection should occur in the adapter or a CSS template.
- Port: render gradients and state selectors into generated CSS. VS Code DOM
  selectors, compact sizing, and platform-specific geometry remain here.
  Ordinary theme JSON continues to provide the plain-color fallback.
- Runtime: the existing extension only stages, applies, checks, or removes the
  generated stylesheet. It should not become a second palette resolver.
- Review: include resolved effect values, selectors/theme scope, normal/hover/
  focus states, and off-state fallback in the generated review inventory.

Suggested role name: `ui.badge.emphasis`. The rabbit is the reference provenance;
the role describes the emphasized count/marker purpose. Gradient stops, edge,
and halo form one coordinated role group rather than unrelated loose hex values.

## Refactor acceptance criteria

1. Preserve the nine current theme JSON payloads and the accepted enhancement
   appearance while moving ownership into source/roles.
2. Changing an effect source/role input changes the actual generated CSS.
3. Changing a badge-only role does not unexpectedly change button effects.
4. Aqua and Aqua Lime inherit equal UI effect values; unsupported families
   generate no applicable enhancement selectors.
5. Disabling optional CSS still returns the plain theme and preserves unrelated
   imports; rebuilds leave no stale copied stylesheet or unresolved variables.
6. Review the generated CSS alongside theme JSON and inspect the affected native
   button/badge states after the structural change.

No implementation files, installed CSS, settings, or published versions were
changed by this review. The installed local preview remains 0.9.3.

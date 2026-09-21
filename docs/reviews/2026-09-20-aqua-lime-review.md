# Aura Aqua Lime Light and tab-action hover

Date: 2026-09-20. Branch: `feat/aqua-lime-light`. Local build and installation only.

## Accepted direction and architecture

The user selected Aqua Sample C (67 percent) for a separate Aqua-derived theme,
requested shared UI updates, and reported a pale close-button hover on a cyan
tab. Added **Aura Aqua Lime Light** as a ninth VS Code theme. Existing Aqua,
Lime, Aura, and Azure names and saved selection IDs are preserved.

`createAquaLimePalette()` calls `createAquaPalette('light')` and derives only
syntax through the existing shared `createAuraSyntax` mapper. Base, semantic UI
inputs, all UI roles, ANSI, and terminal roles remain Aqua's. Future Aqua UI
changes therefore propagate on rebuild. Ordinary Aqua Light now uses its
published syntax palette; the prior unaccepted Summer role exceptions were
removed. All previous experiment packages and user demo files are preserved.

Accepted source values: cyan `#35BDCC`, mint `#47C491`, selector yellow-green
`#A9CD6E`, and number yellow `#DCB547`. These are C's adapted inks, not raw
reference samples. Palette provenance and reference composition remain recorded
in the sampled study: cyan controls, mint claim-all fill, small lemon artwork,
and a small title transition. The new theme has no green-white UI surfaces;
the existing separate Lime family retains those.

## Resolved review

Regenerated `resolved-themes.html/json`: nine themes, 4,500 UI entries, 432
TextMate rules, and 270 semantic entries. Read the new theme's entire 500-color
UI, all 48 TextMate rules and all 30 semantic entries. Verified every UI entry
equals Aqua Light, and every accepted C semantic value and original TextMate
rule is preserved. Two existing shared boolean/enum fallback rules use the same
cyan group; they do not split those roles from types/constants.

Reviewed changed values against the previously reviewed eight-theme baseline.
Aura and Azure payload hashes remain identical to that baseline. Aqua/Lime
change the shared toolbar-hover role; Aqua Light additionally loses the old
unaccepted syntax experiment. Existing Modern UI mappings, subdued alpha fills,
modified-state colors, and chart fixes from earlier work are retained.

The derived theme's editor remains `#F8FCFE`; sidebar `#F5F9FB`; actions and active
tabs `#12DADD`; white filled-control ink `#FFFFFF`; badges `#64EBAF`. Selection,
find, diff, diagnostics, terminal ANSI, widgets, Remote/SSH, disabled roles, and
less common surfaces all remain Aqua's. The full generated payload is linked
from the resolved review, with exact hashes in
[manifest.json](2026-09-20-aqua-lime/manifest.json).

## Hover regression and border behavior

The installed VS Code build (`7debcd0e2a`) retains an active tab's white action
foreground. Its close action uses the global `toolbar.hoverBackground`, which
was opaque `#ECF1F5` for Aqua Light. Native reproduction with old Sample C showed
the user's pale square; changing only Modern Editor Tab action backgrounds
does not address this global hover fill.

Changed Aqua's shared toolbar-hover role to a translucent foreground overlay:

- Light: `#39495214` (about 8% opacity).
- Dark: `#F2F0F514`.

This preserves the underlying colored tab, while still showing hover under
ordinary dark toolbar icons on pale backgrounds. Existing Lime inherits the
same interaction fix. Regression tests composite the overlay on its actual
receiving surface and check that active-close contrast is not reduced. Tests
do not claim that deliberately soft white-on-cyan controls meet WCAG AA.

Native before/after screenshots were captured on the same CSS tab and close
control. The old pale square was reproduced, and the corrected subtle cyan
hover verified. An inactive tab's dark close icon was also inspected.

The installed Modern UI stylesheet explicitly makes editor-tab border, top
border, hover border, and tab-strip border variables transparent. It also sets
`border-right:none` and a transparent top-border override. No
`modernEditorTab.border` or `modernTab.border` token is registered. Classic
`tab.border` / `tab.activeBorderTop` tokens still exist, but cannot force an
ordinary outline onto these Modern UI pills. High-contrast/focus outlines are
separate states. No unsupported token or custom CSS patch was added.

## Actual native coverage and design judgment

Freshly inspected CSS including an existing text selection, TSX, Markdown with
embedded JSON and a long quote, active close hover before/after, inactive close
hover, focused and inactive tabs, and the surrounding Explorer. Markdown quotes
and strings remain unified mint; booleans retain cyan. The 67 percent syntax
retains the brighter summer appearance selected by the user, with unchanged
purple/orchid/rose roles supplying contrast and variety.

**Accepted choice:** This is the user's selected softer syntax. Type, string,
and number contrast on the editor is approximately 2.19, 2.13, and 1.89. These
are not AA normal-text values. Selector ink is also intentionally light. No
extra quote/literal patch or brightness correction was applied after selection.

**Confirmed regression fixed:** Pale hover fill behind the white active close
icon. Verified against old and new themes in the native window.

**Coverage gaps:** No new full Classic UI, keyboard-focus navigation, diff,
find, terminal, TOML, notification, Remote/SSH, or dark hover screenshots in
this iteration. Shared UI identity and composited tests cover configuration
consistency, not complete runtime approval. No remote connection was created.

## Verification and delivery

- Four VS Code test suites passed: **237 tests**.
- All nine installed payload hashes match generated files.
- Shared UI equality, retained accepted syntax, role consistency, registration,
  and alpha-composited hover behavior are covered.
- `git diff --check` passed (line-ending notices only).
- The legacy build wrapper logged a failed `yarn clean` invocation and continued;
  reran the VS Code port directly with the repository's TS transpile-only runtime,
  generated its package and review inventory, and verified the actual outputs.
- Packaged `aura-modern-aqua-lime-preview.vsix` and installed it only in the
  isolated Reference Study profile. That window is left on Aura Aqua Lime Light.
- No commit, push, version bump, or Marketplace publication.

Screenshots: [hover before](2026-09-20-aqua-lime/tab-close-hover-before.jpg),
[hover after](2026-09-20-aqua-lime/tab-close-hover-after.jpg),
[TSX](2026-09-20-aqua-lime/tsx-and-inactive-tab.jpg),
[Markdown / JSON](2026-09-20-aqua-lime/markdown-json.jpg).

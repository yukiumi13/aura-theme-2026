# Superset port design

## Contract and provenance

This is a port for the Superset desktop app at https://superset.sh/, not Apache
Superset. Source inspection on 2026-10-22 used `superset-sh/superset` commit
`bdf1e2e4fc7b960f79e8cefde87e0d7d62505f18`. The paths below are relative to
that repository and are pinned by this revision:

- `packages/shared/src/themes/types.ts`: all UI, terminal, editor and syntax
  fields. `apps/desktop/src/shared/themes/index.ts` re-exports this contract.
- `packages/shared/src/themes/import.ts`: the parser accepts a single object,
  an array, or `{ "themes": [...] }`; merges omitted fields with built-ins;
  normalizes IDs and rejects reserved built-in IDs.
- `packages/shared/src/themes/editor-theme.ts`: absent editor fields are derived
  from UI and ANSI. Explicit editor output avoids this fallback.
- `apps/desktop/src/renderer/stores/theme/utils/css-variables.ts`: UI fields map
  to root CSS variables, with absent optional values reset to stylesheet defaults.
- `apps/desktop/src/renderer/stores/theme/utils/terminal-theme.ts`: conversion
  to xterm includes cursor, selection and all ANSI slots; CSS colors normalize
  to hex. This port emits hex and preserves alpha where supported.
- `apps/desktop/src/renderer/screens/main/components/WorkspaceView/utils/code-theme/`:
  `syntax-highlighting.ts`, `diff-theme.ts` and `diff-viewer-style.ts` apply
  editor roles to CodeMirror, Shiki and Pierre. These consumers have fewer
  independent roles than VS Code.
- `packages/ui/src/components/ui/{button,input,sidebar,dropdown-menu}.tsx`:
  actual state token usage, opacity rules and hard-coded utility classes.
- `apps/desktop/src/renderer/routes/_authenticated/settings/appearance/components/AppearanceSettings/components/ThemeSection/ThemeSection.tsx`:
  Appearance import, OS pairing and the 256 KiB file limit.
- `packages/cli/src/commands/settings/theme/` and
  `packages/cli/src/lib/settings/`: official import/export/selection support.
  The CLI resolves `SUPERSET_HOME_DIR` at call time, allowing isolated validation.

`docs/superset-theme-contract.json` records all supported field names. Superset
CLI 1.39.0 provides an additional real parser/round-trip check. No upstream
palette is copied into the Aura source.

## Compilation and ownership

```text
source palettes (Aura / Aqua / Lime / Azure, light and dark)
  → existing family role resolver (base + UI + syntax + ANSI)
  → createTemplateVars (named base*, ui*, syntax*, terminal*, ansi*)
  → modernThemes (the same nine entries used by VS Code / Kitty / Ghostty)
  → Superset JSON template through createInMemoryPort
  → individual JSON files + a pack containing those exact compiled definitions
  → packages/superset
```

Source colors and role decisions remain in `src/core/colors`. Named base
variables expose the final family/appearance foundation; they do not introduce
a new palette. `ui.chartSeries` is a generic five-series role using the family's
lavender, mint ink, orange, blue and pink. The port maps series indices and
never chooses new color literals, mixes colors, reads another generated port,
or adjusts palette values. Existing numeric aliases remain for older ports.

Every public color field is explicit: **41 UI + 22 terminal + 24 editor/diff +
14 syntax = 101 per theme**. All nine current themes have stable, year-free
Superset IDs based on their display names. Appearance metadata is explicit;
reserved `light`, `dark` and `system` IDs are not reused. Bundle and individual
files are generated from one template result, not parallel color mappings.

## Receiving surfaces and semantic mapping

| Superset group | Aura input | Meaning |
| --- | --- | --- |
| background / foreground | resolved base reading pair | Preserve each family foundation |
| card / popover | panel / elevated roles | Quiet cards and floating widgets |
| primary / sidebarPrimary | action background and foreground | Filled controls with explicit paired ink |
| secondary / muted / tertiary | base surface / surfaceAlt / panel | Receding controls and toolbar levels |
| accent | hover surface + strong neutral ink | Menus, ghost buttons and hover; not the brand hue |
| sidebarAccent | list selection + strong neutral ink | Shared native hover/selected surface |
| border / input / sidebarBorder | base boundary / chrome boundary | Inputs use the same native token for border and dark-mode fill |
| ring / sidebarRing | focus border role | Native focus geometry applies alpha as needed |
| destructive / warning / success | semantic status roles | Never infer status from ANSI slot indices |
| chart1–5 | `ui.chartSeries` | Five independently resolved data series |
| highlight / highlightForeground | badge pair | Mint badge remains separate from cyan Aqua actions |
| highlightMatch / highlightActive | editor selection / strong selection | Soft search overlays |
| terminal | shared terminal surface and ANSI roles | Matches Kitty/Ghostty cursor, selections and 16 slots |
| editor chrome | base / editor-decoration / action roles | Includes selection, search, gutters and search panel |
| editor cursor | UI accent-bright role | Matches VS Code's editor cursor; independent of terminal cursor fill |
| editor diff | status success / error / modification | Pierre derives its overlay geometry/strength |
| editor syntax | the 14 corresponding syntax roles | Independent of terminal palette changes |

RGBA is retained on CSS-capable fields so overlays compose on their receiving
surface. Terminal fields use the existing resolved terminal surface roles; do
not strip alpha or introduce a second compositing implementation in the port.
Reading surface, UI hover, terminal selection and editor selection are distinct.

## Native constraints and accepted choices

- Aqua actions stay cyan and badges stay mint. White-on-color light controls
  and the existing soft syntax contrast are deliberate choices. Lime keeps its
  green-white light surfaces; Azure keeps its own Fluent roles. These are not
  recolored to resemble a different family.
- `primary` is coupled between filled controls and some link-button text.
  Light mint/cyan/green controls therefore also create faint links on pale
  canvases. The theme schema cannot preserve those bright fills while assigning
  a separate readable ink to these links. Record this constraint; do not
  arbitrarily darken the shared button roles. Azure Dark also shares its darker
  action fill with link text.
- Native primary hover is `primary/90`; secondary hover is `secondary/80`.
  Dark ghost hover uses `accent/50`; dark outline/input controls add opacity.
  Theme JSON cannot independently choose the shared Aura hover color for these.
- Sidebar hover and active row states share `sidebarAccent`; there are no
  separate tab, unchecked activity, notification, remote or unfocused selectors
  in the import schema. Do not claim a selected-versus-hover distinction that
  the application cannot express.
- Destructive button labels use literal white in the native button component,
  regardless of `destructiveForeground`; the field remains explicit for other
  consumers. This and other literal utility colors can limit theme coverage.
- Examples include `DiffStatText` using `text-green-400` / `text-red-400`, rather
  than theme status tokens. A theme JSON cannot replace those classes.
- Syntax scopes, boolean/null treatment, font styles, muted-token fallbacks and
  Pierre's diff opacity belong to Superset. Alpha selections must be reviewed
  over code and over diff rows, not as raw swatches alone.
- Fonts, layout, shortcuts, plugin settings, browser/webview contents and
  remote terminal programs are outside the theme configuration. No VS Code
  CSS injection or settings migration is installed by this port.

## Validation and delivery

Build with `yarn build only superset`; create the release ZIP with
`yarn package:superset`. The port emits nine individual themes plus
`packages/superset/aura-theme-2026.json`. Its pack is importable through the
Appearance control or official CLI. A workflow builds the same sources and
attaches the ZIP to future `v*` releases; this change does not republish 0.9.7.

Run `node scripts/review-superset-themes.js` to verify the upstream field
inventory, pack parity, hex/alpha resolution and payload hashes. The output
contains every resolved field, state specimens, data-series/ANSI strips and
contrast diagnostics. The HTML is interactive and explicitly labelled a
configuration specimen. Run `node scripts/review-vscode-themes.js` for the full
required VS Code inventory, and compare existing generated ports to the
accepted baseline. See `docs/reviews/2026-10-22-superset.md` for actual evidence
and the limits of runtime visual coverage.

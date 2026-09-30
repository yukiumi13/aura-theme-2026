# Aura Modern 0.9.5: ship the native Pill default

Date: 2026-09-29. Fixes the fresh-machine tab issue reported after 0.9.4.

## Change and scope

The generated extension manifest now contributes
`workbench.experimental.modernUIEditorTabStyle: pill` through the supported
`configurationDefaults` contribution point. Previously, the local review and
daily profiles had an explicit Pill setting, while the published extension
only documented this requirement. Fresh installations therefore retained the
Connected style and could display white Aqua labels on a pale tab fill.

The contribution is editor-wide while Aura is enabled, including other themes.
User/Remote/Workspace overrides retain precedence. It neither writes a user's
settings nor enables Modern UI, and has no dependency on the optional CSS
integration. The README states these limits. Explicit Connected selections
remain a compatibility limitation on the affected editor version.

## Resolved design review

Decoded and deep-compared every generated theme with the released 0.9.4 VSIX:
all nine themes are identical, including all 4,500 UI entries, 432 TextMate
rules, 270 semantic entries, transparency and terminal colors. The optional
stylesheet is byte-identical; the effect inventory only changes its version.
The complete generated review inventory was refreshed.

In both Aqua Light appearances, the intended focused active tab remains
`#12DADD` with `#FFFFFF` text; inactive tabs use `#EFF5F8` with `#6B7D86` text.
Unfocused active tabs keep their accepted pale background and subdued text.
No accents, reading surfaces, syntax or gradient roles were revised.

## Real VS Code checks

Used VS Code 1.139.1's native extension test runner with the packaged 0.9.5
extension installed in isolated user-data and extension directories:

- With no explicit User or Workspace tab-style value, the effective value and
  contributed default are both `pill`.
- An explicit User value of `connected` wins. Removing it restores `pill`.
- Starting with Aura disabled restores the editor's `connected` default, with
  no residual User setting.

The test runner temporarily writes and removes its own fixture override; the
Aura extension performs no such writes. See the
[default and override results](2026-09-29-tab-default/native-default-check.json)
and [disabled-extension results](2026-09-29-tab-default/native-disabled-check.json).

Also installed the actual VSIX in the existing isolated fictional visual
profile. Backed up its settings and removed its explicit tab-style preference.
Modern UI remains enabled and the selected theme is Aura Aqua Lime Light.
The TSX tab is cyan with white text, and switching to CSS transfers the cyan
fill to the new active tab while the previous tab returns to its pale fill:

- [Native TSX tab](2026-09-29-tab-default/default-tsx.png)
- [Native CSS tab](2026-09-29-tab-default/default-css.png)

The existing installation-wide button/badge CSS remains present in this visual
profile; it contains no tab rules. The native configuration tests independently
verify default selection and precedence without a loader in the test profile.

**Design conclusion:** the published default now reproduces the accepted
cyan-on-cool-white hierarchy on a new installation. Cyan stays concentrated on
the active document rather than spreading into the tab strip or reading area.
The reference-inspired effects and all palette decisions are unchanged.

Fresh visual coverage is limited to the active/inactive TSX and CSS tabs in
Aqua Lime Light. Separate Aqua Light, other families, Classic UI, split-group
focus, tab-close hover and older editor versions were not newly rendered.
Their unchanged theme/effect data does not claim fresh runtime approval.

## Release checks

- The six existing effect-compilation tests pass against the rebuilt output.
  The repository's older ts-node needs `TS_NODE_TRANSPILE_ONLY=1` to load the
  Jest configuration with the installed TypeScript version, as in the prior
  build workflow; the initial invocation without it failed before tests ran.
- Actual installed-extension tests above cover the new behavior and override
  lifecycle; no mock test was added to restate the manifest value.
- VSIX contains the same 21-file layout as 0.9.4 and nine registered themes.
- Final VSIX SHA-256:
  `f45341ddb255774801dbf5d355ce0e1e2b179ffdd9cae19a531e29d0dcbaf19f`

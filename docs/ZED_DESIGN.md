# Modern Aura for Zed

## Scope and provenance

This port shares the nine Modern appearances: Aura, Aqua, Lime and Azure light/dark pairs, plus Aqua Lime Light. Old accent variants and their compiler are preserved in `legacy/packages/zed` and `legacy/ports/zed`.

The 0.9.8 release candidate integrates the reviewed Zed port onto main `092620e`. The shared registry and terminal compiler remain intact. All nine Zed theme payloads are byte-identical to the original reviewed iteration; existing VS Code, Ghostty and Kitty color payloads are unchanged. The task's older Aqua worktree and its pre-existing edits are retained separately.

Zed's [stable release page](https://zed.dev/releases/stable) identified **1.26.2**, released October 28, 2026. The actual deserializer contract was checked at tag commit `c4273271092b0287f7d181f616bd5171e0a2f70c` and main `f816e1f9263e3a8ef63c4baaa02e1441ce1c6038`. `crates/settings_content/src/theme.rs` is identical at these revisions. The website still specifies the v0.2.0 theme URL; that URL alone does not describe all newer fields.

Primary implementation references:

- [Theme content fields](https://github.com/zed-industries/zed/blob/c4273271092b0287f7d181f616bd5171e0a2f70c/crates/settings_content/src/theme.rs).
- [Theme refinement and fallback](https://github.com/zed-industries/zed/blob/c4273271092b0287f7d181f616bd5171e0a2f70c/crates/theme_settings/src/theme_settings.rs).
- [Tab foreground/background pairing](https://github.com/zed-industries/zed/blob/c4273271092b0287f7d181f616bd5171e0a2f70c/crates/ui/src/components/tab.rs).
- [Button state/elevation mapping](https://github.com/zed-industries/zed/blob/c4273271092b0287f7d181f616bd5171e0a2f70c/crates/ui/src/components/button/button_like.rs).
- [Global text and selected colors](https://github.com/zed-industries/zed/blob/c4273271092b0287f7d181f616bd5171e0a2f70c/crates/ui/src/styles/color.rs).
- [Semantic tokens](https://zed.dev/docs/semantic-tokens).

The pinned field inventory is `zed-theme-contract.json`; `zed-theme-mapping.json` records each field's named shared role. On an upstream update, compare the two Rust content structs, supported syntax from bundled themes, and the actual consumer components before expanding the inventory. The offline validator requires exact field coverage and rejects unknown/deprecated fields and unresolved colors.

## Shared layers

`source -> base/semantic/family roles -> createEditorSurface(final palette) -> named template variables -> Zed template -> packages/zed`.

The editor-surface resolver runs after Aqua/Lime/Azure overrides. It owns generic control surfaces, global-foreground-compatible active tabs, action tints, search states, debugger lines, mode pairs, and translucent collaboration selections. The port contains mappings and serialization only. Existing VS Code role values are preserved; no second set of hex colors is maintained in Zed.

| Layer | Role and distribution |
| --- | --- |
| Reading canvas | Family `base.background`; Aqua/Lime Dark retain Aura Dark, Azure keeps Fluent neutrals |
| App and status chrome | `base.appBackground`; subdued, without broad accent washes |
| Docked panels | `base.sidebar`; they are the receiving surface for list controls |
| Surfaces and popovers | `base.surface` then `ui.surfaceRole.elevated` |
| Tabs | Existing tab strip/inactive roles, restrained action-tinted active surface |
| Hover / press / select | Neutral hover, stronger focused-list tint on press, persistent list selection tint |
| Focus and drop targets | Shared keyboard-focus ink, separate from decorative boundaries |
| Actions and state emphasis | Family action tint; readable link/accent ink; paired vivid Vim/Helix indicators where foreground is configurable |
| Diagnostics and Git | Semantic status colors and alpha surfaces, independent of terminal ANSI and syntax |
| Editor overlays | Layered diff, search, occurrence, debugger, guides and code lens roles |
| Terminal | Shared 24 ANSI slots plus dedicated terminal surfaces and foregrounds |

Aqua retains cold-white surfaces, cyan emphasis, and mint mode accents. Lime retains green-white surfaces with mint emphasis. Azure uses Fluent blue and gray. Aqua Lime Light preserves the previously selected soft summer syntax (including pale cyan types, mint strings and yellow numbers); see `reviews/2026-09-20-aqua-lime-review.md`.

## Complete configurable color contract

Each theme defines all **186** non-deprecated scalar fields in the inspected current contract. This includes minimap and scrollbar normal/hover/active states, dock overlays, debugger and code lens, filled/hollow diff hunk surfaces and borders, Git conflict markers, status foreground/background/borders, and Vim/Helix foreground/background pairs.

Eight complete player slots cover the eight default slots; an explicit nonempty accent array replaces Zed's accent defaults. All 46 syntax names in the inspected bundled One theme are covered, along with Aura's semantic targets, for **85 styles**. Each syntax style has explicit foreground, transparent background, font style and weight. The semantic-token fragment remains opt-in and all its referenced names resolve.

No token count is used as an aesthetic score or an estimate of screen-area distribution.

## Coupled and unavailable controls

Zed's active tab reads global `text`; it has no independent `tab.active_foreground`. A saturated Azure background with white VS Code tab ink cannot be copied as a pair. The editor-surface role instead tints the action color at 0x16 in Light and 0x20 in Dark, keeping ordinary global text legible. Generic buttons also use global text, and selected labels can use `text.accent`.

Tinted accent buttons use `info.background` and `info.border`. These are compiled from action tint/border roles while `info` retains its diagnostic foreground. This host coupling also colors information surfaces; it is explicitly reviewed rather than hidden by fallback.

Vim/Helix mode fields support independent foregrounds, so their filled action/badge pairs preserve existing white-on-color choices. Aqua/Lime Light's white on vivid fills remains deliberately soft. Zed exposes no universal badge pair or per-state tab foreground. A theme cannot independently set remote-status hover, every notification variant, close-button states, widget geometry, gradients, UI fonts, or file icons. Components also have programmatic colors and opacity behavior; system colors are initialized by Zed outside this theme contract.

Arbitrary future language captures, LSP custom rules, plugins, user overrides, OS rendering and upstream additions remain runtime boundaries. Explicit coverage removes default fallback for the pinned configurable fields, not every possible source of color in Zed.

## Verification and review

Run `yarn build only zed`, `node scripts/validate-zed-themes.js`, `yarn test`, `node scripts/review-zed-themes.js`, and `yarn package:zed`. The generated HTML/JSON review includes every scalar field, syntax style, accent and player plus composited states and diffs.

The iteration report in `reviews/2026-11-01-zed-modern.md` distinguishes source inspection, resolved configuration, illustrative rendering, regression checks, and outstanding native runtime coverage. The fictional TSX/CSS/JSON/TOML/Markdown examples use assigned syntax styles; they are not grammar/parser verification.

# Zed Modern port review — November 1, 2026

## Scope and exact evidence

Nine Modern appearances replace the fourteen legacy dark variants. This iteration uses the task's existing Aqua worktree and palette state (package 0.9.1), with the curated registry from main `092620e`. It does not merge the older dirty worktree into main. The prior package is preserved byte-for-byte under `legacy/packages/zed` and its compiler under `legacy/ports/zed`.

Zed stable **1.26.2** (`c4273271092b0287f7d181f616bd5171e0a2f70c`) and upstream main `f816e1f9263e3a8ef63c4baaa02e1441ce1c6038` have identical inspected color-content structs. Tab and theme-refinement implementations are identical too. ButtonLike differs only in size/height APIs; inspected color pairing is unchanged. See [source references and mapping decisions](../ZED_DESIGN.md).

- [Complete resolved Zed sheet](resolved-zed.html), [resolved payloads](resolved-zed.json).
- [Rendered configuration overview](2026-11-01-zed-modern/overview.png). These are illustrative configuration specimens, **not native Zed screenshots**.
- [Payload hashes and verification record](2026-11-01-zed-modern/verification.json).
- [Complete VS Code resolved inventory](resolved-themes.html): 4,500 UI entries, 432 TextMate rules, 270 semantic tokens across nine appearances.

Every Zed theme explicitly supplies all 186 supported scalar colors, 85 syntax styles (including all 46 inspected built-in names), eight complete player slots and an eight-color accent array. Zed refines scalar colors over built-in defaults; explicitly supplying every pinned field prevents that fallback. Player slots merge by index, so all eight defaults are covered. Nonempty accent arrays replace their defaults. This does not guarantee the appearance of hard-coded component colors, system colors, user overrides, future grammar captures, or future fields.

## Overall design judgment

The nine rendered specimens preserve distinct family foundations. Aqua Light's `#F8FCFE` reading area and `#F5F9FB` docks remain cold white; Lime Light uses `#FBFDFB` and `#F5F9F3`. Aqua/Lime Dark keep Aura's `#09080D` canvas. Azure Dark uses `#1F1F1F` with `#141414` docks, and Azure Light uses `#FAFAFA` with `#F5F5F5` docks. Large areas stay quiet, with accent concentration in selection, focus, mode indicators, and syntax.

For ordinary controls the palette moves through neutral hover, stronger pressed tint and persistent selected tint. Disabled controls recede. Elevated surfaces retain their own background. Search and diff overlays have bounded area; syntax is still visible in the five illustrative language specimens. This is a design judgment from configuration and rendered specimens, not full application approval.

Aqua's sampled cyan/mint relationship appears in its action tints and mode pairs. Lime retains its greener balance. Azure keeps Fluent blue. None of these changes alters the source hue anchors or raises contrast globally. Token counts were used to check coverage only.

## Findings and decisions

| Classification | Finding / resolved evidence | Decision |
| --- | --- | --- |
| Configuration regression fixed | The legacy `border.transparent` used a vivid syntax color | All themes now use `#00000000`; placeholder borders no longer introduce accidental decoration |
| Host constraint | Zed's selected Tab reads global `text`, not VS Code's per-tab foreground | Active tabs use restrained family tints: Aqua Light `#12DADD16` with `#4A5861`; Azure Light `#0F6CBD16` with `#424242` |
| Design adjustment | Filled/tinted buttons also use global or selected text | Generic controls stay neutral/tinted. `info.background` carries the action tint (Aqua Light `#12DADD24`); its diagnostic foreground remains separately defined |
| Design adjustment | Legacy line numbers reused a low-opacity line highlight | Zed uses shared opaque subtle ink (`#6D6D6D` in Aura Dark) while the existing VS Code line-number choice stays unchanged |
| Accepted choice | Aqua/Lime Light mode pairs can actually select their own foreground | White-on-cyan/mint remains: normal `#FFFFFF` on `#12DADD` for Aqua; insert `#FFFFFF` on `#64EBAF` |
| Accepted choice | Aqua Lime Light's selected soft summer syntax has intentionally low contrast | Retain types `#35BDCC`, strings `#47C491`, numbers `#DCB547`. Plain-editor ratios are about 2.19 / 2.13 / 1.89; compare overlay dilution, not a newly imposed global threshold |
| Design adjustment | Git/diff/diagnostic colors previously borrowed numeric syntax aliases | Semantic roles now drive added, deleted, modified, conflict, info and warning states; terminal ANSI remains independent |
| Coverage gap | Zed has no independent universal badge pair, activity-rail states, remote-hover pair or per-state tab foreground | Use the public component fields coherently; do not invent unsupported tokens |

The lowest sampled ordinary-state pair is 3.68:1 in Aqua Light/Aqua Lime Light and 3.71:1 in Lime Light. This excludes intentionally soft vivid mode pairs and disabled controls. These ratios support inspection and are not aesthetic scores.

Aqua Lime Light's layered diff numbers are about 1.68–1.69:1, consistent with the intentionally pale syntax and lighter than ordinary Aura/Aqua. This is retained as an accepted-source tradeoff and explicitly exposed in the report. Its native readability remains a runtime review item.

## Inspected coverage

- Source-level contracts for normal/hover/pressed/selected buttons, global and selected text, active/inactive tabs, theme fallback, syntax styles, player and accent merging.
- Every generated Zed scalar field and nested syntax/player/accent value parsed and validated. Reviewed surface, terminal, guide, search, diagnostic, mode, debugger, minimap, conflict, and layered diff mappings.
- All nine appearances rendered by headless Chrome and visually inspected in the overview: TSX, CSS, JSON, TOML, Markdown, terminal, ordinary controls, static hover/selection examples, disabled states, mode indicators and layered diff specimens. Snippets have assigned theme style spans; no grammar-parser or LSP execution is claimed.
- Every shipped VS Code JSON was parsed, including UI alpha entries, all 16 ANSI slots per theme, TextMate and semantic styles. Regenerated the required full resolved sheet. Rebuilt VS Code and compared **all package files byte-for-byte** with the pre-task snapshot: no changes. Existing VS Code runtime observations remain historical, not fresh native checks.

Native Zed was **not inspected**: no Zed binary is available on PATH and neither DISPLAY nor WAYLAND_DISPLAY is set. Real hover, keyboard focus, unfocused windows, popovers, notifications, remote status, collaboration labels, Vim/Helix, debugger, font rendering, and language-server precedence remain unverified. Configuration specimens do not close these gaps. Next native review should use an isolated fictional workspace with personal themes/overrides disabled and exercise those states in all changed light/dark families.

## Validation and delivery

- `yarn build only zed` and `yarn build only vscode`: passed.
- `node scripts/validate-zed-themes.js`: passed; exact field set, valid colors, complete built-in syntax and every packaged semantic rule target.
- `yarn test`: **15 suites / 285 tests passed**, including 28 new Zed checks.
- `tsc --noEmit`, changed-source ESLint, and scoped `git diff --check`: passed.
- Both resolved review generators completed.
- ZIP CRC and byte-for-byte payload equality checked: 14 files, exactly nine modern themes, semantic settings, README, manifest, notices, license. The archive is excluded.
- ZIP: `dist/zed/aura-theme-2026-zed-extension.zip`; hashes are in `verification.json`.

The delivered configuration is coherent with the shared Modern families and complete for the pinned public color contract. Native visual approval remains open. No installation into personal settings or publication was performed.

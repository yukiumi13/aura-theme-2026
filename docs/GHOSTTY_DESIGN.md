# Ghostty design and compatibility

## Compilation

```text
source colors
  → Aura / Aqua / Aqua Lime / Lime / Azure palettes
  → semantic UI, syntax and terminal roles
  → terminal surface adapter (after family overrides)
  → named template variables
  → shared modern theme registry + shared terminal ANSI mapping
  → Ghostty templates
  → nine .conf files + four optional Herdr surface companions
```

`src/ports/shared/modern-themes.ts` owns the current lineup for VS Code and Ghostty. VS Code's saved theme IDs and file slugs remain stable. Ghostty uses the current display names for filenames. Old Ghostty outputs are frozen in `legacy/ghostty`; new builds do not mix them into the active bundle.

`createTerminalSurface` resolves only after each family has finished overriding its roles. No independent Ghostty palette or numeric legacy accent mapping is maintained. Syntax changes therefore cannot accidentally redefine terminal colors. Aqua Lime Light shares Aqua Light's terminal roles, even though its editor syntax differs.

## Role mapping

| Ghostty field | Shared source / adaptation |
| --- | --- |
| `background`, `foreground` | Reading surface and main text; identical to VS Code's `terminal.background` and `terminal.foreground` |
| `palette = 0..15` | The same final ANSI mapping as the corresponding VS Code theme |
| `cursor-color` | Family primary-action fill |
| `cursor-text` | Most readable existing palette endpoint on that fill |
| `selection-background` | Solid selection role composited over the reading surface |
| `selection-foreground` | Strong foreground |
| `search-background` | Editor selection role composited over the reading surface |
| `search-foreground` | Strong foreground |
| `search-selected-background` | Primary-action fill |
| `search-selected-foreground` | Same ink selection as the cursor |
| `split-divider-color` | Shared border composited over the reading surface |
| `unfocused-split-fill` | Reading background; opacity remains a user preference |
| `window-titlebar-background` | Family chrome surface |
| `window-titlebar-foreground` | Muted foreground |

Ghostty expects RGB in these fields. Source RGBA is composited, not truncated. Cursor and active search ink is chosen from the existing reading background, strong foreground and elevated surface. This adapts a filled control to small terminal glyphs without inventing a darker accent or changing the user's accepted VS Code white-on-aqua controls.

## Capability baseline

Checked against [Ghostty 1.3.1 Config.zig](https://github.com/ghostty-org/ghostty/blob/22efb0be2bbea73e5339f5426fa3b20edabcaa11/src/config/Config.zig) and the [configuration reference](https://ghostty.org/docs/config/reference). Independent search colors arrived in [Ghostty 1.3](https://ghostty.org/docs/install/release-notes/1-3-0); the new bundle requires 1.3+.

Titlebar colors are GTK-only and require the user's `window-theme = ghostty`. macOS uses native titlebar styling. This setting is deliberately not forced by the theme. Color themes cannot express the VS Code button gradients, badge glow or focus halos.

Font, geometry, opacity, blur, cursor shape, bold behavior, minimum contrast and bindings are user policy. `palette-generate` and `palette-harmonious` remain at their defaults: overwriting the extended xterm palette would change applications that use indices 16–255. Programs that emit truecolor select their own RGB values.

Theme lookup uses the exact filename: `theme = aura-aqua-light.conf`. A system pair can use `theme = light:aura-aqua-light.conf,dark:aura-aqua-dark.conf`. User config colors override theme colors. See [Ghostty's theme documentation](https://ghostty.org/docs/features/theme).

## Herdr terminal theme

Source inspected at [herdr 5da0a01](https://github.com/herdrdev/herdr/tree/5da0a01e1eedda054db0c81dd3a780000c40d9f0). This is a source compatibility audit, not a claim about the user's installed Herdr version.

- [`Palette::terminal`](https://github.com/herdrdev/herdr/blob/5da0a01e1eedda054db0c81dd3a780000c40d9f0/src/app/state.rs) uses default foreground/background, ANSI blue for accent, green/yellow/bright-red for state, cyan for notifications, and gray for secondary labels. It does not receive Ghostty's cursor, search, or selection roles as separate UI tokens.
- [`terminal_theme.rs`](https://github.com/herdrdev/herdr/blob/5da0a01e1eedda054db0c81dd3a780000c40d9f0/src/terminal_theme.rs) queries OSC 10/11 for default foreground/background and OSC 4 for the palette, including the extended slots. Herdr's embedded terminal engine can therefore preserve host colors independently of its UI theme.
- `terminal` uses ANSI 8 (`DarkGray`) as the active-row and hover surface. Aura's slot 8 is text ink. For Aqua Light, default text `#4A5861` on slot 8 `#80919A` has about 2.25:1 contrast. Moving this gray toward white would weaken terminal dim text and break accepted ANSI parity.

Optional generated `herdr/*.toml` companions address the surface mismatch through Herdr's own role overrides:

| Herdr role | Compiled source |
| --- | --- |
| `active_row_bg` | Shared list-selection role composited over the reading surface |
| `selection_bg` | Shared focused-list-selection role composited over the reading surface |
| `surface1` | Shared hover-surface role composited over the reading surface |

Only these three roles are overridden. Text, status, accents, panel/sidebar background and other inherited roles remain Herdr's `terminal` behavior. Light/dark subtables use the matching family roles; Aqua Lime uses Aqua's companion. Both appearance names remain `terminal`. Users forcing a theme against system appearance must select the corresponding values in `[theme.custom]` instead. This is intentionally a small compatibility adapter, not a second independent Herdr color design.

Herdr's primary accent consequently remains the readable ANSI-blue ink, not the vivid aqua button fill. This preserves the meaning of the ANSI palette across terminal applications. The companion does not reproduce VS Code's effects or overwrite a user's Herdr config automatically.

## Verification

Unit checks cover all 270 decoded Ghostty values, source/output equality, exact VS Code terminal parity, alpha composition, filled-text contrast and companion surface mappings. `scripts/review-ghostty-themes.js` records full resolved colors and contrast observations for manual review. Runtime validation and remaining visual coverage are recorded separately under `docs/reviews/`; successful parsing and numerical contrast are not an aesthetic approval.

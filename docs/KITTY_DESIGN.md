# Kitty design and compatibility

## Active build

Kitty is a maintained port in `src/ports/kitty`, compiled to `packages/kitty` by `yarn build only kitty` or the full build. The old upstream Soft Dark/iTerm conversion stays archived in `legacy/ports/kitty` and `legacy/packages/kitty`. Active builds and release bundles never include it.

The nine themes come from `src/ports/shared/modern-themes.ts`, also used by VS Code and Ghostty. Kitty consumes the same terminal ANSI mapping; Aqua Lime Light consequently has the same terminal and chrome colors as Aqua Light while retaining its independent VS Code syntax colors.

```text
source palettes + semantic roles
  → resolved terminal surface roles
  → named template variables + shared modern theme registry
  → Kitty theme template
  → nine color configurations

Kitty port extra/styles/aura-ui.conf
  → optional interface geometry and tab-label typography
```

## Field mapping

| Kitty fields | Shared role / adaptation |
| --- | --- |
| `background`, `foreground` | Reading surface and normal reading ink; same as VS Code and Ghostty terminals. |
| `color0`–`color15` | The shared curated ANSI palette; extended colors keep the terminal default. |
| `cursor`, `cursor_text_color` | Filled-action color with readable text selected from existing palette inks. |
| `selection_background`, `selection_foreground` | Composited solid selection and strong reading ink. |
| `active_tab_background`, `active_tab_foreground` | Accepted family chrome active-tab roles. |
| `inactive_tab_background`, `inactive_tab_foreground` | Family inactive-tab surface and muted reading ink. Disabled/unfocused editor ink is deliberately not used for ordinary inactive tabs. |
| `tab_bar_background`, `tab_bar_margin_color` | Family tab-strip surface. |
| `active_border_color`, `inactive_border_color` | Composited focus border and neutral split divider. |
| `bell_border_color` | Semantic warning color. |
| `url_color` | Semantic link foreground, independent of ANSI and syntax. |
| `macos_titlebar_color` | Resolved family chrome background, kept in the color file for OS appearance switching. |

Resolve source RGBA onto the reading background before writing RGB colors. These mappings extend `createTerminalSurface` and `createTemplateVars`; they do not create a separate Kitty palette or modify the existing Ghostty field mappings.

Preserve the accepted Aqua/Lime Light white-on-cyan active-tab appearance. Numerical contrast observations must identify this deliberate soft-contrast choice rather than silently darkening the source accent. The cursor remains independently adapted for small terminal glyphs. Inactive tab ink must remain readable as normal navigation rather than appear disabled.

## Styling and personal configuration

The optional `styles/aura-ui.conf` selects a flat top tab bar using Kitty's built-in `separator` renderer, whitespace separators, small margins, fine split dividers and normal active/inactive tab labels. It does not load a Python renderer, change the startup layout, hide window decorations or modify keyboard/mouse shortcuts.

This is where port-specific interface geometry and tab-label typography belong. Terminal body font family/weight, regular and bold faces, size, gamma/composition, background opacity, blur and content padding remain personal settings. Same-family fonts need not render with identical perceived weight in Ghostty and Kitty. Preserving application-requested bold/italic body text is separate from styling Kitty's own tab labels.

Kitty's tabs are rendered in cells, so native macOS tab controls and exact VS Code Pill geometry are outside this preset's capabilities. No runtime aesthetic approval is implied by a parser check or a configuration swatch.

## Installation, release and switching

Generated themes are included by filename from the user's Kitty configuration. Chezmoi can deploy them and select a family/appearance while keeping fonts and SSH file-link actions local. Old user-installed themes are not deleted by this port; archive or remove them explicitly in the user's dotfile repository once their active include has migrated.

The terminal bundle script and GitHub workflow build and attach `aura-theme-2026-kitty-themes.zip`, including nine themes, the optional style preset, README, license and Fluent notice. Shared palette/role changes trigger the workflow just as they do for Ghostty.

Kitty 0.38+ recognizes `dark-theme.auto.conf`, `light-theme.auto.conf` and `no-preference-theme.auto.conf` in its configuration directory. These files override other color settings and require their own titlebar color. The package README documents fixed includes and automatic selection separately; updating installed source themes also requires refreshing these copies. The theme kitten is an alternative interactive way to select them.

## Capability boundaries and review

URL color does not enable path recognition, Cmd + Click or remote VS Code opening. Those belong to the user's mouse bindings, open actions and routing scripts. Kitty marker colors are not equivalent to Ghostty search-match fields. Herdr's optional shared-role companions are available in the Ghostty package and work with the same Kitty terminal palette.

Checks cover the generated lineup, every decoded color, ANSI/reading/selection/cursor parity with Ghostty, chrome parity with VS Code, late overrides and alpha composition. `node scripts/review-kitty-themes.js` records complete resolved colors, payload hashes, contrast observations and labeled configuration specimens. Actual macOS typography, titlebar rendering, hover behavior and multi-window tab interaction remain separate runtime review requirements.

References: [Kitty configuration](https://sw.kovidgoyal.net/kitty/conf/), [tab-bar options](https://sw.kovidgoyal.net/kitty/conf/#tab-bar), [automatic theme selection](https://sw.kovidgoyal.net/kitty/kittens/themes/#change-color-themes-automatically-when-the-os-switches-between-light-and-dark), and [Kitty 0.49.2 source](https://github.com/kovidgoyal/kitty/tree/v0.49.2).

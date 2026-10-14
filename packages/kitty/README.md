# Aura Modern for Kitty

Nine current themes generated from the same source palettes, terminal ANSI colors and semantic roles as Aura Modern for VS Code and Ghostty. The old single Soft Dark conversion remains archived under [`legacy/packages/kitty`](https://github.com/yukiumi13/aura-theme-2026/tree/main/legacy/packages/kitty); it is outside the active build and release path.

## Install

Copy the nine theme files and the optional interface preset from this directory or the Kitty release bundle:

```sh
theme_dir="${XDG_CONFIG_HOME:-$HOME/.config}/kitty/themes"
mkdir -p "$theme_dir/styles"
cp ./*.conf "$theme_dir/"
cp ./styles/aura-ui.conf "$theme_dir/styles/"
```

Choose a theme in `kitty.conf`:

```conf
include themes/aura-aqua-dark.conf
include themes/styles/aura-ui.conf
```

Reload Kitty's configuration. Your settings after these includes take precedence. The color include works by itself; the interface include is optional.

| Theme | File |
| --- | --- |
| Aura Dark | `aura-dark.conf` |
| Aura Light | `aura-light.conf` |
| Aura Aqua Light | `aura-aqua-light.conf` |
| Aura Aqua Dark | `aura-aqua-dark.conf` |
| Aura Aqua Lime Light | `aura-aqua-lime-light.conf` |
| Aura Lime Light | `aura-lime-light.conf` |
| Aura Lime Dark | `aura-lime-dark.conf` |
| Aura Azure Light | `aura-azure-light.conf` |
| Aura Azure Dark | `aura-azure-dark.conf` |

## Interface style and font weight

The theme files supply active/inactive tab colors, tab-bar surfaces, focus and split borders, URL ink, and the macOS titlebar color. The optional `styles/aura-ui.conf` supplies a flat top tab bar, whitespace separators, small margins, fine split dividers and regular-weight tab labels. It replaces Kitty's default bold-italic active-tab label without changing the terminal body's font.

Body font family, size, regular/bold faces, text composition, padding, transparency, blur and key bindings remain user preferences. In particular, a theme does not change `font_family`, `bold_font` or `text_composition_strategy`. The same font can render differently in different terminals; this bundle does not promise identical Ghostty and Kitty text weight.

Kitty renders the tab bar in terminal cells. This preset uses its built-in separator style and needs no Python tab renderer. It does not reproduce native macOS tabs, rounded VS Code Pill tabs, hover animations or the editor's optional gradients. Active colors preserve each family's accepted chrome roles, including white-on-cyan Aqua/Lime Light controls. Inactive labels use the shared muted reading foreground rather than disabled text.

## Light/dark switching and dotfile managers

For a fixed appearance, a dotfile manager such as chezmoi can choose the include from your Aura family/appearance settings and install the generated theme files. Keep personal fonts, shortcuts and SSH link routing in your own Kitty configuration.

Kitty 0.38+ also supports automatic OS appearance switching. Install the theme files first, then save the paired files under Kitty's recognized automatic-theme names:

```sh
kitty_config_dir="${XDG_CONFIG_HOME:-$HOME/.config}/kitty"
cp "$kitty_config_dir/themes/aura-aqua-dark.conf" "$kitty_config_dir/dark-theme.auto.conf"
cp "$kitty_config_dir/themes/aura-aqua-light.conf" "$kitty_config_dir/light-theme.auto.conf"
cp "$kitty_config_dir/themes/aura-aqua-light.conf" "$kitty_config_dir/no-preference-theme.auto.conf"
```

Restart Kitty to activate this mode. These automatic files override other color settings, so choose either automatic files or a fixed theme include as your color-selection mechanism. Keep the optional interface include in `kitty.conf`. The theme files contain their own `macos_titlebar_color` so the titlebar follows the selected appearance. Updating the installed themes also requires updating these three copies. See [Kitty's automatic color switching documentation](https://sw.kovidgoyal.net/kitty/kittens/themes/#change-color-themes-automatically-when-the-os-switches-between-light-and-dark).

## Links, terminal programs and Herdr

`url_color` controls link appearance. Actual Cmd + Click bindings, path matching and remote VS Code opening belong to your `mouse_map`, `open-actions.conf` and local routing script; a color theme does not install or modify them.

Foreground/background, cursor, selections and ANSI 0–15 match the shared terminal roles. ANSI 16–255 retain Kitty's defaults. Terminal applications can override colors, cursor and text styles with escape sequences. Kitty marker colors are not equivalent to Ghostty's independent search fields, so this port does not claim to reproduce those search interactions.

Herdr can inherit the same foreground/background and ANSI palette with its `terminal` theme. The optional family-specific Herdr surface companions shipped in the [Ghostty package](https://github.com/yukiumi13/aura-theme-2026/tree/main/packages/ghostty/herdr) also use these shared roles and can be merged into Herdr's configuration when using Kitty.

## Build

```sh
yarn build only kitty
node scripts/package-terminal-bundles.js --only kitty
```

The pipeline is **source colors → semantic roles → terminal surface roles → named template variables → Kitty template → generated package**. Update source roles or the port, then rebuild; do not maintain a second hand-converted Ghostty palette.

References: [Kitty configuration](https://sw.kovidgoyal.net/kitty/conf/), [tab bar](https://sw.kovidgoyal.net/kitty/conf/#tab-bar), [themes kitten](https://sw.kovidgoyal.net/kitty/kittens/themes/), and [port design notes](https://github.com/yukiumi13/aura-theme-2026/blob/main/docs/KITTY_DESIGN.md).

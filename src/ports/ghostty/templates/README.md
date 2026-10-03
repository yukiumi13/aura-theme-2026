# Aura Modern for Ghostty

Nine themes generated from the same source palettes and semantic roles as Aura Modern for VS Code. Requires **Ghostty 1.3 or newer**; the configuration was checked against the 1.3.1 source.

## Install

Copy the `.conf` files from this directory or the Ghostty release bundle into your Ghostty themes directory:

```sh
theme_dir="${XDG_CONFIG_HOME:-$HOME/.config}/ghostty/themes"
mkdir -p "$theme_dir"
cp aura-*.conf "$theme_dir/"
```

In your Ghostty config, choose a file by its **full filename, including `.conf`**:

```ini
theme = aura-aqua-light.conf
```

For automatic switching with the system appearance:

```ini
theme = light:aura-aqua-light.conf,dark:aura-aqua-dark.conf
```

Reload Ghostty's configuration. Colors explicitly set in your own config take precedence over the theme. Use `ghostty +list-themes` to browse installed themes.

## Themes

| Theme | Filename |
| --- | --- |
{{{ themeRows }}}

Aura pairs violet and mint. Aqua uses cool white or violet-black surfaces with cyan interaction accents. Lime combines mint interactions and green-tinted selections, with a green-white light background. Azure uses Microsoft Fluent blues and neutral surfaces.

**Aqua Lime Light has the same terminal colors as Aqua Light.** Its extra summer colors belong to editor syntax roles. Both names are provided for a consistent lineup; terminal output and selections deliberately stay in sync. Programs that emit their own truecolor sequences, including many editor and prompt themes, control those colors themselves.

## Using Herdr

In Herdr's config, select its terminal theme:

```toml
[theme]
name = "terminal"
```

Herdr uses the terminal's default foreground/background and ANSI roles for its UI. Its primary accent is ANSI blue (slot 4); status colors use green (2), yellow (3), bright red (9) and cyan (6). In Aqua Light these are readable terminal inks, so its accent is softer than VS Code's filled aqua controls. Truecolor output inside a pane still belongs to that application.

For a closer match on selected rows, this bundle includes optional `herdr/aura.toml`, `herdr/aqua.toml`, `herdr/lime.toml` and `herdr/azure.toml`. Aqua Lime uses the Aqua file. Merge the matching file's `[theme]` section into your existing Herdr config, without duplicating tables. These files keep `terminal` in both appearances and override only active-row, navigation-selection and hover surfaces. Text, status colors, sidebar and panel backgrounds continue to follow the terminal. This avoids using ANSI gray text ink as a large row background, especially in light themes.

The overrides follow system light/dark appearance. If you force a Ghostty theme independently of the system, disable `auto_switch` and place the matching mode's three values directly under `[theme.custom]`. If you switch between Aura families, merge the corresponding companion file too. The plain `terminal` setup needs no companion file.

Herdr's config lives at `~/.config/herdr/config.toml` on Linux/macOS and `%APPDATA%\herdr\config.toml` on Windows. Use Herdr's **reload config** action after editing it. On Unix, current Herdr re-queries terminal colors after a resize; if a running client still shows the previous Ghostty palette, resize its window or reconnect that client. Existing panes can stay running. See the [Herdr configuration guide](https://herdr.dev/docs/configuration/#theme).

## What is themed

- Reading background and foreground, plus all 16 ANSI colors, follow the current VS Code terminal design.
- Cursor and active search matches use the family's primary-action accent, with a readable ink chosen from its existing palette.
- Selections and candidate search matches have separate, quieter fills. Translucent source roles are composited onto the reading background before writing Ghostty's RGB values.
- Split dividers and unfocused split fill use the shared surface roles.
- GTK titlebar colors follow the family chrome. To enable them on Linux, add `window-theme = ghostty` to your own config. macOS ignores those two titlebar colors and uses its native window styling.

Font, padding, opacity, blur, cursor shape, bold behavior, minimum contrast and key bindings remain user preferences. The bundle does not include shaders or inject GTK CSS. Ghostty themes do not expose VS Code's per-button gradients, activity badges or focus-ring effects.

Ghostty 1.3 adds `palette-generate` and `palette-harmonious`. This bundle leaves their defaults unchanged so programs that expect the standard xterm colors at indices 16–255 keep working. You can opt into palette generation in your own config.

## Updating from the old Ghostty bundle

The active bundle now matches the nine current themes. `aura-dark.conf` keeps its filename and receives the current roles; Azure is now a light/dark pair named `aura-azure-light.conf` and `aura-azure-dark.conf`. The old Soft, Cyan, Blue, Violet, Purple, Rose, Amber, Teal, Graphite, Ink and separate ANSI variants are archived under [`legacy/ghostty`](https://github.com/yukiumi13/aura-theme-2026/tree/main/legacy/ghostty), rather than being mixed into new installations. Your previously installed files are not removed automatically.

On Ghostty 1.2, the new `search-*` fields are unsupported. Upgrade to 1.3+ for this bundle. The archived themes remain available for older installations.

## Design and compatibility

The compiler uses **source colors → semantic roles → terminal surface roles → named template variables → Ghostty config**. The theme registry and ANSI mapping are shared with VS Code. [Design and capability notes](https://github.com/yukiumi13/aura-theme-2026/blob/main/docs/GHOSTTY_DESIGN.md) describe the field mappings and visual review limits.

References: [Ghostty theme setup](https://ghostty.org/docs/features/theme), [configuration reference](https://ghostty.org/docs/config/reference), and [1.3 release notes](https://ghostty.org/docs/install/release-notes/1-3-0).

## License

MIT, based on Aura by Dalton Menezes. Azure includes Microsoft Fluent color tokens; see [third-party notices](THIRD_PARTY_NOTICES.md).

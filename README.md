# Aura Modern for Oh My Pi

Nine light and dark palettes compiled from Aura Modern 1.0.0. Aqua Lime Light pairs a white terminal canvas with near-white chrome, a soft gray prompt band and pale aqua list selections. Tool output uses neutral surfaces with color reserved for status, diffs and syntax.

## Install

```sh
omp install github:yukiumi13/aura-theme-2026#omp-v1.0.0
```

Start a new interactive `omp` session, then open **/settings → Appearance → Light Theme** and choose **aura-aqua-lime-light**. Set **Dark Theme** to **aura-aqua-dark** for a matching pair. Oh My Pi selects the slot from the terminal appearance. In an ordinary terminal, set its background to white for the Aqua Lime Light reading canvas. OMP paints message bands, tools and list selections itself. Hosts supporting the theme's terminal palette can also apply its canvas and ANSI colors.

You can also select those two slots from the shell after the first session has registered the themes.

```sh
omp config set theme.light aura-aqua-lime-light
omp config set theme.dark aura-aqua-dark
```

Available themes are `aura-dark`, `aura-light`, `aura-aqua-dark`, `aura-aqua-light`, `aura-aqua-lime-light`, `aura-lime-dark`, `aura-lime-light`, `aura-azure-dark` and `aura-azure-light`.

## Bash transcript

For a quieter Bash transcript, run `omp config set display.shellVisualization false` and start a new session. OMP then shows the original command and its output. To see the execution annotations again, set the same option to `true`. Either view keeps the native state frame. The Aqua Lime Light running frame is muted blue and the settled frame is blue-gray. The composer keeps its own light gray surface.

## Profile files

On session startup the plugin makes the themes available in the current agent profile's `themes/` directory. Existing custom edits are preserved. The `.aura-modern/` subdirectory stores checksums for updates. You can make an independent variant by copying a JSON file to a new filename. Theme selection, composer shape, fonts, icons, shortcuts, status-line layout and model configuration stay under your control.

To retire the plugin, select another theme and run `omp plugin uninstall omp-aura-modern`. OMP can continue to read the installed JSON files. To remove them too, remove the nine named themes you no longer want and the `.aura-modern/` checksum directory from that profile.

[Source and port review](https://github.com/yukiumi13/aura-theme-2026/blob/main/docs/OH_MY_PI_DESIGN.md)

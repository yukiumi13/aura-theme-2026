{{{ basic-heading }}}

This bundle contains WezTerm color tables generated from the Aura Theme 2026 palette architecture.

## Installation

1. Download `aura-theme-2026-wezterm-themes.zip` from a GitHub Release, or use the generated files in `packages/wezterm`.
2. Copy the desired `.lua` file into your WezTerm colors directory:

```sh
mkdir -p ~/.config/wezterm/colors
cp aura-ink-2026.lua ~/.config/wezterm/colors/
```

3. Load the file from your `wezterm.lua`:

```lua
local wezterm = require("wezterm")
local config = wezterm.config_builder()

config.colors = dofile(wezterm.home_dir .. "/.config/wezterm/colors/aura-ink-2026.lua")

return config
```

On Windows, the colors directory can live under your chezmoi-managed WezTerm config directory, for example `%USERPROFILE%\.config\wezterm\colors`.

## Included Themes

The bundle includes the legacy Aura themes and all 2026 color variants.

{{{ footer }}}

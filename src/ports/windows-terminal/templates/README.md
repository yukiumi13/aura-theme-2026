{{{ basic-heading }}}

This bundle contains Windows Terminal color schemes generated from the Aura Theme 2026 palette architecture.

## Installation

1. Download `aura-theme-2026-windows-terminal-themes.zip` from a GitHub Release, or use the generated files in `packages/windows-terminal`.
2. Open Windows Terminal settings.
3. Select **Open JSON file**.
4. Pick one generated JSON file and copy its object into the `schemes` array.
5. Set your profile's `colorScheme` to the copied scheme's `name`.

Example:

```json
{
  "profiles": {
    "defaults": {
      "colorScheme": "Aura Ink 2026"
    }
  }
}
```

## Included Schemes

The bundle includes the legacy Aura schemes and all 2026 color variants.

{{{ footer }}}

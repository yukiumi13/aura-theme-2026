# Aura Theme 2026 for Visual Studio Code

This is the VS Code port maintained by the `yukiumi13/aura-theme-2026` fork. It uses the 2026 palette architecture for editor UI colors, syntax scopes, semantic token colors, and integrated terminal ANSI colors.

## Themes Available

- Aura Light 2026
- Aura 2026 Dark
- Aura 2026 Dark (Soft Text)
- Aura 2026 Soft Dark
- Aura 2026 Soft Dark (Soft Text)
- Aura Ink 2026
- Aura Cyan 2026
- Aura Blue 2026
- Aura Violet 2026
- Aura Purple 2026
- Aura Teal 2026
- Aura Rose 2026
- Aura Amber 2026
- Aura Azure 2026
- Aura Graphite 2026

## Aura Light 2026

The light appearance uses violet-tinted paper, quiet gray-violet chrome, lavender functions, mint strings, pink properties, and warm amber numbers. It retains the existing Aura syntax roles and uses the same template for TextMate, semantic highlighting, UI, and terminal colors.

Light selections and diff highlights use lower opacity to keep code readable. Buttons, badges, diagnostics, and all 16 ANSI colors are tuned for light backgrounds. Select **Aura Light 2026** from **Preferences: Color Theme**, or set it as your preferred light theme:

```json
{
  "workbench.preferredLightColorTheme": "Aura Light 2026",
  "workbench.preferredDarkColorTheme": "Aura 2026 Dark",
  "window.autoDetectColorScheme": true
}
```

## Installation

Install the release VSIX from GitHub Releases, or build the package locally:

```sh
yarn build only vscode
cd packages/vscode
npx @vscode/vsce package --out aura-theme-2026.vsix
```

Then install `aura-theme-2026.vsix` in VS Code and select an Aura 2026 theme from **Preferences: Color Theme**.

## Notes

The VS Code port is one of the actively maintained targets in this fork. Other inherited editor ports may still exist in the repository, but they are not necessarily migrated to the 2026 palette architecture.

{{{ footer }}}

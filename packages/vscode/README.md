# Aura Theme 2026 for Visual Studio Code

This is the VS Code port maintained by the `yukiumi13/aura-theme-2026` fork. It uses the 2026 palette architecture for editor UI colors, syntax scopes, semantic token colors, and integrated terminal ANSI colors.

## Themes Available

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

# License
[MIT © Dalton Menezes](https://github.com/yukiumi13/aura-theme-2026/blob/main/LICENSE)

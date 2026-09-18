# Aura Theme 2026 for Visual Studio Code

This is the VS Code port maintained by the `yukiumi13/aura-theme-2026` fork. It uses the 2026 palette architecture for editor UI colors, syntax scopes, semantic token colors, and integrated terminal ANSI colors.

## Themes Available

- Aura Aqua Light 2026
- Aura Aqua Dark 2026
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

The light appearance uses a soft neutral editor surface, slightly darker chrome, white floating widgets, lavender functions, mint strings, pink properties, and warm amber numbers. It retains the existing Aura syntax roles and uses the same template for TextMate, semantic highlighting, UI, and terminal colors.

Original Aura mint (`#61FFCA`) is preserved in primary actions, badges, and the Remote/SSH status item, consistently paired with dark text. Their hover state uses aqua (`#12DADD`). Buttons have no decorative outline. Neutral list/menu/tab hover states keep normal dark text, while search matches and links use purple. Syntax, diagnostics, and terminal colors use a separate readable mint ink. Purple remains the focus, link, and type accent.

Unfocused tabs stay readable, and selected sidebar rows retain a subtle violet fill after focus moves to the editor. Toolbar and tab hover states share the neutral list fill. Git additions use semantic green, modifications purple, and conflicts orange; inlay hints use secondary text.

Light selections and diff highlights use lower opacity to keep code readable. Buttons, badges, diagnostics, and all 16 ANSI colors are tuned for light backgrounds. Select **Aura Light 2026** from **Preferences: Color Theme**, or set it as your preferred light theme:

```json
{
  "workbench.preferredLightColorTheme": "Aura Light 2026",
  "workbench.preferredDarkColorTheme": "Aura 2026 Dark",
  "window.autoDetectColorScheme": true
}
```

## Aura Aqua

**Aura Aqua Light 2026** and **Aura Aqua Dark 2026** pair vivid cyan active tabs, navigation, and actions with near-white or deep blue surfaces. Aqua Light intentionally uses white text on its vivid aqua active controls and softer blue links, UI text, and syntax colors. Aqua Dark keeps dark text on aqua controls and luminous syntax over a lifted blue canvas. Both appearances use blue types, violet control flow, orchid functions, mint strings, rose properties, amber numbers, neutral hover labels, and borderless filled actions.

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

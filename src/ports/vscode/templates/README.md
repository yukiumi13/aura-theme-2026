# Aura Theme 2026 (Unofficial Fork)

An independently maintained fork of [Dalton Menezes's original Aura Theme](https://github.com/daltonmenezes/aura-theme), maintained by [yukiumi13](https://github.com/yukiumi13/aura-theme-2026). This extension is not an official release from the original Aura project.

The original Aura work remains credited to Dalton and contributors. This fork develops three paired appearances with coordinated UI, syntax, and terminal colors: Aura, Aqua, and Azure. Its source and issue tracker are in the [fork repository](https://github.com/yukiumi13/aura-theme-2026).

## Preview in VS Code

These are screenshots of the published themes in VS Code, captured from the same fictional sample workspace with a separate, unsigned-in VS Code profile.

### Aura 2026 Dark

![Aura 2026 Dark in VS Code](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-dark-vscode.jpg)

### Aura 2026 Light

![Aura 2026 Light in VS Code](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-light-vscode.jpg)

### Aura 2026 Aqua Light

![Aura 2026 Aqua Light in VS Code](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-aqua-light-vscode.jpg)

### Aura 2026 Aqua Dark

![Aura 2026 Aqua Dark in VS Code](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-aqua-dark-vscode.jpg)

## Six themes, three pairs

| Family | Dark | Light |
| --- | --- | --- |
| Aura | Aura 2026 Dark | Aura 2026 Light |
| Aqua | Aura 2026 Aqua Dark | Aura 2026 Aqua Light |
| Azure | Aura 2026 Azure Dark | Aura 2026 Azure Light |

Azure uses Microsoft's Fluent blue ramp, neutral surfaces, and coordinated purple,
pink and seafoam syntax. It is an independent Aura adaptation, not an official
Microsoft theme.

### Aura 2026 Azure Dark

![Aura 2026 Azure Dark in VS Code](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-azure-dark-vscode.jpg)

### Aura 2026 Azure Light

![Aura 2026 Azure Light in VS Code](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-azure-light-vscode.jpg)

## Aura 2026 Light

The light appearance uses a soft neutral editor surface, slightly darker chrome, white floating widgets, lavender functions, mint strings, pink properties, and warm amber numbers. It retains the existing Aura syntax roles and uses the same template for TextMate, semantic highlighting, UI, and terminal colors.

Original Aura mint (`#61FFCA`) is preserved in primary actions, badges, and the Remote/SSH status item, consistently paired with dark text. Their hover state uses aqua (`#12DADD`). Buttons have no decorative outline. Neutral list/menu/tab hover states keep normal dark text, while search matches and links use purple. Syntax, diagnostics, and terminal colors use a separate readable mint ink. Purple remains the focus, link, and type accent.

Unfocused tabs stay readable, and selected sidebar rows retain a subtle violet fill after focus moves to the editor. Toolbar and tab hover states share the neutral list fill. Git additions use semantic green, modifications purple, and conflicts orange; inlay hints use secondary text.

Light selections and diff highlights use lower opacity to keep code readable. Buttons, badges, diagnostics, and all 16 ANSI colors are tuned for light backgrounds. Select **Aura 2026 Light** from **Preferences: Color Theme**, or set it as your preferred light theme:

```json
{
  "workbench.preferredLightColorTheme": "Aura Light 2026",
  "workbench.preferredDarkColorTheme": "Aura 2026 Dark",
  "window.autoDetectColorScheme": true
}
```

## Aura Aqua

**Aura 2026 Aqua Light** and **Aura 2026 Aqua Dark** share vivid cyan active tabs, navigation, and actions. Aqua Light intentionally uses white text on its vivid aqua controls, near-white surfaces, and soft blue, violet, orchid, mint, rose, and amber syntax.

Aqua Dark builds directly on Aura Dark: near-black violet surfaces, soft lavender-white text, subdued comments, purple types, lavender functions, mint strings, pink properties, and amber numbers. It inherits Aura Dark's terminal colors and uses aqua for interaction emphasis with dark text on filled controls. The two appearances share an interaction language while keeping palettes designed for their respective backgrounds.

## Installation

Install [Aura Theme 2026 from the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yukiumi13.aura-theme-2026), download a release VSIX from GitHub Releases, or build the package locally:

```sh
yarn build only vscode
cd packages/vscode
npx @vscode/vsce package --out aura-theme-2026.vsix
```

Then install `aura-theme-2026.vsix` in VS Code and select an Aura 2026 theme from **Preferences: Color Theme**.

## Updating from 0.5.x

The theme picker now contains six themes. Saved selections for Dark, Light, Aqua,
and Azure continue to work with the new display names. Azure's dark appearance is
redesigned; Azure Light is new.

The old Cyan, Blue, Violet, Purple, Rose, Amber, Teal, Graphite, Ink, and Soft
Dark/Soft Text options are retired from this VS Code package. If you used one of
those themes, select a theme from the six above after updating.

## Notes

The VS Code port is one of the actively maintained targets in this fork. Other inherited editor ports may still exist in the repository, but they are not necessarily migrated to the 2026 palette architecture.

{{{ footer }}}

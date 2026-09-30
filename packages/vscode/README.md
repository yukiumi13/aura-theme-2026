# Aura Modern

![Aura Modern — Aqua Dark in Visual Studio Code](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-teaser-zoom.png)

Nine color themes for Visual Studio Code: **Aura**, **Aqua**, **Lime**, and **Azure** in dark and light, plus **Aqua Lime Light**.

An unofficial fork of [Aura by Dalton Menezes](https://github.com/daltonmenezes/aura-theme), maintained by [yukiumi13](https://github.com/yukiumi13/aura-theme-2026).

## Install

Install [Aura Modern from the Marketplace](https://marketplace.visualstudio.com/items?itemName=yukiumi13.aura-theme-2026), then open **Preferences: Color Theme** from the Command Palette and choose an **Aura** theme.

To switch with your system appearance, enable **Window: Auto Detect Color Scheme** in Settings and choose your preferred light and dark themes.

## Previews

Real VS Code screenshots of a fictional sample project. Aqua and Lime show the experimental Modern UI; Aura and Azure show the traditional interface.

### Aura

Aura's purple and mint palette.

#### Aura Dark

![Aura Dark](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-dark-vscode.jpg)

#### Aura Light

![Aura Light](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-light-vscode.jpg)

### Aqua

Cyan actions and navigation, mint badges, and a touch of citrus on cool white or Aura's violet-black background.

#### Aura Aqua Dark

![Aura Aqua Dark](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-aqua-dark-modern-vscode.png)

#### Aura Aqua Light

![Aura Aqua Light](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-aqua-light-modern-vscode.png)

#### Aura Aqua Lime Light

Aqua's cool white workspace with brighter cyan, mint, yellow-green, and warm yellow syntax. It shares Aqua Light's interface and terminal colors; strings, tags, and quotes retain one consistent green.

### Lime

Cyan and mint with a touch of lemon. Lime Light has a pale green-white workspace; Lime Dark keeps Aura's violet-black background.

#### Aura Lime Dark

![Aura Lime Dark](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-lime-dark-modern-vscode.png)

#### Aura Lime Light

![Aura Lime Light](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-lime-light-modern-vscode.png)

### Azure

Blues inspired by Microsoft Fluent, with neutral backgrounds.

#### Aura Azure Dark

![Aura Azure Dark](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-azure-dark-vscode.jpg)

#### Aura Azure Light

![Aura Azure Light](https://raw.githubusercontent.com/yukiumi13/aura-theme-2026/main/docs/assets/aura-2026-azure-light-vscode.jpg)

## Modern UI

On supported VS Code versions, enable **Workbench › Experimental: Modern UI**:

```json
{
  "workbench.experimental.modernUI": true
}
```

Aqua and Lime Light use white icons on the selected cyan or mint activity tile, and dark icons on a pale tile when hovering over an unselected item. Their dark appearances use bright icons on subdued surfaces. The traditional interface is also supported; this experimental setting changes parts of VS Code's layout and styling too.

If a recent VS Code version shows a white active-tab label on a pale background, choose **Workbench › Experimental: Modern UI Editor Tab Style → Pill**. The connected-tab style in VS Code 1.139.1 replaces the theme's active fill with the editor surface. Pill tabs retain Aqua's cyan fill and white text:

```json
{
  "workbench.experimental.modernUIEditorTabStyle": "pill"
}
```

## Experimental Aqua gradients (desktop)

Aqua Light and Aqua Lime Light can optionally use mint/cyan gradients on primary buttons and a small button-focus glow. Hover expands the cyan center and uses the theme's hover cyan for a clear response. Numeric activity badges use a vertical cyan-to-green gradient with a fine white edge and soft mint glow. The default-off enhancement is static: no animation, no changes to tabs, font weights or code colors, and no gradients on secondary or disabled buttons, spinners, or icon badges. With it off, the themes retain white button borders and mint accents.

1. Install and enable [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) on the computer running the VS Code desktop window. Aura does not install it automatically.
2. In User Settings, enable **Aura › Experimental: Gradients** (`aura.experimental.gradients`). Choose **Apply setting**, or run **Aura: Apply Gradient Setting**.
3. Review the first-use notice and apply. The loader needs permission to modify the VS Code installation and can cause an installation-integrity warning. Use its reload prompt afterward.
4. After setup, switching the setting on or off reapplies the loader configuration. Reload all windows to see the result. Other CSS/JS imports are retained and reapplied by the loader. Changing those imports or the installation asks for confirmation again.

**Aura: Show Gradient Status** checks the installed stylesheet against this extension's current version. It distinguishes missing setup, pending application and installed styles; it cannot verify whether every open window has reloaded. After a VS Code or Aura update, run **Apply Gradient Setting** again if needed. Disable the setting, apply it and reload **before uninstalling Aura or the loader**.

This is an experimental customization, not a supported VS Code theme API. It uses internal CSS selectors and may need adjustment after editor updates. Styles are scoped to the two Aqua Light themes, but injection is installation-wide: all matching windows and profiles are affected. Manage it from one local profile; separate profiles do not have independent visual on/off states. The setting is machine-specific and is not synced. In Remote SSH sessions the integration runs locally; it does not patch the remote server. Web VS Code is unsupported. Workspace-level loader imports must be moved to User Settings before applying.

Enhanced fills, edges and shadows use the theme's compiled effect palette. Ordinary color customizations do not recolor those effects; the native foreground and focus indicator still apply. Turn the enhancement off and apply the setting to use ordinary VS Code button and badge colors throughout.

## Feedback

[Report an issue](https://github.com/yukiumi13/aura-theme-2026/issues) with the theme name, file type, and a screenshot of the problem. Release notes and upgrade information are in the [Changelog](https://github.com/yukiumi13/aura-theme-2026/blob/main/packages/vscode/CHANGELOG.md).

## License

[MIT](https://github.com/yukiumi13/aura-theme-2026/blob/main/LICENSE). The original Aura license is included with this extension. Azure also uses selected Microsoft Fluent UI color tokens; see [third-party notices](https://github.com/yukiumi13/aura-theme-2026/blob/main/packages/vscode/THIRD_PARTY_NOTICES.md).

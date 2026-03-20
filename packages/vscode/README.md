<p align="center">
  <img src="https://github.com/daltonmenezes/assets/blob/master/images/aura-theme/new-heading.png?raw=true" alt="Aura Theme" width="70%" />
</p>

<p align="center">
✨ A beautiful dark theme with four variants for Visual Studio Code. Two of these variants are focused on long-term work without causing any discomfort to the eyes
  <br><br>

  <!-- Patreon -->
  <a href="https://www.patreon.com/daltonmenezes">
    <img alt="patreon url" src="https://img.shields.io/badge/support%20on-patreon-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>
  <!-- Preview in vscode.dev -->
  <a href="https://vscode.dev/theme/daltonmenezes.aura-theme">
    <img alt="preview in vscode.dev" src="https://img.shields.io/badge/preview%20in-vscode.dev-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>  
  <!-- marketplace version -->
  <a href="https://marketplace.visualstudio.com/items?itemName=DaltonMenezes.aura-theme">
    <img alt="marketplace version" src="https://img.shields.io/vscode-marketplace/v/DaltonMenezes.aura-theme.svg?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>
  <!-- downloads -->
  <a href="https://marketplace.visualstudio.com/items?itemName=DaltonMenezes.aura-theme">
    <img alt="downloads" src="https://img.shields.io/visual-studio-marketplace/d/DaltonMenezes.aura-theme.svg?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>
  <!-- rating -->
  <a href="https://marketplace.visualstudio.com/items?itemName=DaltonMenezes.aura-theme">
    <img alt="rating" src="https://img.shields.io/visual-studio-marketplace/stars/DaltonMenezes.aura-theme.svg?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>
</p>

> This package is a **fork + adapted 2026 edition** maintained by **yukiumi13**. It is based on the original Aura Theme, with a remapped VS Code palette aimed at a more detailed 2026-style UI and syntax-highlighting experience.

> 这个包是 **yukiumi13** 维护的 **fork / adapted 2026** 版本，基于原版 Aura Theme 继续演进，重点在于面向 2026 风格的 VS Code 细粒度 UI 与语法高亮适配。

<p align="center">
  <img alt="preview" src="https://github.com/daltonmenezes/assets/blob/master/images/aura-theme/aura-vscode-preview.png?raw=true" >
</p>


# Themes available
  - Aura 2026 Dark
  - Aura 2026 Dark (Soft Text)
  - Aura 2026 Soft Dark
  - Aura 2026 Soft Dark (Soft Text)

# Installation
1. Open the repository on GitHub: `https://github.com/yukiumi13/aura-theme-2026`
2. Go to **Actions** and open the latest **Build VSCode VSIX** workflow run
3. Download the artifact named `aura-theme-2026-vsix`
4. Extract the archive and install the `.vsix` file from **Extensions > ... > Install from VSIX...**
5. Open **Preferences: Color Theme** and choose an Aura 2026 variant.

# Download VSIX from GitHub
If you prefer using the private GitHub build instead of the Marketplace version:

1. Open the repository on GitHub: `https://github.com/yukiumi13/aura-theme-2026`
2. Go to the **Actions** tab and open the latest **Build VSCode VSIX** run
3. Download the uploaded artifact named `aura-theme-2026-vsix`
4. Extract it and install the `.vsix` file from VS Code using **Extensions > ... > Install from VSIX...**

If you create a tag like `v2.1.2`, the same workflow will also attach the `.vsix` file to a GitHub Release automatically.

# Getting full experience
1. Install [Fira Code font](https://github.com/tonsky/FiraCode/wiki/VS-Code-Instructions)
2. Install [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

# Changelog

## 2.1.2 (February 19, 2022)
- Improve status bar colors when debbuging
- Improve breakpoint frame highlight

## 2.1.1 (February 17, 2022)
- Improve the Dart/Flutter support

## 2.1.0 (October 14, 2021)
- Add colors to editor inlay hint
- Update selection color to accent20
- Update JSX children texts to be green
## 2.0.1 (October 3, 2021)
- Replace Aura Dark to Aura Dark Plus but keeping the name
- Update yellow accents, like in functions, for an orange tone
- Update Shock pink accents as in object properties for a softer tone
- Update active and inactive selected file list items to have a clearer background for easier 
- Update scrollbar background color for the text selection accent making it clearer and with a slight transparency avoiding the loss of relevant information.
- jsx: Update the color of the component tags for better differentiation and more consistent with the color given at the time they are defined.
- Update the active tab foreground to be green
- Update active icon color on sidebar to green
- Better support for:
    - Elixir
    - Python
    - GraphQL
    - Env files
    - Markdown
    - CSS

[See full changelog](https://github.com/yukiumi13/aura-theme-2026/blob/main/packages/vscode/CHANGELOG.md)

# Contributors
<table>
  <thead>
    <tr>
      <td valign="bottom"><p align="center">
  <a href="https://github.com/daltonmenezes">
    <img src="https://github.com/daltonmenezes.png?size=100" align="center" />
  </a>
</p></td>
    </tr>
  </thead>

  <tbody>
    <td><a href="https://github.com/daltonmenezes">Dalton Menezes</a></td>
  </tbody>
</table>

# License
[MIT © Dalton Menezes](https://github.com/daltonmenezes/aura-theme/blob/main/LICENSE)
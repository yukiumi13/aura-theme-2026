The Modern Aura family for Zed, generated from shared source palettes, semantic roles, editor surfaces, syntax, and terminal colors.

## Themes

| Theme | Appearance |
| --- | --- |
{{{ themeRows }}}

## Install

Extract the release ZIP and use Zed's **Install Dev Extension** command to select the extracted extension folder. For a theme-only local installation, copy the JSON files in `themes/` into `~/.config/zed/themes/`, then select a theme with **theme selector: toggle**.

This bundle has nine modern themes. The former fourteen dark accent variants are archived under `legacy/packages/zed` in the repository. Select a new theme after upgrading; `Aura Azure Dark` uses the current Fluent foundation, while the retired `Aura Azure 2026` used the older Aura accent palette.

## Coverage and host constraints

All 186 non-deprecated scalar colors in the pinned Zed 1.26.2 source contract are explicit, including minimap, debugger, panel overlays, diff hunks, Vim/Helix mode pairs, 24 ANSI slots, diagnostics, and Git states. Collaboration colors and built-in syntax styles are explicit too. The exact source revision and mapping are documented in [Zed design]({{{ repository }}}/blob/main/docs/ZED_DESIGN.md).

Zed uses global text colors for active tabs and many buttons. These controls use family-tinted surfaces that pair with that text. Zed does not expose VS Code's independent white selected-tab foreground or a universal badge color; its theme cannot reproduce every VS Code interaction. Theme JSON also cannot configure component geometry, icons, UI fonts, or arbitrary future language captures. Newer fields are intended for the inspected upstream contract; older Zed releases may ignore fields they do not recognize.

## Semantic highlighting

The theme includes styles for both tree-sitter and LSP semantic tokens. The optional [`semantic-token-settings.json`](semantic-token-settings.json) fragment enables combined highlighting and uses role names, so it follows the selected appearance. Merge that fragment into your own settings if desired; installing the theme does not change your settings. See [mapping notes]({{{ repository }}}/blob/main/docs/ZED_SEMANTIC_TOKENS.md).

## Development

From the repository root:

```sh
yarn build only zed
node scripts/validate-zed-themes.js
node scripts/review-zed-themes.js
yarn package:zed
```

The resolved review sheet is a configuration specimen, not a native Zed screenshot. Native interaction coverage is recorded separately in `docs/reviews/`.

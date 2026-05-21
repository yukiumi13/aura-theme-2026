# Aura Theme 2026

Aura Theme 2026 is a fork maintained by **yukiumi13**. It is based on the original [Aura Theme](https://github.com/daltonmenezes/aura-theme), but this repository is currently focused on a smaller, actively reworked 2026 theme system rather than the full upstream port matrix.

The current work is centered on a shared palette/schema that keeps editor UI, syntax colors, and terminal ANSI colors consistent across the ports that are actively maintained here.

## Current Scope

The 2026 remapping is currently implemented and published for these ports:

| Port | Package | Release asset |
| --- | --- | --- |
| Visual Studio Code | `packages/vscode` | `aura-theme-2026.vsix` |
| Zed | `packages/zed` | `aura-theme-2026-zed-extension.zip` |
| Ghostty | `packages/ghostty` | `aura-theme-2026-ghostty-themes.zip` |
| Windows Terminal | `packages/windows-terminal` | `aura-theme-2026-windows-terminal-themes.zip` |

Other inherited packages from upstream Aura may still exist in this repository, but they should be treated as legacy/unreviewed until they are explicitly migrated to the 2026 palette architecture.

## Themes

The maintained ports include the legacy Aura variants plus the 2026 variants generated from the shared palette schema:

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

## Palette Architecture

The 2026 system is generated from structured palette roles instead of hand-editing every output theme.

```text
base.ts / variants.ts
  -> create-aura-palette.ts
  -> compile-legacy-scheme.ts
  -> port templates
  -> packages/*
```

The simplified data flow is:

```text
Base palette
  surfaces, foregrounds, borders, comments
        +
Semantic palette
  brand mint, error/success/warning/info
        +
Variant family
  accent, accentBright, accentSoft, companion colors
        |
        v
AuraPalette
  ui roles + syntax roles + ansi roles
        |
        v
LegacyAuraScheme
  template variables such as accent12, uiAccent, syntaxString, ansiBrightGreen
        |
        v
Port templates
  VS Code, Zed, Ghostty, Windows Terminal
```

The important design split is:

- `ui` roles control editor chrome, selection, hover, links, status surfaces, and interaction accents.
- `syntax` roles control code highlighting for VS Code and Zed theme styles.
- `ansi` roles control terminal 16-color schemes for VS Code integrated terminal, Zed terminal, Ghostty, and Windows Terminal.

`ansiBrightGreen` and similar names are terminal ANSI slots, not language semantic tokens.

### Layer Notes

- `base` is the dark surface system. It controls the ink background, panels, borders, foregrounds, muted text, and comments. Most variants should not change this layer.
- `semantic` is the stable meaning layer. It contains the Aura mint brand color and status colors such as error, success, warning, and info. These colors stay consistent across variants unless there is a deliberate semantic reason to change them.
- `family` is the variant layer. A family defines the theme flavor, such as cyan, rose, amber, violet, or graphite. It supplies `accent`, `accentBright`, `accentSoft`, and companion colors.
- `ui` is derived from `base + semantic + family`. It maps colors to interface jobs such as selection, hover, focus border, links, remote status, welcome tiles, and action buttons.
- `syntax` is derived from the same source palette but targets code highlighting. It maps strings, functions, keywords, parameters, tags, numbers, comments, and punctuation.
- `ansi` is the terminal layer. It maps the palette to terminal 16-color slots: black, red, green, yellow, blue, magenta, cyan, white, and their bright variants.
- `compile-legacy-scheme.ts` is a compatibility bridge for the existing Mustache templates. Newer names such as `uiActionHoverBackground`, `syntaxParameter`, and `ansiBrightGreen` are preferred, while older `accent*` names are kept so older templates can still compile.

In practice, new theme quality should come from adjusting the structured roles in `src/core/colors/palettes`, not from editing generated JSON files in `packages/*` by hand.

## Zed Semantic Tokens

The Zed extension is theme-only. It defines Zed syntax styles, but it does not install grammars or override user settings.

For recommended semantic-token settings, use [packages/zed/semantic-token-settings.json](packages/zed/semantic-token-settings.json). That file is generated with the Zed package and is intended to be tracked by dotfile tools such as chezmoi. The mapping is documented in [docs/ZED_SEMANTIC_TOKENS.md](docs/ZED_SEMANTIC_TOKENS.md).

## Build

Install dependencies:

```sh
yarn install --frozen-lockfile
```

Build the maintained ports:

```sh
yarn build only vscode
yarn build only zed
yarn build only ghostty
yarn build only windows-terminal
```

Package release bundles:

```sh
yarn package:zed
yarn package:terminals
```

Run tests:

```sh
yarn test
```

## Release Assets

Tag releases publish the maintained ports through GitHub Actions:

- `.github/workflows/vscode-vsix.yml`
- `.github/workflows/zed-extension-bundle.yml`
- `.github/workflows/terminal-theme-bundles.yml`

On `v*` tags, the release should receive:

```text
aura-theme-2026.vsix
aura-theme-2026-zed-extension.zip
aura-theme-2026-ghostty-themes.zip
aura-theme-2026-windows-terminal-themes.zip
```

## Credits

This fork builds on the original Aura Theme by Dalton Menezes and contributors. The 2026 palette remapping, expanded variants, Zed mapping, Ghostty output, and Windows Terminal release bundles are maintained in this fork.

## License

[MIT](LICENSE)

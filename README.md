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
| WezTerm | `packages/wezterm` | `aura-theme-2026-wezterm-themes.zip` |

Inherited upstream Aura ports are retained under `legacy/ports` and `legacy/packages`. They are not part of the maintained 2026 build/release path unless they are explicitly migrated back into `src/ports` and `packages`.

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

The 2026 system is organized around three conceptual layers plus a temporary template-alias adapter. The generated theme files should be edited through these source files, not by hand in `packages/*`.

```text
Source palette
  neutral + brand + status + variant family colors
        |
        v
Role tokens
  ui + syntax + terminal/ansi roles
        |
        v
Template variables
  explicit role aliases plus legacy accentXX aliases
        |
        v
Port mappings
  VS Code, Zed, Ghostty, Windows Terminal, WezTerm
        |
        v
packages/*
```

The code layout follows that model:

- `src/core/colors/source` owns raw Aura colors: ink neutrals, brand colors, status colors, and variant accent families.
- `src/core/colors/roles` turns source colors into meaning-bearing theme roles such as `ui`, `syntax`, `terminal`, and `ansi`.
- `src/core/colors/template-vars` exposes the flat Mustache variables consumed by templates. Explicit names such as `syntaxFunctionDeclaration`, `uiActionHoverBackground`, and `ansiBrightGreen` are preferred. Numeric `accentXX` names are compatibility aliases for inherited templates, not design tokens.
- `src/ports/*/templates` maps app-specific theme keys to those variables.

The important design split is:

- `ui` roles control editor chrome, selection, hover, links, status surfaces, and interaction accents.
- `syntax` roles control code highlighting for VS Code and Zed theme styles.
- `terminal` and `ansi` roles control terminal foreground/background, cursor, selection, and 16-color slots for VS Code integrated terminal, Zed terminal, Ghostty, Windows Terminal, and WezTerm.

`ansiBrightGreen` and similar names are terminal ANSI slots, not language semantic tokens.

In practice, new theme quality should come from adjusting source colors and role tokens under `src/core/colors`, not from editing generated JSON/config files in `packages/*` by hand.

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
yarn build only wezterm
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
aura-theme-2026-wezterm-themes.zip
```

## Credits

This fork builds on the original Aura Theme by Dalton Menezes and contributors. The 2026 palette remapping, expanded variants, Zed mapping, Ghostty output, Windows Terminal output, and WezTerm output are maintained in this fork.

## License

[MIT](LICENSE)

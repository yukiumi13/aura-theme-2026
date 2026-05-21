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
src/core/colors/palettes
  -> base surfaces and foregrounds
  -> brand and status colors
  -> variant accent families
  -> UI roles, syntax roles, ANSI roles
  -> generated port templates
```

The important design split is:

- `ui` roles control editor chrome, selection, hover, links, status surfaces, and interaction accents.
- `syntax` roles control code highlighting for VS Code and Zed theme styles.
- `ansi` roles control terminal 16-color schemes for VS Code integrated terminal, Zed terminal, Ghostty, and Windows Terminal.

`ansiBrightGreen` and similar names are terminal ANSI slots, not language semantic tokens.

## Zed Semantic Tokens

The Zed extension is theme-only. It defines Zed syntax styles, but it does not install grammars or override user settings.

For recommended semantic-token settings, see [docs/ZED_SEMANTIC_TOKENS.md](docs/ZED_SEMANTIC_TOKENS.md).

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

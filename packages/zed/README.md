# Aura Theme 2026 - Zed

A maintained Aura Theme 2026 port for Zed.
Version: `v0.2.1`



This is the Zed port maintained by the `yukiumi13/aura-theme-2026` fork. It uses the 2026 palette architecture for Zed UI colors, syntax styles, and terminal ANSI colors.

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

Install the extension from Zed, or download the `aura-theme-2026-zed-extension.zip` release asset and install it manually.

After installation, open the theme selector and search for `Aura 2026`.

## Semantic Tokens

This extension is theme-only. It defines Zed theme syntax styles such as `function`, `method`, `type.class`, `variable.readonly`, `constant.numeric`, and `keyword.operator`, but it does not install language grammars or override your Zed settings.

For LSP semantic tokens, enable them in your Zed settings:

```json
{
  "semantic_tokens": "combined"
}
```

For stricter semantic-token mapping, add rules under `global_lsp_settings.semantic_token_rules` and point them at the styles exposed by this theme. The full recommended mapping lives in [`docs/ZED_SEMANTIC_TOKENS.md`](https://github.com/yukiumi13/aura-theme-2026/blob/main/docs/ZED_SEMANTIC_TOKENS.md).

# License
[MIT © Dalton Menezes](https://github.com/yukiumi13/aura-theme-2026/blob/main/LICENSE)

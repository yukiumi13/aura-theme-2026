<p align="center">
  <img src="https://github.com/daltonmenezes/assets/blob/master/images/aura-theme-2026/new-heading.png?raw=true" alt="Aura Theme 2026" width="70%" />
</p>

<p align="center">
✨ A beautiful dark theme for Zed and other apps
  <br><br>

  <!-- Patreon -->
  <a href="https://www.patreon.com/daltonmenezes">
    <img alt="patreon url" src="https://img.shields.io/badge/support%20on-patreon-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>

  <!-- version -->
  <a href="#">
    <img alt="version" src="https://img.shields.io/badge/version%20-v0.0.25-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>
</p>



<p align="center">
  <img alt="preview" src="https://github.com/yukiumi13/aura-theme-2026/assets/25427808/3f7b97e5-122a-4c3d-9fb7-c4f99487bba3" />
</p>

# Themes available

- Aura Dark
- Aura Dark (Soft Text)
- Aura Soft Dark
- Aura Soft Dark (Soft Text)

# Installation

1. Open the **Command Palette** with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
2. Open the **Extensions** view with the `zed: extensions` command
3. Search for `Aura 2026 theme`
4. Click on **Install**.
5. Open the **Command Palette** again
6. Open the **Theme selector** with the `theme selector: toggle` command
7. Search for `Aura 2026` and choose an `Aura 2026` variant.

# Semantic tokens

This extension is theme-only. It defines Zed theme syntax styles such as
`function`, `method`, `type.class`, `variable.readonly`, `constant.numeric`,
and `keyword.operator`, but it does not install language grammars or override
your Zed settings.

For LSP semantic tokens, enable them in your Zed settings:

```json
{
  "semantic_tokens": "combined"
}
```

If you want stricter semantic-token mapping, add rules under
`global_lsp_settings.semantic_token_rules` and point them at the styles exposed
by this theme. The full recommended mapping lives in
[`docs/ZED_SEMANTIC_TOKENS.md`](https://github.com/yukiumi13/aura-theme-2026/blob/main/docs/ZED_SEMANTIC_TOKENS.md).

```json
{
  "global_lsp_settings": {
    "semantic_token_rules": [
      {
        "token_type": "variable",
        "token_modifiers": ["readonly"],
        "style": ["variable.readonly", "constant", "variable"]
      },
      {
        "token_type": "property",
        "style": ["variable.member", "property"]
      }
    ]
  }
}
```

# Contributors

<table>
  <thead>
    <tr>
    <td valign="bottom"><p align="center">
        <a href="https://github.com/dustessavdh">
          <img src="https://github.com/dustessavdh.png?size=100" align="center" />
        </a>
      </p></td>
      <td valign="bottom"><p align="center">
  <a href="https://github.com/daltonmenezes">
    <img src="https://github.com/daltonmenezes.png?size=100" align="center" />
  </a>
</p></td>
    </tr>
  </thead>

  <tbody>    <tr>
      <td><a href="https://github.com/dustessavdh">Tessa van der Heijden</a></td>
      <td><a href="https://github.com/daltonmenezes">Dalton Menezes</a></td>
    </tr>
  </tbody>
</table>

# License
[MIT © Dalton Menezes](https://github.com/yukiumi13/aura-theme-2026/blob/main/LICENSE)

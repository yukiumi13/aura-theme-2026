{{{ basic-heading }}}

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
3. Search for `{{{ shortName }}} theme`
4. Click on **Install**.
5. Open the **Command Palette** again
6. Open the **Theme selector** with the `theme selector: toggle` command
7. Search for `{{{ shortName }}}` and choose an `{{{ shortName }}}` variant.

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
[`docs/ZED_SEMANTIC_TOKENS.md`]({{{ repository }}}/blob/main/docs/ZED_SEMANTIC_TOKENS.md).

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
      {{{ author-thead }}}
    </tr>
  </thead>

  <tbody>    <tr>
      <td><a href="https://github.com/dustessavdh">Tessa van der Heijden</a></td>
      {{{ author-tbody }}}
    </tr>
  </tbody>
</table>

{{{ footer }}}

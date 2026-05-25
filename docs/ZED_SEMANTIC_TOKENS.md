# Zed Semantic Token Mapping

Aura 2026's Zed port is a theme-only extension. It defines the theme styles
listed below in `style.syntax`, but it does not write to your Zed settings.

Zed semantic token behavior is controlled by user settings:

- `semantic_tokens`: enables LSP semantic highlighting.
- `global_lsp_settings.semantic_token_rules`: maps LSP token types and
  modifiers to theme styles.

Zed matches semantic token rules in order. More specific modifier rules should
come before broad token-type rules.

## Enable Semantic Tokens

```json
{
  "semantic_tokens": "combined"
}
```

Use `"combined"` for normal editing. Use `"full"` only when you want LSP
semantic tokens to replace tree-sitter syntax highlighting for supported
languages.

## Full Recommended Rules

Use [`packages/zed/semantic-token-settings.json`](../packages/zed/semantic-token-settings.json) as the canonical, machine-readable settings fragment. It can be copied directly into `settings.json` or included from a dotfile manager such as chezmoi.

The file contains:

```json
{
  "semantic_tokens": "combined",
  "global_lsp_settings": {
    "semantic_token_rules": [
      "..."
    ]
  }
}
```

Keep the JSON file as the sync source. This document explains why the mapping exists and lists the Zed style names exposed by the theme.

## Theme Style Reference

These are the Zed syntax styles exposed by Aura 2026.

| Zed style | Aura role | Intended use |
| --- | --- | --- |
| `attribute` | `syntaxAttribute` | Attributes and annotations |
| `boolean` | `syntaxBoolean` | Boolean literals |
| `class` | `syntaxClass` | Class names |
| `comment` | `syntaxComment` | Regular comments |
| `comment.doc` | `syntaxCommentDoc` | Documentation comments |
| `comment.documentation` | `syntaxCommentDoc` | LSP documentation comments |
| `constant` | `syntaxConstant` | Constants |
| `constant.builtin` | `syntaxVariableSpecial` | Built-in constants |
| `constant.numeric` | `syntaxNumber` | Numeric literals |
| `constructor` | `syntaxConstructor` | Constructors |
| `decorator` | `syntaxDecorator` | Decorators and annotations |
| `embedded` | `syntaxEmbedded` | Embedded code |
| `emphasis` | `syntaxKeyword` | Markup emphasis |
| `emphasis.strong` | `syntaxKeyword` | Strong markup emphasis |
| `enum` | `syntaxEnum` | Enum types |
| `enumMember` | `syntaxEnumMember` | Enum members and variants |
| `function` | `syntaxFunction` | Function calls |
| `function.definition` | `syntaxFunctionDeclaration` | Function declarations |
| `function.method` | `syntaxMethodDeclaration` | Method declarations |
| `function.special` | `syntaxFunctionSpecial` | Built-in/special functions |
| `function.kwargs` | `syntaxParameter` | Keyword arguments |
| `hint` | `syntaxType` | Hints |
| `interface` | `syntaxType` | Interfaces |
| `keyword` | `syntaxKeyword` | Keywords |
| `keyword.control` | `syntaxKeyword` | Control-flow keywords |
| `keyword.operator` | `syntaxOperator` | Operator-like keywords |
| `keyword.return` | `syntaxKeyword` | Return/yield keywords |
| `label` | `syntaxLabel` | Labels |
| `link_text` | `syntaxLink` | Link text |
| `link_uri` | `syntaxLink` | Link URLs |
| `method` | `syntaxMethod` | Method calls |
| `module` | `syntaxNamespace` | Modules |
| `namespace` | `syntaxNamespace` | Namespaces |
| `number` | `syntaxNumber` | Numeric literals |
| `operator` | `syntaxOperator` | Operators |
| `parameter` | `syntaxParameter` | Parameters |
| `preproc` | `syntaxMacro` | Preprocessor and macros |
| `preproc.directive` | `syntaxMacro` | Preprocessor directives |
| `primary` | `syntaxVariable` | Primary/default tokens |
| `property` | `syntaxProperty` | Object fields and properties |
| `property.definition` | `syntaxProperty` | Property declarations |
| `property.readonly` | `syntaxVariableSpecial` | Readonly properties |
| `punctuation` | `syntaxPunctuation` | General punctuation |
| `punctuation.bracket` | `syntaxPunctuationMuted` | Brackets |
| `punctuation.delimiter` | `syntaxPunctuationMuted` | Delimiters |
| `punctuation.list_marker` | `syntaxTitle` | Markdown/list markers |
| `punctuation.markup` | `syntaxProperty` | Markup punctuation |
| `punctuation.special` | `accent5` | Special/error punctuation |
| `selector` | `syntaxSelector` | CSS selectors |
| `selector.pseudo` | `syntaxSelector` | CSS pseudo selectors |
| `string` | `syntaxString` | Strings |
| `string.doc` | `syntaxString` | Doc strings |
| `string.escape` | `syntaxStringEscape` | Escape sequences |
| `string.regex` | `syntaxRegexp` | Regular expressions |
| `string.special` | `syntaxStringSpecial` | Special strings |
| `string.special.symbol` | `syntaxStringSpecial` | Symbols |
| `struct` | `syntaxType` | Struct names |
| `tag` | `syntaxTag` | Tags |
| `text.literal` | `syntaxString` | Literal text |
| `title` | `syntaxTitle` | Titles and headings |
| `type` | `syntaxType` | Types |
| `type.builtin` | `syntaxType` | Built-in types |
| `type.class` | `syntaxClass` | Class types |
| `type.defaultLibrary` | `syntaxType` | Standard library types |
| `type.interface` | `syntaxType` | Interface types |
| `typeParameter` | `syntaxType` | Generic type parameters |
| `variable` | `syntaxVariable` | Variables |
| `variable.builtin` | `syntaxVariableSpecial` | Built-in variables |
| `variable.defaultLibrary` | `syntaxVariableSpecial` | Standard library variables |
| `variable.member` | `syntaxProperty` | Members and fields |
| `variable.mutable` | `syntaxVariable` | Mutable variables |
| `variable.parameter` | `syntaxParameter` | Parameters |
| `variable.readonly` | `syntaxVariableSpecial` | Readonly variables |
| `variable.special` | `syntaxVariableSpecial` | Special variables |
| `variant` | `syntaxEnumMember` | Enum variants |

## Practical Notes

- Keep the extension theme-only. Language/tree-sitter files make the package
  harder to maintain and can accidentally change language behavior.
- Use `dev: open highlights tree view` in Zed to inspect which token type and
  modifier is being applied at the cursor.
- If a style does not appear, Zed tries the next fallback in the `style` array.
- If semantic colors do not update after changing settings, restart the
  language server with `editor: restart language server`.

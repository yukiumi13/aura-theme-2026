<p align="center">
  <img src="https://github.com/daltonmenezes/assets/blob/master/images/aura-theme/new-heading.png?raw=true" alt="Aura Theme" width="70%" />
</p>

<p align="center">
✨ A forked 2026 adaptation of Aura Theme for Zed
  <br><br>

  <!-- Patreon -->
  <a href="https://www.patreon.com/daltonmenezes">
    <img alt="patreon url" src="https://img.shields.io/badge/support%20on-patreon-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>

  <!-- version -->
  <a href="#">
    <img alt="version" src="https://img.shields.io/badge/version%20-v1.0.5-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca">
  </a>
</p>

> This package is the `yukiumi13` fork/adapted 2026 edition of Aura Theme for Zed.
>
> This fork is maintained by `yukiumi13` and remaps Aura Theme for Zed with a 2026-style palette and updated theme fields.



<p align="center">
  <img alt="preview" src="https://github.com/daltonmenezes/aura-theme/assets/25427808/3f7b97e5-122a-4c3d-9fb7-c4f99487bba3" />
</p>

# Themes available

- Aura 2026 Dark
- Aura 2026 Dark (Soft Text)
- Aura 2026 Soft Dark
- Aura 2026 Soft Dark (Soft Text)

# Installation

This fork is currently intended to be installed locally as a **dev extension**.

> At the moment, this fork is intended to be installed as a **local dev extension**, rather than through the official Zed extensions registry.

If you do not want to clone the whole repository, you can download a ready-to-use bundle from:

- **GitHub Actions artifacts**: the `Build Zed Extension Bundle` workflow uploads a downloadable artifact named `aura-theme-2026-zed-extension`
- **GitHub Releases**: when a tag like `v1.2.3` is pushed, the workflow also attaches `aura-theme-2026-zed-extension.zip` to the release

After downloading, extract the archive and select the extracted folder `aura-theme-2026-zed-extension` when installing the dev extension in Zed.

1. Open the **Command Palette** with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
2. Run `zed: install dev extension`
3. Select either:
   - the folder `packages/zed` from this repository, or
   - the extracted download folder `aura-theme-2026-zed-extension`
4. Open the **Command Palette** again
5. Run `theme selector: toggle`
6. Search for `Aura 2026` and choose an `Aura 2026` variant

If the theme does not appear immediately, restart Zed and check the log with `zed: open log`.
If the theme still does not appear, restart Zed and inspect the extension log via `zed: open log`.

# What this package contains

`packages/zed` is first and foremost a **Zed theme extension package**.

Its main deliverables are:

- `extension.toml` — the Zed extension manifest
- `themes/` — the installable Aura 2026 theme variants for Zed
- `languages/python/` — a Python language overlay that ships Aura-oriented queries and semantic-token defaults together with a registered Python grammar so Zed can load the overlay reliably

This package also includes a couple of **optional example settings files** for users who want to further tweak semantic-token behavior:

- `settings.example.jsonc`
- `settings.python-minimal.example.jsonc`

These example files are supplementary only. They are **not** part of the theme payload itself and do **not** auto-load in Zed.

# Python semantic tokens

In addition to the theme itself, this package now ships a **Python language overlay**:

- It registers a Python grammar for the extension so Aura's Python queries can load correctly
- It provides `languages/python/semantic_token_rules.json`
- It bundles a fuller Aura-oriented default mapping for common Python semantic tokens

That design matters because Zed language directories expect their referenced grammar to be registered by the extension. Without that registration, the Python overlay can fail to attach and Python highlighting can disappear entirely.

That means Python call-site keyword arguments such as `project=` and `name=` no longer rely solely on manual user-side `settings.json` overrides to look correct.

Python highlighting in Zed is still composed from two layers:

- Tree-sitter syntax highlighting
- Semantic tokens from the language server

When `semantic_tokens` is enabled, the final appearance may no longer come directly from theme syntax keys such as `syntax.function.kwargs` or `syntax.parameter`; it can instead be driven by semantic token rules.

This package now ships a **default Aura semantic-token rule set for Python**, so switching to Aura no longer requires rewriting a separate Python semantic-token block by hand.

## What is fixed automatically

After installing this package, if semantic tokens are enabled for Python:

- Python parameter definitions
- Python call-site keyword arguments such as `project=`
- Common semantic token types such as `namespace`, `property`, `function`, `method`, `type`, and `class`

will prefer Aura-oriented styles such as:

- `function.kwargs`
- `variable.parameter`
- `parameter`
- `namespace`
- `property`
- `function`
- `function.method`
- `type` / `class`
- `attribute`
- `keyword` / `operator` / `string` / `number` / `comment`

with parameter-family tokens retaining italic styling.

## Why the Python grammar is registered again

An earlier iteration of this fork removed the `python` grammar registration from `extension.toml` in an attempt to avoid installation-time compilation.

In practice, that also removed the grammar binding that Zed needs for the extension's `languages/python/` overlay, which could leave Python files with missing or severely reduced highlighting after installing the dev extension.

This package therefore registers the Python grammar again so the bundled Python queries and semantic-token defaults can actually load.

## What still cannot be forced by the extension

An extension **cannot modify your Zed user settings for you**, so it still cannot automatically enable:

- `semantic_tokens = "combined"`
- `semantic_tokens = "full"`

on your behalf.

In practice:

- If `semantic_tokens` remains at the default `"off"`, you will mostly see tree-sitter highlighting
- If you set Python to `"combined"`, you get richer semantic highlighting together with the bundled Aura mappings

## Recommended workflow

At minimum, we recommend a setting like this:

```json
{
  "languages": {
    "Python": {
      "semantic_tokens": "combined"
    }
  }
}
```

If you want more fine-grained semantic-token customization, this package still includes optional example files:

- `packages/zed/settings.example.jsonc`
- `packages/zed/settings.python-minimal.example.jsonc`

These files are still examples only and do not auto-load. Their purpose is to:

- help you enable `semantic_tokens`
- or layer your own overrides on top of the bundled defaults

## When manual overrides are still useful

If, in your own Zed + Python LSP combination, some tokens are not reported as `parameter` but as another type instead (for example `property`, `variable`, or a custom modifier combination), manual overrides are still useful:

1. Run `dev: open highlights tree view`
2. Place the cursor on the token you want to inspect
3. Check the actual semantic token type and modifiers
4. Add a user-side override in `settings.json` if needed

For example:

```json
{
  "languages": {
    "Python": {
      "semantic_tokens": "combined"
    }
  },
  "global_lsp_settings": {
    "semantic_token_rules": [
      {
        "token_type": "namespace",
        "style": ["namespace"]
      },
      {
        "token_type": "parameter",
        "style": ["function.kwargs", "variable.parameter", "parameter"]
      }
    ]
  }
}
```

If the highlights tree shows that your `project=` token is **not** `parameter`, replace `"parameter"` above with the actual token type reported in your environment.

## Optional ready-to-copy settings files

If you do not want to assemble the rules by hand, open:

- `packages/zed/settings.example.jsonc`
- `packages/zed/settings.python-minimal.example.jsonc` (Python-only minimal version)

and merge that file into your Zed user settings if needed. They include:

- `semantic_tokens: "combined"` for Python / JS / TS / TSX
- Aura-oriented semantic token remapping for `parameter`, `namespace`, `property`, `method`, `type`, etc.
- a theme selection example pointing to `Aura 2026 Dark`

After saving your Zed settings, run `lsp: restart language servers` if the highlighting does not update immediately.

## Why this is no longer theme-only

This fork is no longer a pure theme package made only of theme JSON files. In order to distribute Python semantic-token defaults with the package, `packages/zed` now includes a small Python language overlay.

The theme files themselves still only define styles such as:

- `function.kwargs`
- `parameter`
- `variable.parameter`
- `namespace`

The default mapping from **semantic token type → theme style** is delivered through `languages/python/semantic_token_rules.json`; it now includes a broader Aura Python default rule set instead of just a one-line `parameter` patch.

Even so, the actual priority order is still:

- your user `settings.json`
- this extension's bundled Python language rules
- Zed built-in defaults

So in short:

- common Python parameters / kwargs, plus a range of common Python semantic token types, are now fixed by default in the package
- more personal or more extreme semantic-token preferences are still best handled by user overrides

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
[MIT © Dalton Menezes](https://github.com/daltonmenezes/aura-theme/blob/main/LICENSE)

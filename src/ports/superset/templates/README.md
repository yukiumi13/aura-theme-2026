# Aura Modern for Superset

Nine current Aura themes compiled for the [Superset desktop app](https://superset.sh/). UI, editor/diff and terminal colors come from the same source palettes and semantic roles as the VS Code, Ghostty and Kitty ports.

## Install

In **Settings → Appearance**, use the theme **Import** control and select `aura-theme-2026.json` to import all nine themes, or select an individual theme JSON. Choose the imported theme from the appearance selector. The pack is below Superset's 256 KiB UI import limit.

With the Superset CLI that provides `settings theme`:

```sh
superset settings theme import ./aura-theme-2026.json
superset settings theme set aura-aqua-light
```

Follow the OS appearance with an explicit family pair:

```sh
superset settings theme set system --system-dark aura-aqua-dark --system-light aura-aqua-light
```

| Theme | Appearance | ID | Individual file |
| --- | --- | --- | --- |
{{{ themeRows }}}

Re-importing replaces themes with the same IDs. UI labels may vary between Superset versions; the JSON contract is documented in the [port design record](https://github.com/yukiumi13/aura-theme-2026/blob/main/docs/SUPERSET_DESIGN.md).

## Design and scope

Reading surfaces retain each family's light or dark foundation. Primary actions use paired action roles; brand highlights use the independently paired badge roles. Aqua keeps cyan actions and mint badges; Lime uses its own green-white light foundation; Azure retains its Fluent colors. Aqua/Lime dark reading surfaces stay Aura Dark; Azure keeps its own Fluent dark foundation.

Superset's `accent` is a **hover surface**, so it receives the shared hover role rather than the saturated Aura brand accent. Its sidebar accent is shared by hover and selection and receives the existing list-selection tint with neutral text. The app controls its own opacity-based primary hover, disabled states and focus-ring geometry. Its `primary` token also colors link-button text; Aqua's intentionally soft white-on-cyan controls retain their existing contrast. Theme JSON cannot provide separate native link, active-tab, notification, remote, or primary-hover colors, nor the optional VS Code gradients.

All supported UI fields, 16 ANSI slots, terminal selection/cursor pairs, 24 editor colors and 14 syntax roles are explicit. Syntax stays independent of terminal ANSI, and diff addition/deletion/modification use semantic status roles. Superset derives its diff overlay strengths and syntax scope mapping; its editor supports fewer independent syntax roles than VS Code. App components with hard-coded utility colors, browser pages, webviews and remote programs can retain their own colors. A theme does not set fonts, shortcuts, layout or plugin settings.

## Build and review

```sh
yarn build only superset
yarn package:superset
node scripts/review-superset-themes.js
node scripts/review-vscode-themes.js
```

Build output is `packages/superset/`; the ZIP is `dist/superset/aura-theme-2026-superset-themes.zip`. Edit source palettes/roles or `src/ports/superset/templates/theme.json`, then rebuild. The import pack and individual files share one compiler result. Configuration review specimens are labelled as such and are not actual Superset screenshots.

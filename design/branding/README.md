# Aura branding

The Aura wordmark uses **Smooch**, paired with **Jost Medium** for the Modern
subtitle. Its capital A and lowercase ura retain the font's original outlines,
baseline, and proportions, with slight tracking to separate the letter colors.

## Assets

- `aura-wordmark.png`: transparent, four-color Aura lettering.
- `aura-modern-master.png`: 1024 px square master with the Modern subtitle.
- `aura-modern-icon.png`: 512 px extension icon, also written to
  `src/ports/vscode/extra/logo.png` and `packages/vscode/logo.png`.
- `../../docs/assets/aura-teaser-zoom.png`: README composition over a crop of the
  real Aqua Dark editor screenshot. A dark fade separates the text from the UI.
- `../../docs/assets/aura-teaser-gallery.png`: alternate composition showing
  Aura Dark, Aura Light, and Aqua Light with their original screenshot colors.

The screenshots show a fictional sample project in an isolated VS Code profile.
The teaser crops exclude the operating system title bar. Full screenshots remain
in the VS Code README gallery for evaluating the theme itself.

## Rebuild

Install Pillow in your Python environment, then run from the repository root:

```sh
python scripts/render-branding.py
```

The script renders the font outlines, colors the letters, typesets Modern, and
composes the teasers from checked-in screenshots. All assets can be rebuilt
locally without a font service or an image generation service.

## Typography and licenses

- [Smooch](https://github.com/googlefonts/smooch), copyright 2017 The Smooch
  Project Authors. Font distributed through
  [Google Fonts](https://github.com/google/fonts/tree/main/ofl/smooch).
  License: `fonts/Smooch-OFL.txt`.
- [Jost](https://github.com/indestructible-type/Jost), by indestructible type.
  Font distributed through [Google Fonts](https://github.com/google/fonts/tree/main/ofl/jost).
  License: `fonts/Jost-OFL.txt`.

Both fonts use the SIL Open Font License 1.1. The original font files and their
license notices are included here as design sources. Only the rendered icon is
bundled in the VS Code extension; the font files are not included in the VSIX.

## Color correspondence

| Letter | Color | Intent |
| --- | --- | --- |
| A | `#61FFCA` | Main visual emphasis |
| u | `#A277FF` | Aura purple |
| r | `#D49DFF` | Softer orchid |
| a | `#12DADD` | Aqua accent |
| Modern | `#ADACAE` | Quiet geometric subtitle |

# Aura Aqua: design assessment and paired variants

The supplied screenshot's cyan and Aura mint can form a coherent analogous palette. The cyan is cooler and more synthetic; mint is greener and softer. Their closeness is useful for cohesion, but makes them a weak pair for distinguishing unrelated meanings by hue alone. Meaning should also come from placement, lightness, labels, and icons.

## What was measured

`docs/aqua-color-sampling.json` records source-image SHA-256, dimensions, color metadata, crop rectangles, and raw pixel counts. The reference is a 654 × 1098 RGBA PNG with an sRGB metadata chunk and gamma 0.45455; it has no embedded ICC profile. The sampler does not resize, quantize, or convert the image's color profile.

| Region | Frequent stored RGB values |
| --- | --- |
| Purchase button | `#12DADD`, `#11DADD`, `#13DADD` |
| Task button | `#0CDADD` through `#11DADD` |
| Progress bar | `#1ADBDE`, `#1BDBDE` |
| Paper | `#F8FCFE` |

`#12DADD` is the most common color within the recorded vivid-cyan filter (1,869 pixels), so it is used as a representative anchor. It is not claimed to be the original game's design token. Crop placement is a visual choice; color counts are direct measurements. Neighboring values can come from gradients, anti-aliasing, or earlier image processing. With Pillow available, reproduce the report with:

```sh
python scripts/sample-image-palette.py /path/to/reference.png --output /tmp/aqua-sampling.json
```

The anchor's HSV hue is approximately 180.9°, versus Aura mint's 159.9°. These are adjacent hues, not a complementary pair. White text on the sampled aqua has only about 1.74:1 contrast. The variants therefore use dark text on the vivid aqua fill. The reference's glow, double outlines, low-contrast disabled labels, and artwork are not copied into the themes.

## Adopted interaction language for the default themes

Aqua is a distinct **interaction response** color. The light default keeps mint-filled normal actions, then uses the sampled aqua for hover with the same dark text. Dark themes use aqua for action/Remote hover and the UI hover/emphasis roles that previously borrowed mint. Ordinary light hover labels remain neutral, and light links/focus remain purple.

`semantic.interaction.accent` is independent of `brand.mint`, syntax, and success status. Dark normal action fills use the family accent so their dark labels remain readable before hover; compact status hover stays neutral. Existing TextMate, semantic syntax, and ANSI colors are unchanged.

## Implemented variant language

Each variant is evaluated for its own visual quality: surface hierarchy, code legibility, role separation, and the balance of cool and warm hues. Matching the default Aura syntax is not an acceptance criterion. The shared role function reuses the language mapping, while the Aqua source palette supplies independently tuned syntax accents and semantic colors for each appearance.

The VS Code extension adds **Aura Aqua Light 2026** and **Aura Aqua Dark 2026**. These are distinct from the older Aura Cyan dark-only accent variant: they have paired surfaces, shared aqua actions, neutral interaction labels, and explicit status meanings.

| Meaning | Aqua Light | Aqua Dark |
| --- | --- | --- |
| Filled actions, badges, Remote/SSH | `#12DADD` with `#07363A` text | Same pairing |
| UI links / hover | Clear blue `#215FA6` / `#174D8C` | Aqua `#12DADD` / `#76E9EC` |
| Types / constants | Blue `#215FA6` | Sky blue `#7DCDE9` |
| Information icons | Blue `#215FA6` | Aqua `#12DADD` |
| Control flow and operators | Violet `#6550AE` | Soft violet `#B9A4EF` |
| Function calls / properties | Orchid `#874D9D` / rose `#A13F70` | Orchid `#D6B1F0` / rose `#EDABC8` |
| Numbers | Amber `#905C19` | Warm sand `#EDC58F` |
| Strings / success | Readable Aura mint ink | Original Aura mint |
| Canvas | Sampled cold paper `#F8FCFE` | Designed charcoal `#111A1E` |
| Chrome | Designed `#EEF4F6` | Designed `#0C1418` |
| Ordinary hover | Neutral surface and foreground | Neutral surface and foreground |

Only the aqua anchor and cold-paper background are direct reference samples. Hover, charcoal, surface, and selection shades are design choices; they are not attributed to the reference UI. The initial deep-aqua ink proposal was removed from light text. Clear blue types and links give the cold paper a crisp accent without requiring deep teal ink. Violet control flow, orchid functions, rose properties, and amber numbers break up the earlier concentration of purple/pink code. Dark syntax uses brighter, softer accents against charcoal; vivid mint remains a deliberate string accent. The more luminous dark syntax also permits clearer selection and diff surfaces. Parameters and documentation comments use subdued slate ink to avoid turning secondary information into another competing hue.

## Implementation and validation

- `source/aqua.ts` owns the anchor, tonal colors, neutral palettes, UI families, syntax accents, and semantic brand/action/status assignments. Original Aura mint remains a separate brand anchor.
- `createAuraPalette` consumes independent action and interaction semantics. Default hover uses the interaction accent, and custom Aqua action fills keep their own hover treatment.
- `create-aura-syntax.ts` owns the shared syntax role mapping within the existing role layer. `create-aqua-roles.ts` supplies Aqua's own type/control accents and appearance-specific semantic palette, and assigns neutral hover, readable hints/inactive labels, cool selections, and bounded diff tints. UI and syntax can be tuned separately without fixing either to the default theme. Compatibility aliases follow the structured roles.
- The same VS Code template generates all themes. The two new appearances are registered separately from legacy dark-only families, so other ports do not accidentally receive light metadata.
- Tests render the actual template, check manifest/output agreement, composite selections and diff layers, verify contrast for explicit syntax and interaction pairs, check agreement between TextMate and semantic highlighting, and confirm status colors are independent of ANSI overrides. ANSI black remains a dark TUI background slot in the dark appearance; other foreground slots and the black/white pair are checked for readability.

The accompanying preview is an illustration rendered from the generated theme values, not a screenshot of a running VS Code instance.

## Rendered previews

![Aura Aqua Light token preview](assets/aura-aqua-light-2026.png)

![Aura Aqua Dark token preview](assets/aura-aqua-dark-2026.png)

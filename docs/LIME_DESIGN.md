# Aura Lime

Lime is a separate light/dark pair. Its summer character comes from cyan,
green-cyan, mint, and small yellow accents distributed across the interface.

## Reference

The second supplied game screenshot (661 × 1182) includes a bottom claim-all
button absent from the earlier crop. Its mint-to-cyan transition matters more
than any single dominant color. Measurements are recorded in
[lime-color-sampling.json](lime-color-sampling.json); the reference artwork is
not distributed with the extension.

| Reference region | Sample | Theme interpretation |
| --- | --- | --- |
| Task buttons and progress | `#00DDDF` | Keep the established Aqua cyan `#12DADD` for active tabs and progress |
| Claim-all button, upper left | `#64EBAF` | Mint actions and active navigation |
| Claim-all button, center | `#06DDD7` | A movement toward cyan on interaction |
| Title lettering | `#00FED7` | Green-cyan action hover |
| Drink illustration | `#FED532` | Softer lemon `#F5DF72` on button borders, pale lime `#E4EF82` on selected edges |

The lemon and pale lime are designed adaptations, not extracted theme tokens.
Most visible green in the reference is mint or green-cyan; yellow-green itself
does not dominate it. VS Code color themes use solid colors, so the reference's
gradient is translated into neighboring controls and hover states.

## Two appearances

**Light** preserves the first summer prototype: green-white editor `#FBFDFB`,
slightly deeper chrome `#F5F9F3`, pale green selections, and white floating
widgets. White labels on cyan/mint controls keep Aqua Light's deliberately soft
treatment. Keyboard focus uses deeper teal so it remains visible on pale areas.

**Dark** keeps Aura Dark's violet-black surfaces, syntax roles, and terminal
palette. Mint navigation icons on a green-tinted active surface, green-tinted
selections, green-cyan links, and fine citrus accents establish Lime's identity
without coloring the reading canvas. Filled buttons use Aura's dark ink for
text. Light activity icons use slate so unchecked hover on the pale rail stays
visible in the traditional interface. In experimental Modern UI, Lime Light
uses white selected icons on mint and slate hover icons on `#EDF5EA`.
Lime Dark keeps mint icons on its selected green tint, with neutral hover.

Warnings, success, and errors retain their semantic colors. Citrus decoration
does not replace the diagnostic palette or tint the code yellow.

## Relationship to Aqua

Aqua keeps its original cold-white or Aura Dark surfaces, cyan actions,
and syntax. Mint badges and fine citrus edges decorate this foundation.
Lime has its own palette inputs, names, selections, and navigation treatment.
The two pairs share the role builder and VS Code template to keep language
highlighting, layered diffs, widgets, and terminal behavior consistent.

The six existing theme IDs remain stable. The new IDs are `Aura Lime Light`
and `Aura Lime Dark`; upgrading does not switch an existing Aqua selection.

## Preview status

The final pair's Extensions/TSX view, selected activity icon, and unchecked
Search hover were inspected in the isolated VS Code profile with Modern UI.
See the [interaction review](reviews/2026-09-19-modern-activity-review.md) for
coverage and remaining follow-ups. The [VS Code gallery](../packages/vscode/README.md#lime)
includes current Light and Dark captures from the same fictional workspace.

# Azure Light and Dark

Azure is a paired VS Code appearance using Microsoft Fluent's web brand ramp,
neutral hierarchy, and shared color families. It is an independent Aura adaptation,
not an Azure portal replica or an official Microsoft theme.

## Sources

Reviewed September 18, 2026:

- [Fluent color guidance](https://fluent2.microsoft.design/color): neutral surfaces establish hierarchy; brand colors mark actions; status colors retain their meanings.
- [Fluent alias tokens](https://fluent2.microsoft.design/color-tokens): light and dark appearances select different steps from the same ramps.
- [Web brand ramp](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/global/brandColors.ts).
- [Shared colors and neutral ramp](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/global/colors.ts).
- [Light aliases](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/alias/lightColor.ts) and [dark aliases](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/alias/darkColor.ts).

The palette subset retains Microsoft's MIT notice in the VSIX's
`THIRD_PARTY_NOTICES.md`. No Fluent fonts, icons, or artwork are bundled.

## Applied roles

| Role | Light | Dark |
| --- | --- | --- |
| Editor | grey 98, `#FAFAFA` | grey 12, `#1F1F1F` |
| Sidebar | grey 96, `#F5F5F5` | grey 8, `#141414` |
| Floating surface | white | grey 16, `#292929` |
| Ordinary foreground | grey 26, `#424242` | grey 84, `#D6D6D6` |
| Filled actions / active tab | brand 80, `#0F6CBD`, white text | brand 70, `#115EA3`, white text |
| Action hover | brand 70 | brand 80 |
| Selection | brand 160 | brand 20 |
| Types | brand 80 | brand 110 |
| Keywords | lavender shade10 | lavender tint30 |
| Functions | purple tint20 | purple tint40 |
| Properties | pink shade20 | pink tint30 |
| Strings | seafoam shade30 | seafoam tint30 |
| Numbers | bronze shade10 | peach tint30 |

The token values above come directly from Fluent. Assigning them to editor syntax,
using a solid blue active tab, choosing softer ordinary text, and tuning transparent
selections/diffs are Aura design decisions. Fluent does not specify a code syntax
palette. The original Aura mint remains a separate brand anchor.

Azure reuses the shared syntax mapping and explicit UI roles developed during Aqua.
Neutral hover text, muted inactive tabs, elevated menus, independent semantic status
colors, and restrained layered diff fills apply to both appearances. Azure uses its
own Fluent blue interactions; it does not inherit Aqua's cyan hover.

## Validation

Tests render the actual VS Code template, compare generated files, check all six
manifest entries and legacy selection IDs, and evaluate syntax over selections,
search matches and layered diffs. Azure accepts the same soft-text floor as Aqua
Light (3:1) and a 4.5:1 floor in Dark. These checks catch accidental unreadability;
real-window review determines visual balance.

## Theme selection migration

VS Code now exposes six themes: Dark / Light, Aqua Dark / Light, Azure Dark / Light.
Display names begin with `Aura` and omit the year. All six saved selection IDs
remain unchanged: `Aura 2026 Dark`, `Aura Light 2026`, `Aura Aqua Light 2026`,
`Aura Aqua Dark 2026`, `Aura Azure 2026`, and `Aura 2026 Azure Light`.
The extension identifier and theme file paths are retained for compatibility.

The other twelve entries are retired from the VS Code package. Their source families
remain available to the existing terminal and Zed ports; those ports have their own
release scope. Users of removed entries must select one of the six retained themes.
The v0.5.5 Git history preserves all retired VS Code theme definitions.

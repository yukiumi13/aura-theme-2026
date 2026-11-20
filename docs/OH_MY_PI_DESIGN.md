# Aura Modern for Oh My Pi

The [plugin](../packages/oh-my-pi) compiles all nine appearances from the same named roles as Aura Modern 1.0.0. The port targets the standalone Oh My Pi 19.0.1 TUI. Build it from the repository root with `yarn build only oh-my-pi`. See the [native visual review](reviews/2026-11-20-oh-my-pi.md) for screenshots.

## Surfaces

Aqua Lime Light uses a white terminal canvas, near-white tool surfaces and a soft gray input. In a regular terminal the emulator owns the unpainted canvas. Set its background to white or use the matching Aura terminal preset. Theme-aware hosts can read the exported terminal background, foreground, chrome, widget and 16 ANSI slots directly.

| Role | Aqua Lime Light | OMP behavior |
| --- | --- | --- |
| Terminal canvas | `#FFFFFF` | Background underneath the transcript |
| Tool and status surfaces | `#FBFBFB` | Neutral backgrounds in renderers that use them |
| User input | `#F4F4F4` | User messages and composer shapes that request a filled surface |
| Selection | `#E9F3F4` | List widgets that paint a selection background |
| Transcript and tool output | `#4A5861` | Main reading text, including substantive command output |
| Secondary text | `#6B7D86` | Metadata and thinking text |
| Active labels and Bash frame | `#39749D` | Small labels and running/pending native frames share the foreground accent |
| Focus detail | `#12DADD` | Widgets using the independent accent border |
| Diff ink | `#006B4D` / `#B93844` | Added and removed lines on a neutral background |

The templates expose 70 named TUI colors, all three HTML export surfaces and the complete terminal palette for each appearance. Translucent selection and error roles are composited against the family canvas because OMP requires opaque terminal colors. OMP allocates six optional subagent colors dynamically to distinguish simultaneous agents. The host also selects which Markdown styles use ANSI slots when Colorful Markdown is enabled.

## Bash and the composer

OMP separately renders the command transcript and the editable composer. Bash draws a segmented frame with the shared accent while running, the dim foreground when settled, and warning or error ink for those outcomes. The result renderer leaves the card interior on the terminal canvas. Other tools, including Edit, paint their own card backgrounds. A filled composer draws the input surface; the default status-band composer mainly emphasizes the status row.

Shell Visualization adds execution markers and variable annotations and draws inactive or skipped segments faintly. A lower-density setup can use `omp config set display.shellVisualization false`. Turning it off displays the original shell command with its output and keeps the native frame. An extension can opt into OMP's transcript presenter API for collapsible summaries if row layout needs to change. This package uses the stock transcript layout.

[OMP theme contract](https://github.com/can1357/oh-my-pi/blob/v19.0.1/docs/theme.md) · [Bash cards](https://github.com/can1357/oh-my-pi/blob/v19.0.1/packages/tui/src/tools/bash.ts) · [Trace emphasis](https://github.com/can1357/oh-my-pi/blob/v19.0.1/packages/tui/src/tools/shell-viz-render.ts) · [Transcript presenters](https://github.com/can1357/oh-my-pi/blob/v19.0.1/docs/extensions.md#transcript-presenter)

## Packaging

OMP discovers custom theme JSON files in the active profile. Its startup extension registers managed theme copies there. An exclusive first copy and per-file checksums protect existing custom files and symbolic links. The package has no install scripts or npm dependencies.

The GitHub tag `omp-v1.0.0` has the generated plugin as its repository root, as required by the OMP Git installer. Its commit has the corresponding full source commit as its parent. The release archive contains the same plugin files.

[Upstream plugin installer](https://github.com/can1357/oh-my-pi/blob/v19.0.1/docs/plugin-manager-installer-plumbing.md)

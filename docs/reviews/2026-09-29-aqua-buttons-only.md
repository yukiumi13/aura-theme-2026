# Aqua 0.9.1: buttons-only preview

Date: 2026-09-29. Supersedes the tab enhancement in the local 0.9.0 preview.
The user's feedback removes tabs from scope and asks about selected typography.

## Changes and typography finding

Removed `--aura-tab-gradient`, the active tab background rule, and tab text,
close-action and Modern UI action-background overrides from the source CSS.
The optional enhancement now affects only primary buttons and their hover/focus
states. No font-weight declarations were added in either preview.

The installed VS Code 1.131.0 stylesheet sets Modern UI tab label links to
`font-weight: var(--vscode-fontWeight-semiBold)`. Similar rules apply to sidebar,
auxiliary-panel and settings-tab labels. The initial gradient preview's darker
tab foreground could make that existing weight more noticeable, but did not
change the weight. This identifies tab/title behavior, not every unspecified
selected control in the user's editor.

Installed the actual 0.9.1 VSIX only in the disposable review profile and
reapplied through Custom CSS and JS Loader 7.5.1. In native split editor tabs,
the enhancement stylesheet present versus temporarily removed yielded identical
background images (`none`), text color and computed font weight (`600`).
Primary Source Control buttons retain the gradient. See
[native checks](2026-09-29-aqua-buttons-only/native-checks.json) and
[revised screenshot](2026-09-29-aqua-buttons-only/buttons-only.png).

## Whole-theme review and validation

Regenerated the full resolved inventory. All nine theme JSON payloads are
byte-identical to 0.9.0, preserving the prior syntax, surface and interaction
review. Only the optional CSS and descriptions change in this revision.
Native button/tab hierarchy now follows the user's smaller scope: saturated
gradient actions, ordinary editor navigation, unchanged typography.

All 14 suites / 257 tests pass. The actual VSIX passes ZIP CRC verification;
its manifest reports 0.9.1, its stylesheet contains no tab selectors or
font-weight rules, and all nine bundled themes match the prior preview exactly.
The previous review's platform and secondary-state coverage limits remain.

This is an unpublished preview. The test-profile installation is not evidence
of installation on the user's everyday desktop. The active task runs on cm03;
the intended everyday installation target requires confirmation.

# Aqua 0.9.2: visible button hover and Modern tab compatibility

Date: 2026-09-29. Local, unpublished preview, built from the preserved 0.9.1
remote working files. Runtime: Windows desktop VS Code 1.139.1.

## Regressions and corrections

**Button hover:** the opaque normal gradient concealed the native
`button.hoverBackground`. The former `#ffffff16` overlay changed the result too
little to communicate hover. The new hover gradient uses the existing hover
cyan and expands its central region from 46–58% to 26–74%, retaining mint at
both ends. The shadow changes from `0 1px 3px #14384418` to
`0 2px 6px #14384426`. Normal fill, white edge, typography, and focus styling
are retained. Disabled and secondary buttons remain excluded by the selectors.

Resolved colors for both affected light appearances:

| Role | Value |
| --- | --- |
| Mint end stops, `badge.background` | `#64EBAF` |
| Normal cyan, `button.background` | `#12DADD` |
| Hover cyan, `button.hoverBackground` | `#0FC9CE` |
| Filled-control foreground | `#FFFFFF` |

**White text on a pale active tab:** reproduced with Modern UI's Connected tab
style. In this installed VS Code version,
`workbench.experimental.modernUIEditorTabStyle` defaults to `connected`; its
active `.tab-fill` uses `--modern-ui-connected-tab-surface` derived from the
editor background. The theme's white active foreground remains in effect while
its cyan active background is replaced. This is a native style interaction,
not a missing tab gradient or a local Aqua color override.

Setting `workbench.experimental.modernUIEditorTabStyle` to `pill` restored the
cyan active fill and readable white label/close icon. Applied this native
setting in the local review profile and the user's Google profile. Documented
the setting in the README. This preview does not automatically alter other
users' settings and does not add tab CSS, gradients, or font-weight overrides.
Connected mode without this setting remains a documented compatibility limit.

## Reference and design judgment

The supplied September 28 claim-all reference combines mint ends, a cyan
center, white text, a white inner edge, and slight volume. The new hover changes
the distribution of the accepted colors, making the pointer state observable
while retaining the normal button's cooling mint/cyan character. The wider
cyan region helps Aqua remain cyan-led rather than spreading green into reading
surfaces. White text on the saturated fill remains the accepted soft-contrast
choice. No new citrus hue, syntax role, or reading-surface tint was introduced.

The rabbit marker reference is separate; no rabbit/badge gradient implementation
is claimed by this preview.

## Resolved configuration review

Regenerated the complete resolved inventory: nine appearances, 4,500 UI values,
432 TextMate rules, and 270 semantic entries. Compared all nine parsed theme
JSON payloads against the actual 0.9.1 VSIX with deep equality: every value and
rule is unchanged. This includes transparency, terminal slots, syntax roles,
surfaces, and state colors. Raw file hashes can differ from 0.9.1 because of
line endings; semantic equality is the verified claim. See the
[current payload hashes](2026-09-29-hover-tabs/manifest.json) and
[full resolved sheet](resolved-themes.html).

The prior whole-theme review therefore carries forward for unchanged payloads;
it is not a fresh runtime approval of all nine themes. The changed CSS remains
scoped to Aqua Light and Aqua Lime Light. Its state mapping, rather than the
palette or theme template, accounts for the new visual result.

## Actual desktop observations

Used a separate user-data directory, fictional TSX/CSS files, and the real
installed Windows VS Code. Inspected:

- Connected active tabs reproducing the pale-fill/white-text regression.
- Pill active/inactive tabs after the setting change, with cyan active fill and
  readable white label/close icon.
- Explorer primary buttons at rest and under pointer hover. Hover visibly
  expands and deepens cyan; returning to rest restores the mint distribution.
- The surrounding editor, sidebar, and fictional CSS/TSX syntax, which retain
  their existing hierarchy.

Local evidence: [normal](2026-09-29-hover-tabs/normal-and-pill.png) and
[hover](2026-09-29-hover-tabs/hover-and-pill.png). These are real desktop captures,
not HTML mockups. They include application notifications and are review
evidence, not prepared public marketing assets.

The everyday window was using the Google profile, whose extension inventory
still pointed to 0.8.0 although Default had received 0.9.1. Installed the 0.9.2
VSIX and Custom CSS and JS Loader 7.5.1 explicitly into Google, reloaded that
window, and confirmed the corrected native tab appearance.

For this local visual check, the exact built stylesheet was applied to the
desktop workbench with backups and compatible Custom CSS markers. The original
Content-Security-Policy was preserved byte-for-byte. The loader's Apply command
was not exercised; this is not end-to-end verification of its installation
flow. The resulting standard installation-integrity warning was observed and
was not suppressed. Styling is installation-wide for matching theme selectors,
even though extension installation and settings are profile-specific.

## Validation and remaining coverage

- Existing gradient-controller suite: 8 tests passed, covering opt-in behavior,
  exact-payload installation/upgrade, import preservation, failure handling,
  and queued operations.
- All nine parsed theme payloads equal the 0.9.1 VSIX baseline.
- `git diff --check` passed.
- Built local VSIX: version 0.9.2; SHA-256
  `1fa33c9a83b8fd8e583a55a6531e673e9c19ab4f5fbc942c17ac830b39d9cb53`.

Fresh native coverage is limited to the tab compatibility correction and the
primary-button normal/hover states described above. Keyboard focus, disabled
and secondary controls retain their prior implementation but were not freshly
exercised. Classic UI, dark appearances, other languages, Remote/SSH, terminal,
layered diffs, and loader consent/application remain coverage gaps for this
Windows revision. This work is locally installed for trial, not published.

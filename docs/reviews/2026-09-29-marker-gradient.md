# Aqua 0.9.3: level-marker treatment for numeric activity badges

Date: 2026-09-29. Local unpublished preview. Windows desktop VS Code 1.139.1,
Modern UI enabled, Pill tabs, compact layout, Aura Aqua Lime Light.

## Reference and design decision

The user's September 28 reference has two distinct treatments: the claim-all
button's horizontal mint/cyan distribution and the level-10 rabbit marker's
vertical cyan-to-green fill with a white edge and glow. Version 0.9.2 handled
the button; this revision adds the marker treatment to numeric activity badges.

The upper `#50F5E2` and lower `#75F79E` stops are earlier regional pixel samples
from the supplied marker screenshot, not asserted original source-design
values. The existing badge mint (`#64EBAF`) bridges them at 52%. A one-pixel
white inset edge (`#FFFFFFED`) retains the native box size; a five-pixel cyan
glow (`#50F5E266`) and a small text shadow (`#126C7259`) provide separation.

The reference's large glow would overwhelm 13–16 pixel editor badges, so the
local treatment deliberately reduces its area. The vertical fill and white
edge carry most of the identity. No rabbit silhouette, badge enlargement, or
animation is added. Buttons retain their 0.9.2 normal and hover treatments.

## Selector scope and semantics

The stylesheet still applies only to Aqua Light and Aqua Lime Light.
It targets nonempty numeric `.badge-content` elements in native action bars,
excluding `.progress-badge` and `.icon-badge`. Checked those distinctions in
the actual installed VS Code source. Spinner and warning/error icon badges
therefore retain their native treatment. Generic search-result counts, problem
counts, code tokens, and status surfaces are not broadly restyled.

## Whole-theme configuration review

Regenerated the complete resolved inventory: nine themes, 4,500 UI entries,
432 TextMate rules, and 270 semantic entries. All nine parsed theme payloads
in the actual 0.9.3 VSIX equal those in the 0.9.2 VSIX, including transparency,
terminal colors, syntax roles, and less common states. The accepted whole-theme
assessment carries forward; this revision changes only optional CSS and its
documentation. See the [payload manifest](2026-09-29-marker-gradient/manifest.json)
and [resolved configuration sheet](resolved-themes.html).

## Native observations

Used the existing isolated fictional sample profile in the real desktop editor.
Created an unsaved scratch buffer containing “Summer marker preview” to produce
a real Explorer count badge. No personal content was used for review images.

- [Before](2026-09-29-marker-gradient/before.png): the 0.9.2 solid mint count.
- [Inactive navigation](2026-09-29-marker-gradient/inactive-badge.png): the new
  gradient badge against the pale activity rail.
- [Selected navigation](2026-09-29-marker-gradient/selected-badge.png): the same
  badge over the cyan Explorer tile, alongside ordinary code and buttons.

**Design adjustment:** the badge now has a visible white contour and vertical
cyan/green variation. The small halo is intentionally restrained at normal
viewing size. It adds the reference's marker character without tinting the
editor or spreading decorative green through functional buttons.

**Accepted choice:** soft contrast with white count text is retained. A subtle
text shadow separates the count without replacing its foreground or weight.

**Coverage gaps:** freshly observed one-digit Explorer badges in selected and
inactive activity states. Other badge types, multi-digit counts, other activity
bar locations, Classic UI, and Aqua Light were not separately exercised. The
shared CSS scope supports both Aqua light appearances; this is not a claim of
fresh native approval of both. Focus/hover and button behavior retain the prior
implementation and review. Dark themes and other families are unaffected.

## Delivery and checks

Built the actual 0.9.3 VSIX and verified ZIP CRC, manifest version, nine-theme
payload equality, and CSS identity. Installed it in the isolated preview and
the user's Google profile. Reloaded the isolated preview and left it open for
trial. The everyday Google window needs its next reload to display the new CSS.

Replaced only the previously applied Aura stylesheet, with a new backup of the
workbench and old CSS. The original Content-Security-Policy was preserved.
As in 0.9.2, the loader's Apply command was not exercised, so this verifies the
rendered exact payload rather than its end-to-end installation flow. The
installation-integrity warning remains visible. No publication or push occurred.

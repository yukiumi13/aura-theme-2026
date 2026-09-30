# Aqua focus roles — corrected 0.9.6 preview

Date: 2026-09-30. Baseline: released 0.9.5,
`bf53bde51b122f3241bcd36342b00c060671a270`.

## User clarification and role decision

The supplied screenshot shows the outer boundary of a focused notification
toast. VS Code implements the toast as a list: the focused row obtains a
list-focus outline. The ordinary `notificationToast.border` token is the
much paler `#E1E9ED`. Styling only inputs and buttons therefore missed the
reported surface.

The user then clarified that retaining the input/toolbar treatment should
follow semantic role assignment, not an automatic rollback after identifying
the screenshot. The final design uses **one focus-emphasis role** with
control, compact and surface glow densities. Notification is a receiving
surface in the VS Code adapter, not a separate semantic focus palette.

- Shared ring: reference anchors `#50F5E2`, `#64EBAF`, `#75F79E`, at 0%, 52%,
  100% along 135 degrees. Shared inner edge: white at alpha `ED`.
- Control: cyan glow at alpha `66`, rendered within 5px; a 2px ring on input
  and primary-action boundaries.
- Compact: mint glow at alpha `45`, rendered within 3px; a 1.5px ring on
  eligible toolbar icons.
- Surface: cyan glow at alpha `45`, rendered within 7px; a 2px perimeter on
  the focused notification toast. Its larger area receives lower glow density.

These opacities and geometries are design adaptations. The source anchors
remain the accepted regional samples from the level-marker reference.

## Focus ownership and other semantics

The card selector requires `.notification-toast:has(.monaco-list:focus)`.
It intentionally does not use `:focus-within`: when the action button owns
focus, the card stops matching and the button uses control focus. This avoids
simultaneous parent and child rings. Input emphasis similarly requires focus
on the actual input, not a nearby toolbar. Buttons/icons use `:focus-visible`.

Hover, selection, badge attention, and warning/error severity retain separate
roles. A warning icon remains warning-colored inside a focused card. Native
message text, body fill and controls remain intact. Error/warning/info inputs,
disabled controls and secondary actions are excluded from the gradient control
treatment. Notification-center rows retain native styling in this iteration.

The hollow ring uses a masked, pointer-transparent pseudo-element. It does
not intercept close/action clicks. Native list outlines are replaced only
inside the focused toast scope. Known toolbar and segmented-button
pseudo-elements are excluded. Input/toolbar focus remains in the corrected
design; the first preview's global native focus-token recoloring is removed.

## Resolved configuration review

Read and deep-compared all nine generated theme JSON documents against the
accepted 0.9.5 baseline: **all are identical**. This includes 4,500 UI entries,
432 TextMate rules, 270 semantic entries, RGBA overlays, terminal colors,
search, diff, diagnostics and less-used UI states. All native focus fallbacks
remain unchanged, including Aqua Light's `#4A80A7`.

Both Aqua Light themes inherit the same optional focus role. Other families
emit no new enhancement rules. Action normal/hover colors and numeric badge
roles are unchanged; primary-button focus now belongs to the shared focus role.
The complete decoded inventory and effect mappings are recorded in
`2026-09-30-notification-focus/config-audit.json` and the regenerated overall
review sheet, which includes input, compact, action and notification specimens.

**Design judgment:** the role allocation is coherent with the user's reference:
bright cyan/mint identify the current interaction location, while severity and
attention retain their own meanings. The notification adds a small perimeter
accent rather than a new large fill. Perceived intensity and real control
clipping still require a native visual review.

## Verification and coverage

- 159 relevant Aqua/derivative/effect tests passed; TypeScript and ESLint passed.
- Regression coverage checks source-to-role compilation, derivative inheritance,
  independence from action/badge palettes, transient surface ownership, disabled
  and validation exclusions, hollow rings and pointer-event pass-through.
- CSS SHA-256:
  `5662bcd04ec2983c7bc1d1f3fe962db54acdb8c5b2fa0c688b256583fb6004fd`.
- VSIX SHA-256:
  `313792a67512bfa64888d3665839a29a51a579b2aa73299f5070c77d7761d02f`.
- Packaged as a local 0.9.6 focus-roles preview. Existing installation-wide Aura
  CSS is backed up and replaced in its one owned style block; all other HTML,
  CSP and integrity-check code are unchanged. The old preview's extension
  directory was locked by its running VS Code process; same-version reinstall
  failed without completing. Installed and launched the corrected VSIX from
  fresh isolated user-data and extension directories, preserving old windows.
- A temporary preview extension raises a clearly labeled fictional notification
  and invokes VS Code's native focus-toasts command. Input focus is also available
  through `Aqua Preview: Show Focus Input`. This helper is not in the VSIX.
- The new native-host receipt confirms VS Code 1.139.1, Aura 0.9.6, Aqua Light,
  the exact CSS hash above, and successful invocation of focus-toasts. The
  new window is titled `Aura 0.9.6 — Focus Roles Preview (new)`. This confirms
  startup and payload selection, not pixel rendering or visual correctness.

**Coverage gap:** Computer Use still times out after resetting its session.
No new native screenshots or visual state matrix were captured. The user image
and installed VS Code styles informed the target, while automated checks verify
configuration and selector intent. They do not establish visual correctness.
Pending native review: focused/unfocused card, focus moving to its button,
keyboard icon focus, input validation, both Aqua appearances, Modern/classic UI,
and CSS-off behavior. Nothing was published or pushed in this iteration.

An attempted baseline file restore was rejected by automatic approval review
because it could overwrite unrelated changes. It was not executed. Corrections
were made with targeted patches; the earlier patch and review were preserved.

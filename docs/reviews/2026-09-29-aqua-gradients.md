# Aqua gradients: 0.9.0 local preview

Date: 2026-09-29. Baseline: Marketplace 0.8.0 and main commit
`b6c8ed285545d752953d0ba8edf725db2363109b`. Development branch:
`codex/aqua-gradient-enhancement`. Not published to Marketplace or GitHub.

## Design and resolved configuration

The user approved vivid claim-all-style primary buttons, restrained active
tabs, static effects and an optional switch. The current direction supersedes
the older Aqua Light citrus-edge choice. Aqua Lime Light intentionally derives
the same UI, so it receives the change too. The separate Lime pair does not.

Rebuilt the port and regenerated the complete resolved-theme sheet: nine
themes, 4,500 UI entries, 432 TextMate rules and 270 semantic entries. Compared
every generated payload with the accepted 0.8.0 baseline. Exactly nine UI keys
change in each Aqua Light appearance:

- `button.border`, `button.secondaryBorder`, `extensionButton.border`:
  `#E4EF82` to `#FFFFFF`.
- `activityBar.activeBorder`, `activityBarTop.activeBorder`,
  `panelTitle.activeBorder`, `tab.activeBorderTop`, `tab.selectedBorderTop`:
  `#E4EF82` to `#64EBAF`.
- `titleBar.border`: `#DCEAB0` to neutral `#E1E9ED`.

All TextMate/semantic syntax and terminal colors are unchanged. The other seven
theme payloads are byte-identical. Existing diff alpha layers, selections,
notification roles, search, Remote/SSH, diagnostics and disabled roles remain
unchanged. Exact hashes and changed keys are recorded in
[payload comparison](2026-09-29-aqua-gradients/payloads.json).

The CSS layer is separate from the native theme contract. It uses the resolved
button cyan and badge mint as endpoints; the tab overlays white at 79–68 percent
opacity to recede. Tab text and close actions use ordinary slate ink, while
diagnostic/SCM filename decorations retain their native rules. CSS selectors
are restricted to the two specific theme classes and the focused editor group.
The light controls preserve the user's deliberate white-on-color softness;
this does not establish AA small-text contrast.

## Runtime implementation

The local extension host contributes `aura.experimental.gradients` (machine
scope, default false), Apply and Status commands. It never patches installation
files directly. The user-enabled Custom CSS and JS Loader owns that operation.
The extension writes its own stable stylesheet in extension storage, edits only
its own import URL, and reads the workbench HTML to verify the installed bytes.
Other CSS/JS imports are preserved and reapplied by the loader. Workspace-level
imports are refused before invoking it.

First application explains the installation modification. Consent is associated
with the installation and other import URLs; subsequent toggles reapply without
another confirmation while those remain the same. The loader supplies the reload
prompt. Startup only inspects state; it does not silently modify the editor.
Status distinguishes the setting from installed CSS and never asserts that all
live windows have reloaded. Nonmodal notices do not block later commands.

Disabling neutralizes the generated file, removes its URL, and reapplies the
remaining imports. It does not uninstall the whole loader. Users should disable,
apply and reload before uninstalling Aura. Profiles cannot have independent
visual states because the loader modifies one shared installation. Manage the
enhancement from one local profile. CSS is scoped by theme even in other windows.

## Native inspection

Installed the actual local VSIX into an isolated profile and a disposable copy
of VS Code **1.131.0**, with the actual Marketplace Custom CSS and JS Loader
**7.5.1**. No personal profile, remote server or normal editor installation was
modified. The workspace contains only fictional reward/palette examples.

Observed in the running desktop editor:

- Actual Source Control primary buttons use the expected mint/cyan gradient
  with white text, a white rim and subtle shadow. Hover adds a light overlay.
- Keyboard navigation adds a clear 1px focus outline and a bounded 7px glow.
- Active tabs use the soft gradient with slate text and visible close actions.
  Earlier diagnostic filename color was retained rather than overridden.
- In a real split editor, the inactive group has no gradient and the active
  group retains it. The active close icon stays slate on its translucent hover
  background, with the tab gradient preserved underneath.
- Classic and Modern UI both render the tab gradient. Modern UI in this build
  suppresses the proposed tab inset shadow; the pastel fill still provides the
  intended quiet emphasis. No stronger border was added to compensate.
- Switching to Aura Dark removes gradient styling immediately; switching to
  Aqua Lime Light uses the shared enhancement.
- Toggling off after initial setup removes the installed stylesheet, and after
  the loader's reload action the actual button background image is `none`.
  Toggling back on and reloading restores the actual gradient.
- Disabled and secondary exclusion selectors were checked by temporarily
  setting their classes on native button elements. These are **DOM state
  probes**, not observations of complete native disabled/secondary workflows.
- VS Code displayed its installation-integrity warning after the real loader
  applied styles, as described in the setup notice. It was dismissed for clean
  screenshots; no checksum bypass or suppression was installed.

[Computed native states](2026-09-29-aqua-gradients/native-checks.json),
[enabled Modern](2026-09-29-aqua-gradients/enabled-modern.png),
[disabled Modern](2026-09-29-aqua-gradients/disabled-modern.png),
[keyboard focus](2026-09-29-aqua-gradients/focus-modern.png),
[enabled Classic](2026-09-29-aqua-gradients/enabled-classic.png),
[split-group close hover](2026-09-29-aqua-gradients/split-close-hover.png).

## Verification and conclusion

- 14 test suites, **257 tests passed**. Lifecycle tests cover default-off,
  missing loader, cancellation, repeated application, update recovery,
  preserving other imports, disable cleanup, failed loader postflight,
  workspace overrides and nonblocking notices.
- TypeScript and ESLint passed. The VSIX includes nine themes plus the runtime
  and CSS, README, changelog, logo and license material; no test harness or
  sample workspace is packaged.

The new distribution is more coherent with the user's references: mint and
cyan share the small action surfaces, yellow no longer outlines repeated light
controls, and the tab has less visual weight than the primary action. Native
on/off and theme isolation are verified on the stated Linux desktop version.

Coverage limits: no native Windows/macOS or Remote SSH run, no new exhaustive
diff/find/terminal/notification suite, no fresh full multi-language syntax
inspection, and no verification of every newer Modern UI selector. The native
sample covered TypeScript; unchanged syntax is supported by byte comparison.
Other primary-button implementations and extension update paths remain
supported by selectors/configuration tests or inspection,
not exhaustive native screenshots. The preview is suitable for user evaluation,
not a claim of complete cross-version visual approval.

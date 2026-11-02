# Zed 0.9.8 release candidate

Based on main `092620eb8f4eae5022c6b6602f4a066526d64755`. The earlier Zed design review is retained as historical provenance; this candidate integrates that port without the old Aqua branch changes.

- Full build, 19 suites / 324 tests, TypeScript, changed-source ESLint, and Zed contract validation passed.
- All nine Zed JSON payloads match the reviewed iteration byte-for-byte. Existing VS Code, Ghostty and Kitty color payloads match main byte-for-byte.
- Both resolved review sheets regenerated; no new visual design delta. Native Zed coverage remains open as documented in the original review.
- Zed and all four terminal ZIP bundles built. Tagged CI builds and attaches the VSIX and bundles.
- Chezmoi changes validated with 39 selections, three invalid selections, three platform archive installations and repeated apply. Fixed release URL and checksum must be refreshed from the published ZIP before dotfiles are pushed.

Publication order: push the integrated Aura commit, tag v0.9.8, verify GitHub release assets, pin the published Zed ZIP in dotfiles, rerun installation checks and push the dotfiles change.

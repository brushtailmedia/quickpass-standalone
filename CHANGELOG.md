# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [1.1.0] - 2026-11-13

Security and mobile-browser hardening.

### Added
- Content Security Policy meta tag (`default-src 'none'`), so the page can never make a network request even if edited later.
- Red "Always Clear Clipboard once done" status line while a copied password is outstanding.
- Editing any field after a copy clears the stale password from the clipboard; the form is kept so a mistyped site name can be fixed without retyping.
- Both "show" toggles turn off when the page is hidden (tab switch, app switch on a phone).
- "Change password output length:" heading above the length options in Extras, so the stacked mobile layout does not read as one group with "Allow all special characters".
- `scripts/vectors.test.mjs`: runs the inlined password core against the shared deterministic vectors (`node scripts/vectors.test.mjs`, no dependencies).

### Fixed
- Site name input no longer autocorrects, autocapitalizes or spellchecks on mobile keyboards, and is not restored by Firefox on reload (`autocomplete="off"`).
- Master password uses `autocomplete="current-password"` so mobile Safari stops offering "Use Strong Password".
- Mobile layout: 16 px inputs (no iOS zoom on focus), larger touch targets, safe-area insets, `100dvh`.

### Changed
- `SHA256SUMS.txt` and `SHA512SUMS.txt` regenerated for the new `index.html`.

## [1.0.0] - 2026-05-16

First public release.

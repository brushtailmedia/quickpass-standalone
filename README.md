# QuickPass — Standalone

A single-file, zero-dependency, fully offline, deterministic password generator. One HTML file — no server, no build step, no install, no database.

> Download pre-built file releases from **[Releases](https://github.com/brushtailmedia/quickpass-standalone/releases)**, or copy/download **[index.html](index.html)** directly — use the download raw file button (top right) to save it.

Desktop version: [brushtailmedia/quickpass-desktop](https://github.com/brushtailmedia/quickpass-desktop)
Mobile version: [brushtailmedia/quickpass-app](https://github.com/brushtailmedia/quickpass-app)

![QuickPass Standalone](docs/images/quickpass-standalone-main.webp)

## What It Is

QuickPass is a **deterministic password generator**. Given the same master password + site name, it always produces the same output. Nothing is stored anywhere — no database, no cloud, no local storage. The password is derived on the fly using BLAKE2S and SHA-256, entirely in your browser.

QuickPass originally started as a Python Tkinter desktop app. This version preserves the same core algorithm and deterministic output, rebuilt for the browser. The portable edition — packed into a single HTML file you can carry on a USB stick.

## How It Works

1. You enter a **site name** (e.g. `github`, `user@gmail.com`) and your **master password**.
2. The inputs are combined and run through multiple rounds of **BLAKE2S** hashing to expand the key.
3. The expanded key is hashed with **SHA-256** via the Web Crypto API.
4. The hash bytes are encoded into the final password using Base64, Base85, or a limited character set — depending on your special character preference.

Same inputs always produce the same password. Different inputs always produce a different password. Nothing is transmitted or saved.

## How to Use

1. Open `index.html` in any modern browser. That's it.
2. Enter a site name and your master password.
3. Click **Generate Password**.
4. Click **Copy to Clipboard**, use it, then click **Clear Clipboard**.

### Options (under Extras)

| Option | What It Does |
|---|---|
| **s/char** | Toggle special characters in the output (on by default) |
| **Allow all special characters** | Use the full Base85 symbol set instead of the limited safe set |
| **Character length** | Choose output length: 8, 10, 15, 20, 32, or 40 |
| **Version** | Changes the key expansion rounds — use it to rotate a password without changing your master password |

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge — anything from the last several years)
- That's it

No Node.js, no npm, no server, no internet connection.

## Security Model

- **Nothing leaves your machine.** No network requests, no analytics, no telemetry.
- **Nothing is stored.** No cookies, no localStorage, no sessionStorage, no IndexedDB.
- **Master password lives in memory only**, and only while the page is open.
- **Clipboard is cleared** by the Clear Clipboard button, by editing any field after a copy, or by the next copy. Closing the tab does not clear it, so a red "Always Clear Clipboard once done" line stays visible while a copied password is outstanding.
- **Both "show" toggles turn off** when the page is hidden (tab switch, or switching apps on a phone). The form is kept.
- **Content Security Policy** `default-src 'none'` is set in the page itself, so it cannot make a network request even if someone edits the file later.
- **All cryptography runs client-side** using the browser's built-in Web Crypto API (SHA-256) and a pure JavaScript BLAKE2S implementation.

### Testing

`index.html` has no build step, but its password core is checked against the same deterministic vectors as the desktop and mobile apps:

```bash
node scripts/vectors.test.mjs
```

### Clipboard on `file://` URLs

Browsers restrict the modern Clipboard API (`navigator.clipboard`) to secure contexts (HTTPS / localhost). When opened as a local file, the app falls back to the legacy `document.execCommand('copy')` method, which requires a direct user action (button click) to work. Functionally identical — copy and clear both work as expected.

### Known Risks

- **Clipboard exposure:** Other apps or OS clipboard history tools may retain copied passwords. Clear after use.
- **Device compromise:** Keyloggers, malware, or malicious browser extensions bypass any in-app protection.
- **Naming consistency:** The same site name must be entered every time. `github` and `GitHub` produce different passwords (the app lowercases automatically, but trailing spaces or alternate naming won't match).
- **File integrity:** If someone tampers with this file, the crypto could be altered silently. Verify the source if you didn't download it yourself:

```bash
shasum -a 256 -c SHA256SUMS.txt
```

## License

MIT. See [LICENSE](LICENSE).

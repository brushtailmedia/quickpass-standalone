// Runs the password core that is inlined in index.html against the same deterministic
// vectors used by quickpass-desktop and quickpass-app. No dependencies: `node scripts/vectors.test.mjs`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');

const scriptStart = html.indexOf('/* ── core.js (inlined) ── */');
const scriptEnd = html.indexOf('/* ── app.js (inlined) ── */');
assert.ok(scriptStart > 0 && scriptEnd > scriptStart, 'core.js markers not found in index.html');
const core = html.slice(scriptStart, scriptEnd);

const context = vm.createContext({ TextEncoder, crypto, btoa });
vm.runInContext(core, context, { filename: 'index.html#core' });
const passGen = vm.runInContext('passGen', context);

const vectors = [
  {
    input: ['mysupersecretpassword', 'github/work', 0, 20, 'V.1'],
    expected: 'LDXfdUT6X7Ucm8nEQEfg'
  },
  {
    input: ['mysupersecretpassword', 'github/work', 2, 20, 'V.1'],
    expected: 'S1)P&wtDCdXA#)_lNCy7'
  },
  {
    input: ['mysupersecretpassword', 'github/work', 1, 20, 'V.1'],
    expected: 'EH&SCMEYN~9Gl7hKu6$L'
  },
  {
    input: ['correct horse battery staple', 'user@example.com', 0, 32, 'V.15'],
    expected: 'PYjEXFCAfzLFl6FC7awpXIx913bTEXn7'
  },
  {
    input: ['correct horse battery staple', 'user@example.com', 2, 32, 'V.15'],
    expected: '98Sqe0ZYT=j%lyPq#X@Q7rTx7nb!FBY@'
  },
  {
    input: ['correct horse battery staple', 'user@example.com', 1, 32, 'V.15'],
    expected: 'J&43yP=J3j#h0N%@BArTjD6R3(-C?5I}'
  }
];

for (const { input, expected } of vectors) {
  const actual = await passGen(...input);
  assert.equal(actual, expected, `Vector mismatch for ${JSON.stringify(input)}`);
}

console.log('standalone vectors: ok');

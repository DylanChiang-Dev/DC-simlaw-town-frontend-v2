import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const authGateSource = readFileSync(join(root, 'src', 'components', 'AuthGate.tsx'), 'utf8');
const packageSource = readFileSync(join(root, 'package.json'), 'utf8');

assert.match(
  packageSource,
  /"test:auth-bootstrap":\s*"node tests\/auth-bootstrap-workspace\.test\.mjs"/,
  'package.json should expose a focused auth bootstrap regression test.',
);

assert.match(
  authGateSource,
  /await fetchCurrentUser\(\);[\s\S]*setUser\(authService\.getCurrentUser\(\)\);[\s\S]*setState\('authenticated'\);[\s\S]*if \(ensureWorkspace\)/,
  'AuthGate should authenticate the user before attempting workspace bootstrap.',
);

assert.match(
  authGateSource,
  /try \{[\s\S]*await ensureSandbox\(\);[\s\S]*\} catch \(err\) \{[\s\S]*console\.warn\('Failed to ensure sandbox after authentication:', err\);[\s\S]*\}/,
  'AuthGate should not turn a non-auth workspace bootstrap failure into a login bounce.',
);

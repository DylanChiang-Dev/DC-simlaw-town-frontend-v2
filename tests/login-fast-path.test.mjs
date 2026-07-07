import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), 'utf8');

const appSource = read('src/App.tsx');
const packageSource = read('package.json');

assert.match(
  packageSource,
  /"test:login-fast-path":\s*"node tests\/login-fast-path\.test\.mjs"/,
  'package.json should expose a focused login fast-path regression test.',
);

assert.match(
  appSource,
  /if \(!auth\.backendConfigured \|\| !auth\.user \|\| !runtime\.activeCaseId\) \{[\s\S]*getWebSocketService\(\)\.disconnect\(\);[\s\S]*return;[\s\S]*\}[\s\S]*void getWebSocketService\(\)\.connect\(\);/,
  'App should defer WebSocket connection until there is an active case.',
);

assert.match(
  appSource,
  /\}, \[auth\.backendConfigured, auth\.user, runtime\.activeCaseId, vnEventQueue\]\);/,
  'WebSocket effect should reconnect when the active case appears.',
);

assert.match(
  appSource,
  /const playerLawyerEnabled = Boolean\([\s\S]*runtime\.activeCaseId[\s\S]*runtime\.simulation\?\.simulationMode === 'plaintiff'[\s\S]*\);[\s\S]*usePlayerLawyerRuntime\(\s*playerLawyerEnabled,\s*runtime\.activeCaseId,\s*\)/,
  'Player-lawyer runtime should not call its backend endpoint before plaintiff-player mode is active.',
);

console.log('login-fast-path: all assertions passed');

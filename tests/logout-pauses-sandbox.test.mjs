import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const authGateSource = readFileSync(join(root, 'src', 'components', 'AuthGate.tsx'), 'utf8');

assert.match(
  authGateSource,
  /import \{ ensureSandbox, pauseSimulation \} from '\.\.\/services\/sandboxApi';/,
  'AuthGate should import pauseSimulation so logout can stop the current sandbox before clearing the auth token.',
);

assert.match(
  authGateSource,
  /import \{ getWebSocketService \} from '\.\.\/services\/webSocket';/,
  'AuthGate should notify the active WebSocket that logout is intentional before disconnecting.',
);

assert.match(
  authGateSource,
  /async function handleLogout\(\): Promise<void> \{[\s\S]*showLoggedOutLanding\(\);[\s\S]*getWebSocketService\(\)\.send\(\{ type: 'client_logout' \}\);[\s\S]*await withLogoutTimeout\(pauseSimulation\(\)\);[\s\S]*authService\.logout\(\);/,
  'Logout should switch to the landing page immediately, then pause the sandbox before authService.logout clears the bearer token.',
);

assert.match(
  authGateSource,
  /finally \{[\s\S]*authService\.logout\(\);[\s\S]*\}/,
  'Logout should always clear auth state even if the sandbox pause request fails or times out.',
);

assert.match(
  authGateSource,
  /const LOGOUT_PAUSE_TIMEOUT_MS = \d+;/,
  'Logout should cap how long sandbox pause can delay clearing auth state.',
);

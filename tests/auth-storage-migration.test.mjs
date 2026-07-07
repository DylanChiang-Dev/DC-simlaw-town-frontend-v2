import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const authSource = readFileSync(join(root, "src", "services", "auth.ts"), "utf8");
const packageSource = readFileSync(join(root, "package.json"), "utf8");

assert.match(
  packageSource,
  /"test:auth-storage":\s*"node tests\/auth-storage-migration\.test\.mjs"/,
  "package.json should expose a focused auth storage migration test script.",
);

assert.match(
  authSource,
  /AUTH_LOGOUT_EVENT = 'legalworld:auth-logout'/,
  "Auth logout events should use the legalworld namespace.",
);

assert.match(
  authSource,
  /ACCESS_TOKEN: 'legalworld_auth_access_token'/,
  "Auth access tokens should use the legalworld storage key.",
);

assert.match(
  authSource,
  /AUTH_USER: 'legalworld_auth_user'/,
  "Auth users should use the legalworld storage key.",
);

assert.match(
  authSource,
  /EXPIRES_AT: 'legalworld_auth_expires_at'/,
  "Auth expiry timestamps should use the legalworld storage key.",
);

assert.match(
  authSource,
  /const LEGACY_STORAGE_KEYS = \{[\s\S]*ACCESS_TOKEN: 'simlaw_auth_access_token'[\s\S]*AUTH_USER: 'simlaw_auth_user'[\s\S]*EXPIRES_AT: 'simlaw_auth_expires_at'[\s\S]*\}/,
  "Auth should retain the legacy simlaw storage keys for one-time migration.",
);

assert.match(
  authSource,
  /function migrateStorageValue\([\s\S]*localStorage\.getItem\(nextKey\)[\s\S]*localStorage\.getItem\(legacyKey\)[\s\S]*localStorage\.setItem\(nextKey, legacyValue\)[\s\S]*localStorage\.removeItem\(legacyKey\)/,
  "Auth should migrate legacy simlaw storage values into legalworld keys and clear the old entries.",
);

assert.match(
  authSource,
  /migrateStorageValue\(STORAGE_KEYS\.ACCESS_TOKEN, LEGACY_STORAGE_KEYS\.ACCESS_TOKEN\)[\s\S]*migrateStorageValue\(STORAGE_KEYS\.AUTH_USER, LEGACY_STORAGE_KEYS\.AUTH_USER\)[\s\S]*migrateStorageValue\(STORAGE_KEYS\.EXPIRES_AT, LEGACY_STORAGE_KEYS\.EXPIRES_AT\)/,
  "Auth session restoration should migrate token, user, and expiry values before reading the session.",
);

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), 'utf8');

const runtimeSource = read('src/state/useSimulationRuntime.ts');
const appSource = read('src/App.tsx');
const pickerSource = read('src/components/CasePicker.tsx');
const packageSource = read('package.json');
const refreshBody = runtimeSource.match(/const refresh = useCallback\(async \(\) => \{([\s\S]*?)\n  \}, \[enabled\]\);/)?.[1] || '';

assert.match(
  packageSource,
  /"test:case-list-lazy-load":\s*"node tests\/case-list-lazy-load\.test\.mjs"/,
  'package.json should expose a focused regression test for lazy case list loading.',
);

assert.match(
  refreshBody,
  /const nextSimulation = await fetchSimulationStatus\(\);[\s\S]*setSimulation\(nextSimulation\);/,
  'Initial runtime refresh should only fetch sandbox status.',
);

assert.doesNotMatch(
  refreshBody,
  /fetchSandboxCases\(\)/,
  'Initial runtime refresh should not block on the full case list.',
);

assert.match(
  runtimeSource,
  /casesLoading:\s*boolean/,
  'Runtime state should expose an independent casesLoading flag.',
);

assert.match(
  runtimeSource,
  /loadCases:\s*\(\) => Promise<void>/,
  'Runtime state should expose a lazy case loader.',
);

assert.match(
  appSource,
  /if \(entryView !== 'preset'\) return;[\s\S]*void runtime\.loadCases\(\);/,
  'App should load preset cases only when the preset picker is opened.',
);

assert.match(
  appSource,
  /if \(!casePickerOpen \|\| entryView !== 'landing'\) return;[\s\S]*window\.setTimeout\(\(\) => \{[\s\S]*void runtime\.loadCases\(\);[\s\S]*\}, 350\)/,
  'App should prewarm the case list shortly after the landing choice is visible.',
);

assert.match(
  appSource,
  /loading=\{runtime\.casesLoading \|\| runtime\.loading\}/,
  'CasePicker should show case-list loading separately from status loading.',
);

assert.match(
  pickerSource,
  /loading && !cases\.length[\s\S]*case-list-loading[\s\S]*正在读取案件索引/,
  'CasePicker should show an explicit loading prompt while the case list is warming up.',
);

assert.match(
  pickerSource,
  /decoding="async"[\s\S]*loading="lazy"/,
  'Case preview images should decode asynchronously and lazy-load to reduce docket jank.',
);

assert.match(
  appSource,
  /onRefresh=\{runtime\.loadCases\}/,
  'Refreshing cases should reload the lazy case list, not only the sandbox status.',
);

console.log('case-list-lazy-load: all assertions passed');

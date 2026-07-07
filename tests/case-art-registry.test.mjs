import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { getCaseArtProfile, registerResolvedCaseArt, resolvePortraitForKey, CASE_ART_PROFILES } =
  await import(join(root, 'src', 'data', 'caseArt.ts'));

assert.equal(getCaseArtProfile('case_150').caseId, 'default');

registerResolvedCaseArt([{
  ...getCaseArtProfile('nonexistent'),
  caseId: 'case_150',
  plaintiffPortrait: '/art/vn/char-pool-org-construction.png',
  caseCg: '/art/vn/cg-category-construction.png',
}]);
assert.equal(getCaseArtProfile('case_150').caseCg, '/art/vn/cg-category-construction.png');

registerResolvedCaseArt([{ ...CASE_ART_PROFILES.case_1, caseCg: '/art/vn/cg-category-loan-contract.png' }]);
assert.equal(getCaseArtProfile('case_1').caseCg, '/art/vn/cg-case1-hair-salon-rent-evidence.png');

assert.equal(
  resolvePortraitForKey('case_150', 'client', '/fallback.png'),
  '/art/vn/char-pool-org-construction.png',
);
assert.equal(resolvePortraitForKey('case_999', 'client', '/fallback.png'), '/fallback.png');
assert.equal(resolvePortraitForKey(undefined, 'client', '/fallback.png'), '/fallback.png');

const api = readFileSync(join(root, 'src', 'services', 'sandboxApi.ts'), 'utf8');
assert.match(api, /registerResolvedCaseArt\(/, 'fetchSandboxCases 必须注册解析结果');
const stage = readFileSync(join(root, 'src', 'components', 'VisualNovelStage.tsx'), 'utf8');
assert.match(stage, /resolvePortraitForKey\(/, 'VN 舞台必须走 portrait 覆盖查找');

console.log('case-art-registry: all assertions passed');

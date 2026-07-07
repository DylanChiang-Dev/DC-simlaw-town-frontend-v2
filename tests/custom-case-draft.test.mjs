import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(root, p), 'utf8');

assert.equal(existsSync(join(root, 'src/services/customCaseApi.ts')), true,
  'customCaseApi service 应存在');
assert.equal(existsSync(join(root, 'src/components/CaseConstructionWizard.tsx')), true,
  'CaseConstructionWizard 组件应存在');

const api = read('src/services/customCaseApi.ts');
for (const marker of [
  'CustomCaseDraftStatus',
  'CustomCaseDraft',
  'fetchCustomCaseDraft',
  'saveCustomCaseDraft',
  'clearCustomCaseDraft',
  '/api/sandbox/custom-cases/draft',
  'source_text',
  'extracted_info',
  'case_id',
]) {
  assert.match(api, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `service 应包含 ${marker}`);
}

const wizard = read('src/components/CaseConstructionWizard.tsx');
for (const marker of [
  'fetchCustomCaseDraft',
  'saveCustomCaseDraft',
  'clearCustomCaseDraft',
  '已恢复上次草稿',
  '已恢复上次构造结果',
  '上次已保存为',
  '清空草稿',
  '上次构造请求可能已中断',
]) {
  assert.match(wizard, new RegExp(marker), `wizard 应包含 ${marker}`);
}

assert.match(wizard, /setTimeout\([\s\S]*saveCustomCaseDraft/,
  'wizard 应使用防抖自动保存草稿');

const styles = read('src/styles.css');
for (const className of [
  'wizard-draft-status',
  'wizard-draft-actions',
]) {
  assert.match(styles, new RegExp(`\\.${className}\\b`), `${className} 应有 CSS 样式`);
}

console.log('custom-case-draft tests passed');

import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(root, p), 'utf8');

const picker = read('src/components/CasePicker.tsx');

// 1) 两步状态机
assert.match(picker, /useState<'case' \| 'mode'>/, 'CasePicker 应有 case/mode 两步状态');

// 2) 两个模式选项文案
assert.match(picker, /自动模拟/, '应提供「自动模拟」选项');
assert.match(picker, /扮演原告律师/, '应提供「扮演原告律师」选项');

// 3) onStart 收 (caseId, mode) 两参
assert.match(
  picker,
  /onStart:\s*\(caseId:\s*string,\s*mode:\s*SimulationMode\)\s*=>\s*Promise<void>/,
  'onStart 回调应接收 caseId 与 mode',
);
assert.match(picker, /onStart\(selectedCaseId,\s*chosenMode\)/, '确认开始应调用 onStart(caseId, mode)');

// 4) 未选模式时确认按钮禁用
assert.match(picker, /disabled=\{disabled \|\| loading \|\| !chosenMode\}/, '未选模式时确认按钮应禁用');

// 5) 返回选案件
assert.match(picker, /setStep\('case'\)/, '应能从模式步返回选案件步');

// 6) 模式步样式类必须有对应 CSS，避免裸 DOM
const styles = read('src/styles.css');
for (const className of ['case-picker-mode', 'mode-option-list', 'mode-option-card']) {
  assert.ok(styles.includes(className), `styles.css 应包含 .${className} 样式`);
}

console.log('case-picker-mode: all assertions passed');

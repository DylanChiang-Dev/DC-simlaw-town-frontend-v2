import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(root, p), 'utf8');

const picker = read('src/components/CasePicker.tsx');

// 1) 案由与难度两个筛选状态
assert.match(picker, /const \[causeFilter, setCauseFilter\] = useState\(''\)/, '应有案由筛选状态');
assert.match(picker, /const \[difficultyFilter, setDifficultyFilter\] = useState\(''\)/, '应有难度筛选状态');

// 2) 案由选项由案件列表派生，不写死
assert.match(picker, /const causeOptions = useMemo/, '案由选项应从 cases 派生');
assert.match(picker, /const difficultyOptions = useMemo/, '难度选项应从 cases 派生');
assert.ok(!picker.includes("['民间借贷纠纷'"), '案由清单不应硬编码');

// 3) 卡片渲染使用筛选后的列表
assert.match(picker, /filteredCases\.map\(/, '案件卡片应渲染 filteredCases');

// 4) 筛选控件文案
assert.match(picker, /全部案由/, '案由下拉应有「全部案由」');
assert.match(picker, /全部难度/, '难度 chips 应有「全部难度」');
assert.match(picker, /共 \{filteredCases\.length\} 件/, '应显示筛选后案件数量');

// 5) 筛选后空结果提示（区别于无案件）
assert.match(picker, /没有符合当前筛选条件的案件/, '筛选空结果应有独立提示');

// 6) 样式类必须有对应 CSS
const styles = read('src/styles.css');
for (const className of ['case-filter-bar', 'case-filter-select', 'case-filter-chip', 'case-filter-count']) {
  assert.ok(styles.includes(className), `styles.css 应包含 .${className} 样式`);
}

// 7) 案件列表限高滚动，容纳 100+ 案
const caseListBlock = styles.slice(styles.indexOf('.case-list {'), styles.indexOf('.case-card {'));
assert.match(caseListBlock, /max-height/, '.case-list 应限高');
assert.match(caseListBlock, /overflow-y:\s*auto/, '.case-list 应可滚动');

console.log('case-picker-filter: all assertions passed');

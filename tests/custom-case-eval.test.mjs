import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(root, p), 'utf8');

assert.equal(existsSync(join(root, 'src/components/CaseEvalReport.tsx')), true,
  'CaseEvalReport 组件应存在');

const api = read('src/services/customCaseApi.ts');
assert.match(api, /\/evaluate/, 'service 应有 evaluate 调用');
assert.match(api, /\/jobs\/\$\{jobId\}/, 'service 应轮询 job 状态');
assert.match(api, /\/report/, 'service 应有 report 调用');
assert.match(api, /listEvalJobs/, 'service 应提供跑分记录列表接口');
assert.match(api, /\/api\/sandbox\/custom-cases\/jobs/, 'service 应调用 jobs 列表路由');
assert.match(api, /progress_percent/, 'service 应读取后端跑分进度百分比');
assert.match(api, /stage/, 'service 应读取当前跑分阶段代码');

const report = read('src/components/CaseEvalReport.tsx');
assert.match(report, /listEvalJobs/, '报告组件打开时应先查询已有任务');
assert.match(report, /ACTIVE_STATUSES/, '报告组件应识别可接续的运行中任务');
assert.match(report, /setTimeout\(poll/, '应做轮询');
assert.match(report, /数十分钟/, '应提示耗时');
assert.match(report, /eval-estimated-progress/, '应显示跑分预计进度条');
assert.match(report, /eval-progress-steps/, '应显示跑分阶段列表');
assert.match(report, /可关闭页面|刷新或关闭都不会中断/, '应提示用户可以关闭页面稍后回来');
assert.match(report, /interrupted/, '应支持后端重启导致的 interrupted 状态');
assert.match(report, /评测指标|报告整理/, '应展示评测和报告整理阶段');

assert.equal(existsSync(join(root, 'src/components/CustomEvalHistory.tsx')), true,
  'CustomEvalHistory 组件应存在');
const history = read('src/components/CustomEvalHistory.tsx');
assert.match(history, /跑分记录/, '历史组件应显示跑分记录标题');
assert.match(history, /查看报告|查看进度/, '历史组件应提供查看报告或进度入口');

console.log('custom-case-eval tests passed');

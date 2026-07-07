import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(root, p), 'utf8');

// 1) 组件与 service 存在
assert.equal(existsSync(join(root, 'src/components/CaseConstructionWizard.tsx')), true,
  'CaseConstructionWizard 组件应存在');
assert.equal(existsSync(join(root, 'src/services/customCaseApi.ts')), true,
  'customCaseApi service 应存在');

// 2) service 调用了正确的后端路由
const api = read('src/services/customCaseApi.ts');
assert.match(api, /\/api\/sandbox\/custom-cases\/build/, 'service 应调用 build 路由');
assert.match(api, /\/api\/sandbox\/custom-cases\/confirm/, 'service 应调用 confirm 路由');
assert.match(api, /listCustomCases/, 'service 应提供已构造案件列表接口');
assert.match(api, /\/api\/sandbox\/custom-cases['"`]/, 'service 应调用自定义案件列表路由');
assert.match(api, /deleteCustomCase/, 'service 应提供删除已构造案件接口');
assert.match(api, /method:\s*'DELETE'/, '删除已构造案件应调用 DELETE 方法');
assert.match(api, /listEvalJobs/, 'service 应提供跑分任务历史列表接口');

// 3) 上传步含纯文本说明
const wizard = read('src/components/CaseConstructionWizard.tsx');
const casePicker = read('src/components/CasePicker.tsx');
const customCaseList = read('src/components/CustomCaseList.tsx');
const evalReport = read('src/components/CaseEvalReport.tsx');
const markdownText = read('src/components/MarkdownText.tsx');
assert.match(wizard, /纯文本/, '上传步应包含纯文本说明文案');
assert.match(casePicker, />\s*上传文书构造案件\s*</,
  '案件选择器应使用纯文本显示上传文书构造案件入口');
assert.doesNotMatch(casePicker, /➕/,
  '上传文书构造案件入口不应使用表情字符');

// 4) 新弹窗类名必须有对应样式，避免裸 DOM 落到生产界面
const styles = read('src/styles.css');
for (const className of [
  'case-construction-wizard',
  'case-eval-report',
  'custom-eval-history',
  'custom-eval-history-table',
  'wizard-header',
  'wizard-upload',
  'wizard-building',
  'wizard-preview',
  'wizard-done',
  'wizard-actions',
  'wizard-error',
  'wizard-hint',
  'eval-progress',
  'eval-markdown',
  'custom-case-entry-action',
  'wizard-progress-steps',
  'wizard-elapsed-time',
  'wizard-refresh-note',
  'wizard-timeout-note',
  'wizard-estimated-progress',
  'wizard-estimated-progress-bar',
  'wizard-estimated-progress-meta',
  'wizard-guide',
  'wizard-guide-section',
]) {
  assert.match(styles, new RegExp(`\\.${className}\\b`), `${className} 应有 CSS 样式`);
}

// 5) App 离线门禁：离线时案件入口整体不可用
const app = read('src/App.tsx');
assert.match(app, /auth\.backendConfigured[\s\S]*auth\.user[\s\S]*runtime\.simulation\?\.canStart[\s\S]*!runtime\.activeCaseId/,
  'App 应在离线或未登录时隐藏案件入口');

// 6) 自定义案件向导必须在自定义案件列表流程中可见并可交互
assert.match(app, /entryView === 'custom'[\s\S]*<CustomCaseList/,
  'App 应通过自定义案件列表承载上传文书构造案件流程');
assert.match(customCaseList, /wizardOpen[\s\S]*<CaseConstructionWizard/,
  '自定义案件列表应在点击上传新文书后打开构造向导');
assert.match(customCaseList, /onConfirmed=\{\(caseId\) => \{[\s\S]*void loadCases\(\);[\s\S]*setSelectedId\(caseId\);/,
  '保存自定义案件后应刷新列表并选中新案件');

// 7) 构造阶段必须给用户可感知的等待态，避免模型慢时像卡死
assert.match(wizard, /buildElapsedSeconds[\s\S]*setInterval/,
  '构造阶段应显示已等待时间，并持续刷新等待状态');
assert.match(wizard, /wizard-progress-steps/,
  '构造阶段应显示步骤进度容器');
assert.match(wizard, /抽取案情[\s\S]*人格画像[\s\S]*咨询问题/s,
  '构造阶段应显示抽取案情、人格画像、咨询问题等步骤');
assert.match(wizard, /请勿刷新|刷新会中断/,
  '构造阶段应明确提示刷新会中断本次构造请求');
assert.match(wizard, /仍在等待模型返回|精简文本重试/,
  '构造阶段等待过久时应提示模型仍在处理并给出重试建议');
assert.match(wizard, /ESTIMATED_BUILD_SECONDS/,
  '构造阶段应使用基于历史耗时的预估秒数计算预计进度');
assert.match(wizard, /wizard-estimated-progress/,
  '构造阶段应显示预计进度条');
assert.match(wizard, /预计进度/,
  '预计进度条应明确标注为预计，避免被理解为真实模型进度');
assert.match(wizard, /超过常规时长/,
  '超过预估耗时后应提示已经超过常规时长');
assert.match(wizard, /跑分记录/,
  '保存案件后应提供跑分记录入口');
assert.match(wizard, /custom-case-existing-heading[\s\S]*setShowHistory\(true\)[\s\S]*跑分记录/,
  '上传页初始态也应在已构造案件区域提供跑分记录入口');
assert.match(wizard, /CustomEvalHistory/,
  '向导应接入跑分记录组件');
assert.match(wizard, /listCustomCases/,
  '向导打开时应加载当前账号已构造案件');
assert.match(wizard, /listEvalJobs/,
  '向导打开时应同时加载跑分历史，用于区分查看报告、查看进度和开始跑分');
assert.match(wizard, /getEvalActionLabel[\s\S]*查看报告[\s\S]*查看进度[\s\S]*开始跑分/,
  '已构造案件按钮应根据历史跑分任务显示查看报告、查看进度或开始跑分');
assert.match(wizard, /已构造案件/,
  '上传页应显示已构造案件区域');
assert.match(wizard, /开始跑分/,
  '已构造案件应提供直接开始跑分入口');
assert.match(wizard, /deleteCustomCase/,
  '向导应调用删除接口清理重复构造案件');
assert.match(wizard, /确认删除/,
  '删除已构造案件前应向用户确认');
assert.match(wizard, /删除/,
  '已构造案件卡片应提供删除操作');
assert.match(wizard, /showEval[\s\S]*<CaseEvalReport[\s\S]*variant="inline"[\s\S]*UPLOAD_HINT/,
  '上传页内联跑分报告应显示在上传说明之前，避免落到 textarea 下方');
assert.doesNotMatch(wizard, /showEval[\s\S]*selectedEvalCaseId[\s\S]*<CaseEvalReport caseId=\{selectedEvalCaseId\} onClose=\{onClose\}/,
  '跑分报告不应作为构造向导底部的完整嵌套弹窗渲染');

// 8) 跑分报告 Markdown 应渲染为结构化内容，阶段分数表不能以原始管道文本展示
assert.match(evalReport, /variant\?:\s*'dialog'\s*\|\s*'inline'/,
  '跑分报告组件应支持内联展示模式');
assert.match(evalReport, /case-eval-report \$\{variant\}/,
  '跑分报告应把展示模式写入 className 供 CSS 区分');
assert.match(evalReport, /import \{ MarkdownText \} from '\.\/MarkdownText';/,
  '跑分报告应复用 MarkdownText 渲染 Markdown 内容');
assert.match(evalReport, /<MarkdownText[\s\S]*className="eval-markdown"[\s\S]*text=\{markdown\}/,
  '跑分报告应把报告 Markdown 交给 MarkdownText 渲染');
assert.doesNotMatch(evalReport, /<pre className="eval-markdown">/,
  '跑分报告不应再用 pre 原样显示 Markdown');
assert.match(markdownText, /type:\s*'table'/,
  'MarkdownText 应支持 Markdown 表格块');
assert.match(markdownText, /<table/,
  'MarkdownText 应把 Markdown 表格渲染为 table 元素');
assert.match(styles, /\.markdown-text table\b[\s\S]*border-collapse:\s*collapse/,
  'Markdown 表格应有独立 table 样式');
assert.match(styles, /\.markdown-text th\b[\s\S]*\.markdown-text td\b/s,
  'Markdown 表头和单元格应有样式，保证跑分报告表格可读');
assert.match(styles, /\.case-eval-report\.inline\b[\s\S]*box-shadow:\s*none/,
  '内联跑分报告应取消完整弹窗阴影，避免在构造弹窗内重叠');

console.log('custom-case-wizard tests passed');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appSource = readFileSync(join(root, 'src', 'App.tsx'), 'utf8');
const queueSource = readFileSync(join(root, 'src', 'state', 'vnEventQueue.ts'), 'utf8');
const vnReducerSource = readFileSync(join(root, 'src', 'state', 'vnEventReducer.ts'), 'utf8');
const dialogSource = readFileSync(join(root, 'src', 'components', 'PretrialMediationDialog.tsx'), 'utf8');
const stylesSource = readFileSync(join(root, 'src', 'styles.css'), 'utf8');
const demoCasesSource = readFileSync(join(root, 'src', 'demo', 'demoCases.ts'), 'utf8');
const demoFixturesSource = readFileSync(join(root, 'src', 'recording', 'frontendDemoFixtures.ts'), 'utf8');

// --- vnEventQueue：pause/resume 能力 ---

assert.match(
  queueSource,
  /pause: \(\) => void;[\s\S]*resume: \(\) => void;/,
  'vnEventQueue should expose pause/resume so the story stream can wait for player input.',
);

assert.match(
  queueSource,
  /const drain = \(\): void => \{\s*if \(paused\) return;/,
  'drain should stop dispatching while the queue is paused.',
);

assert.match(
  queueSource,
  /timerId = null;\s*if \(paused\) return;/,
  'A pending delayed event should stay queued when pause happens during its timer.',
);

assert.match(
  queueSource,
  /resume: \(\): void => \{\s*paused = false;\s*drain\(\);/,
  'resume should clear the paused flag and immediately drain queued events.',
);

assert.match(
  queueSource,
  /queue = \[\];\s*paused = false;/,
  'clear should reset the paused flag so a restarted simulation never inherits a stuck queue.',
);

// --- reducer：调解文案与结果分支 ---

assert.match(
  vnReducerSource,
  /export const PRETRIAL_MEDIATION_PROMPT = '开庭前，法庭依法组织双方进行庭前调解。是否接受调解？';/,
  'The mediation prompt copy should be exported for the dialog component.',
);

assert.match(
  vnReducerSource,
  /PRETRIAL_MEDIATION_ACCEPTED_TEXT =\s*'你方表示愿意接受调解，但对方当事人明确拒绝，双方未能达成一致。调解不成立，案件转入一审庭审。';/,
  'Accepting mediation should still end with the fixed failed-mediation outcome.',
);

assert.match(
  vnReducerSource,
  /PRETRIAL_MEDIATION_REFUSED_TEXT =\s*'你方拒绝调解，对方当事人亦无调解意愿。调解不成立，案件转入一审庭审。';/,
  'Refusing mediation should also end with the fixed failed-mediation outcome.',
);

assert.match(
  vnReducerSource,
  /export function hasPretrialMediationRecord\(history: DialogueHistoryEntry\[\]\): boolean \{[\s\S]*entry\.kind === 'system'[\s\S]*PRETRIAL_MEDIATION_ACCEPTED_TEXT \|\| entry\.text === PRETRIAL_MEDIATION_REFUSED_TEXT/,
  'Mediation dedupe should scan the whole history because appendHistory only skips adjacent duplicates.',
);

assert.match(
  vnReducerSource,
  /\| \{ type: 'pretrial-mediation-result'; payload: \{ accepted: boolean \} \}/,
  'The VN event union should include the mediation result event.',
);

assert.match(
  vnReducerSource,
  /case 'pretrial-mediation-result':\s*return applyPretrialMediationResult\(state, event\.payload\.accepted\);/,
  'The reducer should route mediation results to a dedicated handler.',
);

assert.match(
  vnReducerSource,
  /function applyPretrialMediationResult\(state: VnRuntimeState, accepted: boolean\): VnRuntimeState \{[\s\S]*if \(hasPretrialMediationRecord\(state\.history\)\) \{\s*return state;\s*\}[\s\S]*accepted \? PRETRIAL_MEDIATION_ACCEPTED_TEXT : PRETRIAL_MEDIATION_REFUSED_TEXT;[\s\S]*appendSystemLine\(state, text, 'CI'\)/,
  'The mediation narration should be deduped and recorded as a CI-stage system line.',
);

// --- App 接线：暂停队列等待玩家点选，选择后先旁白再放行 ---

assert.match(
  appSource,
  /getCaseEventName\(payload \|\| \{\}\) === 'ENTER_TRIAL_FIRST_INSTANCE'[\s\S]*if \(!hasPretrialMediationRecord\(vnHistoryRef\.current\)\) \{\s*vnEventQueue\.pause\(\);\s*setMediationPromptOpen\(true\);\s*\}\s*vnEventQueue\.enqueue\(\[\{ event: \{ type: 'case-state-change', payload \} \}\]\);\s*return;/,
  'ENTER_TRIAL_FIRST_INSTANCE should pause the queue and open the mediation prompt before the court-opening line is dispatched.',
);

assert.match(
  appSource,
  /function handleMediationChoice\(accepted: boolean\): void \{\s*setMediationPromptOpen\(false\);[\s\S]*dispatchVnEvent\(\{ type: 'pretrial-mediation-result', payload: \{ accepted \} \}\);\s*vnEventQueue\.resume\(\);/,
  'The choice handler should append the mediation narration synchronously before resuming the queue, so it lands ahead of the court-opening line.',
);

assert.match(
  appSource,
  /\{mediationPromptOpen && <PretrialMediationDialog onChoose=\{handleMediationChoice\} \/>\}/,
  'App should render the mediation dialog while the prompt is open.',
);

assert.match(
  appSource,
  /caseClosed \|\| runtime\.error \|\| runtime\.simulation\?\.paused \|\| playerDialogOpen \|\| mediationPromptOpen/,
  'Auto-next should not advance the story while the mediation prompt is open.',
);

const startCleanup = appSource.match(/async function handleStartSelectedCase[\s\S]*?await runtime\.startSelectedCase/);
assert.ok(
  startCleanup && startCleanup[0].includes('setMediationPromptOpen(false)'),
  'Starting a case should close any stale mediation prompt.',
);

const restartCleanup = appSource.match(/async function handleRestartSimulation[\s\S]*?await runtime\.restart/);
assert.ok(
  restartCleanup && restartCleanup[0].includes('setMediationPromptOpen(false)'),
  'Restarting the simulation should close any stale mediation prompt.',
);

// --- 选择框组件：必须二选一，无遮罩关闭 ---

assert.match(
  dialogSource,
  /role="dialog" aria-modal="true" aria-labelledby="pretrial-mediation-title"/,
  'The mediation dialog should be an accessible modal.',
);

assert.match(
  dialogSource,
  /onChoose\(false\)[\s\S]*拒绝调解[\s\S]*onChoose\(true\)[\s\S]*接受调解/,
  'Both choices should route through the same onChoose callback with the accepted flag.',
);

assert.doesNotMatch(
  dialogSource,
  /onClose|onClick=\{[^}]*\}[^>]*className="modal-layer"/,
  'The mediation dialog must not offer a dismiss path other than the two choices, otherwise the paused queue would stall.',
);

// --- 样式：过渡感 + reduced-motion ---

assert.match(
  stylesSource,
  /\.mediation-dialog \{[\s\S]*animation: mediationDialogFadeIn/,
  'The mediation dialog should fade in as a stage transition.',
);

assert.match(
  stylesSource,
  /@media \(prefers-reduced-motion: reduce\) \{\s*\.mediation-dialog \{\s*animation: none;/,
  'Reduced-motion users should get the dialog without the entrance animation.',
);

// --- demo fixtures：调解旁白位于开庭行之前 ---

const demoCaseMediationIndex = demoCasesSource.indexOf('PRETRIAL_MEDIATION_REFUSED_TEXT }');
const demoCaseOpeningIndex = demoCasesSource.indexOf("text: '一审正式开庭。'");
assert.ok(
  demoCaseMediationIndex > 0 && demoCaseOpeningIndex > demoCaseMediationIndex,
  'demoCases should record the mediation narration before the court-opening line.',
);

const fixtureMediationIndex = demoFixturesSource.indexOf("systemEntry('demo-court-mediation', 'CI', '一审庭审', PRETRIAL_MEDIATION_REFUSED_TEXT)");
const fixtureOpeningIndex = demoFixturesSource.indexOf("systemEntry('demo-court-start', 'CI', '一审庭审', '一审正式开庭。')");
assert.ok(
  fixtureMediationIndex > 0 && fixtureOpeningIndex > fixtureMediationIndex,
  'frontendDemoFixtures should record the mediation narration before the court-opening line.',
);

console.log('pretrial-mediation tests passed');

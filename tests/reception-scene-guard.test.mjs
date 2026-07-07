import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const reducerSource = readFileSync(join(root, 'src', 'state', 'vnEventReducer.ts'), 'utf8');
const appSource = readFileSync(join(root, 'src', 'App.tsx'), 'utf8');

assert.match(
  reducerSource,
  /const ENTRY_FLOW_STAGES = new Set\(\['SYSTEM', 'RECEPTION', 'LC'\]\);/,
  'The reducer should define the entry-flow stages during which reception scenes are allowed.',
);

assert.match(
  reducerSource,
  /function applyDialogueUpdate[\s\S]*?if \(isTownAgentDialoguePayload\(payload\) && !isEntryFlowStage\(state\.scene\.stageCode\)\) \{[\s\S]*?return state;[\s\S]*?\}/,
  'Town NPC ambient dialogues (agent_update_dialogue) must be dropped from the main story once the case has left the entry flow, so trials are not hijacked by the reception desk.',
);

assert.match(
  reducerSource,
  /const stageCode = !explicitStageCode && isEntryFlowStage\(fallbackStageCode\) && isReceptionPayload\(payload, text\)/,
  'The RECEPTION stage text heuristic must only apply while the case is still in the entry flow, so trial lines mentioning 推荐律师/分配给 cannot switch the background to the reception desk.',
);

assert.match(
  reducerSource,
  /if \(stageCode === 'RECEPTION' \|\| \(isEntryFlowStage\(stageCode\) && isReceptionPayload\(payload, text\)\)\) \{[\s\S]*?return 'receptionist';/,
  'Speaker inference should only fall back to the receptionist during entry-flow stages.',
);

assert.match(
  reducerSource,
  /if \(speaker === 'receptionist' \|\| \(isEntryFlowStage\(stageCode\) && isReceptionRecommendationText\(text\)\)\) \{[\s\S]*?return '律所前台';/,
  'The 律所前台 speaker label must not be forced onto court dialogue just because the text mentions a lawyer recommendation.',
);

assert.match(
  appSource,
  /if \(String\(payload\?\.type \|\| ''\) !== 'agent_update_dialogue'\) \{\s*setDialogueGate\(null\);\s*\}/,
  'Town NPC ambient dialogues must not clear the pending dialogue gate of the active case flow.',
);

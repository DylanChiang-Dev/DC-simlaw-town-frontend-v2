import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const resolver = await import(join(root, 'src', 'data', 'caseArtResolver.ts'));
const { resolvePartyPortrait, resolveCategoryCg, resolveCaseArtProfile, stablePick } = resolver;

const person = (over = {}) => ({ partyType: '自然人', gender: '男', birthYear: 1985, hasRepresentative: false, ...over });

assert.match(resolvePartyPortrait(person(), 'plaintiff', '合同纠纷', 'case_101'), /char-pool-male-/);
assert.match(resolvePartyPortrait(person({ gender: '女' }), 'plaintiff', '合同纠纷', 'case_101'), /char-pool-female-/);

const org = person({ partyType: '法人', gender: '', birthYear: null, hasRepresentative: true });
assert.match(resolvePartyPortrait(org, 'plaintiff', '合同纠纷', 'case_102'), /char-pool-org-business-neutral/);
assert.match(resolvePartyPortrait(org, 'defendant', '合同纠纷', 'case_102'), /char-pool-org-business-defensive/);
assert.match(resolvePartyPortrait(org, 'defendant', '建设工程施工合同纠纷', 'case_150'), /char-pool-org-construction/);
assert.match(resolvePartyPortrait(org, 'plaintiff', '劳动争议', 'case_103'), /char-pool-org-hr-labor/);

assert.match(resolvePartyPortrait(person({ birthYear: 1995 }), 'plaintiff', '合同纠纷', 'x'), /-young-|male-middle-/);
assert.match(resolvePartyPortrait(person({ birthYear: 1955 }), 'plaintiff', '生命权、健康权、身体权纠纷', 'x'), /-senior-/);

assert.match(resolvePartyPortrait(person({ birthYear: 1985 }), 'plaintiff', '提供劳务者受害责任纠纷', 'x'), /anxious|worried|neutral/);
assert.match(resolvePartyPortrait(person({ birthYear: 1985 }), 'defendant', '民间借贷纠纷', 'x'), /defensive|neutral/);

const unknown = { partyType: '', gender: '', birthYear: null, hasRepresentative: false };
const first = resolvePartyPortrait(unknown, 'plaintiff', '', 'case_777');
assert.match(first, /char-pool-neutral-/);
assert.equal(resolvePartyPortrait(unknown, 'plaintiff', '', 'case_777'), first, '同输入必须稳定');

assert.match(resolveCategoryCg('机动车交通事故责任纠纷'), /cg-category-traffic-accident/);
assert.match(resolveCategoryCg('从未见过的案由'), /cg-category-neighborhood-property/);

const items = ['a', 'b', 'c'];
assert.equal(stablePick(items, 'case_1:plaintiff'), stablePick(items, 'case_1:plaintiff'));

const summary = {
  caseId: 'case_150',
  title: '',
  plaintiffName: '',
  defendantName: '',
  rawCaseCause: '建设工程施工合同纠纷',
  trainingCategory: '',
  difficulty: '',
  status: 'idle',
  isCustom: false,
  plaintiffArt: org,
  defendantArt: org,
};
const profile = resolveCaseArtProfile(summary);
assert.equal(profile.caseId, 'case_150');
assert.equal(profile.plaintiffKey, 'client');
assert.equal(profile.defendantKey, 'defendant');
assert.match(profile.caseCg, /cg-category-construction/);
assert.match(profile.plaintiffLawyerPortrait, /char-player-lawyer-neutral/);

console.log('case-art-resolver: all assertions passed');

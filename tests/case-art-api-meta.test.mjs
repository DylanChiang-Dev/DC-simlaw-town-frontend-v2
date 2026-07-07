import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { mapPartyArtMeta } = await import(join(root, 'src', 'services', 'partyArtMeta.ts'));

assert.deepEqual(
  mapPartyArtMeta({ party_type: '法人', gender: '', birth_year: null, has_representative: true }),
  { partyType: '法人', gender: '', birthYear: null, hasRepresentative: true },
);
assert.equal(mapPartyArtMeta({ birth_year: 1975 }).birthYear, 1975);

assert.deepEqual(
  mapPartyArtMeta(undefined),
  { partyType: '', gender: '', birthYear: null, hasRepresentative: false },
);

const api = readFileSync(join(root, 'src', 'services', 'sandboxApi.ts'), 'utf8');
assert.match(api, /plaintiffArt:\s*mapPartyArtMeta\(payload\.plaintiff_art\)/, '条目映射需填 plaintiffArt');
assert.match(api, /defendantArt:\s*mapPartyArtMeta\(payload\.defendant_art\)/, '条目映射需填 defendantArt');

console.log('case-art-api-meta: all assertions passed');

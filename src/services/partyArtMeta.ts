import type { PartyArtMeta } from './types';

export type PartyArtMetaResponse = {
  party_type?: string;
  gender?: string;
  birth_year?: number | null;
  has_representative?: boolean;
};

export function mapPartyArtMeta(payload?: PartyArtMetaResponse): PartyArtMeta {
  return {
    partyType: String(payload?.party_type || '').trim(),
    gender: String(payload?.gender || '').trim(),
    birthYear: typeof payload?.birth_year === 'number' ? payload.birth_year : null,
    hasRepresentative: Boolean(payload?.has_representative),
  };
}

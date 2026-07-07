import {
  CATEGORY_CGS,
  CG_BY_CAUSE,
  FALLBACK_CG_CODE,
  ORG_PORTRAITS,
  PERSON_PORTRAITS,
  type PersonAge,
  type PersonMood,
} from './caseArtAssets.ts';
import { DEFAULT_CASE_ART_PROFILE, type CaseArtProfile } from './caseArt.ts';
import type { PartyArtMeta, SandboxCaseSummary } from '../services/types';

export const ART_REFERENCE_YEAR = 2020;

type PartyRole = 'plaintiff' | 'defendant';

const CORPORATE_PARTY_TYPES = new Set(['法人', '非法人组织', '法人/非法人组织', '企业', '公司', '组织']);

const ANXIOUS_CAUSE_CGS = new Set(['cg-category-personal-injury', 'cg-category-labor', 'cg-category-traffic-accident']);

const ORG_CODE_BY_CG: Record<string, string> = {
  'cg-category-real-estate': 'org-real-estate',
  'cg-category-lease-property': 'org-real-estate',
  'cg-category-construction': 'org-construction',
  'cg-category-labor': 'org-hr-labor',
  'cg-category-insurance-damage': 'org-insurance-claims',
  'cg-category-traffic-accident': 'org-insurance-claims',
};

export function stablePick<T>(items: T[], seed: string): T {
  let hash = 5381;
  for (let i = 0; i < seed.length; i += 1) {
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) >>> 0;
  }
  return items[hash % items.length];
}

function isCorporate(meta: PartyArtMeta): boolean {
  if (CORPORATE_PARTY_TYPES.has(meta.partyType)) return true;
  return !meta.gender && meta.hasRepresentative;
}

function toAgeBucket(birthYear: number | null): PersonAge {
  if (birthYear === null) return 'middle';
  const age = ART_REFERENCE_YEAR - birthYear;
  if (age < 30) return 'young';
  if (age < 45) return 'middle';
  if (age < 60) return 'older';
  return 'senior';
}

function moodPreference(role: PartyRole, cgCode: string): PersonMood[] {
  if (role === 'defendant') return ['defensive', 'neutral', 'firm', 'worried', 'anxious'];
  if (ANXIOUS_CAUSE_CGS.has(cgCode)) return ['anxious', 'worried', 'neutral', 'firm', 'defensive'];
  return ['firm', 'neutral', 'worried', 'anxious', 'defensive'];
}

function resolveCgCode(cause: string): string {
  return CG_BY_CAUSE[String(cause || '').trim()] || FALLBACK_CG_CODE;
}

export function resolveCategoryCg(cause: string): string {
  return CATEGORY_CGS[resolveCgCode(cause)];
}

function resolveOrgPortrait(role: PartyRole, cgCode: string): string {
  const industryCode = ORG_CODE_BY_CG[cgCode];
  const code = industryCode || (role === 'defendant' ? 'org-business-defensive' : 'org-business-neutral');
  const asset = ORG_PORTRAITS.find((item) => item.code === code);
  return asset ? asset.path : DEFAULT_CASE_ART_PROFILE.plaintiffPortrait;
}

function resolvePersonPortrait(meta: PartyArtMeta, role: PartyRole, cgCode: string, seed: string): string {
  const gender = meta.gender === '男' ? 'male' : meta.gender === '女' ? 'female' : 'neutral';
  const age = toAgeBucket(meta.birthYear);
  let candidates = PERSON_PORTRAITS.filter((item) => item.gender === gender && item.age === age);
  if (!candidates.length) candidates = PERSON_PORTRAITS.filter((item) => item.gender === gender);
  if (!candidates.length) candidates = PERSON_PORTRAITS.filter((item) => item.gender === 'neutral');
  for (const mood of moodPreference(role, cgCode)) {
    const matched = candidates.filter((item) => item.mood === mood);
    if (matched.length) return stablePick(matched, seed).path;
  }
  return stablePick(candidates, seed).path;
}

export function resolvePartyPortrait(
  meta: PartyArtMeta,
  role: PartyRole,
  cause: string,
  caseId: string,
): string {
  const cgCode = resolveCgCode(cause);
  const seed = `${caseId}:${role}`;
  if (isCorporate(meta)) return resolveOrgPortrait(role, cgCode);
  return resolvePersonPortrait(meta, role, cgCode, seed);
}

export function resolveCaseArtProfile(summary: SandboxCaseSummary): CaseArtProfile {
  const cause = summary.rawCaseCause || summary.trainingCategory || '';
  return {
    ...DEFAULT_CASE_ART_PROFILE,
    caseId: summary.caseId,
    plaintiffPortrait: resolvePartyPortrait(summary.plaintiffArt, 'plaintiff', cause, summary.caseId),
    defendantPortrait: resolvePartyPortrait(summary.defendantArt, 'defendant', cause, summary.caseId),
    caseCg: resolveCategoryCg(cause),
  };
}

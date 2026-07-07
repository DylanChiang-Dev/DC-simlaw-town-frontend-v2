export type PersonGender = 'male' | 'female' | 'neutral';
export type PersonAge = 'young' | 'middle' | 'older' | 'senior';
export type PersonMood = 'neutral' | 'anxious' | 'firm' | 'defensive' | 'worried';

export type PersonPortraitAsset = {
  code: string;
  gender: PersonGender;
  age: PersonAge;
  mood: PersonMood;
  path: string;
};

export type OrgPortraitAsset = {
  code: string;
  path: string;
};

const P = (code: string) => `/art/vn/char-pool-${code}.png`;

export const PERSON_PORTRAITS: PersonPortraitAsset[] = [
  { code: 'male-young-neutral', gender: 'male', age: 'young', mood: 'neutral', path: P('male-young-neutral') },
  { code: 'male-young-anxious', gender: 'male', age: 'young', mood: 'anxious', path: P('male-young-anxious') },
  { code: 'male-middle-neutral', gender: 'male', age: 'middle', mood: 'neutral', path: P('male-middle-neutral') },
  { code: 'male-middle-firm', gender: 'male', age: 'middle', mood: 'firm', path: P('male-middle-firm') },
  { code: 'male-middle-defensive', gender: 'male', age: 'middle', mood: 'defensive', path: P('male-middle-defensive') },
  { code: 'male-older-neutral', gender: 'male', age: 'older', mood: 'neutral', path: P('male-older-neutral') },
  { code: 'male-older-firm', gender: 'male', age: 'older', mood: 'firm', path: P('male-older-firm') },
  { code: 'male-senior-worried', gender: 'male', age: 'senior', mood: 'worried', path: P('male-senior-worried') },
  { code: 'male-senior-defensive', gender: 'male', age: 'senior', mood: 'defensive', path: P('male-senior-defensive') },
  { code: 'female-young-neutral', gender: 'female', age: 'young', mood: 'neutral', path: P('female-young-neutral') },
  { code: 'female-young-anxious', gender: 'female', age: 'young', mood: 'anxious', path: P('female-young-anxious') },
  { code: 'female-middle-neutral', gender: 'female', age: 'middle', mood: 'neutral', path: P('female-middle-neutral') },
  { code: 'female-middle-firm', gender: 'female', age: 'middle', mood: 'firm', path: P('female-middle-firm') },
  { code: 'female-middle-defensive', gender: 'female', age: 'middle', mood: 'defensive', path: P('female-middle-defensive') },
  { code: 'female-older-neutral', gender: 'female', age: 'older', mood: 'neutral', path: P('female-older-neutral') },
  { code: 'female-older-worried', gender: 'female', age: 'older', mood: 'worried', path: P('female-older-worried') },
  { code: 'female-senior-worried', gender: 'female', age: 'senior', mood: 'worried', path: P('female-senior-worried') },
  { code: 'female-senior-defensive', gender: 'female', age: 'senior', mood: 'defensive', path: P('female-senior-defensive') },
  { code: 'neutral-middle-anxious', gender: 'neutral', age: 'middle', mood: 'anxious', path: P('neutral-middle-anxious') },
  { code: 'neutral-older-firm', gender: 'neutral', age: 'older', mood: 'firm', path: P('neutral-older-firm') },
];

export const ORG_PORTRAITS: OrgPortraitAsset[] = [
  { code: 'org-business-neutral', path: P('org-business-neutral') },
  { code: 'org-business-defensive', path: P('org-business-defensive') },
  { code: 'org-real-estate', path: P('org-real-estate') },
  { code: 'org-construction', path: P('org-construction') },
  { code: 'org-hr-labor', path: P('org-hr-labor') },
  { code: 'org-insurance-claims', path: P('org-insurance-claims') },
];

const CG = (code: string) => `/art/vn/${code}.png`;

export const CATEGORY_CGS: Record<string, string> = {
  'cg-category-loan-contract': CG('cg-category-loan-contract'),
  'cg-category-general-contract': CG('cg-category-general-contract'),
  'cg-category-traffic-accident': CG('cg-category-traffic-accident'),
  'cg-category-real-estate': CG('cg-category-real-estate'),
  'cg-category-labor': CG('cg-category-labor'),
  'cg-category-construction': CG('cg-category-construction'),
  'cg-category-lease-property': CG('cg-category-lease-property'),
  'cg-category-personal-injury': CG('cg-category-personal-injury'),
  'cg-category-insurance-damage': CG('cg-category-insurance-damage'),
  'cg-category-neighborhood-property': CG('cg-category-neighborhood-property'),
};

export const FALLBACK_CG_CODE = 'cg-category-neighborhood-property';

export const CG_BY_CAUSE: Record<string, string> = {
  民间借贷纠纷: 'cg-category-loan-contract',
  不当得利纠纷: 'cg-category-loan-contract',
  合同纠纷: 'cg-category-general-contract',
  买卖合同纠纷: 'cg-category-general-contract',
  商品房销售合同纠纷: 'cg-category-general-contract',
  机动车交通事故责任纠纷: 'cg-category-traffic-accident',
  房屋买卖合同纠纷: 'cg-category-real-estate',
  商品房预售合同纠纷: 'cg-category-real-estate',
  劳动争议: 'cg-category-labor',
  劳动合同纠纷: 'cg-category-labor',
  劳务合同纠纷: 'cg-category-labor',
  建设工程施工合同纠纷: 'cg-category-construction',
  房屋租赁合同纠纷: 'cg-category-lease-property',
  租赁合同纠纷: 'cg-category-lease-property',
  物业服务合同纠纷: 'cg-category-lease-property',
  '生命权、健康权、身体权纠纷': 'cg-category-personal-injury',
  提供劳务者受害责任纠纷: 'cg-category-personal-injury',
  财产保险合同纠纷: 'cg-category-insurance-damage',
  财产损害赔偿纠纷: 'cg-category-insurance-damage',
  排除妨害纠纷: 'cg-category-neighborhood-property',
};

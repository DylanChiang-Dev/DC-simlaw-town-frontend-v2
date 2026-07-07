export const PROJECT_CONTACT_EMAIL = 'sbyue23@m.fudan.edu.cn';
export const PROJECT_INFO_TITLE = '关于 Legal World';
export const PROJECT_INFO_COPY = `Legal World 是一个交互式的 AI 法律世界，围绕案件推演、全流程诉讼仿真、模拟法庭、法学研究和法学实训，帮助你在完整案件流程中训练法律判断。欢迎填写体验问卷，也欢迎通过 ${PROJECT_CONTACT_EMAIL} 与我们联系。`;
export const PROJECT_SURVEY_LABEL = '填写体验问卷';

export type LandingCapability = {
  title: string;
  copy: string;
};

export const LANDING_HERO_TITLE = 'Legal World';
export const LANDING_HERO_SUBTITLE = '交互式法律世界';
export const LANDING_PRIMARY_CTA = '开始体验';
export const LANDING_SECONDARY_CTA = '查看项目介绍';
export const LANDING_PROJECT_URL = 'https://chidaic.github.io/Legal-world';
export const LANDING_CAPABILITIES: LandingCapability[] = [
  { title: '全生命周期', copy: '咨询、文书、庭审、上诉连续推进。' },
  { title: '交互式训练', copy: '玩家在关键律师节点输入、确认和调整策略。' },
  { title: '过程可观察', copy: '案件进度、工具/技能、角色对话和文书任务可视化。' },
];
export const LANDING_CAPABILITIES_TITLE = '为法律训练而设计';

export const LANDING_HERO_EYEBROW = '案件推演｜全流程诉讼仿真｜模拟法庭｜法学研究｜法学实训';
export const LANDING_INSTITUTION_BRAND = '上海创智学院 × 复旦大学数据智能与社会计算实验室';

export type LandingFlowActor = '玩家参与' | 'AI 智能体' | '玩家 × AI';

export type LandingFlowStep = {
  step: string;
  title: string;
  copy: string;
  actor: LandingFlowActor;
};

export const LANDING_FLOW_TITLE = '完整的诉讼生命周期';
export const LANDING_FLOW_SUBTITLE = '六个阶段连续推进，每一步都可参与、可观察、可复盘。';
export const LANDING_FLOW_STEPS: LandingFlowStep[] = [
  { step: '01', title: '咨询受理', copy: '接待当事人，厘清事实与诉求，判断案由。', actor: '玩家 × AI' },
  { step: '02', title: '起诉与答辩', copy: '起草起诉状与答辩状，组织证据与请求。', actor: '玩家参与' },
  { step: '03', title: '庭审调查', copy: '举证质证，AI 法官主持法庭调查。', actor: '玩家 × AI' },
  { step: '04', title: '法庭辩论', copy: '与 AI 对方律师展开多轮法庭辩论。', actor: '玩家参与' },
  { step: '05', title: '判决', copy: 'AI 合议庭综合全案作出判决并说理。', actor: 'AI 智能体' },
  { step: '06', title: '上诉', copy: '不服一审判决，进入二审程序继续对抗。', actor: '玩家 × AI' },
];

export type LandingShowcaseItem = {
  title: string;
  copy: string;
  bullets: string[];
  image: string;
  alt: string;
};

export const LANDING_SHOWCASE_TITLE = '过程可视的法律世界';
export const LANDING_SHOWCASE_HERO_IMAGE = '/art/vn/bg-document-desk.png';
export const LANDING_SHOWCASE_ITEMS: LandingShowcaseItem[] = [
  {
    title: '文书工作台',
    copy: '起诉状、答辩状在结构化引导下起草，证据要素自动归类。',
    bullets: ['起诉状/答辩状引导起草', '证据要素结构化', 'AI 审阅与修改建议'],
    image: '/art/vn/bg-document-desk.png',
    alt: '文书工作台界面',
  },
  {
    title: '多智能体庭审引擎',
    copy: '法官与控辩双方由多智能体驱动，工具调用与推理过程全程可追踪。',
    bullets: ['法官/双方律师多智能体协作', '工具与技能调用可追踪', '全程对话与进度可回放'],
    image: '/art/vn/bg-case-analysis-room.png',
    alt: '多智能体引擎示意',
  },
];

export type LandingInstitution = {
  name: string;
  logo: string;
};

export const LANDING_INSTITUTIONS: LandingInstitution[] = [
  { name: '上海创智学院', logo: '/art/brand/shanghai-innovation-institute-logo.png' },
  { name: '复旦大学 DISC 实验室', logo: '/art/brand/disc-logo.png' },
];

export const LANDING_INSTITUTION_LOCKUPS: LandingInstitution[] = [
  { name: '上海创智学院', logo: '/art/brand/shanghai-innovation-institute-lockup.svg' },
  { name: '复旦大学数据智能与社会计算实验室', logo: '/art/brand/disc-lab-lockup.png' },
];

export const LANDING_FOOTER_COPYRIGHT = '© 2026 上海创智学院 · 复旦大学数据智能与社会计算实验室';

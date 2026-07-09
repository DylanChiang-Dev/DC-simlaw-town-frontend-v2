export const PROJECT_CONTACT_EMAIL = 'sbyue23@m.fudan.edu.cn';
export const LOGIN_DEVICE_NOTICE = '建议使用电脑访问本系统，以获得最佳体验';
export const LOGIN_ORGANIZATION_LABEL = '单位';
export const PROJECT_INFO_TITLE = '关于 Legal World';
export const PROJECT_INFO_COPY = `Legal World 是一个交互式的 AI 法律世界，围绕案件推演、全流程诉讼仿真、模拟法庭、法学研究和法学实训，帮助你在完整案件流程中训练法律判断。欢迎填写体验问卷，也欢迎通过 ${PROJECT_CONTACT_EMAIL} 与我们联系。`;
export const PROJECT_SURVEY_LABEL = '填写体验问卷';

export type LandingCapability = {
  title: string;
  copy: string;
};

export const LANDING_HERO_TITLE = 'Legal World';
export const LANDING_HERO_SUBTITLE = '大规模、高保真的交互式法律世界';
export const LANDING_PRIMARY_CTA = '在线体验';
export const LANDING_MCP_CTA = 'MCP 服务';
export const LANDING_SECONDARY_CTA = '查看项目介绍';
export const LANDING_PROJECT_URL = 'https://chidaic.github.io/Legal-world';

export const LANDING_MCP_CONTACT_LEAD = '如果你希望接入、共建或洽谈合作，欢迎与我们联系。';
export const LANDING_MCP_CONTACT_CTA = '联系我们';

// ===== MCP 独立页面（/mcp）内容 =====
export const MCP_PAGE_TITLE = 'Legal World MCP';
export const MCP_PAGE_TAGLINE =
  'Legal World MCP 基于开放标准（Model Context Protocol，模型上下文协议），把 Legal World 的法律工具与交互环境标准化开放给外部客户端。简单配置即可在 Claude、Cursor 等支持 MCP 的客户端中接入，推演案情，或训练你的专属智能体。';
export const MCP_PAGE_INTRO =
  'Legal World 是一个基于真实中国民事案件构建的法律全生命周期多智能体模拟环境，支持外部智能体通过 MCP 服务接入并扮演律师，在真实案件驱动的咨询、文书、庭审和上诉流程中练习法律推理、证据组织、诉讼策略和文书写作能力。';

export type McpHighlight = { label: string; value: string; detail: string };
export const MCP_HIGHLIGHTS: McpHighlight[] = [
  { label: '真实案件规模', value: '75,309', detail: '一审-二审配对案件，来自真实裁判文书结构化处理。' },
  { label: '案由覆盖', value: '500+', detail: '案由类型，覆盖广泛的民事纠纷场景。' },
  { label: '生命周期', value: '8 阶段', detail: '从咨询、文书、一审到上诉、二审的完整流程。' },
  { label: '角色生态', value: '多角色', detail: '当事人、律师、法官、书记员、对手方协同。' },
  { label: 'Legal Skill', value: '6 个', detail: '4 类律师文书 Skill + 2 类记忆写入 Skill。' },
  { label: 'Legal Tool', value: '17 个', detail: '10 个核心/运行时 Tool + 7 个扩展/调试 Tool。' },
  { label: '法律检索', value: '57,096 条', detail: '法条级记录，来自 1,393 份中央层级法律来源文件。' },
  { label: '训练轨迹', value: '可导出', detail: '对话、工具调用、文书 PDF、运行 ledger、结案报告与评分。' },
];

export const MCP_WHY_POINTS: string[] = [
  '在咨询阶段识别事实、追问证据、形成初步法律判断。',
  '在文书阶段把当事人陈述转化为诉讼请求、事实理由、证据目录和法律依据。',
  '在庭审阶段围绕举证质证、法庭调查、争议焦点和辩论意见组织表达。',
  '在上诉阶段理解一审裁判，提炼不服点，构造二审请求和理由。',
  '在全流程中持续维护当事人记忆、律师办案记忆和阶段性策略。',
];

export type McpStage = { code: string; name: string; role: string };
export const MCP_STAGES: McpStage[] = [
  { code: 'PLC', name: '原告咨询', role: '作为原告侧律师，接收当事人陈述，追问事实和证据，给出法律分析。' },
  { code: 'CD', name: '起诉状起草', role: '组织诉讼请求、事实理由、证据和法院信息，生成起诉状。' },
  { code: 'DLC', name: '被告咨询', role: '对手方咨询由环境内部 Agent 控制，一般不进入外部 Agent 流程。' },
  { code: 'DD', name: '答辩状起草', role: '对手方文书由环境内部 Agent 控制，一般不进入外部 Agent 流程。' },
  { code: 'CI', name: '一审庭审', role: '外部 Agent 可在己方律师发言节点发表陈述、举证质证和辩论意见。' },
  { code: 'AD', name: '上诉状起草', role: '若己方进入上诉流程，外部 Agent 可起草上诉状。' },
  { code: 'AR', name: '上诉答辩状起草', role: '若己方处于被上诉人一侧，可起草上诉答辩状。' },
  { code: 'CIA', name: '二审庭审', role: '外部 Agent 可在二审己方律师节点完成庭审表达。' },
];

export type McpDataTier = { tier: string; desc: string };
export const MCP_DATA_TIERS: McpDataTier[] = [
  { tier: 'Full', desc: '75,309 个一审-二审配对案件，覆盖 500+ 案由。' },
  { tier: 'Medium', desc: '1,000 个案由均衡采样案件，覆盖 100 个高频案由。' },
  { tier: 'Light', desc: '100 个轻量调试和快速实验案件，覆盖 20 个高频案由。' },
];
export const MCP_LAW_CORPUS_FACTS: string[] = [
  '1,393 份中央层级法律来源文件。',
  '57,096 条法条级 metadata 记录。',
  '支持 search_laws 语义检索，查找与当前法律问题相关的法律依据。',
];

export type McpSkill = { name: string; type: string; desc: string };
export const MCP_SKILLS: McpSkill[] = [
  { name: 'lawyer-complaint-drafting', type: '律师文书', desc: '民事起诉状结构、格式和质量规范。' },
  { name: 'lawyer-defense-drafting', type: '律师文书', desc: '民事答辩状结构、抗辩组织和质量规范。' },
  { name: 'lawyer-appeal-drafting', type: '律师文书', desc: '民事上诉状请求、不服点和理由组织规范。' },
  { name: 'lawyer-appeal-response-drafting', type: '律师文书', desc: '民事上诉答辩状回应结构和质量规范。' },
  { name: 'lawyer-memory-writing', type: '记忆沉淀', desc: '律师案件长期记忆的字段级写入规则。' },
  { name: 'client-memory-writing', type: '记忆沉淀', desc: '当事人案件长期记忆的字段级写入规则。' },
];

export type McpTool = { name: string; category: '核心' | '扩展' | '调试'; desc: string };
export const MCP_TOOLS: McpTool[] = [
  { name: 'load_skill', category: '核心', desc: '加载指定 SKILL.md 到 Agent 上下文。' },
  { name: 'search_laws', category: '核心', desc: '检索本地法律法规语料。' },
  { name: 'save_client_memory', category: '核心', desc: '写入当事人长期记忆。' },
  { name: 'save_lawyer_memory', category: '核心', desc: '写入律师长期记忆。' },
  { name: 'draft_complaint_document', category: '核心', desc: '生成/导出民事起诉状产物。' },
  { name: 'draft_defense_document', category: '核心', desc: '生成/导出民事答辩状产物。' },
  { name: 'draft_appeal_document', category: '核心', desc: '生成/导出民事上诉状产物。' },
  { name: 'draft_appeal_response_document', category: '核心', desc: '生成/导出民事上诉答辩状产物。' },
  { name: 'draft_first_instance_judgment_document', category: '核心', desc: '生成/导出一审判决书产物。' },
  { name: 'draft_second_instance_judgment_document', category: '核心', desc: '生成/导出二审判决书产物。' },
  { name: 'search_cases', category: '扩展', desc: '检索本地相似案例语料。' },
  { name: 'check_citations', category: '扩展', desc: '校验文书中的法条引用。' },
  { name: 'compare_documents', category: '扩展', desc: '比较两份法律文书的差异和争点变化。' },
  { name: 'run_case_benchmark_evaluation', category: '扩展', desc: '对单案运行结果执行评测。' },
  { name: 'read_case_artifact', category: '调试', desc: '读取当前案件目录下的白名单产物。' },
  { name: 'load_client_memory', category: '调试', desc: '读取当事人长期记忆。' },
  { name: 'load_lawyer_memory', category: '调试', desc: '读取律师长期记忆。' },
];

export const MCP_TRAINING_SIGNALS: string[] = [
  '完整对话轨迹：每个阶段的角色发言、用户/Agent 输入、法官追问、对手回应。',
  '工具调用轨迹：法律检索、案例检索、文书导出、引用校验等 Tool 使用记录。',
  '文书产物：起诉状、答辩状、上诉状、上诉答辩状、一审/二审判决书及 PDF。',
  '责任节点 ledger：外部 Agent 实际负责的发言、文书和确认动作。',
  '结案报告：案件信息、流程概览、职责提交、完整对话和文书链接。',
  '自动评估：总分、分维度评价、亮点和改进建议。',
];
export const MCP_TRAINING_USES: string[] = [
  '训练法律 Agent 的工具使用策略。',
  '训练法律咨询和庭审发言能力。',
  '训练文书结构化写作能力。',
  '训练长程案件记忆和阶段策略。',
  '做跨模型法律实务能力评测。',
];
export const LANDING_CAPABILITIES: LandingCapability[] = [
  { title: '案件推演', copy: '动态模拟案件发展、策略选择与结果演化。' },
  { title: '人机对打', copy: '与 AI 法律智能体实时交锋，在对抗中检验推理、辩论与决策能力。' },
  { title: '智能体训练', copy: '在复杂动态法律场景中，训练你的专属法律智能体。' },
];
export const LANDING_CAPABILITIES_TITLE = 'What can Legal World do?';

export const LANDING_HERO_EYEBROW = '案件推演｜全流程诉讼仿真｜模拟法庭｜法学研究｜智能体训练';
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

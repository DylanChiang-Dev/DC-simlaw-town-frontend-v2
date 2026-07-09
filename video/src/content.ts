// 宣传片文案常量（取自主项目 src/config/projectInfo.ts，独立复制一份供 Remotion 使用）。

export const BRAND = 'Legal World';
export const BRAND_SUB = '大规模、高保真的交互式法律世界';
export const EYEBROW = '案件推演 · 全流程诉讼仿真 · 模拟法庭 · 法学实训';

export type FlowStep = {
  step: string;
  title: string;
  actor: string;
};

export const FLOW_STEPS: FlowStep[] = [
  { step: '01', title: '咨询', actor: '玩家 × AI' },
  { step: '02', title: '起诉状', actor: '玩家参与' },
  { step: '03', title: '答辩状', actor: 'AI 对手' },
  { step: '04', title: '一审庭审', actor: '多 Agent' },
  { step: '05', title: '上诉状', actor: '玩家参与' },
  { step: '06', title: '二审庭审', actor: '玩家 × AI' },
];

export type Advantage = {
  title: string;
  copy: string;
};

export const ADVANTAGES: Advantage[] = [
  { title: '全生命周期', copy: '咨询到上诉，六阶段连续推进' },
  { title: '交互式训练', copy: '关键律师节点，由你决策' },
  { title: '科研级框架', copy: '人类评估 · 演示录播 · 20+ 测试' },
];

export const CTA_URL = 'www.fudan-disc.com/legalworld';
export const INSTITUTION = '上海创智学院 × 复旦大学数据智能与社会计算实验室';

// 片尾机构 logo（圆形徽章，含中英文名称，白底衬托）
export const INSTITUTION_LOGOS = [
  { src: 'brand/sii-logo.png', name: '上海创智学院' },
  { src: 'brand/disc-logo.png', name: '复旦大学 DISC 实验室' },
] as const;

export const CLIPS = {
  casepicker: 'clips/clip-casepicker.mp4',
  stage: 'clips/clip-stage.mp4',
  court: 'clips/clip-court.mp4',
  trial: 'clips/clip-trial.mp4',
  panel: 'clips/clip-panel.mp4',
  radar: 'clips/clip-radar.mp4',
  modes: 'clips/v4-modes.webm',
  mcpLanding: 'clips/v4-mcp-landing.webm',
  mcpPage: 'clips/v4-mcp-page.webm',
} as const;

export const MCP_STATS = [
  { value: '75,309', label: '一审-二审配对案件' },
  { value: '500+', label: '案由覆盖' },
  { value: '57,096', label: '法条级记录' },
  { value: '1,393', label: '中央层级法律来源文件' },
] as const;

export const MCP_CAPABILITIES = [
  { value: '6', label: 'Legal Skills' },
  { value: '17', label: 'Legal Tools' },
  { value: '可导出', label: '训练轨迹与自动评估' },
] as const;

// 旁白字幕（对齐豆包配音时间码；每个节拍一句）
export const SUBTITLES = {
  intro: '你的律师 Agent，能打赢一场真实案件吗？',
  stats: '七万五千个真实案件，五百多个案由，完整诉讼流程等它上场',
  lawyer: '你也可以亲自下场，咨询、起草、庭审发言，关键节点由你推进',
  trial: '法官、对方律师、当事人，全部由多智能体驱动',
  observable: '工具调用、法条检索、记忆写入，每一步都看得见',
  mcp: '通过 MCP 接入你的律师智能体，在真实诉讼中训练、对抗和评测',
  outro: 'Legal World，开始体验',
} as const;

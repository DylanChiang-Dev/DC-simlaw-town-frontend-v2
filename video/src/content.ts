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

export type SceneKey = 'intro' | 'stats' | 'lawyer' | 'trial' | 'observable' | 'mcp' | 'outro';

export type SceneTiming = {
  from: number;
  dur: number;
};

export type PromoVariant = {
  scenes: Record<SceneKey, SceneTiming>;
  totalFrames: number;
  subtitles: Record<SceneKey, string>;
  voiceoverFiles: Record<SceneKey, string>;
};

// V5 看完率优先版旁白字幕。
export const SUBTITLES_V5: Record<SceneKey, string> = {
  intro: '你的律师 Agent，能打赢一场真实案件吗？不是在聊天框里回答问题，而是在完整诉讼流程里接受考验。',
  stats: 'Legal World 把七万五千个真实案件、五百多个案由，放进一个可以对抗、可以复盘的法律世界。',
  lawyer: '你也可以亲自下场，从咨询、起草，到庭审发言，关键节点由你推进，系统记录每一次选择。',
  trial: '法官、对方律师、当事人和案件角色全部由多智能体驱动，它们会围绕事实、证据和法律依据持续互动。',
  observable: '工具调用、法条检索、记忆写入，每一步都看得见。训练过程不再是黑箱，而是可追踪的轨迹。',
  mcp: '通过 MCP 接入你的律师智能体，让它在真实诉讼任务中训练、对抗和评测，输出可以比较的能力证据。',
  outro: 'Legal World，让法律智能体进入真实流程。',
} as const;

// V4 MCP 强化版旁白字幕，按“每段 MP3 实际时长 + 900ms”重排到 80 秒。
export const SUBTITLES_V4: Record<SceneKey, string> = {
  intro: 'Legal World，是一个能让你亲自下场的 AI 法律世界。它不是单次问答，而是把案件、角色和任务放进完整流程里运行。',
  stats: '系统连接真实案件、法条记录和案由结构，让你的律师智能体面对接近真实的任务环境，理解事实、证据和法律依据，而不是只回答一段法律咨询。',
  lawyer: '从原告咨询、起诉状，到庭审发言、上诉判断，你可以亲自推进关键节点，也可以让 AI 自动跑完整个诉讼流程，并留下可复盘的选择。',
  trial: '进入法庭后，对方律师、当事人和法官都由不同智能体驱动。它们会围绕事实、证据、争议焦点和程序节奏持续对抗，并根据发言改变下一步走向。',
  observable: '每一次工具调用、法条检索、记忆写入和文书生成，都能被看见、被追踪、被复盘。训练过程不再是黑箱，而是可以检查的证据链。',
  mcp: '通过 Legal World MCP，把真实案件、法律工具、诉讼阶段和评测信号开放给外部智能体，用来训练、对抗和比较能力，让评测走进真实任务。',
  outro: 'Legal World，让法律智能体进入真实流程，而不是停在问答里，在世界里真正跑起来。',
} as const;

export const VOICEOVER_FILES_V5: Record<SceneKey, string> = {
  intro: 'voiceover/v5/01-intro.mp3',
  stats: 'voiceover/v5/02-stats.mp3',
  lawyer: 'voiceover/v5/03-lawyer.mp3',
  trial: 'voiceover/v5/04-trial.mp3',
  observable: 'voiceover/v5/05-observable.mp3',
  mcp: 'voiceover/v5/06-mcp.mp3',
  outro: 'voiceover/v5/07-outro.mp3',
} as const;

export const VOICEOVER_FILES_V4: Record<SceneKey, string> = {
  intro: 'voiceover/v4/01-intro.mp3',
  stats: 'voiceover/v4/02-stats.mp3',
  lawyer: 'voiceover/v4/03-lawyer.mp3',
  trial: 'voiceover/v4/04-trial.mp3',
  observable: 'voiceover/v4/05-observable.mp3',
  mcp: 'voiceover/v4/06-mcp.mp3',
  outro: 'voiceover/v4/07-outro.mp3',
} as const;

export const PROMO_VARIANTS = {
  v5: {
    totalFrames: 1800,
    scenes: {
      intro: { from: 0, dur: 268 },
      stats: { from: 268, dur: 252 },
      lawyer: { from: 520, dur: 275 },
      trial: { from: 795, dur: 293 },
      observable: { from: 1088, dur: 267 },
      mcp: { from: 1355, dur: 280 },
      outro: { from: 1635, dur: 165 },
    },
    subtitles: SUBTITLES_V5,
    voiceoverFiles: VOICEOVER_FILES_V5,
  },
  v4: {
    totalFrames: 2413,
    scenes: {
      intro: { from: 0, dur: 311 },
      stats: { from: 311, dur: 388 },
      lawyer: { from: 699, dur: 364 },
      trial: { from: 1063, dur: 413 },
      observable: { from: 1476, dur: 328 },
      mcp: { from: 1804, dur: 370 },
      outro: { from: 2174, dur: 239 },
    },
    subtitles: SUBTITLES_V4,
    voiceoverFiles: VOICEOVER_FILES_V4,
  },
} satisfies Record<string, PromoVariant>;

export const BGM_FILE = 'audio/signal-to-noise-scott-buckley.mp3';

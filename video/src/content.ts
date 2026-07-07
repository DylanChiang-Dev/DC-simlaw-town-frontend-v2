// 宣传片文案常量（取自主项目 src/config/projectInfo.ts，独立复制一份供 Remotion 使用）。

export const BRAND = 'Legal World';
export const BRAND_SUB = '交互式 AI 法律世界';
export const EYEBROW = '案件推演 · 全流程诉讼仿真 · 模拟法庭 · 法学实训';

export type FlowStep = {
  step: string;
  title: string;
  actor: string;
};

export const FLOW_STEPS: FlowStep[] = [
  { step: '01', title: '咨询受理', actor: '玩家 × AI' },
  { step: '02', title: '起诉与答辩', actor: '玩家参与' },
  { step: '03', title: '庭审调查', actor: '玩家 × AI' },
  { step: '04', title: '法庭辩论', actor: '玩家参与' },
  { step: '05', title: '判决', actor: 'AI 智能体' },
  { step: '06', title: '上诉', actor: '玩家 × AI' },
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

export const CTA_URL = 'chidaic.github.io/Legal-world';
export const INSTITUTION = '上海创智学院 × 复旦大学数据智能与社会计算实验室';

export const CLIPS = {
  casepicker: 'clips/clip-casepicker.mp4',
  stage: 'clips/clip-stage.mp4',
  court: 'clips/clip-court.mp4',
  trial: 'clips/clip-trial.mp4',
  panel: 'clips/clip-panel.mp4',
  radar: 'clips/clip-radar.mp4',
} as const;

// 旁白字幕（对齐豆包配音时间码；每个节拍一句）
export const SUBTITLES = {
  intro: '一个能让你亲自下场的 AI 法律世界',
  lawyer: '从咨询、起诉到庭审、上诉，六个阶段亲自打完',
  trial: '法官主持、对方律师应战，全部由 AI 驱动',
  observable: '它调用了什么、记住了什么，全程透明可查',
  outro: 'Legal World，开始体验',
} as const;

// 设计令牌：暖色手绘基调，对齐产品 UI（深棕 + 暖金 + 纸感米白）。

export const COLORS = {
  bgDeep: '#140d07',
  bgPanel: '#1e140b',
  bgPanelSoft: 'rgba(30, 20, 11, 0.72)',
  gold: '#d8a860',
  goldBright: '#e9c987',
  text: '#f4ead9',
  textMuted: '#b8a68c',
  line: 'rgba(216, 168, 96, 0.42)',
  lineSoft: 'rgba(216, 168, 96, 0.20)',
} as const;

// 场景时间轴（帧 @30fps，共 1800 帧 = 60 秒）。相邻场景重叠 15 帧做交叉溶解。
// v5 看完率优先：冷开场 / 数据冲击 / 玩家下场 / 多智能体庭审 / 可观察 / MCP / CTA
export const OVERLAP = 15;

export const SCENES = {
  intro: { from: 0, dur: 135 },
  stats: { from: 120, dur: 255 },
  lawyer: { from: 360, dur: 345 },
  trial: { from: 690, dur: 345 },
  observable: { from: 1020, dur: 315 },
  mcp: { from: 1320, dur: 285 },
  outro: { from: 1590, dur: 210 },
} as const;

export const TOTAL_FRAMES = 1800;
export const FPS = 30;

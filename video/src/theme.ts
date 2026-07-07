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
// v2 五节拍：开场 / 你即律师·全流程 / 多智能体对抗庭审 / 过程可观察 / CTA
export const OVERLAP = 15;

export const SCENES = {
  intro: { from: 0, dur: 195 },
  lawyer: { from: 180, dur: 555 },
  trial: { from: 720, dur: 495 },
  observable: { from: 1200, dur: 375 },
  outro: { from: 1560, dur: 240 },
} as const;

export const TOTAL_FRAMES = 1800;
export const FPS = 30;

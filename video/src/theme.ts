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
export const OVERLAP = 15;

export const SCENES = {
  intro: { from: 0, dur: 165 },
  paradigm: { from: 150, dur: 255 },
  flow: { from: 390, dur: 465 },
  lawyer: { from: 840, dur: 315 },
  observable: { from: 1140, dur: 285 },
  advantage: { from: 1410, dur: 225 },
  outro: { from: 1620, dur: 180 },
} as const;

export const TOTAL_FRAMES = 1800;
export const FPS = 30;

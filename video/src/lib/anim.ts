import { Easing, interpolate } from 'remotion';

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// 淡入：frame 从 s 到 e，opacity 0→1
export function fadeIn(frame: number, s: number, e: number): number {
  return interpolate(frame, [s, e], [0, 1], { ...clamp, easing: EASE });
}

// 淡入淡出
export function fadeInOut(
  frame: number,
  inS: number,
  inE: number,
  outS: number,
  outE: number,
): number {
  return interpolate(frame, [inS, inE, outS, outE], [0, 1, 1, 0], {
    ...clamp,
    easing: EASE,
  });
}

// 线性映射（带缓动与 clamp）
export function ramp(
  frame: number,
  s: number,
  e: number,
  from: number,
  to: number,
): number {
  return interpolate(frame, [s, e], [from, to], { ...clamp, easing: EASE });
}

import type { CSSProperties } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { ramp } from '../lib/anim';

const VIDEO_W = 1920;
const VIDEO_H = 1080;

type KenBurns = {
  src: string;
  trimBefore?: number;
  durationInFrames: number;
  scaleFrom?: number;
  scaleTo?: number;
  xFrom?: number; // 平移百分比（相对画面宽），正=右移
  xTo?: number;
  yFrom?: number;
  yTo?: number;
  blur?: number;
  brightness?: number;
  style?: CSSProperties;
};

// 缓慢推拉的全屏录屏背景
export function KenBurnsClip({
  src,
  trimBefore = 0,
  durationInFrames,
  scaleFrom = 1.05,
  scaleTo = 1.12,
  xFrom = 0,
  xTo = 0,
  yFrom = 0,
  yTo = 0,
  blur = 0,
  brightness = 1,
  style,
}: KenBurns) {
  const frame = useCurrentFrame();
  const scale = ramp(frame, 0, durationInFrames, scaleFrom, scaleTo);
  const x = ramp(frame, 0, durationInFrames, xFrom, xTo);
  const y = ramp(frame, 0, durationInFrames, yFrom, yTo);
  const filter = `${blur ? `blur(${blur}px) ` : ''}brightness(${brightness})`;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', ...style }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={trimBefore}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          scale,
          translate: `${x}% ${y}%`,
          filter,
        }}
      />
    </AbsoluteFill>
  );
}

type ZoomClip = {
  src: string;
  trimBefore?: number;
  boxW: number; // 目标容器宽
  boxH: number; // 目标容器高
  originX: number; // 缩放焦点，0~1（相对源画面）
  originY: number;
  scale?: number; // 放大倍数
  kenBurns?: number; // 额外缓慢放大量
  style?: CSSProperties;
};

// 以 object-fit cover 铺满容器，再围绕焦点放大，聚焦录屏某个角落/区域
export function RegionClip({
  src,
  trimBefore = 0,
  boxW,
  boxH,
  originX,
  originY,
  scale = 2.2,
  kenBurns = 0.08,
  style,
}: ZoomClip) {
  const frame = useCurrentFrame();
  const z = scale + ramp(frame, 0, 260, 0, kenBurns);
  return (
    <div style={{ width: boxW, height: boxH, overflow: 'hidden', position: 'relative', ...style }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={trimBefore}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${originX * 100}% ${originY * 100}%`,
          transformOrigin: `${originX * 100}% ${originY * 100}%`,
          transform: `scale(${z})`,
        }}
      />
    </div>
  );
}

// 保留常量避免未用告警
void VIDEO_W;
void VIDEO_H;

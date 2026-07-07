import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { EASE } from '../lib/anim';

// 局部帧驱动的上浮淡入
export function FadeUp({
  delay = 0,
  dur = 18,
  y = 30,
  children,
  style,
}: {
  delay?: number;
  dur?: number;
  y?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const f = frame - delay;
  const opacity = interpolate(f, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const ty = interpolate(f, [0, dur], [y, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return <div style={{ opacity, translate: `0px ${ty}px`, ...style }}>{children}</div>;
}

// 底部渐变压暗，保证字幕可读
export function BottomScrim({ height = 460 }: { height?: number }) {
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
      <div
        style={{
          height,
          background: `linear-gradient(to top, rgba(10,6,3,0.92), rgba(10,6,3,0.55) 45%, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
}

export function Vignette() {
  return (
    <AbsoluteFill
      style={{
        boxShadow: 'inset 0 0 320px 90px rgba(8,5,2,0.85)',
        pointerEvents: 'none',
      }}
    />
  );
}

// 小标签（eyebrow）
export function Kicker({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        fontSize: 26,
        fontWeight: 500,
        letterSpacing: '0.18em',
        color: COLORS.gold,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// 底部三分之一字幕条：kicker + 主句
export function LowerThird({
  kicker,
  title,
  delay = 0,
}: {
  kicker: string;
  title: string;
  delay?: number;
}) {
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 120px 96px' }}>
      <FadeUp delay={delay}>
        <div
          style={{
            width: 10,
            height: 46,
            background: COLORS.gold,
            marginBottom: 22,
            borderRadius: 2,
          }}
        />
      </FadeUp>
      <FadeUp delay={delay + 4}>
        <Kicker style={{ marginBottom: 14 }}>{kicker}</Kicker>
      </FadeUp>
      <FadeUp delay={delay + 8}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.18,
            color: COLORS.text,
            maxWidth: 1200,
            textShadow: '0 4px 30px rgba(0,0,0,0.6)',
          }}
        >
          {title}
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
}

// 顶部卖点标题条（配合底部字幕，避免上下文字打架）
export function TopHeadline({
  kicker,
  title,
  delay = 0,
}: {
  kicker: string;
  title: string;
  delay?: number;
}) {
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', padding: '76px 0 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <FadeUp delay={delay}>
          <Kicker style={{ fontSize: 24 }}>{kicker}</Kicker>
        </FadeUp>
        <FadeUp delay={delay + 5}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 900,
              fontSize: 76,
              color: COLORS.text,
              textShadow: '0 4px 30px rgba(0,0,0,0.75)',
            }}
          >
            {title}
          </div>
        </FadeUp>
      </div>
    </AbsoluteFill>
  );
}

// 场景大标题（居中区块顶部用）
export function SceneHeading({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <FadeUp delay={delay}>
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 900,
          fontSize: 72,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </FadeUp>
  );
}

// 底部旁白字幕（承载旁白/配音文本，常驻底部居中）
export function Subtitle({ text, delay = 8 }: { text: string; delay?: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 54 }}>
      <div
        style={{
          opacity,
          maxWidth: 1500,
          textAlign: 'center',
          fontFamily: FONT_SANS,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.3,
          color: COLORS.text,
          padding: '14px 40px',
          borderRadius: 14,
          background: 'rgba(10,6,3,0.62)',
          backdropFilter: 'blur(2px)',
          border: `1px solid ${COLORS.lineSoft}`,
          textShadow: '0 2px 14px rgba(0,0,0,0.9)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}

// 脉动高亮圈（指向界面按钮）
export function PulseRing({
  x,
  y,
  r = 62,
  label,
}: {
  x: number;
  y: number;
  r?: number;
  label?: string;
}) {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.08 * Math.sin(frame / 6);
  const glow = 0.5 + 0.5 * (0.5 + 0.5 * Math.sin(frame / 6));
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          border: `3px solid ${COLORS.goldBright}`,
          boxShadow: `0 0 ${18 * glow}px ${6 * glow}px rgba(233,201,135,0.55)`,
          scale: pulse,
        }}
      />
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: x - 150,
            top: y - r - 58,
            width: 300,
            textAlign: 'center',
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: 24,
            color: COLORS.goldBright,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
}

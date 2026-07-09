import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { FadeUp, Vignette } from '../components/ui';
import { COLORS, SCENES } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { BRAND, CTA_URL, INSTITUTION_LOGOS } from '../content';
import { EASE } from '../lib/anim';

function LogoBadge({ src }: { src: string }) {
  return (
    <div
      style={{
        width: 156,
        height: 156,
        borderRadius: '50%',
        background: '#fdfaf4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        border: `1px solid ${COLORS.lineSoft}`,
      }}
    >
      <Img src={staticFile(src)} style={{ width: 132, height: 132, objectFit: 'contain' }} />
    </div>
  );
}

export function Scene07Outro() {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [SCENES.outro.dur - 22, SCENES.outro.dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${COLORS.bgPanel}, ${COLORS.bgDeep})`,
        opacity: fadeOut,
      }}
    >
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <FadeUp delay={4}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 900,
              fontSize: 132,
              color: COLORS.text,
              textShadow: '0 10px 50px rgba(0,0,0,0.6)',
            }}
          >
            {BRAND}
          </div>
        </FadeUp>
        <FadeUp delay={18} style={{ marginTop: 26 }}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 700,
              fontSize: 38,
              color: COLORS.goldBright,
              letterSpacing: '0.06em',
            }}
          >
            在线体验 · {CTA_URL}
          </div>
        </FadeUp>
        <FadeUp delay={28} style={{ marginTop: 18 }}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 700,
              fontSize: 34,
              color: COLORS.text,
              letterSpacing: '0.04em',
            }}
          >
            MCP 服务 · 接入你的法律智能体
          </div>
        </FadeUp>
        <FadeUp delay={42} style={{ marginTop: 46 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 54 }}>
            {INSTITUTION_LOGOS.map((logo) => (
              <LogoBadge key={logo.src} src={logo.src} />
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={50} style={{ marginTop: 24 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 24, color: COLORS.textMuted, letterSpacing: '0.06em' }}>
            上海创智学院 · 复旦大学数据智能与社会计算实验室 联合出品
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

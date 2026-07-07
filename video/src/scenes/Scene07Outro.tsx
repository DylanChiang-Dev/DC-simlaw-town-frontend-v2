import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FadeUp, Vignette } from '../components/ui';
import { COLORS, SCENES } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { BRAND, CTA_URL, INSTITUTION } from '../content';
import { EASE } from '../lib/anim';

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
        background: `radial-gradient(circle at 50% 42%, ${COLORS.bgPanel}, ${COLORS.bgDeep})`,
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
              fontSize: 150,
              color: COLORS.text,
              textShadow: '0 10px 50px rgba(0,0,0,0.6)',
            }}
          >
            {BRAND}
          </div>
        </FadeUp>
        <FadeUp delay={20} style={{ marginTop: 30 }}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 700,
              fontSize: 40,
              color: COLORS.goldBright,
              letterSpacing: '0.06em',
            }}
          >
            开始体验 · {CTA_URL}
          </div>
        </FadeUp>
        <FadeUp delay={34} style={{ marginTop: 54 }}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 26,
              color: COLORS.textMuted,
              letterSpacing: '0.04em',
            }}
          >
            {INSTITUTION}
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KenBurnsClip } from '../components/Clip';
import { FadeUp, Kicker, Subtitle, Vignette } from '../components/ui';
import { COLORS, SCENES } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { BRAND, BRAND_SUB, CLIPS, EYEBROW, SUBTITLES } from '../content';
import { fadeIn } from '../lib/anim';

export function Scene01Intro() {
  const frame = useCurrentFrame();
  const brandScale = 0.94 + 0.06 * fadeIn(frame, 6, 40);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <KenBurnsClip
        src={CLIPS.casepicker}
        durationInFrames={SCENES.intro.dur}
        scaleFrom={1.12}
        scaleTo={1.22}
        blur={9}
        brightness={0.34}
      />
      <AbsoluteFill
        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(20,13,7,0.15), rgba(12,8,4,0.85))' }}
      />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <FadeUp delay={4}>
          <Kicker style={{ marginBottom: 30, fontSize: 24 }}>{EYEBROW}</Kicker>
        </FadeUp>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: 190,
            lineHeight: 1,
            color: COLORS.text,
            letterSpacing: '0.01em',
            scale: String(brandScale),
            opacity: fadeIn(frame, 6, 34),
            textShadow: '0 10px 60px rgba(0,0,0,0.7)',
          }}
        >
          {BRAND}
        </div>
        <FadeUp delay={26} style={{ marginTop: 26 }}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 500,
              fontSize: 46,
              letterSpacing: '0.22em',
              color: COLORS.goldBright,
            }}
          >
            {BRAND_SUB}
          </div>
        </FadeUp>
      </AbsoluteFill>
      <Subtitle text={SUBTITLES.intro} delay={40} />
    </AbsoluteFill>
  );
}

import { AbsoluteFill } from 'remotion';
import { KenBurnsClip } from '../components/Clip';
import { FadeUp, Subtitle, Vignette } from '../components/ui';
import { COLORS } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { CLIPS } from '../content';
import type { SceneProps } from '../Promo';

export function Scene01Intro({ promo }: SceneProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <KenBurnsClip
        src={CLIPS.trial}
        trimBefore={720}
        durationInFrames={promo.scenes.intro.dur}
        scaleFrom={1.05}
        scaleTo={1.14}
        blur={2}
        brightness={0.42}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(8,5,2,0.78), rgba(8,5,2,0.32) 46%, rgba(8,5,2,0.78))' }} />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <FadeUp delay={3}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: '0.18em',
              color: COLORS.gold,
              marginBottom: 24,
            }}
          >
            真实案件 · 多智能体法庭
          </div>
        </FadeUp>
        <FadeUp delay={8} y={34}>
          <div
            style={{
              width: 1420,
              fontFamily: FONT_SERIF,
              fontWeight: 900,
              fontSize: 104,
              lineHeight: 1.12,
              color: COLORS.text,
              textAlign: 'center',
              textShadow: '0 10px 64px rgba(0,0,0,0.85)',
            }}
          >
            你的律师 Agent，
            <br />
            能打赢一场官司吗？
          </div>
        </FadeUp>
      </AbsoluteFill>
      <Subtitle text={promo.subtitles.intro} delay={22} />
    </AbsoluteFill>
  );
}

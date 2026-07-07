import { AbsoluteFill } from 'remotion';
import { KenBurnsClip } from '../components/Clip';
import { FadeUp, SceneHeading, Vignette } from '../components/ui';
import { COLORS, SCENES } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { ADVANTAGES, CLIPS } from '../content';

function AdvantageCard({ title, copy, delay }: { title: string; copy: string; delay: number }) {
  return (
    <FadeUp delay={delay} y={44}>
      <div
        style={{
          width: 470,
          padding: '44px 38px',
          borderRadius: 18,
          background: COLORS.bgPanelSoft,
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 46, color: COLORS.goldBright }}>{title}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 30, lineHeight: 1.4, color: COLORS.text }}>{copy}</div>
      </div>
    </FadeUp>
  );
}

export function Scene06Advantage() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <KenBurnsClip
        src={CLIPS.court}
        trimBefore={20}
        durationInFrames={SCENES.advantage.dur}
        scaleFrom={1.1}
        scaleTo={1.18}
        blur={8}
        brightness={0.22}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(12,8,4,0.78), rgba(12,8,4,0.9))' }} />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SceneHeading delay={2}>为什么选择 Legal World</SceneHeading>
        <div style={{ display: 'flex', gap: 40, marginTop: 68 }}>
          {ADVANTAGES.map((a, i) => (
            <AdvantageCard key={a.title} title={a.title} copy={a.copy} delay={18 + i * 14} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KenBurnsClip } from '../components/Clip';
import { FadeUp, SceneHeading, Vignette } from '../components/ui';
import { COLORS, SCENES } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { CLIPS, FLOW_STEPS } from '../content';
import { ramp } from '../lib/anim';

const CHIP_START = 34;
const CHIP_GAP = 20;

function StageChip({ step, title, actor, delay }: { step: string; title: string; actor: string; delay: number }) {
  return (
    <FadeUp delay={delay} y={36}>
      <div
        style={{
          width: 244,
          padding: '26px 20px 22px',
          borderRadius: 14,
          background: COLORS.bgPanelSoft,
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 44, color: COLORS.gold }}>{step}</div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, color: COLORS.text }}>{title}</div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 20,
            color: COLORS.textMuted,
            border: `1px solid ${COLORS.lineSoft}`,
            borderRadius: 999,
            padding: '3px 14px',
          }}
        >
          {actor}
        </div>
      </div>
    </FadeUp>
  );
}

export function Scene03Flow() {
  const frame = useCurrentFrame();
  const lineW = ramp(frame, CHIP_START, CHIP_START + FLOW_STEPS.length * CHIP_GAP + 40, 0, 1560);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <KenBurnsClip
        src={CLIPS.stage}
        trimBefore={30}
        durationInFrames={SCENES.flow.dur}
        scaleFrom={1.08}
        scaleTo={1.16}
        blur={5}
        brightness={0.26}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(12,8,4,0.7), rgba(12,8,4,0.86))' }} />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SceneHeading delay={4}>完整的诉讼生命周期</SceneHeading>
        <FadeUp delay={14} style={{ marginTop: 16, marginBottom: 60 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: COLORS.textMuted, letterSpacing: '0.08em' }}>
            六个阶段连续推进 · 每一步可参与、可观察、可复盘
          </div>
        </FadeUp>
        <div style={{ position: 'relative', width: 1560, display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              position: 'absolute',
              top: 62,
              left: 0,
              height: 2,
              width: lineW,
              background: COLORS.line,
            }}
          />
          {FLOW_STEPS.map((s, i) => (
            <StageChip
              key={s.step}
              step={s.step}
              title={s.title}
              actor={s.actor}
              delay={CHIP_START + i * CHIP_GAP}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

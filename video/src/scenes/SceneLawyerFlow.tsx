import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { KenBurnsClip } from '../components/Clip';
import { FadeUp, SceneHeading, Subtitle, TopHeadline, Vignette } from '../components/ui';
import { COLORS, SCENES, OVERLAP } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { CLIPS, FLOW_STEPS, SUBTITLES } from '../content';
import { EASE, ramp } from '../lib/anim';

const PHASE_A = 150; // 生命周期快闪
const CHIP_START = 30;
const CHIP_GAP = 18;

function StageChip({ step, title, actor, delay }: { step: string; title: string; actor: string; delay: number }) {
  return (
    <FadeUp delay={delay} y={34}>
      <div
        style={{
          width: 236,
          padding: '22px 18px 20px',
          borderRadius: 14,
          background: COLORS.bgPanelSoft,
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 16px 44px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 40, color: COLORS.gold }}>{step}</div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 28, color: COLORS.text }}>{title}</div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 19,
            color: COLORS.textMuted,
            border: `1px solid ${COLORS.lineSoft}`,
            borderRadius: 999,
            padding: '2px 12px',
          }}
        >
          {actor}
        </div>
      </div>
    </FadeUp>
  );
}

function PhaseFlow() {
  const frame = useCurrentFrame();
  const lineW = ramp(frame, CHIP_START, CHIP_START + FLOW_STEPS.length * CHIP_GAP + 26, 0, 1520);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <KenBurnsClip
        src={CLIPS.stage}
        trimBefore={30}
        durationInFrames={PHASE_A}
        scaleFrom={1.08}
        scaleTo={1.15}
        blur={5}
        brightness={0.24}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(12,8,4,0.72), rgba(12,8,4,0.88))' }} />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SceneHeading delay={4}>人也可以亲自下场</SceneHeading>
        <FadeUp delay={14} style={{ marginTop: 14, marginBottom: 54 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 31, color: COLORS.textMuted, letterSpacing: '0.04em' }}>
            咨询 · 起草 · 庭审发言 · 上诉
          </div>
        </FadeUp>
        <div style={{ position: 'relative', width: 1520, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', top: 58, left: 0, height: 2, width: lineW, background: COLORS.line }} />
          {FLOW_STEPS.map((s, i) => (
            <StageChip key={s.step} step={s.step} title={s.title} actor={s.actor} delay={CHIP_START + i * CHIP_GAP} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function PhaseDraft() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, OVERLAP], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: COLORS.bgDeep }}>
      <OffthreadVideo
        src={staticFile(CLIPS.court)}
        trimBefore={300}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,6,3,0.55), transparent 22%, transparent 62%, rgba(10,6,3,0.75))' }} />
      <Vignette />
      <TopHeadline kicker="你，就是律师" title="亲自起草 · 当庭陈述" delay={4} />
    </AbsoluteFill>
  );
}

export function SceneLawyerFlow() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <Sequence durationInFrames={PHASE_A + OVERLAP} name="flow">
        <PhaseFlow />
      </Sequence>
      <Sequence from={PHASE_A - OVERLAP} durationInFrames={SCENES.lawyer.dur - PHASE_A + OVERLAP} name="draft">
        <PhaseDraft />
      </Sequence>
      <Subtitle text={SUBTITLES.lawyer} delay={12} />
    </AbsoluteFill>
  );
}

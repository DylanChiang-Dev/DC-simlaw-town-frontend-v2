import { AbsoluteFill } from 'remotion';
import { KenBurnsClip } from '../components/Clip';
import { FadeUp, Subtitle, TopHeadline, Vignette } from '../components/ui';
import { COLORS } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { CLIPS } from '../content';

const MODES = [
  { title: '在线体验', copy: '你担任律师，亲自推进案件' },
  { title: 'AI 自动模拟', copy: '观看智能体完整跑完流程' },
] as const;

function ModeCard({ title, copy, delay }: { title: string; copy: string; delay: number }) {
  return (
    <FadeUp delay={delay} y={34}>
      <div
        style={{
          width: 470,
          minHeight: 210,
          borderRadius: 18,
          border: `1px solid ${COLORS.line}`,
          background: 'rgba(30,20,11,0.76)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.48)',
          padding: '34px 38px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 52, color: COLORS.text }}>{title}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 30, lineHeight: 1.35, color: COLORS.textMuted }}>{copy}</div>
      </div>
    </FadeUp>
  );
}

export function SceneModes() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <KenBurnsClip
        src={CLIPS.modes}
        durationInFrames={315}
        scaleFrom={1.02}
        scaleTo={1.08}
        blur={4}
        brightness={0.35}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(12,8,4,0.72), rgba(12,8,4,0.82))' }} />
      <Vignette />
      <TopHeadline kicker="两种参与方式" title="你下场，还是 AI 代打？" delay={6} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 96 }}>
        <div style={{ display: 'flex', gap: 70 }}>
          {MODES.map((mode, index) => (
            <ModeCard key={mode.title} title={mode.title} copy={mode.copy} delay={32 + index * 14} />
          ))}
        </div>
      </AbsoluteFill>
      <Subtitle text="想亲自下场，还是让 AI 全程代打，两种方式随你选" delay={16} />
    </AbsoluteFill>
  );
}

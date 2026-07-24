import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { FadeUp, SceneHeading, Subtitle, Vignette } from '../components/ui';
import { COLORS } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { CLIPS, MCP_STATS } from '../content';
import type { SceneProps } from '../Promo';

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <FadeUp delay={delay} y={26}>
      <div
        style={{
          width: 350,
          padding: '26px 24px',
          borderRadius: 18,
          background: 'rgba(30,20,11,0.82)',
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 22px 64px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 72, color: COLORS.goldBright }}>{value}</div>
        <div style={{ marginTop: 8, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 27, color: COLORS.text }}>
          {label}
        </div>
      </div>
    </FadeUp>
  );
}

export function SceneStats({ promo }: SceneProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <OffthreadVideo
        src={staticFile(CLIPS.mcpPage)}
        trimBefore={35}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.34) blur(4px)' }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,6,3,0.68), rgba(10,6,3,0.84))' }} />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SceneHeading delay={2}>把真实案件丢给智能体</SceneHeading>
        <FadeUp delay={12} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 34, color: COLORS.textMuted }}>
            不是问答演示，是会推进的诉讼环境
          </div>
        </FadeUp>
        <div style={{ display: 'flex', gap: 32, marginTop: 52 }}>
          {MCP_STATS.map((stat, index) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} delay={24 + index * 6} />
          ))}
        </div>
      </AbsoluteFill>
      <Subtitle text={promo.subtitles.stats} delay={18} />
    </AbsoluteFill>
  );
}

import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { FadeUp, SceneHeading, Subtitle, Vignette } from '../components/ui';
import { COLORS, OVERLAP, SCENES } from '../theme';
import { FONT_SANS, FONT_SERIF } from '../fonts';
import { CLIPS, MCP_CAPABILITIES, MCP_STATS, SUBTITLES } from '../content';

const SHOT_A = 95;
const SHOT_B = 185;

function Scrim() {
  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(10,6,3,0.68), rgba(10,6,3,0.25) 38%, rgba(10,6,3,0.78))',
      }}
    />
  );
}

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <FadeUp delay={delay} y={26}>
      <div
        style={{
          width: 338,
          borderRadius: 16,
          padding: '24px 24px 22px',
          background: 'rgba(30,20,11,0.82)',
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 20px 58px rgba(0,0,0,0.48)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontSize: 64, fontWeight: 900, color: COLORS.goldBright }}>{value}</div>
        <div style={{ marginTop: 8, fontFamily: FONT_SANS, fontSize: 26, color: COLORS.text }}>{label}</div>
      </div>
    </FadeUp>
  );
}

function CapabilityCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <FadeUp delay={delay} y={24}>
      <div
        style={{
          width: 360,
          minHeight: 148,
          borderRadius: 16,
          padding: '22px 28px',
          background: 'rgba(20,13,7,0.84)',
          border: `1px solid ${COLORS.lineSoft}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontSize: 58, fontWeight: 900, color: COLORS.gold }}>{value}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 29, color: COLORS.text }}>{label}</div>
      </div>
    </FadeUp>
  );
}

function LandingShot() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <OffthreadVideo
        src={staticFile(CLIPS.mcpLanding)}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28) blur(5px)' }}
      />
      <Scrim />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <FadeUp delay={12}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 34, letterSpacing: '0.18em', color: COLORS.gold }}>
            LEGAL WORLD MCP
          </div>
        </FadeUp>
        <FadeUp delay={22} style={{ marginTop: 18 }}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 900,
              fontSize: 76,
              color: COLORS.text,
              textAlign: 'center',
              textShadow: '0 8px 44px rgba(0,0,0,0.72)',
            }}
          >
            把法律世界开放给你的智能体
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function StatsShot() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <OffthreadVideo
        src={staticFile(CLIPS.mcpPage)}
        trimBefore={60}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45) blur(3px)' }}
      />
      <Scrim />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SceneHeading delay={2}>训练、对抗、评测</SceneHeading>
        <div style={{ display: 'flex', gap: 42, marginTop: 54 }}>
          {MCP_STATS.slice(0, 3).map((stat, index) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} delay={16 + index * 7} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function CapabilityShot() {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 44%, ${COLORS.bgPanel}, ${COLORS.bgDeep})` }}>
      <OffthreadVideo
        src={staticFile(CLIPS.mcpPage)}
        trimBefore={240}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.22) blur(5px)' }}
      />
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SceneHeading delay={0}>MCP 接入你的律师智能体</SceneHeading>
        <FadeUp delay={10} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: COLORS.textMuted }}>
            对话轨迹 · 工具调用 · 文书产物 · Ledger · 自动评估
          </div>
        </FadeUp>
        <div style={{ display: 'flex', gap: 40, marginTop: 56 }}>
          {MCP_CAPABILITIES.map((item, index) => (
            <CapabilityCard key={item.label} value={item.value} label={item.label} delay={22 + index * 9} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function SceneMcp() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <Sequence durationInFrames={SHOT_A + OVERLAP} name="mcp-landing">
        <LandingShot />
      </Sequence>
      <Sequence from={SHOT_A - OVERLAP} durationInFrames={SHOT_B - SHOT_A + OVERLAP} name="mcp-stats">
        <StatsShot />
      </Sequence>
      <Sequence from={SHOT_B - OVERLAP} durationInFrames={SCENES.mcp.dur - SHOT_B + OVERLAP} name="mcp-capabilities">
        <CapabilityShot />
      </Sequence>
      <Subtitle text={SUBTITLES.mcp} delay={18} />
    </AbsoluteFill>
  );
}

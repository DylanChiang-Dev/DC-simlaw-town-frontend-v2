import { AbsoluteFill } from 'remotion';
import { RegionClip } from '../components/Clip';
import { FadeUp, SceneHeading, Vignette } from '../components/ui';
import { COLORS } from '../theme';
import { FONT_SANS } from '../fonts';
import { CLIPS } from '../content';

const BOX_W = 812;
const BOX_H = 536;

function Panel({
  originX,
  originY,
  scale,
  caption,
  delay,
  trimBefore,
}: {
  originX: number;
  originY: number;
  scale: number;
  caption: string;
  delay: number;
  trimBefore: number;
}) {
  return (
    <FadeUp delay={delay} y={40}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${COLORS.line}`,
            overflow: 'hidden',
            boxShadow: '0 26px 70px rgba(0,0,0,0.5)',
          }}
        >
          <RegionClip
            src={CLIPS.stage}
            trimBefore={trimBefore}
            originX={originX}
            originY={originY}
            scale={scale}
            boxW={BOX_W}
            boxH={BOX_H}
          />
        </div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 32, color: COLORS.text }}>{caption}</div>
      </div>
    </FadeUp>
  );
}

export function Scene05Observable() {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${COLORS.bgPanel}, ${COLORS.bgDeep})`,
      }}
    >
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SceneHeading delay={2}>过程，可观察</SceneHeading>
        <FadeUp delay={12} style={{ marginTop: 14, marginBottom: 52 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: COLORS.textMuted, letterSpacing: '0.08em' }}>
            工具调用 · 技能记忆 · 空间雷达，全程可追踪
          </div>
        </FadeUp>
        <div style={{ display: 'flex', gap: 64 }}>
          <Panel
            originX={0.07}
            originY={0.46}
            scale={2.5}
            caption="工具 · 技能 · 记忆"
            delay={22}
            trimBefore={120}
          />
          <Panel
            originX={0.9}
            originY={0.82}
            scale={2.9}
            caption="小镇雷达 · 空间化流程"
            delay={34}
            trimBefore={120}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

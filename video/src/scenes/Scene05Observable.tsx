import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { FadeUp, SceneHeading, Subtitle, Vignette } from '../components/ui';
import { COLORS } from '../theme';
import { FONT_SANS } from '../fonts';
import { CLIPS } from '../content';
import type { SceneProps } from '../Promo';

// 精准裁切的面板/雷达特写卡片（原生分辨率，锐利）
function Card({
  src,
  w,
  h,
  caption,
  delay,
  trimBefore,
}: {
  src: string;
  w: number;
  h: number;
  caption: string;
  delay: number;
  trimBefore: number;
}) {
  return (
    <FadeUp delay={delay} y={40}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div
          style={{
            width: w,
            height: h,
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${COLORS.line}`,
            boxShadow: '0 26px 70px rgba(0,0,0,0.55)',
          }}
        >
          <OffthreadVideo
            src={staticFile(src)}
            trimBefore={trimBefore}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, color: COLORS.text }}>{caption}</div>
      </div>
    </FadeUp>
  );
}

export function Scene05Observable({ promo }: SceneProps) {
  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(circle at 50% 38%, ${COLORS.bgPanel}, ${COLORS.bgDeep})` }}
    >
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 92 }}>
        <SceneHeading delay={2}>看得见的 AI</SceneHeading>
        <FadeUp delay={12} style={{ marginTop: 12 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 28, color: COLORS.textMuted, letterSpacing: '0.08em' }}>
            工具调用 · 法条检索 · 记忆写入，每一步都摊开给你看
          </div>
        </FadeUp>
        <div style={{ display: 'flex', gap: 72, marginTop: 56, alignItems: 'flex-start' }}>
          <Card src={CLIPS.panel} w={452} h={476} caption="工具 · 技能 · 记忆" delay={20} trimBefore={300} />
          <Card src={CLIPS.radar} w={620} h={476} caption="小镇雷达 · 空间化流程" delay={30} trimBefore={270} />
        </div>
      </AbsoluteFill>
      <Subtitle text={promo.subtitles.observable} delay={14} />
    </AbsoluteFill>
  );
}

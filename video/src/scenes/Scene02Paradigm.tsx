import { AbsoluteFill } from 'remotion';
import { KenBurnsClip } from '../components/Clip';
import { BottomScrim, LowerThird, Vignette } from '../components/ui';
import { COLORS, SCENES } from '../theme';
import { CLIPS } from '../content';

export function Scene02Paradigm() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <KenBurnsClip
        src={CLIPS.stage}
        trimBefore={60}
        durationInFrames={SCENES.paradigm.dur}
        scaleFrom={1.02}
        scaleTo={1.1}
        yFrom={0}
        yTo={-2}
        brightness={0.96}
      />
      <Vignette />
      <BottomScrim />
      <LowerThird
        kicker="视觉小说式交互"
        title="角色立绘 + 逐句对话，把一桩案件娓娓道来"
        delay={12}
      />
    </AbsoluteFill>
  );
}

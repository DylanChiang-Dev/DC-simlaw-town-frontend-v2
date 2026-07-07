import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { OffthreadVideo, staticFile } from 'remotion';
import { BottomScrim, LowerThird, PulseRing, Vignette } from '../components/ui';
import { COLORS } from '../theme';
import { CLIPS } from '../content';

// 庭审发言弹窗（clip-court 9s 起），保持画面静止以便高亮对齐按钮
export function Scene04Lawyer() {
  const frame = useCurrentFrame();
  // AI 润色稿约在裁切后第 180 帧（原始 15~16s）出现，之后再高亮按钮
  const showRing = frame > 150;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <OffthreadVideo
        src={staticFile(CLIPS.court)}
        trimBefore={270}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Vignette />
      {showRing ? <PulseRing x={1406} y={947} r={64} label="AI 润色" /> : null}
      <BottomScrim height={360} />
      <LowerThird
        kicker="你，就是律师 · 关键决策由你拍板"
        title="起草文书 · 举证质证 · 参与辩论"
        delay={10}
      />
    </AbsoluteFill>
  );
}

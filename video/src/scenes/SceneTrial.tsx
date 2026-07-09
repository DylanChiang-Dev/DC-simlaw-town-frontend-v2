import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Subtitle, TopHeadline, Vignette } from '../components/ui';
import { COLORS, OVERLAP, SCENES } from '../theme';
import { CLIPS, SUBTITLES } from '../content';
import { EASE } from '../lib/anim';

const SHOT_A = 165; // 对方律师赵雪
const SCRIM = 'linear-gradient(180deg, rgba(10,6,3,0.5), transparent 20%, transparent 66%, rgba(10,6,3,0.72))';

// clip-trial：对方律师赵雪约在 20s、法官刘正约在 35s
function TrialShot({ trimBefore, fade }: { trimBefore: number; fade: boolean }) {
  const frame = useCurrentFrame();
  const opacity = fade
    ? interpolate(frame, [0, OVERLAP], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: EASE,
      })
    : 1;
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: COLORS.bgDeep }}>
      <OffthreadVideo
        src={staticFile(CLIPS.trial)}
        trimBefore={trimBefore}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <AbsoluteFill style={{ background: SCRIM }} />
      <Vignette />
    </AbsoluteFill>
  );
}

export function SceneTrial() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <Sequence durationInFrames={SHOT_A + OVERLAP} name="opponent">
        <TrialShot trimBefore={750} fade={false} />
      </Sequence>
      <Sequence from={SHOT_A - OVERLAP} durationInFrames={SCENES.trial.dur - SHOT_A + OVERLAP} name="judge">
        <TrialShot trimBefore={1680} fade />
      </Sequence>
      <TopHeadline kicker="法庭上，对手也是 AI" title="多智能体对抗庭审" delay={8} />
      <Subtitle text={SUBTITLES.trial} delay={12} />
    </AbsoluteFill>
  );
}

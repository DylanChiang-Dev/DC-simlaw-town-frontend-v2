import type { ReactNode } from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { COLORS, OVERLAP, SCENES } from './theme';
import { EASE } from './lib/anim';
import { Scene01Intro } from './scenes/Scene01Intro';
import { Scene02Paradigm } from './scenes/Scene02Paradigm';
import { Scene03Flow } from './scenes/Scene03Flow';
import { Scene04Lawyer } from './scenes/Scene04Lawyer';
import { Scene05Observable } from './scenes/Scene05Observable';
import { Scene06Advantage } from './scenes/Scene06Advantage';
import { Scene07Outro } from './scenes/Scene07Outro';

// 进入时交叉溶解（前 OVERLAP 帧淡入，叠在上一场景之上）
function Dissolve({ children }: { children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, OVERLAP], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

const ORDER = [
  { key: 'intro', s: SCENES.intro, C: Scene01Intro },
  { key: 'paradigm', s: SCENES.paradigm, C: Scene02Paradigm },
  { key: 'flow', s: SCENES.flow, C: Scene03Flow },
  { key: 'lawyer', s: SCENES.lawyer, C: Scene04Lawyer },
  { key: 'observable', s: SCENES.observable, C: Scene05Observable },
  { key: 'advantage', s: SCENES.advantage, C: Scene06Advantage },
  { key: 'outro', s: SCENES.outro, C: Scene07Outro },
] as const;

export function Promo() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      {ORDER.map(({ key, s, C }) => (
        <Sequence key={key} from={s.from} durationInFrames={s.dur} name={key}>
          <Dissolve>
            <C />
          </Dissolve>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

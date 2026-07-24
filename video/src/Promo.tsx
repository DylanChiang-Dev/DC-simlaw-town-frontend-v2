import type { ReactNode } from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, OVERLAP } from './theme';
import { EASE } from './lib/anim';
import { BGM_FILE, PROMO_VARIANTS, type PromoVariant } from './content';
import { Scene01Intro } from './scenes/Scene01Intro';
import { SceneStats } from './scenes/SceneStats';
import { SceneLawyerFlow } from './scenes/SceneLawyerFlow';
import { SceneTrial } from './scenes/SceneTrial';
import { Scene05Observable } from './scenes/Scene05Observable';
import { SceneMcp } from './scenes/SceneMcp';
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
  { key: 'intro', C: Scene01Intro },
  { key: 'stats', C: SceneStats },
  { key: 'lawyer', C: SceneLawyerFlow },
  { key: 'trial', C: SceneTrial },
  { key: 'observable', C: Scene05Observable },
  { key: 'mcp', C: SceneMcp },
  { key: 'outro', C: Scene07Outro },
] as const;

export function Promo({ variant = 'v5' }: { variant?: keyof typeof PROMO_VARIANTS }) {
  const promo = PROMO_VARIANTS[variant];
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <Audio
        src={staticFile(BGM_FILE)}
        volume={(frame) =>
          interpolate(frame, [0, 45, promo.totalFrames - 75, promo.totalFrames - 1], [0, 0.11, 0.11, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      {ORDER.map(({ key, C }) => {
        const s = promo.scenes[key];
        return (
        <Sequence key={key} from={s.from} durationInFrames={s.dur} name={key}>
          <Audio src={staticFile(promo.voiceoverFiles[key])} volume={0.95} />
          <Dissolve>
            <C promo={promo} />
          </Dissolve>
        </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

export type SceneProps = {
  promo: PromoVariant;
};

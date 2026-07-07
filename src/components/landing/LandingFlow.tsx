import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import {
  LANDING_FLOW_STEPS,
  LANDING_FLOW_SUBTITLE,
  LANDING_FLOW_TITLE,
  type LandingFlowActor,
  type LandingFlowStep,
} from '../../config/projectInfo';
import { useRevealOnScroll } from './useRevealOnScroll';

const ACTOR_TONE: Record<LandingFlowActor, string> = {
  玩家参与: 'landing-flow-actor--player',
  'AI 智能体': 'landing-flow-actor--agent',
  '玩家 × AI': 'landing-flow-actor--mixed',
};

type StepProps = {
  flowStep: LandingFlowStep;
  index: number;
};

function LandingFlowStepCard({ flowStep, index }: StepProps) {
  const revealRef = useRevealOnScroll<HTMLLIElement>();

  return (
    <li
      className="landing-flow-step"
      ref={revealRef}
      style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
    >
      <span className="landing-flow-step-number">{flowStep.step}</span>
      <h3>{flowStep.title}</h3>
      <p>{flowStep.copy}</p>
      <span className={`landing-flow-actor ${ACTOR_TONE[flowStep.actor]}`}>{flowStep.actor}</span>
    </li>
  );
}

export const LandingFlow = forwardRef<HTMLElement>(function LandingFlow(_props, ref) {
  return (
    <section className="landing-flow" aria-label="诉讼全流程" ref={ref}>
      <div className="landing-section-header">
        <span className="landing-section-eyebrow">Litigation Lifecycle</span>
        <h2>{LANDING_FLOW_TITLE}</h2>
        <p>{LANDING_FLOW_SUBTITLE}</p>
      </div>
      <ol className="landing-flow-steps">
        {LANDING_FLOW_STEPS.map((flowStep, index) => (
          <LandingFlowStepCard flowStep={flowStep} index={index} key={flowStep.step} />
        ))}
      </ol>
    </section>
  );
});

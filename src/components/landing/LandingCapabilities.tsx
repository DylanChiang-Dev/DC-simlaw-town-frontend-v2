import { LANDING_CAPABILITIES, LANDING_CAPABILITIES_TITLE } from '../../config/projectInfo';
import { useRevealOnScroll } from './useRevealOnScroll';

type CardProps = {
  title: string;
  copy: string;
  index: number;
};

function LandingCapabilityCard({ title, copy, index }: CardProps) {
  const revealRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <div className="landing-capability" ref={revealRef}>
      <span className="landing-capability-index">{String(index + 1).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}

export function LandingCapabilities() {
  return (
    <section className="landing-capabilities-section" aria-labelledby="landing-capabilities-title">
      <div className="landing-section-header">
        <span className="landing-section-eyebrow">Why Legal World</span>
        <h2 id="landing-capabilities-title">{LANDING_CAPABILITIES_TITLE}</h2>
      </div>
      <div className="landing-capabilities">
        {LANDING_CAPABILITIES.map((capability, index) => (
          <LandingCapabilityCard
            copy={capability.copy}
            index={index}
            key={capability.title}
            title={capability.title}
          />
        ))}
      </div>
    </section>
  );
}

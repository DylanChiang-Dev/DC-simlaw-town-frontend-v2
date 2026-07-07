import {
  LANDING_SHOWCASE_ITEMS,
  LANDING_SHOWCASE_TITLE,
  type LandingShowcaseItem,
} from '../../config/projectInfo';
import { useRevealOnScroll } from './useRevealOnScroll';

type RowProps = {
  item: LandingShowcaseItem;
  index: number;
};

function LandingShowcaseRow({ item, index }: RowProps) {
  const revealRef = useRevealOnScroll<HTMLDivElement>();
  const isReversed = index % 2 === 1;

  const media = (
    <div className="landing-showcase-media" key="media">
      <img alt={item.alt} src={item.image} />
    </div>
  );
  const copy = (
    <div className="landing-showcase-copy" key="copy">
      <h3>{item.title}</h3>
      <p>{item.copy}</p>
      <ul className="landing-showcase-bullets">
        {item.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="landing-showcase-row" ref={revealRef}>
      {isReversed ? [copy, media] : [media, copy]}
    </div>
  );
}

export function LandingShowcase() {
  return (
    <section className="landing-showcase" aria-labelledby="landing-showcase-title">
      <div className="landing-section-header">
        <span className="landing-section-eyebrow">Product Showcase</span>
        <h2 id="landing-showcase-title">{LANDING_SHOWCASE_TITLE}</h2>
      </div>
      <div className="landing-showcase-rows">
        {LANDING_SHOWCASE_ITEMS.map((item, index) => (
          <LandingShowcaseRow index={index} item={item} key={item.title} />
        ))}
      </div>
    </section>
  );
}

import {
  LANDING_HERO_EYEBROW,
  LANDING_HERO_SUBTITLE,
  LANDING_HERO_TITLE,
  LANDING_MCP_CTA,
  LANDING_PRIMARY_CTA,
  LANDING_PROJECT_URL,
  LANDING_SECONDARY_CTA,
} from '../../config/projectInfo';

const LANDING_HERO_BACKDROP = '/art/vn/bg-courtroom.png';
const MCP_PAGE_HREF = `${import.meta.env.BASE_URL}mcp`;

const LANDING_HERO_CAST = [
  {
    image: '/art/vn/char-lawyer-wang-xiaoming-confident.png',
    alt: '原告律师王晓明',
  },
  {
    image: '/art/vn/char-judge-serious.png',
    alt: '法官',
  },
  {
    image: '/art/vn/char-defense-lawyer-zhao-xue-confident.png',
    alt: '被告律师赵雪',
  },
] as const;

type Props = {
  onStartExperience: () => void;
};

export function LandingHero({ onStartExperience }: Props) {
  return (
    <section className="landing-hero" aria-labelledby="landing-hero-title">
      <div aria-hidden="true" className="landing-hero-atmosphere" />
      <div className="landing-hero-content">
        <h1 className="landing-title" id="landing-hero-title">{LANDING_HERO_TITLE}</h1>
        <p className="landing-subtitle">{LANDING_HERO_SUBTITLE}</p>
        <div className="landing-hero-keywords" aria-label="核心能力">
          {LANDING_HERO_EYEBROW.split('｜').map((keyword) => (
            <span className="landing-hero-keyword" key={keyword}>{keyword}</span>
          ))}
        </div>
        <div className="landing-cta-row">
          <button className="landing-primary-cta" onClick={onStartExperience} type="button">
            {LANDING_PRIMARY_CTA}
          </button>
          <a className="landing-mcp-cta" href={MCP_PAGE_HREF}>
            <svg
              aria-hidden="true"
              className="landing-mcp-cta-icon"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 7 4 12l5 5M15 7l5 5-5 5M13 4l-2 16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            {LANDING_MCP_CTA}
          </a>
          <a
            className="landing-secondary-cta"
            href={LANDING_PROJECT_URL}
            rel="noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="landing-secondary-cta-icon"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.58 2 12.24c0 4.52 2.87 8.36 6.84 9.72.5.09.68-.22.68-.49 0-.24-.01-.89-.01-1.75-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.39 9.39 0 0 1 12 6.98c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.14 10.14 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z"
                fill="currentColor"
              />
            </svg>
            {LANDING_SECONDARY_CTA}
          </a>
        </div>
      </div>
    </section>
  );
}

export function LandingHeroVisual() {
  return (
    <section className="landing-hero-visual-section" aria-label="Legal World 法庭角色场景">
      <div
        className="landing-hero-frame landing-hero-scene-card"
        aria-label="Legal World 法庭角色场景预览"
      >
        <img
          alt=""
          aria-hidden="true"
          className="landing-hero-scene-backdrop"
          src={LANDING_HERO_BACKDROP}
        />
        <div className="landing-hero-scene-cast">
          {LANDING_HERO_CAST.map((character) => (
            <img
              alt={character.alt}
              className="landing-hero-scene-figure"
              key={character.image}
              src={character.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

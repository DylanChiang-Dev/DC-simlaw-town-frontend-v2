import { LANDING_INSTITUTION_LOCKUPS } from '../../config/projectInfo';

export function LandingNav() {
  return (
    <header className="landing-nav">
      <section className="landing-institution-brand" aria-label="联合机构">
        {LANDING_INSTITUTION_LOCKUPS.map((institution) => (
          <img
            alt={institution.name}
            className="landing-institution-lockup"
            key={institution.logo}
            src={institution.logo}
          />
        ))}
      </section>
    </header>
  );
}

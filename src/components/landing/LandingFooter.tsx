import {
  LANDING_FOOTER_COPYRIGHT,
  LANDING_INSTITUTIONS,
  PROJECT_CONTACT_EMAIL,
} from '../../config/projectInfo';

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-brand">
        <span className="landing-brand-mark">Legal World</span>
        <span className="landing-brand-sub">法律全流程仿真系统</span>
      </div>
      <div className="landing-footer-institutions">
        {LANDING_INSTITUTIONS.map((institution) => (
          <span key={institution.name}>{institution.name}</span>
        ))}
        <a href={`mailto:${PROJECT_CONTACT_EMAIL}`}>{PROJECT_CONTACT_EMAIL}</a>
      </div>
      <p className="landing-footer-copyright">{LANDING_FOOTER_COPYRIGHT}</p>
    </footer>
  );
}

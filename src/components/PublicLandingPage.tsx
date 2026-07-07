import { useEffect } from 'react';
import { LandingCapabilities } from './landing/LandingCapabilities';
import { LandingFlow } from './landing/LandingFlow';
import { LandingFooter } from './landing/LandingFooter';
import { LandingHero, LandingHeroVisual } from './landing/LandingHero';
import { LandingNav } from './landing/LandingNav';
import { LandingShowcase } from './landing/LandingShowcase';

type Props = {
  onStartExperience: () => void;
};

export function PublicLandingPage({ onStartExperience }: Props) {
  useEffect(() => {
    document.body.classList.add('landing-route');
    return () => document.body.classList.remove('landing-route');
  }, []);

  return (
    <main className="public-landing">
      <LandingNav />
      <LandingHero onStartExperience={onStartExperience} />
      <LandingFlow />
      <LandingHeroVisual />
      <LandingShowcase />
      <LandingCapabilities />
      <LandingFooter />
    </main>
  );
}

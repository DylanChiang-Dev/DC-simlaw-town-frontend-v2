import './index.css';
import { Composition } from 'remotion';
import { Promo } from './Promo';
import { PROMO_VARIANTS } from './content';
import { FPS } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LegalWorldPromo"
        component={Promo}
        durationInFrames={PROMO_VARIANTS.v4.totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ variant: 'v4' }}
      />
      <Composition
        id="LegalWorldPromoV5"
        component={Promo}
        durationInFrames={PROMO_VARIANTS.v5.totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ variant: 'v5' }}
      />
      <Composition
        id="LegalWorldPromoV4"
        component={Promo}
        durationInFrames={PROMO_VARIANTS.v4.totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ variant: 'v4' }}
      />
    </>
  );
};

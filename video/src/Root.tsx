import './index.css';
import { Composition } from 'remotion';
import { Promo } from './Promo';
import { FPS, TOTAL_FRAMES } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LegalWorldPromo"
        component={Promo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

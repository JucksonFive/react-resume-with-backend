import {FC, useCallback} from 'react';

import MagneticButton from '../../motion/MagneticButton';

const HeroCTA: FC = () => {
  const openChat = useCallback((): void => {
    globalThis.dispatchEvent(new CustomEvent('chat:open'));
  }, []);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <MagneticButton
        className="bg-primary text-white hover:bg-primary/90 shadow-[0_8px_24px_-12px_rgba(79,70,229,0.6)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        href="#projects"
        size="lg"
        variant="default">
        See my work
      </MagneticButton>
      <MagneticButton
        ariaLabel="Contact me — open chat"
        className="bg-white text-neutral-900 hover:bg-white/90 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={openChat}
        size="lg"
        variant="secondary">
        Contact me
      </MagneticButton>
    </div>
  );
};

HeroCTA.displayName = 'HeroCTA';

export default HeroCTA;

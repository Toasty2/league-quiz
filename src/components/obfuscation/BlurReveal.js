import React from 'react';

const MAX_BLUR_PX = 25;

function BlurReveal({ proxyUrl, alt, className, progress }) {
  return (
    <img
      src={proxyUrl}
      alt={alt}
      className={className}
      style={{ filter: `blur(${(1 - progress) * MAX_BLUR_PX}px)` }}
    />
  );
}

// Ms to go from fully obscured to fully revealed
BlurReveal.durationMs = 30000;

export default BlurReveal;

import React from 'react';
// import BlurReveal from './BlurReveal';
import PixelateReveal from './PixelateReveal';

// Hard mode techniques: components taking { proxyUrl, alt, className, progress }, progress 0 (obscured) to 1 (revealed)
const TECHNIQUES = {
  // blur: BlurReveal,
  pixelate: PixelateReveal,
};

const TECHNIQUE_IDS = Object.keys(TECHNIQUES);
const DEFAULT_DURATION_MS = 30000;

export function pickRandomTechnique() {
  return TECHNIQUE_IDS[Math.floor(Math.random() * TECHNIQUE_IDS.length)];
}

export function getRevealDuration(techniqueId) {
  var Technique = TECHNIQUES[techniqueId];
  return (Technique && Technique.durationMs) || DEFAULT_DURATION_MS;
}

export function renderObfuscated(techniqueId, props) {
  var Technique = TECHNIQUES[techniqueId] || PixelateReveal;
  return <Technique {...props} />;
}

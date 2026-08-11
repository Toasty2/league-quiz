import React from 'react';

// durationMs/preload live on the wrapper since neither is readable without eagerly loading the real component.
function declareTechnique(importTechnique, durationMs) {
  var Component = React.lazy(importTechnique);
  Component.durationMs = durationMs;
  Component.preload = importTechnique;
  return Component;
}

const BlurReveal = declareTechnique(() => import('./BlurReveal'), 30000);
const LiquidReveal = declareTechnique(() => import('./LiquidReveal'), 30000);
const MosaicReveal = declareTechnique(() => import('./MosaicReveal'), 30000);
const SpiraliseReveal = declareTechnique(() => import('./SpiraliseReveal'), 30000);
const ZoomReveal = declareTechnique(() => import('./ZoomReveal'), 30000);
const PixellateReveal = declareTechnique(() => import('./PixellateReveal'), 30000);

// Hard mode cycles this by round number - not randomised, same for every player.
const TECHNIQUE_SEQUENCE = [PixellateReveal, BlurReveal, SpiraliseReveal, ZoomReveal, LiquidReveal];

// Challenger reuses this set with MosaicReveal in place of PixellateReveal.
const CHALLENGER_TECHNIQUES = [MosaicReveal, BlurReveal, SpiraliseReveal, ZoomReveal, LiquidReveal];

const DEFAULT_DURATION_MS = 30000;

export function getTechniqueForRound(round) {
  return TECHNIQUE_SEQUENCE[round % TECHNIQUE_SEQUENCE.length];
}

// Shuffled once per game; plays each technique exactly twice.
export function buildChallengerSequence() {
  var sequence = CHALLENGER_TECHNIQUES.concat(CHALLENGER_TECHNIQUES);
  for (var i = sequence.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }
  return sequence;
}

export function getRevealDuration(technique) {
  return technique.durationMs || DEFAULT_DURATION_MS;
}

// Preloads every chunk a difficulty could use, so Suspense never actually suspends.
export function preloadTechniques(difficulty) {
  var techniques = difficulty === 'challenger' ? CHALLENGER_TECHNIQUES
    : difficulty === 'hard' ? TECHNIQUE_SEQUENCE
    : [];

  return Promise.all(techniques.map((technique) => technique.preload()));
}

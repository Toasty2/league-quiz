import BlurReveal from './BlurReveal';
import LiquidReveal from './LiquidReveal';
import MosaicReveal from './MosaicReveal';
import SpiraliseReveal from './SpiraliseReveal';
import ZoomReveal from './ZoomReveal';
import PixellateReveal from './PixellateReveal';

// Hard mode walks this fixed sequence by round number (round 0 = the first
// question), looping back to the start once it runs out - not randomised,
// so every player gets the same technique on the same round. Add another
// technique by just adding another entry here.
const TECHNIQUE_SEQUENCE = [PixellateReveal, BlurReveal, SpiraliseReveal, ZoomReveal, LiquidReveal];

// Challenger reuses this set with MosaicReveal in place of PixellateReveal.
const CHALLENGER_TECHNIQUES = [MosaicReveal, BlurReveal, SpiraliseReveal, ZoomReveal, LiquidReveal];

const DEFAULT_DURATION_MS = 30000;

export function getTechniqueForRound(round) {
  return TECHNIQUE_SEQUENCE[round % TECHNIQUE_SEQUENCE.length];
}

// Challenger plays each technique exactly twice, but shuffles the order once
// per game rather than walking a fixed sequence.
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

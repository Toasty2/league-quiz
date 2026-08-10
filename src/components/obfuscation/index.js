import BlurReveal from './BlurReveal';
import SpiraliseReveal from './SpiraliseReveal';
import PixellateReveal from './PixellateReveal';

// Hard mode walks this fixed sequence by round number (round 0 = the first
// question), looping back to the start once it runs out - not randomised,
// so every player gets the same technique on the same round. Add another
// technique by just adding another entry here.
const TECHNIQUE_SEQUENCE = [PixellateReveal, BlurReveal, SpiraliseReveal];

const DEFAULT_DURATION_MS = 30000;

export function getTechniqueForRound(round) {
  return TECHNIQUE_SEQUENCE[round % TECHNIQUE_SEQUENCE.length];
}

export function getRevealDuration(technique) {
  return technique.durationMs || DEFAULT_DURATION_MS;
}

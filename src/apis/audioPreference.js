const MUTE_STORAGE_KEY = 'league-quiz-muted';

// Kept separate from sound.js (which requires the actual audio files) so
// components can check/display mute state without pulling audio into the
// bundle. Defaults to muted when no preference has been stored yet.
export function isMuted() {
  var stored = localStorage.getItem(MUTE_STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

export function setMuted(muted) {
  localStorage.setItem(MUTE_STORAGE_KEY, muted ? 'true' : 'false');
}

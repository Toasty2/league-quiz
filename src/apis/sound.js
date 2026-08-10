const MUTE_STORAGE_KEY = 'league-quiz-muted';

const SFX_PATHS = {
  buttonPress: require('../assets/audio/button.wav')
};

const MUSIC_PATH = require('../assets/audio/bgm.wav');

var musicElement = null;

export function isMuted() {
  return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
}

export function setMuted(muted) {
  localStorage.setItem(MUTE_STORAGE_KEY, muted ? 'true' : 'false');

  if (musicElement) {
    muted ? musicElement.pause() : musicElement.play().catch(() => {});
  }
}

export function toggleMute() {
  setMuted(!isMuted());
  return isMuted();
}

export function playSfx(name) {
  if (isMuted()) {
    return;
  }

  var path = SFX_PATHS[name];
  if (!path) {
    return;
  }

  new Audio(path).play().catch(() => {});
}

// Starts the looping background track - call synchronously from the same
// click handler that starts the quiz, so it counts as user-gestured.
export function startMusic() {
  if (!musicElement) {
    musicElement = new Audio(MUSIC_PATH);
    musicElement.loop = true;
  }

  if (!isMuted()) {
    musicElement.play().catch(() => {});
  }
}

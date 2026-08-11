import { isMuted } from './audioPreference';

const SFX_PATHS = {
  buttonPress: require('../assets/audio/button.wav')
};

const MUSIC_PATH = require('../assets/audio/bgm.mp3');

var musicElement = null;

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

// Call synchronously from a click handler so it counts as user-gestured.
export function startMusic() {
  if (!musicElement) {
    musicElement = new Audio(MUSIC_PATH);
    musicElement.loop = true;
  }

  musicElement.play().catch(() => {});
}

export function stopMusic() {
  if (musicElement) {
    musicElement.pause();
  }
}

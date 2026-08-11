import React from 'react';
import { isMuted, setMuted } from '../apis/audioPreference';
import VolumeHighIcon from './icons/VolumeHighIcon';
import VolumeXmarkIcon from './icons/VolumeXmarkIcon';

class AudioToggle extends React.Component {
  state = {
    muted: isMuted()
  };

  // sound.js (and the audio files it requires) is only ever reached via this
  // dynamic import - never loaded until the toggle is actually clicked.
  toggle = () => {
    var nextMuted = !this.state.muted;

    setMuted(nextMuted);
    this.setState({ muted: nextMuted });

    import('../apis/sound').then(({ startMusic, stopMusic }) => {
      nextMuted ? stopMusic() : startMusic();
    });
  }

  render() {
    return (
      <button
        type="button"
        className="audio-toggle"
        onClick={this.toggle}
        aria-label={this.state.muted ? 'Unmute audio' : 'Mute audio'}
      >
        {this.state.muted ? <VolumeXmarkIcon /> : <VolumeHighIcon />}
      </button>
    );
  }
}

export default AudioToggle;

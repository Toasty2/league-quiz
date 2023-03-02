import React from 'react';
import { useStopwatch } from 'react-timer-hook';

function Stopwatch() {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      reset,
    } = useStopwatch({ autoStart: false });
  
  
    return (
      <div style={{textAlign: 'center'}}>
        <div className="stopwatch">
          <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={reset}>Reset</button>
      </div>
    );
  }
  
export default Stopwatch;
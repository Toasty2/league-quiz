export function formatElapsedTime(totalMs) {
  var totalSeconds = Math.floor(totalMs / 1000);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  var milliseconds = totalMs % 1000;
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

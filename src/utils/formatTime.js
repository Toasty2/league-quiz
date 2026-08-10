export function formatElapsedTime(totalMs) {
  var totalSeconds = Math.floor(totalMs / 1000);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  var tenths = Math.floor((totalMs % 1000) / 100);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

const PLAYER_NAME_COOKIE = 'league-quiz-player-name';
const EXPIRY_DAYS = 7;

// Cookie rather than localStorage - Max-Age is a native, browser-enforced
// expiry, so a returning-after-a-while player genuinely gets a blank field
// again rather than the app having to check and clear a timestamp itself.
export function getPlayerName() {
  var match = document.cookie.match(new RegExp('(?:^|; )' + PLAYER_NAME_COOKIE + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

export function setPlayerName(name) {
  var maxAgeSeconds = EXPIRY_DAYS * 24 * 60 * 60;
  document.cookie = `${PLAYER_NAME_COOKIE}=${encodeURIComponent(name)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

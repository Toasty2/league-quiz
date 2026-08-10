export async function getLatestVersion() {
  const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await res.json();
  return versions[0];
}

export async function getChampionList(version) {
  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
  const data = await res.json();
  // Skin-line variant entries (e.g. "Jade_Wukong") share a display name with
  // the base champion but use an underscored id - filter them out.
  return Object.values(data.data).filter((c) => !c.id.includes('_'));
}

export async function getChampionSkins(version, champId) {
  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${champId}.json`);
  const data = await res.json();
  return data.data[champId].skins.map((skin) => skin.num);
}

export function getSplashArtUrl(champId, skinNum = 0) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champId}_${skinNum}.jpg`;
}

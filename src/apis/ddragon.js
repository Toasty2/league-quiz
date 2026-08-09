import axios from 'axios';

// Fetch the current patch version and full champion list once per app
// session and cache the promises, so every component/round shares the
// same data instead of re-fetching it.
let versionPromise = null;
let championListPromise = null;

export function getLatestVersion() {
    if (!versionPromise) {
        versionPromise = axios
            .get('https://ddragon.leagueoflegends.com/api/versions.json')
            .then(response => response.data[0]);
    }
    return versionPromise;
}

export function getChampionList() {
    if (!championListPromise) {
        championListPromise = getLatestVersion().then(version =>
            axios
                .get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)
                .then(response => ({
                    version,
                    // Skin-line variant entries (e.g. "Jade_Wukong") share a
                    // display name with the base champion but use an
                    // underscored id, unlike any real champion id. Filter
                    // them out so each name maps to the actual base champion.
                    champions: Object.values(response.data.data).filter(champ => !champ.id.includes('_')),
                }))
        );
    }
    return championListPromise;
}

// Data Dragon keys champion data by a normalised id, not the display name
// (e.g. "Kai'Sa" -> "Kaisa", "Wukong" -> "MonkeyKing").
export function getChampionIdMap() {
    return getChampionList().then(({ champions }) => {
        const idsByName = {};
        champions.forEach(champ => {
            idsByName[champ.name] = champ.id;
        });
        return idsByName;
    });
}

export function getChampionNames() {
    return getChampionList().then(({ champions }) => champions.map(champ => champ.name));
}

export function getSplashArtUrl(champId) {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champId}_0.jpg`;
}

// Resolves once the image has loaded (or failed) - failing shouldn't ever
// block a whole batch of preloads, so onerror resolves too, not rejects.
export function preloadImage(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(url);
        img.src = url;
    });
}

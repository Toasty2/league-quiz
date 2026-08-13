import axios from 'axios';

const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
const SEARCH_URL = 'https://api.giphy.com/v1/gifs/search';
const MAX_OFFSET = 30;

// Fetches a pool of GIF URLs for a search term. Returns an empty array
// (rather than throwing) if there's no API key configured or the request
// fails, so the app can silently fall back to its hardcoded default GIFs.
export function fetchGifPool(searchTerm, limit = 10) {
    if (!API_KEY) {
        return Promise.resolve([]);
    }

    return axios
        .get(SEARCH_URL, {
            params: {
                api_key: API_KEY,
                q: searchTerm,
                limit: limit,
                // Search results are relevance-ranked, not randomised, so a
                // fixed offset (the default 0) returns the same top results
                // every time - randomising it samples a different slice.
                offset: Math.floor(Math.random() * MAX_OFFSET),
                rating: 'g'
            }
        })
        .then(response => response.data.data.map(gif => gif.images.fixed_height.url))
        .catch(error => {
            console.error('Failed to fetch GIF pool for "' + searchTerm + '"', error);
            return [];
        });
}

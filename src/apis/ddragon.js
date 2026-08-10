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

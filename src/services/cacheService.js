/**
 * Cache Service
 * Manages caching of gallery data with configurable TTL (Time-To-Live)
 * Uses localStorage to persist cache across browser sessions
 */

const CACHE_PREFIX = 'rotaract_gallery_cache_';

/**
 * Get cached data if it exists and hasn't expired
 * @param {string} key - Cache key identifier
 * @param {number} cacheDurationMs - Cache duration in milliseconds
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getCachedData = (key, cacheDurationMs) => {
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) {
            return null;
        }

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const cacheAge = now - timestamp;

        // Check if cache has expired
        if (cacheAge > cacheDurationMs) {
            console.log(`[Cache] Expired for key: ${key} (age: ${cacheAge}ms, TTL: ${cacheDurationMs}ms)`);
            localStorage.removeItem(cacheKey);
            return null;
        }

        const remainingTime = cacheDurationMs - cacheAge;
        console.log(`[Cache] Hit for key: ${key} (expires in ${(remainingTime / 1000 / 60).toFixed(1)}m)`);
        return data;
    } catch (error) {
        console.error(`[Cache] Error reading cache for key: ${key}`, error);
        return null;
    }
};

/**
 * Set cache data with timestamp
 * @param {string} key - Cache key identifier
 * @param {any} data - Data to cache
 */
export const setCachedData = (key, data) => {
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        const cacheObject = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
        console.log(`[Cache] Set cache for key: ${key}`);
    } catch (error) {
        console.error(`[Cache] Error writing cache for key: ${key}`, error);
    }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key identifier
 */
export const clearCache = (key) => {
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`;
        localStorage.removeItem(cacheKey);
        console.log(`[Cache] Cleared cache for key: ${key}`);
    } catch (error) {
        console.error(`[Cache] Error clearing cache for key: ${key}`, error);
    }
};

/**
 * Clear all gallery cache
 */
export const clearAllGalleryCache = () => {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        console.log('[Cache] Cleared all gallery cache');
    } catch (error) {
        console.error('[Cache] Error clearing all gallery cache', error);
    }
};

/**
 * Get cache info for debugging
 * @returns {object} - Cache statistics
 */
export const getCacheInfo = () => {
    try {
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
        const items = cacheKeys.map((key) => {
            const cached = JSON.parse(localStorage.getItem(key));
            return {
                key: key.replace(CACHE_PREFIX, ''),
                size: new Blob([localStorage.getItem(key)]).size,
                timestamp: new Date(cached.timestamp).toLocaleString(),
            };
        });

        return {
            totalCachedItems: items.length,
            items,
            totalSize: items.reduce((acc, item) => acc + item.size, 0),
        };
    } catch (error) {
        console.error('[Cache] Error getting cache info', error);
        return null;
    }
};

export default {
    getCachedData,
    setCachedData,
    clearCache,
    clearAllGalleryCache,
    getCacheInfo,
};


/**
 * Simple cache utility for storing and retrieving API responses
 */

// Default cache duration in milliseconds (5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

// Cache storage
const cache = {};

/**
 * Gets an item from the cache
 * @param {string} key - The cache key
 * @returns {any|null} - The cached item or null if not found/expired
 */
export const getCachedItem = (key) => {
  const item = cache[key];
  
  if (!item) return null;
  
  // Check if item has expired
  if (Date.now() > item.expiry) {
    delete cache[key];
    return null;
  }
  
  return item.data;
};

/**
 * Sets an item in the cache
 * @param {string} key - The cache key
 * @param {any} data - The data to cache
 * @param {number} duration - Cache duration in milliseconds
 */
export const setCacheItem = (key, data, duration = DEFAULT_CACHE_DURATION) => {
  cache[key] = {
    data,
    expiry: Date.now() + duration
  };
};

/**
 * Clears a specific item from the cache
 * @param {string} key - The cache key to clear
 */
export const clearCacheItem = (key) => {
  delete cache[key];
};

/**
 * Clears the entire cache or items matching a prefix
 * @param {string} prefix - Optional prefix to clear only matching items
 */
export const clearCache = (prefix = null) => {
  if (prefix) {
    Object.keys(cache).forEach(key => {
      if (key.startsWith(prefix)) {
        delete cache[key];
      }
    });
  } else {
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }
};

/**
 * Performs a cache-first fetch operation
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to call if cache miss
 * @param {number} duration - Cache duration
 * @returns {Promise<any>} - The data from cache or fetched
 */
export const fetchWithCache = async (key, fetchFn, duration = DEFAULT_CACHE_DURATION) => {
  // Try to get from cache first
  const cachedData = getCachedItem(key);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  setCacheItem(key, data, duration);
  
  return data;
};

export default {
  getCachedItem,
  setCacheItem,
  clearCacheItem,
  clearCache,
  fetchWithCache
}; 
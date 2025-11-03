/**
 * Loading utility functions to provide a more consistent loading experience
 */

// Minimum duration (in ms) to show loading states to prevent flicker
const MIN_LOADING_DURATION = 300;

/**
 * Controls loading states with a minimum duration to prevent UI flicker
 * @param {Function} setLoading - State setter for loading
 * @param {boolean} isLoading - Whether loading should be shown
 * @returns {Promise} - Promise that resolves when loading state should change
 */
export const controlLoadingState = (setLoading, isLoading) => {
  const startTime = Date.now();
  
  if (isLoading) {
    setLoading(true);
    return Promise.resolve();
  } else {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsedTime);
    
    return new Promise(resolve => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, remainingTime);
    });
  }
};

/**
 * Debounces loading state changes to prevent rapid flickering
 * @param {Function} setLoading - State setter for loading
 * @param {number} delay - Delay in ms before showing loading state
 * @returns {Object} - Functions to start and stop loading
 */
export const debouncedLoading = (setLoading, delay = 300) => {
  let timer = null;
  
  return {
    startLoading: () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setLoading(true), delay);
    },
    stopLoading: () => {
      if (timer) clearTimeout(timer);
      setLoading(false);
    }
  };
};

/**
 * Enhanced async data loader with consistent loading states
 * @param {Function} dataFetcher - The async function that fetches data
 * @param {Function} setLoading - State setter for loading
 * @param {Function} setError - State setter for error
 * @param {Function} setData - State setter for data
 * @param {Function} onSuccess - Optional callback on success
 */
export const loadData = async (
  dataFetcher,
  setLoading,
  setError,
  setData,
  onSuccess = null
) => {
  const startTime = Date.now();
  setLoading(true);
  
  try {
    const data = await dataFetcher();
    setData(data);
    if (onSuccess) onSuccess(data);
    setError(null);
  } catch (error) {
    console.error('Error loading data:', error);
    setError('Failed to load data. Please try again later.');
  } finally {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsedTime);
    
    setTimeout(() => {
      setLoading(false);
    }, remainingTime);
  }
};

export default {
  controlLoadingState,
  debouncedLoading,
  loadData
}; 
import { useState, useEffect } from 'react';

/**
 * A custom hook for controlling API calls to avoid excessive fetching
 * @param {Function} fetchFunction - The function to execute for fetching data
 * @param {Array} deps - Dependencies array to watch for changes
 * @param {boolean} fetchOnMount - Whether to fetch data on component mount
 * @param {boolean} refetchOnDepsChange - Whether to refetch when deps change
 * @param {Function} shouldFetch - Optional function to determine if fetch should occur
 * @returns {Object} - { fetched, setFetched, refetch } 
 */
export const useFetchOnce = (
  fetchFunction,
  deps = [],
  fetchOnMount = true,
  refetchOnDepsChange = false,
  shouldFetch = () => true
) => {
  const [fetched, setFetched] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  
  useEffect(() => {
    const shouldExecuteFetch = 
      // Only fetch if not already fetched or if we're refetching on deps change
      (!fetched || refetchOnDepsChange) &&
      // Only fetch on mount if fetchOnMount is true
      (fetchCount > 0 || fetchOnMount) && 
      // Check custom shouldFetch condition
      shouldFetch();
    
    if (shouldExecuteFetch) {
      fetchFunction();
      setFetched(true);
    }
    
    // Increment the fetch count to track mount vs. update
    setFetchCount(prev => prev + 1);
    
  }, [...deps, fetched]);
  
  const refetch = () => {
    setFetched(false);
  };
  
  return { fetched, setFetched, refetch };
};

export default useFetchOnce;

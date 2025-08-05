
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

const RATE_LIMIT_PER_HOUR = 180;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSportmonksApi() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sportmonks_api_key') || '');
  const [requestCount, setRequestCount] = useState(() => {
    const stored = localStorage.getItem('sportmonks_request_count');
    return stored ? JSON.parse(stored) : { count: 0, resetTime: Date.now() + 3600000 };
  });
  const [cache, setCache] = useState(() => {
    const stored = localStorage.getItem('sportmonks_cache');
    return stored ? JSON.parse(stored) : {};
  });

  // Save API key to localStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('sportmonks_api_key', apiKey);
    }
  }, [apiKey]);

  // Save request count to localStorage
  useEffect(() => {
    localStorage.setItem('sportmonks_request_count', JSON.stringify(requestCount));
  }, [requestCount]);

  // Save cache to localStorage
  useEffect(() => {
    localStorage.setItem('sportmonks_cache', JSON.stringify(cache));
  }, [cache]);

  // Reset request count every hour
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= requestCount.resetTime) {
        setRequestCount({ count: 0, resetTime: now + 3600000 });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [requestCount.resetTime]);

  const canMakeRequest = useCallback(() => {
    const now = Date.now();
    if (now >= requestCount.resetTime) {
      setRequestCount({ count: 0, resetTime: now + 3600000 });
      return true;
    }
    return requestCount.count < RATE_LIMIT_PER_HOUR;
  }, [requestCount]);

  const getCachedData = useCallback((key) => {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, [cache]);

  const setCachedData = useCallback((key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  }, []);

  const makeRequest = useCallback(async (endpoint, params = {}) => {
    if (!apiKey) {
      toast({
        title: "API kulcs hiányzik",
        description: "Kérlek add meg a Sportmonks API kulcsot!",
        variant: "destructive"
      });
      return null;
    }

    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    if (!canMakeRequest()) {
      toast({
        title: "Rate limit elérve",
        description: `Óránként maximum ${RATE_LIMIT_PER_HOUR} kérés küldhető. Kérlek várj!`,
        variant: "destructive"
      });
      return null;
    }

    try {
      const queryParams = new URLSearchParams({
        api_token: apiKey,
        ...params
      });

      const response = await fetch(`https://api.sportmonks.com/v3/football/${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API hiba: ${response.status}`);
      }

      const data = await response.json();
      
      setRequestCount(prev => ({
        ...prev,
        count: prev.count + 1
      }));

      setCachedData(cacheKey, data);
      
      return data;
    } catch (error) {
      toast({
        title: "API hiba",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  }, [apiKey, canMakeRequest, getCachedData, setCachedData]);

  const getRemainingRequests = useCallback(() => {
    return Math.max(0, RATE_LIMIT_PER_HOUR - requestCount.count);
  }, [requestCount.count]);

  const getTimeUntilReset = useCallback(() => {
    const now = Date.now();
    const timeLeft = requestCount.resetTime - now;
    return Math.max(0, Math.ceil(timeLeft / 60000)); // minutes
  }, [requestCount.resetTime]);

  return {
    apiKey,
    setApiKey,
    makeRequest,
    getRemainingRequests,
    getTimeUntilReset,
    canMakeRequest: canMakeRequest()
  };
}

import { Paper } from '@/types/paper';

const CACHE_KEY = 'arxivite.papers.cache';
const CACHE_TIMESTAMP_KEY = 'arxivite.papers.cache.timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface PaperCache {
  papers: Paper[];
  timestamp: number;
}

export const PaperCacheService = {
  get: (): PaperCache | null => {
    try {
      const cacheStr = localStorage.getItem(CACHE_KEY);
      const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (!cacheStr || !timestampStr) return null;
      
      const cache = JSON.parse(cacheStr);
      const timestamp = parseInt(timestampStr, 10);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_DURATION) {
        PaperCacheService.clear();
        return null;
      }
      
      return { papers: cache, timestamp };
    } catch (error) {
      console.error('Error reading paper cache:', error);
      return null;
    }
  },
  
  set: (papers: Paper[]): void => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(papers));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error setting paper cache:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing paper cache:', error);
    }
  },
  
  isExpired: (): boolean => {
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestampStr) return true;
    
    const timestamp = parseInt(timestampStr, 10);
    return Date.now() - timestamp > CACHE_DURATION;
  }
};
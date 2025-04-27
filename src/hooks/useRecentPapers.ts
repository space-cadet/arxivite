// src/hooks/useRecentPapers.ts
import { arxiv } from '@/lib/arxiv';
import { useEffect, useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useFilteredPapers } from '@/hooks/useFilteredPapers';
import { useArxivSearch } from '@/hooks/useArxiv';
import type { Paper } from '@/types/paper';

type TimeRange = "daily" | "weekly" | "monthly";
type FilterType = "all" | "recommended" | "bookmarked";

const buildQuery = (timeRange: TimeRange, profile: ResearchProfile) => {
  const queries: string[] = [];
  
  // Add time range
  const timeQuery = getTimeRangeQuery(timeRange);
  if (timeQuery) queries.push(timeQuery);
  
  // Add categories if present
  if (profile.categories.length > 0) {
    const categoryQuery = profile.categories
      .map(cat => `cat:${cat}`)
      .join(' OR ');
    queries.push(`(${categoryQuery})`);
  }
  
  return queries.join(' AND ');
};

const getTimeRangeQuery = (timeRange: TimeRange) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeRange) {
    case "daily":
      const oneDayAgo = new Date(todayStart);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return `lastUpdatedDate:[${oneDayAgo.toISOString().split('T')[0]} TO ${todayStart.toISOString().split('T')[0]}]`;
    
    case "weekly":
      const oneWeekAgo = new Date(todayStart);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return `lastUpdatedDate:[${oneWeekAgo.toISOString().split('T')[0]} TO ${todayStart.toISOString().split('T')[0]}]`;
    
    case "monthly":
      const oneMonthAgo = new Date(todayStart);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return `lastUpdatedDate:[${oneMonthAgo.toISOString().split('T')[0]} TO ${todayStart.toISOString().split('T')[0]}]`;
  }
};

export const useRecentPapers = (timeRange: TimeRange, filter: FilterType) => {
  const { profile } = useProfile();
  const { papers, isLoading, error, search } = useArxivSearch();
  const filteredPapers = useFilteredPapers(papers || [], profile);

  useEffect(() => {
    const searchQuery = buildQuery(timeRange, profile);
    if (searchQuery) {
      search({ query: searchQuery, maxResults: 50 });
    }
  }, [timeRange, search]);

  const processedPapers = useMemo(() => {
    if (!papers?.length) return [];
    
    // Sort papers by date, most recent first
    const sortedPapers = [...papers].sort((a, b) => 
      b.updatedDate.getTime() - a.updatedDate.getTime()
    );

    switch (filter) {
      case "recommended":
        return filteredPapers
          .filter(match => match.score > 0.3) // Lower threshold to show more recommendations
          .sort((a, b) => b.score - a.score) // Sort by relevance
          .map(match => match.paper);
      
      case "bookmarked":
        // TODO: Add bookmarking system in a separate task
        return [];
      
      default:
        return sortedPapers;
    }
  }, [papers, filter, filteredPapers]);

  return {
    papers: processedPapers,
    isLoading,
    error,
    isEmpty: !isLoading && (!papers?.length || (filter === "recommended" && !processedPapers.length)),
    isError: error !== null
  };
};
// src/hooks/useRecentPapers.ts
import { arxiv } from '@/lib/arxiv';
import { useEffect, useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useFilteredPapers } from '@/hooks/useFilteredPapers';
import { useArxivSearch } from '@/hooks/useArxiv';
import type { Paper } from '@/types/paper';
import type { ResearchProfile } from '@/types/profile';

type TimeRange = "daily" | "weekly" | "monthly";
type FilterType = "all" | "recommended" | "bookmarked";

const buildQuery = (timeRange: TimeRange, profile: ResearchProfile) => {
  const queries: string[] = [];
  
  // Add category query - handle multiple categories
  if (profile.categories.length > 0) {
    const categoryQuery = profile.categories
      .map((cat: string) => `cat:${cat}`)
      .join('+OR+');
    queries.push(`(${categoryQuery})`);
  }

  // Add date filter using submittedDate in YYYYMMDDHHMM format
  const dateQuery = getTimeRangeQuery(timeRange);
  if (dateQuery) {
    queries.push(dateQuery);
  }

  return queries.length > 0 ? queries.join('+AND+') : '*';
};

const getTimeRangeQuery = (timeRange: TimeRange) => {
  const today = new Date();
  const todayStr = formatDateForQuery(today);
  
  switch (timeRange) {
    case "daily":
      const oneDayAgo = new Date(today);
      oneDayAgo.setDate(today.getDate() - 1);
      return `submittedDate:[${formatDateForQuery(oneDayAgo)}+TO+${todayStr}]`;
    
    case "weekly":
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return `submittedDate:[${formatDateForQuery(oneWeekAgo)}+TO+${todayStr}]`;
    
    case "monthly":
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return `submittedDate:[${formatDateForQuery(oneMonthAgo)}+TO+${todayStr}]`;
  }
  return '';
};

// Format date as YYYYMMDD0600 for arXiv API
const formatDateForQuery = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  // Always use 0600 GMT as seen in test file
  return `${year}${month}${day}0600`;
};

// Temporarily removed time range query for testing

export const useRecentPapers = (timeRange: TimeRange, filter: FilterType) => {
  const { profile } = useProfile();
  const searchQuery = buildQuery(timeRange, profile);
  const arxivSearch = useArxivSearch();
  
  const { data, isLoading, error } = arxivSearch.search({ 
    query: searchQuery,
    maxResults: 50
  });
  
  const papers = data?.papers || [];
  const filteredPapers = useFilteredPapers(papers, profile);

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
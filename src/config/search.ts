export type PageSize = 20 | 50 | 100;
export type SortField = 'submittedDate' | 'lastUpdatedDate' | 'relevance';
export type SortOrder = 'ascending' | 'descending';

export const DEFAULT_SEARCH_CONFIG = {
  pageSize: 50 as PageSize,
  sortField: 'relevance' as SortField,
  sortOrder: 'descending' as SortOrder,
  currentPage: 0
};

export type SearchConfig = typeof DEFAULT_SEARCH_CONFIG;
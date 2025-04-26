export interface ResearchProfile {
  categories: string[];        // arXiv categories
  authors: string[];          // author names to follow
  keywords: string[];         // research topics/keywords
  excludeTerms: string[];     // terms to filter out
  lastUpdated: Date;
}

export const DEFAULT_PROFILE: ResearchProfile = {
  categories: [],
  authors: [],
  keywords: [],
  excludeTerms: [],
  lastUpdated: new Date()
};
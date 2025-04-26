import { useMemo } from 'react';
import { Paper } from '@/types/paper';
import { ResearchProfile } from '@/types/profile';

export interface PaperMatch {
  paper: Paper;
  score: number;
  matches: {
    category?: boolean;
    author?: boolean;
    keyword?: string[];
    excluded?: string[];
  };
}

export function useFilteredPapers(papers: Paper[], profile: ResearchProfile): PaperMatch[] {
  return useMemo(() => {
    return papers.map(paper => {
      const matches = {
        category: profile.categories.includes(paper.category),
        author: paper.authors.some(author => 
          profile.authors.some(profileAuthor => 
            author.toLowerCase().includes(profileAuthor.toLowerCase())
          )
        ),
        keyword: profile.keywords.filter(keyword =>
          paper.title.toLowerCase().includes(keyword.toLowerCase()) ||
          paper.abstract.toLowerCase().includes(keyword.toLowerCase())
        ),
        excluded: profile.excludeTerms.filter(term =>
          paper.title.toLowerCase().includes(term.toLowerCase()) ||
          paper.abstract.toLowerCase().includes(term.toLowerCase())
        )
      };

      // Calculate match score
      let score = 0;
      if (matches.category) score += 0.3;
      if (matches.author) score += 0.3;
      score += matches.keyword.length * 0.2;
      score -= matches.excluded.length * 0.4;

      return {
        paper,
        score: Math.max(0, Math.min(1, score)), // Normalize between 0 and 1
        matches
      };
    })
    .filter(match => match.score > 0) // Only return papers with positive scores
    .sort((a, b) => b.score - a.score); // Sort by score descending
  }, [papers, profile]);
}
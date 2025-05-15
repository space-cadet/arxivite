import type { ArxivPaper } from './arxiv';

export type Paper = Omit<ArxivPaper, 'links'> & {
  pdfUrl: string;
  thumbnailUrl?: string;
  abstract: string;
  category: string;  // Primary category
  categories: string[];  // All categories including primary
  doi?: string;  // Digital Object Identifier
};

export const arxivToPaper = (arxivPaper: ArxivPaper): Paper => ({
  ...arxivPaper,
  pdfUrl: arxivPaper.links.pdf,
  abstract: arxivPaper.abstract || '',
  category: arxivPaper.categories[0] || '',
  categories: arxivPaper.categories || []
});
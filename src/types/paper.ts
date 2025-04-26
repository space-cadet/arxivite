import type { ArxivPaper } from './arxiv';

export type Paper = Omit<ArxivPaper, 'links'> & {
  pdfUrl: string;
  thumbnailUrl?: string;
};

export const arxivToPaper = (arxivPaper: ArxivPaper): Paper => ({
  ...arxivPaper,
  pdfUrl: arxivPaper.links.pdf,
  summary: arxivPaper.abstract,
  category: arxivPaper.categories[0],
});
import { ArXivClient } from '@agentic/arxiv';
import type { ArxivSearchParams, ArxivSearchResponse } from '../types/arxiv';

const arxivClient = new ArXivClient({
  apiBaseUrl: 'http://export.arxiv.org/api'
});

export const searchPapers = async ({ query, maxResults = 10 }: ArxivSearchParams): Promise<ArxivSearchResponse> => {
  try {
    const result = await arxivClient.search({
      searchQuery: query,
      maxResults,
      start: 0
    });

    const papers = Array.isArray(result) ? result : result.entries || [];

    return {
      papers: papers.map(paper => ({
        id: paper.id || '',
        title: paper.title?.value || paper.title || '',
        authors: Array.isArray(paper.authors) 
          ? paper.authors.map(author => author.name || author.toString())
          : [paper.authors].filter(Boolean).map(author => author.name || author.toString()),
        abstract: (paper.abstract?.value || paper.summary?.value || paper.abstract || paper.summary || '').trim(),
        categories: Array.isArray(paper.categories) 
          ? paper.categories.map(cat => cat.value || cat.toString())
          : [paper.category].filter(Boolean).map(cat => cat.value || cat.toString()),
        publishedDate: new Date(paper.published?.value || paper.publishedDate || paper.published || Date.now()),
        updatedDate: new Date(paper.updated?.value || paper.updatedDate || paper.updated || Date.now()),
        doi: paper.doi || '',
        links: {
          abstract: paper.links?.find(l => l.title === 'Abstract')?.href || `http://arxiv.org/abs/${paper.id}`,
          pdf: paper.links?.find(l => l.title === 'PDF')?.href || `http://arxiv.org/pdf/${paper.id}`,
        },
        comments: paper.comment || '',
        journalRef: paper.journal_ref || '',
      })),
      total: papers.length,
    };
  } catch (error) {
    console.error('Error searching arxiv papers:', error);
    throw error;
  }
};

export const arxiv = {
  search: searchPapers,
};
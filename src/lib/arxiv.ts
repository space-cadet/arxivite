import type { ArxivSearchParams, ArxivSearchResponse } from '../types/arxiv';
import { DOMParser } from 'xmldom';

// Make requests directly to match the API format exactly
const makeArxivRequest = async (searchQuery: string, maxResults: number = 10, start: number = 0) => {
  // Don't encode if it's a submittedDate query
  const finalQuery = searchQuery.includes('submittedDate:') ? 
    searchQuery : 
    encodeURIComponent(searchQuery);
    
  const url = `http://export.arxiv.org/api/query?search_query=${finalQuery}&start=${start}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  console.log('Requesting:', url);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
  }
  
  const text = await response.text();
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');
  
  // xmldom doesn't have querySelector, so we need to use getElementsByTagName
  const entries = Array.from(xmlDoc.getElementsByTagName('entry'));
  console.log('Found entries:', entries.length);
  
  return entries.map(entry => ({
    id: entry.getElementsByTagName('id')[0]?.textContent?.split('/').pop() || '',
    title: entry.getElementsByTagName('title')[0]?.textContent?.trim() || '',
    authors: Array.from(entry.getElementsByTagName('author')).map(author => 
      author.getElementsByTagName('name')[0]?.textContent || ''
    ),
    abstract: entry.getElementsByTagName('summary')[0]?.textContent?.trim() || '',
    categories: [
      Array.from(entry.getElementsByTagName('arxiv:primary_category')).map(cat => cat.getAttribute('term') || '')[0],
      ...Array.from(entry.getElementsByTagName('category')).map(cat => cat.getAttribute('term') || '')
    ].filter(Boolean),
    publishedDate: new Date(entry.getElementsByTagName('published')[0]?.textContent || ''),
    updatedDate: new Date(entry.getElementsByTagName('updated')[0]?.textContent || ''),
    links: {
      abstract: Array.from(entry.getElementsByTagName('link')).find(link => !link.getAttribute('title'))?.getAttribute('href') || '',
      pdf: Array.from(entry.getElementsByTagName('link')).find(link => link.getAttribute('title') === 'pdf')?.getAttribute('href') || ''
    },
    comments: entry.getElementsByTagName('arxiv:comment')[0]?.textContent || '',
    journalRef: entry.getElementsByTagName('arxiv:journal_ref')[0]?.textContent || ''
  }));
};

export const searchPapers = async ({ query, maxResults = 10 }: ArxivSearchParams): Promise<ArxivSearchResponse> => {
  try {
    const papers = await makeArxivRequest(query, maxResults);

    return {
      papers,
      total: papers.length
    };
  } catch (error) {
    console.error('Error searching arxiv papers:', error);
    throw error;
  }
};

export const arxiv = {
  search: searchPapers,
};
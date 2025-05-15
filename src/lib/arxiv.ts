import type { ArxivSearchParams, ArxivSearchResponse, ArxivPaper } from '../types/arxiv';
import { ArxivQueryParser } from './search/queryParser';
// import { DOMParser } from 'xmldom';

// Helper function to parse XML and transform results to our data model
const parseAndTransformResults = (xmlText: string): ArxivPaper[] => {
  const xmlDoc = parseXML(xmlText);
  
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

// Helper function to parse XML that works in both browser and Node environments
function parseXML(text: string): Document {
  // Simple browser detection
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser) {
    // Browser environment
    return new window.DOMParser().parseFromString(text, 'text/xml');
  } else {
    // This code should never run in the browser
    // and will be eliminated by tree-shaking
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const xmldom = require('@xmldom/xmldom');
    return new xmldom.DOMParser().parseFromString(text, 'text/xml');
  }
}

// Legacy version of the ArXiv request function (preserved for potential rollback)
const makeArxivRequestLegacy = async (searchQuery: string, maxResults: number = 10, start: number = 0) => {
  // Determine if we need special handling for this query
  // Don't encode if it's a submittedDate query or an ID query
  let finalQuery;
  if (searchQuery.includes('submittedDate:') || searchQuery.includes('id:')) {
    // ID queries need special formatting for the ArXiv API
    if (searchQuery.includes('id:') && searchQuery.includes('OR')) {
      // Transform "id:1234 OR id:5678" into "id:1234,5678" (ArXiv API format for multiple IDs)
      const idPattern = /id:([^OR\s]+)/g;
      const ids = [];
      let match;
      while ((match = idPattern.exec(searchQuery)) !== null) {
        ids.push(match[1].trim());
      }
      // ArXiv API uses comma for multiple IDs
      finalQuery = `id:${ids.join(',')}`;
      console.log('Converted ID query:', finalQuery);
    } else {
      finalQuery = searchQuery;
    }
  } else {
    finalQuery = encodeURIComponent(searchQuery);
  }
    
  const url = `https://export.arxiv.org/api/query?search_query=${finalQuery}&start=${start}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  console.log('Legacy request:', url);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
  }
  
  const text = await response.text();
  return parseAndTransformResults(text);
};

// LLM-enhanced version with improved query parsing
const makeArxivRequest = async (searchQuery: string, maxResults: number = 10, start: number = 0) => {
  // Create parser instance
  const parser = new ArxivQueryParser();
  
  try {
    // Check if query contains explicit search operators
    const hasExplicitOperators = /\b(au:|ti:|abs:|cat:|all:|submittedDate:)\b/.test(searchQuery);
    
    let finalQuery = searchQuery;
    
    // Only use LLM parsing if no explicit operators
    if (!hasExplicitOperators) {
      // Parse query using LLM
      const parsed = await parser.parseQuery(searchQuery);
      
      // Convert to arXiv format
      finalQuery = parser.convertToArxivFormat(parsed);
      
      // If parsing produced no results, fall back to legacy parsing
      if (!finalQuery) {
        console.log('LLM parsing produced no results, falling back to legacy parser');
        return makeArxivRequestLegacy(searchQuery, maxResults, start);
      }
    }
    
    // Handle special cases (ID queries)
    if (finalQuery.includes('id:') && finalQuery.includes('OR')) {
      const idPattern = /id:([^OR\s]+)/g;
      const ids = [];
      let match;
      while ((match = idPattern.exec(finalQuery)) !== null) {
        ids.push(match[1].trim());
      }
      finalQuery = `id:${ids.join(',')}`;
    }
    
    // Encode if not already containing special operators
    if (!hasExplicitOperators && !finalQuery.includes(':')) {
      finalQuery = encodeURIComponent(finalQuery);
    }
    
    const url = `https://export.arxiv.org/api/query?search_query=${finalQuery}&start=${start}&max_results=${maxResults}`;
    console.log('Requesting:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    const results = parseAndTransformResults(text);
    
    // If no results with strict author search, try relaxed search
    if (results.length === 0 && finalQuery.includes('au:"')) {
      console.log('No results with strict author search, trying relaxed search');
      const relaxedQuery = finalQuery.replace(/au:"([^"]+)"/g, '(au:"$1" OR all:"$1")');
      console.log('Relaxed query:', relaxedQuery);
      
      const relaxedUrl = `https://export.arxiv.org/api/query?search_query=${relaxedQuery}&start=${start}&max_results=${maxResults}`;
      const relaxedResponse = await fetch(relaxedUrl);
      if (!relaxedResponse.ok) {
        throw new Error(`ArXiv API error: ${relaxedResponse.status} ${relaxedResponse.statusText}`);
      }
      
      const relaxedText = await relaxedResponse.text();
      return parseAndTransformResults(relaxedText);
    }
    
    return results;
  } catch (error) {
    console.error('Error in LLM-enhanced search:', error);
    // Fall back to legacy search on any error
    console.log('Falling back to legacy search');
    return makeArxivRequestLegacy(searchQuery, maxResults, start);
  }
};

// We default to using the improved search
// Legacy implementation is preserved for potential rollback
export const searchPapers = async ({ query, maxResults = 10, start = 0 }: ArxivSearchParams): Promise<ArxivSearchResponse> => {
  try {
    // Use the improved implementation by default
    const papers = await makeArxivRequest(query, maxResults, start);

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
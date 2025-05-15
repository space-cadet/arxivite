import type { ArxivSearchParams, ArxivSearchResponse, ArxivPaper } from '../types/arxiv';
import { ArxivQueryParser } from './search/queryParser';
// import { DOMParser } from 'xmldom';

import type { ArxivSearchMetadata, ArxivPaginationOptions } from '../types/arxiv';

// Helper function to get pagination parameters
const getPaginationParams = (pagination?: ArxivPaginationOptions) => {
  const pageSize = pagination?.pageSize || 20;
  const page = pagination?.page || 0;
  const start = page * pageSize;
  return { pageSize, page, start };
};

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
const makeArxivRequestLegacy = async (searchQuery: string, pageSize: number = 20, startIndex: number = 0) => {
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
    
  const url = `https://export.arxiv.org/api/query?search_query=${finalQuery}&start=${startIndex}&max_results=${pageSize}&sortBy=submittedDate&sortOrder=descending`;
  console.log('Legacy request:', url);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
  }
  
  const text = await response.text();
  return parseAndTransformResults(text);
};

// LLM-enhanced version with improved query parsing
const getSearchMetadata = async (searchQuery: string): Promise<ArxivSearchMetadata> => {
  try {
    // Make a minimal request to get total count
    const url = `https://export.arxiv.org/api/query?search_query=${searchQuery}&max_results=1`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    const xmlDoc = parseXML(text);
    
    // Get total results from opensearch:totalResults
    // Get metadata from OpenSearch elements
    const totalResults = parseInt(xmlDoc.getElementsByTagName('opensearch:totalResults')[0]?.textContent || '0', 10);
    const itemsPerPage = parseInt(xmlDoc.getElementsByTagName('opensearch:itemsPerPage')[0]?.textContent || '0', 10);
    const startIndex = parseInt(xmlDoc.getElementsByTagName('opensearch:startIndex')[0]?.textContent || '0', 10);
    
    console.log('ArXiv API metadata:', { totalResults, itemsPerPage, startIndex });
    
    return {
      totalResults: Math.min(totalResults, 2000), // ArXiv API limit
      itemsPerPage: 1,
      startIndex: 0
    };
  } catch (error) {
    console.error('Error getting search metadata:', error);
    return {
      totalResults: 0,
      itemsPerPage: 1,
      startIndex: 0
    };
  }
};

const makeArxivRequest = async (params: ArxivSearchParams): Promise<{ papers: ArxivPaper[], metadata: ArxivSearchMetadata }> => {
  const { pageSize, start } = getPaginationParams(params.pagination);
  // Create parser instance
  const parser = new ArxivQueryParser();
  
  try {
    // Check if query contains explicit search operators
    const hasExplicitOperators = /\b(au:|ti:|abs:|cat:|all:|submittedDate:)\b/.test(params.query);
    
    let finalQuery = params.query;
    
    // Only use LLM parsing if no explicit operators
    if (!hasExplicitOperators) {
      // Parse query using LLM
      const parsed = await parser.parseQuery(params.query);
      
      // Convert to arXiv format
      finalQuery = parser.convertToArxivFormat(parsed);
      
      // If parsing produced no results, fall back to legacy parsing
      if (!finalQuery) {
        console.log('LLM parsing produced no results, falling back to legacy parser');
        const { pageSize, start } = getPaginationParams(params.pagination);
        const url = `https://export.arxiv.org/api/query?search_query=${params.query}&start=${start}&max_results=${pageSize}`;
        const legacyResult = await makeArxivRequestLegacy(params.query, pageSize, start);
        const response = await fetch(url);
        const xmlDoc = parseXML(await response.text());
        const totalResults = parseInt(xmlDoc.getElementsByTagName('opensearch:totalResults')[0]?.textContent || '0', 10);
        
        return {
          papers: legacyResult,
          metadata: {
            totalResults: Math.min(totalResults, 2000),
            itemsPerPage: pageSize,
            startIndex: start
          }
        };
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
    
    // Calculate pagination parameters
    const pageSize = params.pagination?.pageSize || 20;
    const page = params.pagination?.page || 0;
    const start = page * pageSize;
    
    const sortBy = params.sort?.field || 'relevance';
    const sortOrder = params.sort?.order || 'descending';
    const url = `https://export.arxiv.org/api/query?search_query=${finalQuery}&start=${start}&max_results=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
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
      
      const relaxedUrl = `https://export.arxiv.org/api/query?search_query=${relaxedQuery}&start=${start}&max_results=${pageSize}`;
      const relaxedResponse = await fetch(relaxedUrl);
      if (!relaxedResponse.ok) {
        throw new Error(`ArXiv API error: ${relaxedResponse.status} ${relaxedResponse.statusText}`);
      }
      
      const relaxedText = await relaxedResponse.text();
      const relaxedResults = parseAndTransformResults(relaxedText);
      // Parse the relaxed response XML to get metadata
      const relaxedXmlDoc = parseXML(relaxedText);
      const relaxedTotalResults = parseInt(relaxedXmlDoc.getElementsByTagName('opensearch:totalResults')[0]?.textContent || '0', 10);
      
      return {
        papers: relaxedResults,
        metadata: {
          totalResults: Math.min(relaxedTotalResults, 2000),
          itemsPerPage: pageSize,
          startIndex: start
        }
      };
    }
    
    // Parse the XML response
    const xmlDoc = parseXML(text);
    // Get the total results count from the feed
    const totalResults = parseInt(xmlDoc.getElementsByTagName('opensearch:totalResults')[0]?.textContent || '0', 10);
    const itemsPerPage = pageSize;
    const startIndex = start;

    return {
      papers: results,
      metadata: {
        totalResults: Math.min(totalResults, 2000), // ArXiv API limit
        itemsPerPage,
        startIndex
      }
    };
  } catch (error) {
    console.error('Error in LLM-enhanced search:', error);
    // Fall back to legacy search on any error
    console.log('Falling back to legacy search');
    const { pageSize, start } = getPaginationParams(params.pagination);
    const papers = await makeArxivRequestLegacy(params.query, pageSize, start);
    return {
      papers,
      metadata: {
        totalResults: 0,
        itemsPerPage: pageSize,
        startIndex: start
      }
    };
  }
};

// We default to using the improved search
// Legacy implementation is preserved for potential rollback
export const searchPapers = async (params: ArxivSearchParams): Promise<ArxivSearchResponse> => {
  try {
    // First get the total count
    const metadata = await getSearchMetadata(params.query);
    
    // If no results, return early
    if (metadata.totalResults === 0) {
      return {
        papers: [],
        metadata
      };
    }
    
    // Then fetch the actual page of results with metadata
    const result = await makeArxivRequest(params);
    
    return result;
  } catch (error) {
    console.error('Error searching arxiv papers:', error);
    throw error;
  }
};

export const arxiv = {
  search: searchPapers,
};
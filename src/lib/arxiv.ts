import type { ArxivSearchParams, ArxivSearchResponse, ArxivPaper } from '../types/arxiv';
import { ArxivQueryParser } from './search/queryParser';
import { logArxivQuery, logError } from './logging/supabase-logger';
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

// LLM-enhanced version with improved query parsing - uses same query processing as actual search
const getSearchMetadata = async (searchQuery: string): Promise<ArxivSearchMetadata> => {
  try {
    // Create parser instance to process query the same way as actual search
    const parser = new ArxivQueryParser();
    
    // Check if query contains explicit search operators
    const hasExplicitOperators = /\b(au:|ti:|abs:|cat:|all:|submittedDate:)\b/.test(searchQuery);
    
    let finalQuery = searchQuery;
    
    // If no explicit operators, parse the query using LLM (same as actual search)
    if (!hasExplicitOperators) {
      try {
        // Parse and convert to ArXiv format
        const parsed = await parser.parseQuery(searchQuery);
        const converted = parser.convertToArxivFormat(parsed);
        if (converted) {
          finalQuery = converted;
        }
      } catch (error) {
        console.log('LLM parsing failed for metadata, using original query');
        // Fall back to original query if LLM parsing fails
      }
    }
    
    // Make a minimal request to get total count using the same query format
    const url = new URL('https://export.arxiv.org/api/query');
    url.searchParams.append('search_query', `all:${finalQuery}`);
    url.searchParams.append('start', '0');
    url.searchParams.append('max_results', '1');

    console.log('Fetching metadata with processed query from:', url.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(text, 'application/xml');
    
    // Extract totalResults using the working method from debug logs
    const totalResultsEl = doc.getElementsByTagName('opensearch:totalResults')[0] || 
                          doc.getElementsByTagNameNS('http://a9.com/-/spec/opensearch/1.1/', 'totalResults')[0];
                          
    let totalResults = 0;
    if (totalResultsEl) {
      totalResults = parseInt(totalResultsEl.textContent || '0', 10);
      console.log('Metadata: Successfully extracted totalResults:', totalResults);
    } else {
      console.warn('Could not find totalResults element in metadata XML response');
    }
    
    // ArXiv API has a limit of 2000 results
    return {
      totalResults: Math.min(totalResults, 2000),
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
    
    // If no explicit operators, parse the query
    if (!hasExplicitOperators) {
      try {
        // Parse and convert to ArXiv format
        const parsed = await parser.parseQuery(params.query);
        const converted = parser.convertToArxivFormat(parsed);
        if (converted) {
          finalQuery = converted;
        }
      } catch (error) {
        await logError(error as Error, 'query_parser', {
          reason: 'llm_parsing_failed',
          originalQuery: params.query,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Construct the URL
    const url = new URL('https://export.arxiv.org/api/query');
    url.searchParams.append('search_query', `all:${finalQuery}`);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('max_results', pageSize.toString());
    url.searchParams.append('sortBy', 'submittedDate');
    url.searchParams.append('sortOrder', 'descending');
    
    console.log('Making request to:', url.toString());
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // If the query was too broad, try a relaxed search
    if (text.includes('Parser error')) {
      console.log('Parser error detected, trying relaxed search');
      
      // Try a more relaxed search by adding AND between terms
      const relaxedQuery = finalQuery.replace(/\s+/g, ' AND ');
      url.searchParams.set('search_query', `all:${relaxedQuery}`);
      
      console.log('Making relaxed request to:', url.toString());
      
      const relaxedResponse = await fetch(url.toString());
      if (!relaxedResponse.ok) {
        throw new Error(`ArXiv API error: ${relaxedResponse.status} ${relaxedResponse.statusText}`);
      }
      
      const relaxedText = await relaxedResponse.text();
      const relaxedResults = parseAndTransformResults(relaxedText);
      
      return {
        papers: relaxedResults,
        metadata: {
          totalResults: 0, // Let searchPapers handle metadata
          itemsPerPage: pageSize,
          startIndex: start
        }
      };
    }
    
    // Parse the XML response and get results
    const results = parseAndTransformResults(text);

    return {
      papers: results,
      metadata: {
        totalResults: 0, // Let searchPapers handle metadata
        itemsPerPage: pageSize,
        startIndex: start
      }
    };
  } catch (error) {
    console.error('Error in LLM-enhanced search:', error);
    // Fall back to legacy search on any error
    console.log('Falling back to legacy search');
    const papers = await makeArxivRequestLegacy(params.query, pageSize, start);
    return {
      papers,
      metadata: {
        totalResults: 0, // Let searchPapers handle metadata
        itemsPerPage: pageSize,
        startIndex: start
      }
    };
  }
};

// Cache for search results
const searchResultsCache = new Map<string, {
  papers: ArxivPaper[];
  metadata: {
    totalResults: number;
    itemsPerPage: number;
    startIndex: number;
  };
  timestamp: number;
}>();

// Cache expiry time (30 minutes)
const CACHE_EXPIRY_MS = 30 * 60 * 1000;

// Generate cache key from search parameters
const generateCacheKey = (params: ArxivSearchParams): string => {
  const { query } = params;
  // Only cache based on the query, not pagination
  return JSON.stringify({ query });
};

// Client-side sorting function
const sortPapers = (papers: ArxivPaper[], field: string, order: 'ascending' | 'descending'): ArxivPaper[] => {
  return [...papers].sort((a, b) => {
    const multiplier = order === 'ascending' ? 1 : -1;
    
    switch (field) {
      case 'submittedDate':
        return multiplier * (new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime());
      case 'lastUpdatedDate':
        return multiplier * (new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime());
      case 'title':
        return multiplier * a.title.localeCompare(b.title);
      case 'relevance':
        // For relevance, we'll keep the server's order
        return 0;
      default:
        return 0;
    }
  });
};

export const searchPapers = async (params: ArxivSearchParams): Promise<ArxivSearchResponse> => {
  const startTime = Date.now();
  
  try {
    // First get the total count
    const metadata = await getSearchMetadata(params.query);
    
    // If no results, return early
    if (metadata.totalResults === 0) {
      return {
        papers: [],
        metadata: {
          totalResults: 0,
          itemsPerPage: params.pagination?.pageSize || 20,
          startIndex: params.pagination?.page || 0
        }
      };
    }

    // Log the search query
    await logArxivQuery('request', {
      query: params.query,
      pagination: params.pagination,
      sort: params.sort,
      timestamp: new Date().toISOString()
    });

    // Get pagination params
    const { pageSize, page, start } = getPaginationParams(params.pagination);

    // Fetch the actual page of results
    const response = await makeArxivRequest({
      ...params,
      pagination: { pageSize, page },
      sort: { field: 'submittedDate', order: 'descending' }
    });

    // Apply client-side sorting if different from default
    let papers = response.papers;
    if (params.sort?.field && params.sort.field !== 'submittedDate') {
      papers = sortPapers(papers, params.sort.field, params.sort.order);
    }

    return {
      papers,
      metadata: {
        totalResults: metadata.totalResults,
        itemsPerPage: pageSize,
        startIndex: start
      }
    };
  } catch (error) {
    console.error('Error searching papers:', error);
    throw error;
  } finally {
    const endTime = Date.now();
    console.log(`Search completed in ${endTime - startTime}ms`);
  }
};

export const arxiv = {
  search: searchPapers,
};
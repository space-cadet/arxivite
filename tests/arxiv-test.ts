import { arxiv } from '../src/lib/arxiv.ts';

// Create a spy function to capture the URL
const originalFetch = global.fetch;
let lastRequestedUrl = '';
// @ts-ignore - Ignoring type mismatch for testing purposes
global.fetch = async function(...args) {
    lastRequestedUrl = args[0];
    return originalFetch.apply(this, args);
};

async function testArxivClient() {
    try {
        // Test basic search
        console.log('\nTesting basic search...');
        const query1 = 'machine learning';
        const encodedUrl1 = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(query1)}&start=0&max_results=5`;
        const nonEncodedUrl1 = `http://export.arxiv.org/api/query?search_query=${query1}&start=0&max_results=5`;
        console.log('Expected encoded URL:', encodedUrl1);
        console.log('Expected non-encoded URL:', nonEncodedUrl1);
        const searchResults = await arxiv.search({
            query: query1,
            maxResults: 5
        });
        console.log('Actual URL used:', lastRequestedUrl);
        console.log('Results:', printResultsSummary(searchResults));

        // Test search with category
        console.log('\nTesting search with category...');
        const query2 = 'ti:"neural networks" AND cat:cs.AI';
        const encodedUrl2 = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(query2)}&start=0&max_results=3`;
        const nonEncodedUrl2 = `http://export.arxiv.org/api/query?search_query=${query2}&start=0&max_results=3`;
        console.log('Expected encoded URL:', encodedUrl2);
        console.log('Expected non-encoded URL:', nonEncodedUrl2);
        const categoryResults = await arxiv.search({
            query: query2,
            maxResults: 3
        });
        console.log('Actual URL used:', lastRequestedUrl);
        console.log('Results:', printResultsSummary(categoryResults));

        // Test author search
        console.log('\nTesting author search...');
        const query3 = 'au:hinton';
        const encodedUrl3 = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(query3)}&start=0&max_results=3`;
        const nonEncodedUrl3 = `http://export.arxiv.org/api/query?search_query=${query3}&start=0&max_results=3`;
        console.log('Expected encoded URL:', encodedUrl3);
        console.log('Expected non-encoded URL:', nonEncodedUrl3);
        const authorResults = await arxiv.search({
            query: query3,
            maxResults: 3
        });
        console.log('Actual URL used:', lastRequestedUrl);
        console.log('Results:', printResultsSummary(authorResults));

        // Test date filtering
        console.log('\nTesting date filter...');
        // Use explicit dates for testing - specify 06:00 GMT
        const to = new Date('2025-04-27T06:00:00Z');
        const from = new Date('2025-04-20T06:00:00Z');
        
        // Format dates as YYYYMMDD0600 for arXiv API (6:00 AM GMT)
        const formatDate = (date: Date) => {
            return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}0600`;
        };
        
        const dateQuery = `submittedDate:[${formatDate(from)}+TO+${formatDate(to)}]`;
        
        // Test both encoded and non-encoded URLs
        const encodedUrl = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(dateQuery)}&start=0&max_results=5`;
        const nonEncodedUrl = `http://export.arxiv.org/api/query?search_query=${dateQuery}&start=0&max_results=5`;
        
        console.log('Expected encoded URL:', encodedUrl);
        console.log('Expected non-encoded URL:', nonEncodedUrl);
        
        const dateResults = await arxiv.search({
            query: dateQuery,
            maxResults: 5
        });
        console.log('Actual URL used:', lastRequestedUrl);
        console.log('Results:', printResultsSummary(dateResults));

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        // Restore original fetch
        global.fetch = originalFetch;
    }
}

// Helper function to print results without abstracts
function printResultsSummary(results: any) {
    if (!results?.papers) return results;
    
    return {
        total: results.total,
        papers: results.papers.map((paper: any) => ({
            id: paper.id,
            title: paper.title,
            authors: paper.authors,
            publishedDate: paper.publishedDate,
            updatedDate: paper.updatedDate,
            categories: paper.categories
        }))
    };
}

// Run the test
testArxivClient().catch(console.error);
import { llm } from '../llm';

export interface ParsedQuery {
    authors: string[];
    topics: string[];
    year_range?: {
        start: number;
        end: number | null;
    };
    arxiv_categories: string[];
    institutions: string[];
}

export class ArxivQueryParser {
    private static PROMPT = `Parse query: "{query}". Return only raw JSON, no markdown or code blocks, with fields: authors[], topics[], year_range{start,end}, arxiv_categories[], institutions[]. Treat each word that looks like a name as a separate author. Preserve original capitalization. Return author names exactly as written. Omit null fields.`;

    private cache: Map<string, ParsedQuery>;

    constructor() {
        this.cache = new Map();
    }

    async parseQuery(rawQuery: string): Promise<ParsedQuery> {
        const normalizedQuery = rawQuery.trim().toLowerCase();
        
        // Check cache first
        const cached = this.cache.get(normalizedQuery);
        if (cached) {
            return cached;
        }

        try {
            // Get LLM response
            const prompt = ArxivQueryParser.PROMPT.replace('{query}', rawQuery);
            const response = await llm.chat(prompt);
            
            // Parse and validate JSON response
            const rawParsed = JSON.parse(response);
            
            // Ensure all required fields exist with defaults
            const parsed: ParsedQuery = {
                authors: Array.isArray(rawParsed.authors) ? rawParsed.authors : [],
                topics: Array.isArray(rawParsed.topics) ? rawParsed.topics : [],
                year_range: rawParsed.year_range || null,
                arxiv_categories: Array.isArray(rawParsed.arxiv_categories) ? rawParsed.arxiv_categories : [],
                institutions: Array.isArray(rawParsed.institutions) ? rawParsed.institutions : []
            };
            
            // Cache the validated result
            this.cache.set(normalizedQuery, parsed);
            
            return parsed;
        } catch (error) {
            console.error('Error parsing query:', error);
            // Fallback to empty result
            return {
                authors: [],
                topics: [],
                arxiv_categories: [],
                institutions: []
            };
        }
    }

    convertToArxivFormat(parsed: ParsedQuery): string {
        const parts: string[] = [];

        // Add author queries
        if (parsed.authors?.length > 0) {
            // First try exact author matches
            const authorQueries = parsed.authors.map(author => {
                const nameParts = author.split(' ');
                // If it's a full name, try both orders
                if (nameParts.length > 1) {
                    return `(au:"${author}" OR au:"${nameParts.reverse().join(' ')}")`;
                }
                return `au:"${author}"`;
            });
            parts.push(`(${authorQueries.join(' OR ')})`);
        }

        // Add topic queries
        if (parsed.topics?.length > 0) {
            const topicQuery = parsed.topics
                .map(topic => `all:"${topic}"`)
                .join(' AND ');
            parts.push(`(${topicQuery})`);
        }

        // Add year range query
        if (parsed.year_range) {
            const { start, end } = parsed.year_range;
            const startDate = `${start}0101`;
            const endDate = end ? `${end}1231` : 'now';
            parts.push(`(submittedDate:[${startDate} TO ${endDate}])`);
        }

        // Add arxiv category queries
        if (parsed.arxiv_categories?.length > 0) {
            const catQuery = parsed.arxiv_categories
                .map(cat => `cat:${cat}`)
                .join(' OR ');
            parts.push(`(${catQuery})`);
        }

        // Add institution queries (in abstract or title)
        if (parsed.institutions?.length > 0) {
            const instQuery = parsed.institutions
                .map(inst => `(abs:"${inst}" OR ti:"${inst}")`)
                .join(' OR ');
            parts.push(`(${instQuery})`);
        }

        // Join all parts with AND
        return parts.join(' AND ');
    }
}
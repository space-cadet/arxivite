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
    private static PROMPT = `Parse search query: "{query}". Return only raw JSON with fields: authors[], topics[], year_range{start,end}, arxiv_categories[], institutions[]. 

IMPORTANT RULES:
1. Do NOT split established technical terms or concepts that contain names (e.g., "Fisher information", "Cramer-Rao bound", "Gaussian distribution", "Markov chain", "Dirichlet distribution", "Kalman filter", "Maxwell equations", "Fourier transform", "Euler method", etc.)
2. For queries like "fisher information" or "cramer rao", treat the entire phrase as a topic, not as author names
3. Only extract author names when they appear independently or are clearly marked as authors
4. For ambiguous cases (e.g., single names that could be authors or part of technical terms), prefer treating them as search terms rather than authors
5. Preserve original capitalization
6. Omit null or empty fields from the output

Example mappings:
- "fisher information" → topics: ["fisher information"]
- "papers by fisher about information theory" → authors: ["fisher"], topics: ["information theory"]
- "cramer rao bound 2024" → topics: ["cramer rao bound"], year_range: {start: 2024}
- "gaussian process by rasmussen" → topics: ["gaussian process"], authors: ["rasmussen"]`;

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

        // Add year range query if it exists and has valid start year
        if (parsed.year_range && parsed.year_range.start) {
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
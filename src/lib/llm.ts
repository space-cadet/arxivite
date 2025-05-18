import { logLLMUsage, logError } from './logging/supabase-logger';

export interface LLMResponse {
    content: string;
    error?: string;
}

class GeminiLLMService {
    private apiKey: string;
    private apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    private cache: Map<string, string> = new Map(); // Simple in-memory cache
    
    constructor(apiKey: string) {
        // For development, we can use environment variables
        this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
        
        // Validate API key
        if (!this.apiKey) {
            console.warn('No Gemini API key provided. LLM functionality will be limited.');
        }
    }
    
    async chat(prompt: string): Promise<string> {
        // Check cache first
        const cachedResponse = this.cache.get(prompt);
        if (cachedResponse) {
            await logLLMUsage('gemini-1.5-flash', 0, 0); // Log cache hit
            return cachedResponse;
        }
        
        const startTime = Date.now();
        try {
            // If no API key, return empty result
            if (!this.apiKey) {
                await logError(new Error('No API key provided'), 'llm-api');
                return '{"authors":[],"topics":[],"years":[],"institutions":[],"journals":[]}';
            }
            
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.0,
                        topP: 0,
                        topK: 1,
                        maxOutputTokens: 256
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Extract the JSON string from the response
            const rawContent = data.candidates[0].content.parts[0].text;
            console.log('Raw LLM response:', rawContent);
            
            // Ensure we have valid JSON without markdown
            let jsonContent = rawContent;
            if (rawContent.includes('```')) {
                jsonContent = rawContent.replace(/```json\n|\n```/g, '');
            }
            
            // Parse and validate response structure
            const parsed = JSON.parse(jsonContent);
            
            // Capitalize and validate author names
            const authors = (parsed.authors || []).flatMap((author: string) => {
                // Don't split names with common prefixes or suffixes
                if (author.match(/\b(van|von|de|del|della|der|den|das|dos|el|al|bin|ibn)\b/i)) {
                    return [author.split(' ').map((part: string) => 
                        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                    ).join(' ')];
                }
                // Split and capitalize each part
                return author.split(' ').map((part: string) => 
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                ).filter((part: string) => part.length > 1);
            });
            
            const validatedResponse = {
                authors: authors,
                topics: parsed.topics || [],
                year_range: parsed.year_range || null,
                arxiv_categories: parsed.arxiv_categories || [],
                institutions: parsed.institutions || []
            };
            
            const finalJson = JSON.stringify(validatedResponse);
            
            // Store in cache
            this.cache.set(prompt, finalJson);
            
            // Log successful API call
            await logLLMUsage('gemini-1.5-flash', data.candidates[0].tokenCount || 0, Date.now() - startTime, {
                model: 'gemini-1.5-flash',
                promptTokens: Math.ceil(prompt.length / 4),
                responseTokens: data.candidates[0].tokenCount || 0,
                response: rawContent,
                cacheHit: false,
                validJson: true,
                tokenDetails: {
                    prompt: prompt.length,
                    response: rawContent.length,
                    apiReported: data.candidates[0].tokenCount
                }
            });
            
            return finalJson;
        } catch (error) {
            await logError(error as Error, 'llm-api', { 
                prompt,
                timestamp: new Date().toISOString(),
                errorType: error instanceof SyntaxError ? 'json_parse_error' : 'api_error'
            });
            console.error('LLM API error:', error);
            // Return empty result on error
            return '{"authors":[],"topics":[],"years":[],"institutions":[],"journals":[]}';
        }
    }
}

// Environment detection for API key loading
// When using Vite, we can access import.meta.env
const getApiKey = () => {
    try {
        // For Vite projects
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            return import.meta.env.VITE_GEMINI_API_KEY || '';
        }
        // For other environments
        return process.env.GEMINI_API_KEY || '';
    } catch (e) {
        return '';
    }
};

// Export the LLM service instance
export const llm = new GeminiLLMService(getApiKey());
# LLM-Enhanced Search Query Integration

## Overview
The arXivite app enhances search accuracy by using Gemini 1.5 Flash to parse natural language queries into structured format for the arXiv API.

## Testing the Integration

To test the LLM query parsing:

1. Run the test script:
   ```bash
   ./scripts/test-gemini-query.sh "quantum machine learning Bengio 2023"
   ```

2. This will show:
   - The parsed JSON structure from Gemini
   - How it would convert to arXiv API format

## Implementation Details

The integration uses:

- `src/lib/llm.ts` - Gemini API client with caching
- `src/lib/search/queryParser.ts` - Query parsing and conversion to arXiv format
- `src/lib/arxiv.ts` - Integration with arXiv API

## Configuration

The Gemini API key is stored in `.env` as `VITE_GEMINI_API_KEY`.

## Simple Usage Example

```typescript
import { ArxivQueryParser } from './lib/search/queryParser';

// Create parser instance
const parser = new ArxivQueryParser();

// Parse a query
const parsed = await parser.parseQuery("quantum machine learning Bengio 2023");

// Convert to arXiv format
const arxivQuery = parser.convertToArxivFormat(parsed);

console.log(arxivQuery);
// Output: (au:"Bengio") AND (all:"quantum machine learning") AND (submittedDate:[20230101 TO 20231231])
```

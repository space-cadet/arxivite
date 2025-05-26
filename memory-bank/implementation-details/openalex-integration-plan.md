# OpenAlex Integration Implementation Plan
*Created: 2025-05-26*
*Estimated Timeline: 1-2 weeks*
*Complexity: Medium*

## Overview
Add OpenAlex database integration to Arxivite to expand academic paper coverage beyond arXiv preprints, providing access to 250M+ published works with citation data and broader disciplinary coverage.

## Goals
- Expand paper discovery beyond arXiv preprints
- Add citation data and impact metrics
- Enable cross-disciplinary research
- Maintain existing arXiv-focused user experience
- Provide unified search across multiple academic databases

## Phase 1: Core OpenAlex Integration (Week 1)

### 1.1 API Client Implementation
**Files to Create:**
- `src/lib/openalex.ts` - OpenAlex API client
- `src/types/openalex.ts` - OpenAlex-specific types
- `src/hooks/useOpenAlex.ts` - React hook for OpenAlex operations

**Key Features:**
- Basic search functionality
- Work detail fetching
- Author and venue resolution
- Rate limiting (10 requests/second)
- Error handling and retries

### 1.2 Data Model Extension
**Files to Modify:**
- `src/types/paper.ts` - Extend Paper interface
- `src/lib/paperUtils.ts` - Create utility functions

**Changes:**
```typescript
interface Paper {
  // Existing fields...
  source: 'arxiv' | 'openalex';
  doi?: string;
  citationCount?: number;
  venue?: {
    name: string;
    type: 'journal' | 'conference' | 'repository';
  };
  openAccess?: {
    isOa: boolean;
    oaUrl?: string;
  };
  concepts?: Array<{
    displayName: string;
    level: number;
    score: number;
  }>;
}
```

### 1.3 Unified Search Architecture
**Files to Create:**
- `src/lib/unifiedSearch.ts` - Multi-source search orchestration
- `src/types/search.ts` - Unified search types

**Files to Modify:**
- `src/hooks/useArxiv.ts` - Adapt for unified interface
- `src/config/search.ts` - Add source configuration

**Key Components:**
- Source abstraction layer
- Result normalization
- Basic deduplication (DOI/title matching)
- Configurable source selection

## Phase 2: UI Integration (Week 1-2)

### 2.1 Search Interface Updates
**Files to Modify:**
- `src/components/papers/paper-filters.tsx` - Add database selector
- `src/pages/search.tsx` - Integrate unified search

**UI Elements:**
- Database source toggle/selector ("arXiv", "OpenAlex", "Both")
- Advanced search options (venue type, citation count filters)
- Search scope indicators

### 2.2 Results Display Enhancement
**Files to Modify:**
- `src/components/papers/paper-card.tsx` - Add source badges
- `src/components/papers/paper-table-row.tsx` - Display additional metadata
- `src/components/papers/paper-details.tsx` - Show citation data

**Visual Indicators:**
- Source badges (arXiv logo, OpenAlex logo)
- Citation count display
- Open access indicators
- Venue information

### 2.3 Enhanced Paper Details
**Files to Create:**
- `src/components/papers/citation-info.tsx` - Citation metrics display
- `src/components/papers/venue-info.tsx` - Publication venue details

## Phase 3: Advanced Features (Week 2)

### 3.1 Citation Integration
**Features:**
- Citation count sorting
- Related papers via citations
- Citation timeline visualization
- Export citation data

### 3.2 Cross-Source Features
**Features:**
- Find published versions of arXiv preprints
- Cross-reference author works
- Topic clustering across sources
- Impact metrics comparison

### 3.3 Enhanced Filtering
**Features:**
- Publication year ranges
- Venue type filtering
- Citation count thresholds
- Open access filtering
- Subject area filtering

## Technical Implementation Details

### API Endpoints
```
OpenAlex Base URL: https://api.openalex.org
Key Endpoints:
- /works - Search papers
- /works/{id} - Get paper details  
- /authors/{id} - Author information
- /venues/{id} - Venue details
- /concepts - Subject classifications
```

### Rate Limiting
- OpenAlex: 10 requests/second (no API key needed)
- Implement exponential backoff
- Cache responses to minimize API calls
- Batch requests where possible

### Data Mapping Strategy
```typescript
// OpenAlex -> Unified Paper mapping
const mapOpenAlexWork = (work: OpenAlexWork): Paper => ({
  id: work.id,
  title: work.title,
  authors: work.authorships.map(a => ({
    name: a.author.display_name,
    affiliation: a.institutions[0]?.display_name
  })),
  abstract: work.abstract_inverted_index ? 
    reconstructAbstract(work.abstract_inverted_index) : undefined,
  publishedDate: work.publication_date,
  source: 'openalex',
  doi: work.doi,
  citationCount: work.cited_by_count,
  venue: work.primary_location?.source ? {
    name: work.primary_location.source.display_name,
    type: work.type === 'journal-article' ? 'journal' : 'conference'
  } : undefined,
  // ... additional mappings
});
```

### Deduplication Strategy
1. **DOI matching** - Primary deduplication method
2. **Title similarity** - Fuzzy matching for papers without DOIs
3. **Author + title** - Secondary verification
4. **Manual merge indicators** - UI hints for potential duplicates

### Error Handling
- Network timeouts and retries
- Rate limit backoff
- Partial result handling
- Graceful degradation when OpenAlex unavailable
- User feedback for API issues

## Configuration Updates

### Environment Variables
```bash
# Optional: For higher rate limits in future
VITE_OPENALEX_API_KEY=optional_key
VITE_OPENALEX_BASE_URL=https://api.openalex.org
```

### Search Configuration
```typescript
export const SEARCH_SOURCES = {
  arxiv: {
    name: 'arXiv',
    description: 'Physics, Mathematics, Computer Science preprints',
    enabled: true,
  },
  openalex: {
    name: 'OpenAlex',
    description: 'Published academic papers across all disciplines',
    enabled: true,
  },
} as const;
```

## Testing Strategy

### Unit Tests
- API client functions
- Data mapping utilities
- Deduplication logic
- Search orchestration

### Integration Tests
- Multi-source search workflows
- UI component updates
- Error handling scenarios

### Manual Testing
- Search result quality
- Performance with large result sets
- UI responsiveness
- Cross-browser compatibility

## Migration and Rollout

### Feature Flags
- Implement behind feature flag for gradual rollout
- Allow users to opt-in to multi-source search
- Monitor API usage and performance

### Backward Compatibility
- Maintain existing arXiv-only search as default
- Preserve all current functionality
- Optional upgrade path for users

### Performance Monitoring
- API response times
- Search result relevance
- User engagement metrics
- Error rates and patterns

## Dependencies

### New Dependencies
```json
{
  "dependencies": {
    // No new external dependencies required
    // OpenAlex API is REST-based, use existing fetch
  }
}
```

### Internal Dependencies
- Existing search infrastructure
- Paper display components
- State management hooks
- Caching mechanisms

## Risks and Mitigation

### Technical Risks
1. **API Rate Limits** - Implement caching and request optimization
2. **Data Quality Variations** - Robust error handling and validation
3. **Performance Impact** - Lazy loading and progressive enhancement
4. **Breaking Changes** - Comprehensive testing and gradual rollout

### User Experience Risks
1. **Complexity Increase** - Keep UI simple, default to familiar behavior
2. **Result Relevance** - Implement proper ranking and filtering
3. **Loading Times** - Show progress indicators and partial results

## Success Metrics

### Technical Metrics
- API response times < 500ms (95th percentile)
- Search success rate > 99%
- Zero breaking changes to existing functionality

### User Metrics
- Increased paper discovery (measured by bookmarks/saves)
- Broader search queries (cross-disciplinary usage)
- User retention and engagement
- Feature adoption rate

## Future Enhancements

### Phase 4+ (Future)
- Additional databases (PubMed, DBLP, CORE)
- Advanced citation analysis
- Recommendation engine
- Collaborative features
- Export integrations (Mendeley, Zotero expansion)

## Task Creation
This plan will generate the following tasks:
- **T25**: OpenAlex API Integration
- **T26**: Unified Search Architecture  
- **T27**: Multi-Source UI Enhancement
- **T28**: Citation Data Integration

## Conclusion
This implementation provides a solid foundation for expanding Arxivite beyond arXiv while maintaining the simplicity and focus that makes it effective. The phased approach allows for iterative development and testing, ensuring stability throughout the integration process.

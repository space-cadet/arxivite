# Technical Context
*Last Updated: 2025-04-26*

## Technology Stack

### Core Technologies
- React 18.3.1
- TypeScript
- Vite 5.4.6
- Tailwind CSS 3.4.7

### Key Libraries
- shadcn/ui: UI component library
- Radix UI: Accessible primitives
- Lucide React: Icons

### Build Tools
- Vite
- PostCSS
- TypeScript Compiler
- ESLint
- Prettier

## Technical Specifications

### Browser Support
- Modern browsers (last 2 versions)
- ES2021+ features
- CSS Grid and Flexbox
- Mobile browsers:
  - Safari iOS 14+
  - Chrome Android 90+
- Tablet optimization:
  - iPadOS 14+
  - Android tablets 10+

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2s
- Core Web Vitals compliance

### Bundle Size Goals
- Main bundle: < 100KB (gzipped)
- Initial load: < 200KB total
- Dynamic imports for routes

## Implementation Details

### State Management
```typescript
// Core State Interfaces
interface ArXivState {
  papers: Paper[];
  categories: Category[];
  searchParams: SearchParams;
  bookmarks: BookmarkedPaper[];
  uiState: UIState;
}

interface UIState {
  expandedPapers: string[];
  scrollPositions: Record<string, number>;
  activeLayout: 'mobile' | 'tablet' | 'desktop';
  sidebarCollapsed: boolean;
}

interface ArXivActions {
  searchPapers: (params: SearchParams) => Promise<void>;
  toggleBookmark: (paper: Paper) => void;
  updateCategories: (categories: Category[]) => void;
  updateUIState: (updates: Partial<UIState>) => void;
}

// Persistence Hooks
interface PersistedState<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  reset: () => void;
}
```

### Data Models
```typescript
interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  publishedDate: Date;
  updatedDate: Date;
  pdfUrl: string;
}

interface SearchParams {
  query: string;
  categories?: string[];
  dateRange?: DateRange;
  sortBy?: SortOption;
  limit?: number;
}
```

### API Integration
- Direct arXiv XML API integration (export.arxiv.org/api/query)
- Custom XML parsing and data extraction
- Robust time-based filtering support
- Special handling for ID-based queries
- Rate limiting compliance
- Error handling with retries
- Response caching in local storage

### Storage Strategy
```typescript
interface LocalStorage {
  favorites: string[];
  recentSearches: string[];
  preferences: UserPreferences;
  categoryFilters: string[];
}
```

## Development Workflow

### Environment Setup
```bash
# Installation
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Husky pre-commit hooks

### Testing Strategy
- Unit tests with Vitest
- Component testing
- E2E testing consideration

## Deployment

### Build Process
- TypeScript compilation
- Vite bundling
- Asset optimization
- Compression

### Optimization
- Code splitting
- Tree shaking
- Image optimization
- CSS minification

### Monitoring
- Console error tracking
- Performance monitoring
- Usage analytics consideration

## Security Considerations

### Client-Side Security
- Input validation
- XSS prevention
- CORS handling
- Content Security Policy

### Data Protection
- Local storage encryption
- Sensitive data handling
- Session management

## Accessibility Requirements
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Semantic HTML

## Documentation
- TSDoc comments
- Component documentation
- API documentation
- Usage examples
# Current App Structure
*Last Updated: 2025-05-13*

```
src/
├── App.tsx                    # Main app component
├── components/
│   ├── papers/               # Paper-related components
│   │   ├── paper-card.tsx    # Paper display card
│   │   ├── paper-list.tsx    # List container
│   │   └── paper-table-row.tsx # Table view row
│   ├── search/               # Search components
│   │   ├── SearchBar.tsx     # Search input with history
│   │   └── SearchFilters.tsx # Category and date filters
│   ├── profile/              # Profile components
│   ├── layout/               # Layout components
│   │   ├── mobile/           # Mobile-specific layouts
│   │   └── AppLayout.tsx     # Main layout wrapper
│   └── bookmarks/            # Bookmark components
├── hooks/
│   ├── useArxiv.ts           # arXiv API hook
│   ├── useMediaQuery.ts      # Responsive hook
│   ├── usePersistedState.ts  # State persistence
│   └── usePaperState.ts      # Paper UI state
├── lib/
│   ├── arxiv.ts              # Custom arXiv API client
│   ├── bookmarks/            # Bookmark management
│   └── utils.ts              # Utility functions
└── pages/
    ├── search.tsx            # Search page
    ├── catchup.tsx           # Recent papers
    ├── bookmarks.tsx         # Saved papers
    └── settings.tsx          # App settings
```

## Component Hierarchy
```
App
└── AppLayout
    ├── Header
    ├── Sidebar (Desktop/Tablet)
    ├── MobileNavBottom (Mobile)
    └── Pages
        ├── Search
        │   ├── SearchBar
        │   ├── SearchFilters
        │   └── ResponsivePaperList
        │       ├── PaperCard (Mobile/Tablet)
        │       └── PaperTableRow (Desktop)
        ├── Catchup
        ├── Bookmarks
        └── Settings
```

## Data Flow
1. User interacts with UI
2. Components use hooks for data and state
3. Custom arXiv API client makes XML requests
4. XML responses parsed and normalized
5. Data flows through React components
6. UI state persisted as needed
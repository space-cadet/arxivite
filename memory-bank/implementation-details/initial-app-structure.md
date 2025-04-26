# Initial App Structure

```
src/
├── App.tsx                  # Main app component
├── components/
│   ├── SearchBar.tsx       # Search input
│   ├── PaperList.tsx      # List of papers
│   └── PaperCard.tsx      # Individual paper display
└── lib/
    └── arxiv.ts           # arXiv client functions
```

## Component Hierarchy
```
App
└── SearchBar
└── PaperList
    └── PaperCard
```

## Data Flow
1. User enters search in SearchBar
2. App fetches results using arxiv.ts
3. Results passed to PaperList
4. PaperList renders PaperCards
# T6: Paper Bookmarking System
*Created: 2025-04-27*
*Updated: 2025-05-11*

**Description**: Implement paper bookmarking functionality with local storage persistence
**Status**: 🔄 In Progress
**Priority**: MEDIUM
**Started**: 2025-05-11
**Last Active**: 2025-05-11
**Dependencies**: T1, T2

## Completion Criteria
- [ ] Create bookmark data structure
- [ ] Implement bookmark storage system
- [ ] Add bookmark toggle to PaperCard and PaperTableRow
- [ ] Create bookmark management UI
- [ ] Add bookmark filtering to paper lists
- [ ] Add bookmark export/import
- [ ] Visual feedback for bookmarked state
- [ ] Persistent storage of bookmarks

## Implementation Steps

### 1. Core Architecture Setup
- [ ] Create BookmarkContext and Provider
- [ ] Implement useBookmark hook
- [ ] Set up BookmarkService
- [ ] Define core interfaces and types

### 2. Basic Functionality
- [ ] Implement add/remove bookmark operations
- [ ] Add persistence using usePersistedState
- [ ] Create basic bookmark data structure
- [ ] Add loading states and error handling

### 3. UI Implementation
- [ ] Add bookmark button to PaperCard
- [ ] Add bookmark button to PaperTableRow
- [ ] Implement visual feedback for states
- [ ] Add loading and error states

### 4. Enhanced Features
- [ ] Add collections support
- [ ] Implement tagging system
- [ ] Add notes functionality
- [ ] Create bookmark management UI

## Data Structure
```typescript
interface Bookmark {
  paperId: string;
  dateAdded: Date;
  title: string;    // For quick listing without loading paper
  category: string; // For filtering
  collections?: string[];
}

interface BookmarkStore {
  bookmarks: Record<string, Bookmark>;
  collections: string[];
}
```

## Related Files
### Core Implementation
- `src/lib/bookmarks/types.ts` - Type definitions
- `src/lib/bookmarks/context.tsx` - BookmarkContext
- `src/lib/bookmarks/service.ts` - BookmarkService
- `src/hooks/useBookmark.ts` - Hook for bookmark operations

### UI Components
- `src/components/papers/paper-card.tsx` - Card view bookmark integration
- `src/components/papers/paper-table-row.tsx` - Table view bookmark integration
- `src/components/catchup/RecentPaperList.tsx` - List integration
- `src/hooks/useRecentPapers.ts` - Recent papers integration

## Progress
1. ✅ Initial task setup and planning
2. ✅ Adding bookmark button UI to paper card
3. ✅ Core architecture implementation
   - Created types and interfaces
   - Implemented pure service functions
   - Created context with persistence
   - Added useBookmark hook
4. ⬜ Basic functionality
5. ⬜ Enhanced features

## Session Notes (2025-05-11)
- Completed core architecture setup
- Created all necessary files in src/lib/bookmarks/
- Implemented using existing usePersistedState hook
- Next steps:
  1. Add BookmarkProvider to app
  2. Update PaperCard to use bookmark hook
  3. Add error handling
  4. Add tests

## Notes
Keep implementation simple following KIRSS principle:
- Use local storage for persistence via usePersistedState
- Simple toggle functionality first, then enhance
- Basic import/export as JSON
- Minimize dependencies, use built-in React features
- Follow existing UI patterns and components
# Task Registry
*Last Updated: 2025-04-30*

## Active Tasks
| ID | Title | Status | Priority | Started | Dependencies |
|----|-------|--------|----------|---------|--------------|
| T12 | UI Navigation and Theme Toggle Issues | 🔄 | HIGH | 2025-04-30 | - |
| T8 | Fix Vercel Deployment Routing | 🔄 | HIGH | 2025-04-27 | T0 |
| T5 | Catchup Page Implementation | 🔄 | HIGH | 2025-04-27 | T0, T1, T3 |
| T4 | ML-Enhanced Profile | ⬜ | MEDIUM | - | T3 |
| T6 | Paper Bookmarking System | ⬜ | MEDIUM | - | T1, T2 |

## Task Details
### T12: UI Navigation and Theme Toggle Issues
**Description**: Address issues with navigation, sidebar functionality, and theme toggle
**Status**: 🔄 **Last**: 2025-04-30 16:30
**Criteria**: 
- ✅ Author name persists correctly in profile
- ✅ Theme selection persists across sessions
- Navigation from search page works reliably
- Sidebar collapse/uncollapse works on all pages
**Files**: 
- `src/components/theme/theme-provider.tsx` - Theme persistence
- `src/pages/profile.tsx` - Profile state persistence
- `src/components/layout/app-layout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/pages/search.tsx`
- `src/components/theme/theme-provider.tsx`

### T8: Fix Vercel Deployment Routing
**Description**: Address routing issues in Vercel deployment
**Status**: 🔄 **Last**: 2025-04-27
**Criteria**:
- All routes work correctly in production
- No 404 errors on page refresh
**Files**:
- `vercel.json`
- `vite.config.ts`

### T5: Catchup Page Implementation
**Description**: Implement the paper catchup page functionality
**Status**: 🔄 **Last**: 2025-04-27
**Criteria**:
- Display recent papers from followed categories
- Allow filtering and sorting
- Support paper actions (save, dismiss)
**Files**:
- `src/pages/catchup.tsx`
- `src/components/paper/`

### T4: ML-Enhanced Profile
**Description**: Add ML-enhanced features to research profile
**Status**: ⬜ **Last**: -
**Criteria**:
- Implement paper recommendations
- Add interest analysis
- Generate research summaries
**Files**:
- `src/lib/ml/`
- `src/components/profile/`

### T6: Paper Bookmarking System
**Description**: Implement paper bookmarking functionality
**Status**: ⬜ **Last**: -
**Criteria**:
- Save papers to library
- Organize by collections
- Support tags and notes
**Files**:
- `src/lib/bookmarks/`
- `src/components/bookmark/`

## Completed Tasks
| ID | Title | Completed |
|----|-------|-----------|
| T9 | Fix Theme Toggle Functionality | 2025-04-30 |
| T7 | Search State Persistence | 2025-04-27 |
| T3 | Static Research Profile | 2025-04-27 |
| T2 | Paper Display Components | 2025-04-26 |
| T1 | @agentic/arxiv Integration | 2025-04-26 |
| T0 | Project Setup | 2025-04-26 |
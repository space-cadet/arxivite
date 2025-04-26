# Task Registry
*Last Updated: 2025-04-26*

## Active Tasks
| ID | Title | Status | Priority | Started | Dependencies |
|----|-------|--------|----------|---------|--------------|
| T0 | Project Setup | 🔄 IN PROGRESS | HIGH | 2025-04-26 | - |
| T1 | @agentic/arxiv Integration | ⬜ TODO | HIGH | - | T0 |
| T2 | Paper Display Components | ⬜ TODO | HIGH | - | T0 |
| T3 | Static Research Profile | 🔄 IN PROGRESS | HIGH | 2025-04-26 | T0, T1 |
| T4 | ML-Enhanced Profile | ⬜ TODO | MEDIUM | - | T3 |

## Task Details

### T0: Project Setup
**Description**: Initialize project structure, documentation, and base configuration
**Status**: 🔄 IN PROGRESS
**Last Active**: 2025-04-26
**Completion Criteria**:
- ✅ Set up memory bank documentation
- ✅ Configure essential project dependencies
- ✅ Initialize basic project structure
- 🔄 Set up development environment

**Related Files**:
- `memory-bank/*`
- `package.json`
- `vite.config.ts`
- `tsconfig.json`

**Notes**: Following KIRSS principle for minimal but sufficient setup

### T0.1: Frontend UI Implementation
**Description**: Implement the basic frontend UI components and layout
**Status**: ✅ COMPLETED
**Last Active**: 2025-04-26
**Completion Criteria**:
- ✅ Set up basic app layout with header and sidebar
- ✅ Create paper list and card components
- ✅ Implement paper table with sortable columns
- ✅ Add author and category filters
- ✅ Add expandable paper details
- ✅ Style components using ShadcnUI

**Related Files**:
- `src/components/layout/app-layout.tsx`
- `src/components/papers/paper-table.tsx`
- `src/components/papers/paper-table-row.tsx`
- `src/components/papers/paper-filters.tsx`
- `src/pages/home.tsx`
- `src/types/paper.ts`

**Notes**: UI components implemented with KIRSS principle, focusing on essential features first

### T1: @agentic/arxiv Integration
**Description**: Integrate @agentic/arxiv package for direct arXiv paper access
**Status**: 🔄 IN PROGRESS
**Last Active**: 2025-04-26
**Completion Criteria**:
- ✅ Install and configure @agentic/arxiv
- ✅ Create paper fetching hooks
- ✅ Implement search functionality
- 🔄 Add category filtering support

**Related Files**:
- `src/types/arxiv.ts`
- `src/hooks/useArxiv.ts`
- `src/lib/arxiv.ts`
- `src/pages/home.tsx`
- `src/components/papers/paper-filters.tsx`
- `src/components/papers/paper-table-row.tsx`

**Notes**: Initial integration complete. Known issues:
- Category filter list not populating
- React key warning in paper-filters.tsx

### T2: Paper Display Components
**Description**: Create core UI components for displaying papers
**Status**: ⬜ TODO
**Last Active**: -
**Completion Criteria**:
- Create PaperCard component
- Create PaperList component
- Implement paper detail view
- Add basic styling with ShadcnUI

**Related Files**:
- `src/components/PaperCard.tsx`
- `src/components/PaperList.tsx`
- `src/components/PaperDetail.tsx`

**Notes**: Use ShadcnUI components for consistent styling

### T3: Static Research Profile
**Description**: Implement basic user research profile management with manual inputs
**Status**: 🔄 IN PROGRESS
**Last Active**: 2025-04-26
**Completion Criteria**:
- Create profile data structure and storage
- Implement profile editor UI components
- Add profile-based paper filtering
- Create header menubar with navigation
- Add profile page
- Integrate with existing paper display

**Related Files**:
- `src/types/profile.ts`
- `src/components/profile/ProfileEditor.tsx`
- `src/components/layout/Header.tsx`
- `src/pages/profile.tsx`
- `src/hooks/useProfile.ts`
- `src/hooks/useFilteredPapers.ts`

**Notes**: Following KIRSS principle for basic but effective profile management

### T4: ML-Enhanced Profile
**Description**: Add machine learning capabilities to automatically enhance user research profiles
**Status**: ⬜ TODO
**Last Active**: -
**Completion Criteria**:
- Implement paper similarity analysis
- Add paper interaction tracking
- Create ML model for profile enhancement
- Integrate with static profile system
- Add profile suggestions UI
- Add profile learning controls

**Related Files**:
- `src/lib/ml/similarity.ts`
- `src/lib/ml/profile-learner.ts`
- `src/components/profile/MLControls.tsx`
- `src/hooks/useProfileLearning.ts`
- `src/types/ml-profile.ts`

**Notes**: Build on top of static profile system, focus on simple but effective ML approaches first

## Completed Tasks
None yet.

## Task Relationships
```mermaid
graph TD
    T0[T0: Project Setup]
    T1[T1: @agentic/arxiv Integration]
    T2[T2: Paper Display Components]
    
    T0 --> T1
    T0 --> T2
```

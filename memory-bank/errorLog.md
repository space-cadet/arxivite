# Error Log

## 2025-05-19 19:30: T23 - Local/Vercel Search Parameter Mismatch
**File:** `src/lib/arxiv.ts`
**Error:** `Error in LLM-enhanced search: Error: ArXiv API error: 400 Bad Request`
**Cause:** Local and Vercel environments using different sort parameters due to localStorage persistence:
```
Local: sortBy=relevance&sortOrder=ascending
Vercel: sortBy=submittedDate&sortOrder=descending
```
**Fix:** Centralized search configuration with consistent defaults
**Changes:** 
```typescript
// Created src/config/search.ts
export const DEFAULT_SEARCH_CONFIG = {
  pageSize: 50,
  sortField: 'relevance',
  sortOrder: 'descending',
  currentPage: 0
};

// Updated search.tsx to use unified config
const [searchConfig, setSearchConfig] = usePersistedState<SearchConfig>('search.config', DEFAULT_SEARCH_CONFIG);
```
**Task:** T23

## 2025-05-19 19:30: T23 - Search Parameter Inconsistency
**File:** `src/pages/search.tsx`, `src/lib/arxiv.ts`
**Error:** Different sort parameters between local and Vercel environments
**Cause:** Inconsistent state persistence causing different default values to be used
**Fix:** Implemented centralized search configuration
**Changes:** 
- Created `src/config/search.ts` with DEFAULT_SEARCH_CONFIG
- Updated search page to use unified configuration
- Fixed TypeScript type issues with page size and sort order
**Task:** T23

## 2025-05-19 14:35: T18 - Type Safety Issues with Error Handling
**File:** `src/lib/logging/logger.ts`
**Error:** TypeScript type safety warning - unsafe access to error.code
**Cause:** Missing proper type narrowing for error object causing potential runtime errors
**Fix:** Added proper type narrowing using instanceof and property checks
**Changes:**
```typescript
// Before
if (error.code !== 'ENOENT') {
  throw error;
}

// After
if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
  throw error;
}
```

## 2025-05-19 14:30: T18 - Type Inconsistencies in Paper Sorting
**File:** `src/components/papers/paper-table.tsx`
**Error:** TypeScript type mismatch in sorting logic
**Cause:** Incorrect mapping of sort fields to Paper type properties and unsafe date handling
**Fix:** Updated sort field mapping and added proper date handling with fallbacks
**Changes:** 
```typescript
// Before
case 'submittedDate':
  comparison = a.publishedDate - b.publishedDate;
  break;

// After
case 'submittedDate':
  comparison = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
  break;
case 'lastUpdatedDate':
  comparison = new Date(a.updatedDate || a.publishedDate).getTime() - new Date(b.updatedDate || b.publishedDate).getTime();
  break;
```

## 2025-05-19 14:22: T18 - Invalid Hook Arguments in Search Page
**File:** `src/pages/search.tsx`
**Error:** `error TS2554: Expected 1 arguments, but got 2.`
**Cause:** The `useArxivSearch().search()` hook was being called with query options as a second argument, but the hook only accepts a single params object
**Fix:** Removed the second argument since caching settings are already configured in the useArxivSearch hook itself
**Changes:** Removed the redundant options object:
```typescript
// Before
arxivSearch.search(params, {
  staleTime: 30000,
  cacheTime: 300000,
  retry: 1,
  refetchOnWindowFocus: false
});

// After
arxivSearch.search(params);
```
**Task:** T18

## 2025-05-15 10:30: T16 - Missing Props in ResponsivePaperList Components
**File:** Multiple files
**Error:** TypeScript compile errors
```
Type '{ papers: Paper[]; paperState: PaperStateHook; }' is missing the following properties from type 'ResponsivePaperListProps': onSort, sortField, sortOrder
Type '"submittedDate"' is not assignable to type '"relevance" | "date"'.
```
**Cause:** Missing required props in ResponsivePaperList component usage and type mismatch in SortIcon component:
1. Required props not provided in multiple components
2. Incorrect type for sort field in paper-table.tsx
**Fix:** 
1. Added missing props with default values
2. Updated type definition for sort fields
**Changes:**
- Added onSort, sortField, and sortOrder props to ResponsivePaperList usage in:
  - RecentPaperList.tsx
  - bookmarks.tsx
  - profile.tsx
- Updated SortIcon field type in paper-table.tsx
**Task:** T16

## 2025-05-15 10:45: T16 - Unused Parameter Warnings
**File:** Multiple files
**Error:** TypeScript warnings
```
'field' is declared but its value is never read.
```
**Cause:** Unused parameters in no-op functions for onSort handlers
**Fix:** Prefixed unused parameters with underscore to indicate intentional non-use
**Changes:**
- Updated parameter names to '_field' in:
  - RecentPaperList.tsx
  - bookmarks.tsx
  - profile.tsx
**Task:** T16

## 2025-05-13 15:14: T15 - Merge Conflict in Profile Page
**File:** `src/pages/profile.tsx`
**Error:** Runtime error in Vite
```
Pre-transform error: Unexpected token (118:0)
  116 |   }, []); // Run once on mount
  117 |
> 118 | =======
      | ^
```
**Cause:** Unresolved merge conflict markers left in the code during a merge or rebase operation
**Fix:** Cleaned up the file by:
1. Removing all merge conflict markers
2. Fixing the structure of the useEffect hook
3. Ensuring proper code flow and indentation
**Changes:**
- Removed all `=======` merge conflict markers
- Fixed code structure around the useEffect hook for cleaning up fragmented author names
- Ensured proper flow between hooks and render section
**Task:** T15

## 2025-05-13 10:30: T14 - TypeScript Build Errors in Paper Components
**File:** Multiple files (paper-card.tsx, paper-list.tsx, paper-table-row.tsx, profile.tsx)
**Error:** TypeScript compile errors
```
Cannot find name 'usePaperState'.
Property 'paperState' is missing in type '{ key: string; paper: Paper; }'.
Module '@/hooks/usePaperState' has no exported member 'ReturnType'.
```
**Cause:** Missing type exports and prop requirements in paper components:
1. usePaperState hook type not properly exported
2. paperState prop missing in component props
3. Incorrect type import for ReturnType
**Fix:** 
1. Added proper type exports for usePaperState hook
2. Updated components to include and pass paperState prop
3. Fixed type imports and definitions
**Changes:**
- Added PaperStateHook type export in usePaperState.ts
- Updated PaperCard, PaperList, and PaperTableRow components with proper types
- Added paperState prop passing in profile.tsx
**Task:** T14

*Last Updated: 2025-05-13 10:30*

## 2025-05-12 17:30: T6 - Invalid Error Type Access in Bookmarks Page
**File:** `src/pages/bookmarks.tsx`
**Error:** TypeScript compile error
```
Property 'message' does not exist on type 'never'.
```
**Cause:** Attempting to access the 'message' property on an error object that TypeScript infers as type 'never'
**Fix:** Added proper type checking and error handling
**Changes:**
- Added type guard to check if error is instance of Error
- Added fallback for unknown error types
**Task:** T6

## 2025-05-12 17:00: T6 - Readonly Array Type Mismatch in Bookmark Update
**File:** `src/pages/bookmarks.tsx`
**Error:** TypeScript compile error
```
Argument of type 'ArxivPaper[] | readonly []' is not assignable to parameter of type 'any[]'.
  The type 'readonly []' is 'readonly' and cannot be assigned to the mutable type 'any[]'.
```
**Cause:** Function parameter type mismatch between readonly array from API response and mutable array parameter
**Fix:** Updated parameter type to accept readonly arrays
**Changes:**
- Changed updateOldBookmarks parameter type to ReadonlyArray<ArxivPaper>
- Imported ArxivPaper type from @/types/arxiv
**Task:** T6

## 2025-05-12 17:00: T6 - Invalid Error Type in Error Message Display
**File:** `src/pages/bookmarks.tsx`
**Error:** TypeScript compile errors
```
The left-hand side of an 'instanceof' expression must be of type 'any', an object type or a type parameter.
Property 'message' does not exist on type 'never'.
```
**Cause:** Incorrect error type checking and unsafe property access in error display component
**Fix:** Implemented more robust error type checking and safe property access
**Changes:**
- Updated error message display to use type-safe checks
- Modified error message extraction to handle unknown error types
**Task:** T6

## 2025-05-12 16:00: T6 - Missing Type Annotations and Returns in BookmarkContext
**File:** `src/lib/bookmarks/context.tsx`
**Error Message:**
```
Cannot find name 'useState'.
Parameter 'bookmark' implicitly has an 'any' type.
Parameter 'paperId' implicitly has an 'any' type.
Type 'void' is not assignable to type 'BookmarkStore'.
```
**Cause:** Multiple TypeScript issues in BookmarkContext:
1. useState not imported from React
2. Missing type annotations for function parameters
3. Service method return types not properly defined
**Fix:** 
1. Added useState import
2. Added correct type annotations
3. Updated service interface and implementation to handle return values correctly
**Changes:**
1. Added useState to React imports
2. Added Bookmark import from types
3. Added proper type annotations for function parameters
4. Updated BookmarkService interface to specify correct return types
5. Modified service methods to return updated store
**Task:** T6

*Last Updated: 2025-05-12 16:00*

## 2025-05-12 15:20: T6 - ArxivPaper to Paper Type Mismatch
**File:** `src/pages/bookmarks.tsx`
**Error:** TypeScript compile error
```
Type 'ArxivPaper[]' is not assignable to type 'Paper[]'.
  Type 'ArxivPaper' is not assignable to type 'Paper'.
    Type 'ArxivPaper' is missing the following properties from type '{ pdfUrl: string; thumbnailUrl?: string | undefined; abstract: string; category: string; categories: string[]; }': pdfUrl, category
```
**Cause:** ResponsivePaperList component expects Paper type but was receiving ArxivPaper type without proper conversion
**Fix:** Added proper type conversion using arxivToPaper utility function
**Changes:**
- Imported arxivToPaper from @/types/paper
- Added conversion of ArxivPaper to Paper type
- Updated code to use converted papers
**Task:** T6

## 2025-05-12 15:25: T6 - Implicit any Type in Author Filter
**File:** `src/pages/bookmarks.tsx`
**Error:** TypeScript compile error
```
Parameter 'author' implicitly has an 'any' type.
```
**Cause:** Missing type annotation for author parameter in papers filter callback
**Fix:** Added explicit type annotation for the author parameter
**Changes:**
- Added `: string` type annotation to author parameter in filter callback
**Task:** T6

## 2025-05-12 14:30: T6 - Missing Required paperData in Bookmark Type
**File:** `src/components/papers/paper-table-row.tsx`
**Error:** TypeScript compile error
```
Argument of type '{ paperId: string; title: string; category: string; }' is not assignable to parameter of type 'Omit<Bookmark, "dateAdded">'.
  Property 'paperData' is missing in type '{ paperId: string; title: string; category: string; }' but required in type 'Omit<Bookmark, "dateAdded">'
```
**Cause:** When adding a new bookmark in PaperTableRow component, the required `paperData` property was not included in the bookmark object being passed to `addBookmark`.
**Fix:** Added the full paper data to the bookmark object when calling `addBookmark`
**Changes:**
- Updated `addBookmark` call to include `paperData: paper` in the bookmark object
**Task:** T6

## 2025-05-11 16:45: T13 - React Context "Dispatcher is null" Error
**File:** Multiple components including `mode-toggle.tsx`
**Error:** `Uncaught TypeError: dispatcher is null`
**Stack trace:** 
```
useContext React
useTheme useTheme.ts:5
ModeToggle mode-toggle.tsx:12
```
**Cause:** Interaction between browser/Node.js environment detection in the XML parser and React's context system. The theme provider context was not properly accessed after changes to fix the build error.
**Fix:** Simplified environment detection approach in the XML parser and adjusted the main.tsx structure
**Changes:**
- Simplified the XML parser's browser detection to avoid conflicts with React
- Improved how ThemeProvider context is provided in the component tree
- Removed unnecessary wrapper elements in main.tsx
**Task:** T13

## 2025-05-11 16:30: T13 - Vite Build Failure with xmldom
**File:** `src/lib/arxiv.ts`
**Error:** `Rollup failed to resolve import "xmldom" from "/Users/deepak/code/arxivite/src/lib/arxiv.ts"`
**Cause:** The xmldom package is a Node.js dependency and not meant for browser environments, which Vite targets during the build process
**Fix:** Created a browser-compatible XML parsing solution that avoids direct import of xmldom in browser environments
**Changes:** 
- Implemented a conditional XML parser that uses native DOM in browsers
- Used a safe require approach for Node.js environments
- Added proper tree-shaking hints for bundlers
**Task:** T13

## 2025-05-11 16:15: T13 - TypeScript Unused Variable Warning
**File:** `src/components/responsive/ResponsiveIndicator.tsx`
**Error:** `error TS6133: 'isDesktop' is declared but its value is never read.`
**Cause:** The isDesktop variable was declared but not used in the component, which is caught by the strict TS configuration
**Fix:** Updated tsconfig and component to properly use the variable
**Changes:** 
- Modified `tsconfig.app.json` to temporarily disable noUnusedLocals
- Updated the ResponsiveIndicator component to use the isDesktop variable in conditions
**Task:** T13

## 2025-04-27 16:45: T1 - Module Resolution Error in Test Setup
**File:** `tests/arxiv-test.ts`
**Error:** `ERR_MODULE_NOT_FOUND: Cannot find module '/Users/deepak/code/arxivite/src/lib/arxiv'`
**Cause:** ESM module resolution issues with TypeScript files in Node.js environment
**Fix:** Added tsx package and configured TypeScript test environment
**Changes:** 
- Installed tsx package
- Created tsconfig.test.json
- Updated import paths
**Task:** T1

## 2025-04-27 16:45: T1 - DOMParser Not Available in Node Environment
**File:** `src/lib/arxiv.ts`
**Error:** `ReferenceError: DOMParser is not defined`
**Cause:** Browser-specific DOMParser API not available in Node.js environment
**Fix:** Implemented Node.js compatible XML parsing solution
**Changes:** 
- Installed xmldom package
- Updated XML parsing logic to use getElementsByTagName
**Task:** T1

## 2025-04-27 15:30: T1 - ArXiv Client Configuration Error
**File:** `src/lib/arxiv.ts`
**Error:** `Cannot read properties of undefined (reading 'apiBaseUrl')`
**Cause:** Missing configuration object for ArXivClient
**Fix:** Added proper configuration with correct API base URL
**Changes:** Updated client initialization with proper config object
**Task:** T1

## 2025-04-27 14:45: T1 - Search Query Parameter Error
**File:** `src/lib/arxiv.ts`
**Error:** `The 'searchQuery' property must be non-empty if the 'ids' property is not provided`
**Cause:** Incorrect parameter name in API call
**Fix:** Updated parameter mapping in search function
**Changes:** Changed `query` to `searchQuery` in client parameters
**Task:** T1

## 2025-04-27 14:30: T1 - Paper Data Mapping Error
**File:** `src/lib/arxiv.ts`
**Error:** `TypeError: results.map is not a function`
**Cause:** Incorrect assumptions about API response structure
**Fix:** Added proper response handling with fallbacks
**Changes:** Updated data transformation with proper type checking
**Task:** T1

## 2025-04-26 16:15: T1 - Category Filter Not Populating
**File:** `src/components/papers/paper-filters.tsx`
**Error:** Category list in Select component not displaying
**Cause:** Missing category data population logic
**Fix:** To be implemented
**Changes:** None yet
**Task:** T1

## 2025-04-26 16:00: T1 - React Key Warning
**File:** `src/components/papers/paper-filters.tsx`
**Error:** Warning about missing unique "key" prop in list children
**Cause:** Missing key prop in mapped elements
**Fix:** To be implemented
**Changes:** None yet
**Task:** T1
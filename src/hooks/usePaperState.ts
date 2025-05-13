// src/hooks/usePaperState.ts
import { usePersistedState } from '@/hooks/usePersistedState';

interface PaperState {
  expandedPapers: Record<string, boolean>;
}

export function usePaperState(key: string) {
  const [paperState, setPaperState] = usePersistedState<PaperState>(`papers.${key}`, {
    expandedPapers: {}
  });

  const toggleExpanded = (paperId: string) => {
    setPaperState(prev => ({
      ...prev,
      expandedPapers: {
        ...prev.expandedPapers,
        [paperId]: !prev.expandedPapers[paperId]
      }
    }));
  };

  const isExpanded = (paperId: string): boolean => {
    return !!paperState.expandedPapers[paperId];
  };

  return {
    paperState,
    toggleExpanded,
    isExpanded
  };
}
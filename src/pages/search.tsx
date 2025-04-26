import { useState, useMemo, useEffect } from 'react';
import { Paper, arxivToPaper } from '@/types/paper';
import PaperTable from '@/components/papers/paper-table';
import PaperFilters from '@/components/papers/paper-filters';
import { useArxivSearch } from '@/hooks/useArxiv';
import { useProfile } from '@/contexts/ProfileContext';
import { useFilteredPapers } from '@/hooks/useFilteredPapers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from "@tanstack/react-query"
import PaperCard from "@/components/papers/paper-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { Paper } from "@/types/paper"

type TimeRange = "daily" | "weekly" | "monthly"
type FilterType = "all" | "recommended" | "bookmarked"

interface RecentPaperListProps {
  timeRange: TimeRange
  filter: FilterType
}

import { useRecentPapers } from "@/hooks/useRecentPapers"

export default function RecentPaperList({ timeRange, filter }: RecentPaperListProps) {
  const { papers, isLoading, error, isEmpty } = useRecentPapers(timeRange, filter)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load papers. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  if (isEmpty) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {filter === "recommended" 
            ? "No recommended papers found based on your profile. Try adjusting your research interests in the profile page."
            : filter === "bookmarked"
            ? "No bookmarked papers found. Bookmark papers to see them here."
            : "No papers found for the selected time range."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {papers.map((paper) => (
        <PaperCard key={paper.id || paper.title} paper={paper} />
      ))}
    </div>
  )
}
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useProfile } from "@/hooks/useProfile"
import PaperFilters from "@/components/papers/paper-filters"
import { Card, CardContent } from "@/components/ui/card"
import RecentPaperList from "@/components/catchup/RecentPaperList"
import TimeFilter from "@/components/catchup/TimeFilter"
import ProfileSummary from "@/components/profile/ProfileSummary"
import { usePersistedState } from "@/hooks/usePersistedState"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { getCategoryName } from "@/lib/categories"

type TimeRange = "daily" | "weekly" | "monthly"
type FilterType = "all" | "recommended"

// Modified CatchupPage component
import { useScrollState } from '@/hooks/useScrollState';
import { usePaperState } from '@/hooks/usePaperState';

export default function CatchupPage() {
  const { profile } = useProfile();
  const [timeRange, setTimeRange] = usePersistedState<TimeRange>("catchup.timeRange", "daily")
  const [filter, setFilter] = usePersistedState<FilterType>("catchup.filter", "all")
  const [authorFilter, setAuthorFilter] = usePersistedState<string>("catchup.authorFilter", "")
  const [selectedCategory, setSelectedCategory] = usePersistedState<string>("catchup.category", "all")

  // Add scroll state persistence
  useScrollState('catchup');

  // Add paper expanded state persistence
  const paperState = usePaperState('catchup');

  const handleAuthorSearch = (author: string) => {
    setAuthorFilter(author);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Paper Catchup</h1>
        <TimeFilter value={timeRange} onValueChange={setTimeRange} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:flex-1 space-y-4">
          <PaperFilters 
            authorValue={authorFilter}
            categoryValue={selectedCategory}
            searchValue=""
            onSearch={() => {}}
            onAuthorSearch={handleAuthorSearch}
            onCategorySelect={handleCategorySelect}
            categories={profile.categories}
          />

          {/* Active Filters */}
          {(authorFilter || selectedCategory !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-1">
              {authorFilter && (
                <Badge 
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5 px-3 text-sm"
                >
                  Author: {authorFilter}
                  <X 
                    className="h-3 w-3 cursor-pointer ml-1" 
                    onClick={() => setAuthorFilter('')}
                  />
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge 
                  className="flex items-center gap-1 py-1.5 px-3 text-sm"
                >
                  Category: {getCategoryName(selectedCategory)}
                  <X 
                    className="h-3 w-3 cursor-pointer ml-1" 
                    onClick={() => setSelectedCategory('all')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="w-full md:w-[300px] order-first md:order-last">
          <ProfileSummary />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all" className="w-full" value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all" className="py-2 px-4">All Papers</TabsTrigger>
              <TabsTrigger value="recommended" className="py-2 px-4">Recommended</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <RecentPaperList 
                timeRange={timeRange} 
                filter="all"
                authorFilter={authorFilter}
                categoryFilter={selectedCategory}
                paperState={paperState} 
              />
            </TabsContent>
            <TabsContent value="recommended" className="mt-4">
              <RecentPaperList 
                timeRange={timeRange} 
                filter="recommended"
                authorFilter={authorFilter}
                categoryFilter={selectedCategory}
                paperState={paperState}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useProfile } from "@/hooks/useProfile"
import PaperFilters from "@/components/papers/paper-filters"
import { Card, CardContent } from "@/components/ui/card"
import RecentPaperList from "@/components/catchup/RecentPaperList"
import TimeFilter from "@/components/catchup/TimeFilter"
import ProfileSummary from "@/components/profile/ProfileSummary"
import { usePersistedState } from "@/hooks/usePersistedState"

type TimeRange = "daily" | "weekly" | "monthly"
type FilterType = "all" | "recommended" | "bookmarked"

export default function CatchupPage() {
  const { profile } = useProfile();
  const [timeRange, setTimeRange] = usePersistedState<TimeRange>("catchup.timeRange", "daily")
  const [filter, setFilter] = usePersistedState<FilterType>("catchup.filter", "all")
  const [authorFilter, setAuthorFilter] = usePersistedState<string>("catchup.authorFilter", "")
  const [selectedCategory, setSelectedCategory] = usePersistedState<string>("catchup.category", "all")

  const handleAuthorSearch = (author: string) => {
    setAuthorFilter(author);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paper Catchup</h1>
        <TimeFilter value={timeRange} onValueChange={setTimeRange} />
      </div>

      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <PaperFilters 
            authorValue={authorFilter}
            categoryValue={selectedCategory}
            searchValue=""
            onSearch={() => {}}
            onAuthorSearch={handleAuthorSearch}
            onCategorySelect={handleCategorySelect}
            categories={profile.categories}
          />
        </div>
        <div className="w-[300px]">
          <ProfileSummary />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all" className="w-full" value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All Papers</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <RecentPaperList 
                timeRange={timeRange} 
                filter="all"
                authorFilter={authorFilter}
                categoryFilter={selectedCategory}
              />
            </TabsContent>
            <TabsContent value="recommended" className="mt-4">
              <RecentPaperList 
                timeRange={timeRange} 
                filter="recommended"
                authorFilter={authorFilter}
                categoryFilter={selectedCategory}
              />
            </TabsContent>
            <TabsContent value="bookmarked" className="mt-4">
              <RecentPaperList 
                timeRange={timeRange} 
                filter="bookmarked"
                authorFilter={authorFilter}
                categoryFilter={selectedCategory}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
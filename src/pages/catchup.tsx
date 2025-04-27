import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import RecentPaperList from "@/components/catchup/RecentPaperList"
import TimeFilter from "@/components/catchup/TimeFilter"
import { useState } from "react"

type TimeRange = "daily" | "weekly" | "monthly"

export default function CatchupPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paper Catchup</h1>
        <TimeFilter value={timeRange} onValueChange={setTimeRange} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Papers</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <RecentPaperList timeRange={timeRange} filter="all" />
            </TabsContent>
            <TabsContent value="recommended" className="mt-4">
              <RecentPaperList timeRange={timeRange} filter="recommended" />
            </TabsContent>
            <TabsContent value="bookmarked" className="mt-4">
              <RecentPaperList timeRange={timeRange} filter="bookmarked" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
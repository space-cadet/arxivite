import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TimeRange = "daily" | "weekly" | "monthly"

interface TimeFilterProps {
  value: TimeRange
  onValueChange: (value: TimeRange) => void
}

export default function TimeFilter({ value, onValueChange }: TimeFilterProps) {
  return (
    <Select value={value} onValueChange={(val) => onValueChange(val as TimeRange)}>
      <SelectTrigger className="w-full sm:w-[180px] h-10">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily" className="py-2.5">Last 24 Hours</SelectItem>
        <SelectItem value="weekly" className="py-2.5">Last 7 Days</SelectItem>
        <SelectItem value="monthly" className="py-2.5">Last 30 Days</SelectItem>
      </SelectContent>
    </Select>
  )
}
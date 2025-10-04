"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [timeRange, setTimeRange] = useState("7d")

  // Mock analytics data
  const kpis = [
    {
      label: "Total Inspections",
      value: "12,847",
      change: "+8.2%",
      trend: "up" as const,
      period: "vs last week",
    },
    {
      label: "Pass Rate",
      value: "94.3%",
      change: "+2.1%",
      trend: "up" as const,
      period: "vs last week",
    },
    {
      label: "Avg Processing Time",
      value: "67ms",
      change: "-5ms",
      trend: "up" as const,
      period: "vs last week",
    },
    {
      label: "System Uptime",
      value: "99.8%",
      change: "0%",
      trend: "stable" as const,
      period: "vs last week",
    },
  ]

  const failureBreakdown = [
    { type: "Weld Defect", count: 234, percentage: 38, color: "bg-error" },
    { type: "Wire Misalignment", count: 156, percentage: 25, color: "bg-warning" },
    { type: "Surface Scratch", count: 98, percentage: 16, color: "bg-info" },
    { type: "Incomplete Weld", count: 87, percentage: 14, color: "bg-purple-500" },
    { type: "Other", count: 42, percentage: 7, color: "bg-muted-foreground" },
  ]

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    inspections: Math.floor(400 + Math.random() * 200),
    failures: Math.floor(10 + Math.random() * 30),
  }))

  const weeklyData = [
    { day: "Mon", pass: 1850, fail: 120 },
    { day: "Tue", pass: 1920, fail: 95 },
    { day: "Wed", pass: 1780, fail: 145 },
    { day: "Thu", pass: 1890, fail: 110 },
    { day: "Fri", pass: 1950, fail: 88 },
    { day: "Sat", pass: 1650, fail: 102 },
    { day: "Sun", pass: 1580, fail: 98 },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-error" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  "Pick a date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange as any} />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              {getTrendIcon(kpi.trend)}
            </div>
            <div className="text-3xl font-bold mb-1">{kpi.value}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className={cn("font-semibold", kpi.trend === "up" ? "text-success" : "text-muted-foreground")}>
                {kpi.change}
              </span>
              <span className="text-muted-foreground">{kpi.period}</span>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            {/* Hourly Inspection Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Inspections by Hour</h3>
              <div className="h-64 flex items-end gap-1">
                {hourlyData.map((data) => (
                  <div key={data.hour} className="flex-1 flex flex-col gap-1 items-center">
                    <div className="w-full flex flex-col gap-0.5">
                      <div
                        className="w-full bg-success rounded-t transition-all hover:opacity-80"
                        style={{ height: `${(data.inspections / 600) * 200}px` }}
                        title={`${data.inspections} inspections`}
                      />
                      <div
                        className="w-full bg-error rounded-b transition-all hover:opacity-80"
                        style={{ height: `${(data.failures / 600) * 200}px` }}
                        title={`${data.failures} failures`}
                      />
                    </div>
                    {data.hour % 3 === 0 && <span className="text-xs text-muted-foreground mt-1">{data.hour}h</span>}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-success" />
                  <span className="text-sm text-muted-foreground">Pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-error" />
                  <span className="text-sm text-muted-foreground">Fail</span>
                </div>
              </div>
            </Card>

            {/* Failure Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Failure Breakdown</h3>
              <div className="space-y-4">
                {failureBreakdown.map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Failures</span>
                  <span className="font-bold">617</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
            <div className="h-64 flex items-end justify-around gap-4">
              {weeklyData.map((data) => {
                const total = data.pass + data.fail
                const passHeight = (data.pass / total) * 100
                const failHeight = (data.fail / total) * 100

                return (
                  <div key={data.day} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full max-w-20 h-48 bg-muted rounded-lg overflow-hidden flex flex-col-reverse">
                      <div className="bg-success transition-all" style={{ height: `${passHeight}%` }} />
                      <div className="bg-error transition-all" style={{ height: `${failHeight}%` }} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">{data.day}</div>
                      <div className="text-xs text-muted-foreground">{total}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Quality Metrics Tab */}
        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pass/Fail Distribution</h3>
              <div className="relative h-48 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="40"
                    className="text-muted"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="40"
                    strokeDasharray={`${94.3 * 5.03} ${(100 - 94.3) * 5.03}`}
                    strokeDashoffset="125.75"
                    className="text-success"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">94.3%</div>
                  <div className="text-sm text-muted-foreground">Pass Rate</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span>Pass</span>
                  </div>
                  <span className="font-mono">12,117</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-error" />
                    <span>Fail</span>
                  </div>
                  <span className="font-mono">730</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
              <div className="h-48 flex items-end gap-2">
                {[
                  { range: "0-50%", count: 12, color: "bg-error" },
                  { range: "50-60%", count: 28, color: "bg-warning" },
                  { range: "60-70%", count: 145, color: "bg-info" },
                  { range: "70-80%", count: 892, color: "bg-success/60" },
                  { range: "80-90%", count: 3420, color: "bg-success/80" },
                  { range: "90-100%", count: 8350, color: "bg-success" },
                ].map((item) => (
                  <div key={item.range} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={cn("w-full rounded-t transition-all hover:opacity-80", item.color)}
                      style={{ height: `${(item.count / 8350) * 160}px` }}
                      title={`${item.count} inspections`}
                    />
                    <span className="text-xs text-muted-foreground text-center">{item.range}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quality Trends</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">First Pass Yield</span>
                    <span className="text-lg font-bold">92.1%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: "92.1%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Defect Rate</span>
                    <span className="text-lg font-bold">5.7%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-error rounded-full" style={{ width: "5.7%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">False Positive Rate</span>
                    <span className="text-lg font-bold">2.3%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: "2.3%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Avg Confidence</span>
                    <span className="text-lg font-bold">87.4%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-info rounded-full" style={{ width: "87.4%" }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Defect Severity Over Time</h3>
            <div className="h-64 flex items-end gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const critical = Math.floor(Math.random() * 15)
                const major = Math.floor(Math.random() * 25)
                const minor = Math.floor(Math.random() * 20)
                const total = critical + major + minor

                return (
                  <div key={i} className="flex-1 flex flex-col-reverse gap-0.5">
                    <div
                      className="w-full bg-error rounded-b"
                      style={{ height: `${(critical / 60) * 200}px` }}
                      title={`${critical} critical`}
                    />
                    <div
                      className="w-full bg-warning"
                      style={{ height: `${(major / 60) * 200}px` }}
                      title={`${major} major`}
                    />
                    <div
                      className="w-full bg-info rounded-t"
                      style={{ height: `${(minor / 60) * 200}px` }}
                      title={`${minor} minor`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-error" />
                <span className="text-sm text-muted-foreground">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-warning" />
                <span className="text-sm text-muted-foreground">Major</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-info" />
                <span className="text-sm text-muted-foreground">Minor</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processing Time Distribution</h3>
              <div className="h-64 flex items-end gap-2">
                {[
                  { range: "<50ms", count: 2340, color: "bg-success" },
                  { range: "50-60ms", count: 4820, color: "bg-success/80" },
                  { range: "60-70ms", count: 3210, color: "bg-info" },
                  { range: "70-80ms", count: 1890, color: "bg-warning" },
                  { range: "80-90ms", count: 420, color: "bg-warning/70" },
                  { range: ">90ms", count: 167, color: "bg-error" },
                ].map((item) => (
                  <div key={item.range} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={cn("w-full rounded-t transition-all hover:opacity-80", item.color)}
                      style={{ height: `${(item.count / 4820) * 200}px` }}
                      title={`${item.count} inspections`}
                    />
                    <span className="text-xs text-muted-foreground text-center">{item.range}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Throughput Analysis</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Peak Throughput</span>
                    <span className="text-2xl font-bold font-mono">587/hr</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Achieved at 14:00 - 15:00</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Throughput</span>
                    <span className="text-2xl font-bold font-mono">456/hr</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Last 7 days average</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Target Throughput</span>
                    <span className="text-2xl font-bold font-mono">500/hr</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-info rounded-full" style={{ width: "91.2%" }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">91.2% of target</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Efficiency</h3>
              <div className="h-64 flex items-end gap-1">
                {Array.from({ length: 24 }, (_, i) => {
                  const efficiency = 75 + Math.random() * 20
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "w-full rounded-t transition-all",
                          efficiency > 90 ? "bg-success" : efficiency > 80 ? "bg-info" : "bg-warning",
                        )}
                        style={{ height: `${(efficiency / 100) * 200}px` }}
                        title={`${efficiency.toFixed(1)}% efficiency`}
                      />
                      {i % 4 === 0 && <span className="text-xs text-muted-foreground">{i}h</span>}
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: "Avg Processing Time", value: "67ms", target: "< 80ms", status: "good" },
                  { label: "Max Processing Time", value: "124ms", target: "< 150ms", status: "good" },
                  { label: "Min Processing Time", value: "42ms", target: "N/A", status: "good" },
                  { label: "Std Deviation", value: "±12ms", target: "< ±15ms", status: "good" },
                  { label: "Queue Wait Time", value: "3ms", target: "< 10ms", status: "good" },
                  { label: "Camera Latency", value: "8ms", target: "< 15ms", status: "good" },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <div className="text-sm font-medium">{metric.label}</div>
                      <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-mono">{metric.value}</span>
                      <Badge className="bg-success/20 text-success">OK</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">30-Day Pass Rate Trend</h3>
              <div className="h-64 relative">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <polyline
                    points={Array.from({ length: 30 }, (_, i) => {
                      const x = (i / 29) * 380 + 10
                      const y = 180 - (92 + Math.random() * 6 - 3) * 1.6
                      return `${x},${y}`
                    }).join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-success"
                  />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
                  <span>Day 1</span>
                  <span>Day 15</span>
                  <span>Day 30</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Failure Rate Trend</h3>
              <div className="h-64 relative">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <polyline
                    points={Array.from({ length: 30 }, (_, i) => {
                      const x = (i / 29) * 380 + 10
                      const y = 180 - (5 + Math.random() * 3) * 20
                      return `${x},${y}`
                    }).join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-error"
                  />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
                  <span>Day 1</span>
                  <span>Day 15</span>
                  <span>Day 30</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Comparison</h3>
              <div className="space-y-4">
                {[
                  { month: "January", inspections: 38420, passRate: 93.8, change: "+1.2%" },
                  { month: "February", inspections: 35680, passRate: 94.1, change: "+0.3%" },
                  { month: "March", inspections: 41250, passRate: 94.3, change: "+0.2%" },
                ].map((data) => (
                  <div key={data.month} className="p-3 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{data.month}</span>
                      <Badge className="bg-success/20 text-success">{data.change}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Inspections</div>
                        <div className="font-mono font-bold">{data.inspections.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Pass Rate</div>
                        <div className="font-mono font-bold">{data.passRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Predictive Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Improving Quality</div>
                      <div className="text-sm text-muted-foreground">
                        Pass rate has improved by 2.1% over the last 7 days. Current trajectory suggests reaching 95% by
                        end of month.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Maintenance Due</div>
                      <div className="text-sm text-muted-foreground">
                        Camera module showing increased latency. Recommend maintenance within 2 weeks.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Peak Performance</div>
                      <div className="text-sm text-muted-foreground">
                        System operating at 98.5% efficiency. All metrics within optimal range.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

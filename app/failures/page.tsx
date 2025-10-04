"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Trash2, CalendarIcon, X, ZoomIn } from "lucide-react"
import { format } from "date-fns"

interface FailureRecord {
  id: string
  timestamp: Date
  reason: string
  confidence: number
  imageUrl: string
  severity: "critical" | "major" | "minor"
  resolved: boolean
  notes?: string
}

export default function FailuresPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedFailure, setSelectedFailure] = useState<FailureRecord | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock failure data
  const failures: FailureRecord[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000),
      reason: "Weld Defect",
      confidence: 0.94,
      imageUrl: "/failure-weld-defect.jpg",
      severity: "critical",
      resolved: false,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 7200000),
      reason: "Wire Misalignment",
      confidence: 0.87,
      imageUrl: "/failure-wire-misalignment.jpg",
      severity: "major",
      resolved: false,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 10800000),
      reason: "Surface Scratch",
      confidence: 0.76,
      imageUrl: "/failure-surface-scratch.jpg",
      severity: "minor",
      resolved: true,
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 14400000),
      reason: "Incomplete Weld",
      confidence: 0.91,
      imageUrl: "/failure-incomplete-weld.jpg",
      severity: "critical",
      resolved: false,
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 18000000),
      reason: "Tube Deformation",
      confidence: 0.88,
      imageUrl: "/failure-tube-deformation.jpg",
      severity: "major",
      resolved: true,
    },
    {
      id: "6",
      timestamp: new Date(Date.now() - 21600000),
      reason: "Color Variation",
      confidence: 0.72,
      imageUrl: "/failure-color-variation.jpg",
      severity: "minor",
      resolved: false,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-error/20 text-error"
      case "major":
        return "bg-warning/20 text-warning"
      case "minor":
        return "bg-info/20 text-info"
      default:
        return "bg-muted"
    }
  }

  const filteredFailures = failures.filter((failure) => {
    if (filterType !== "all" && failure.reason.toLowerCase() !== filterType) return false
    if (filterSeverity !== "all" && failure.severity !== filterSeverity) return false
    if (searchQuery && !failure.reason.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-6 space-y-4">
      {/* Header with Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Failures</div>
          <div className="text-3xl font-bold">{failures.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Last 24 hours</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Critical</div>
          <div className="text-3xl font-bold text-error">
            {failures.filter((f) => f.severity === "critical").length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Requires attention</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Resolved</div>
          <div className="text-3xl font-bold text-success">{failures.filter((f) => f.resolved).length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {((failures.filter((f) => f.resolved).length / failures.length) * 100).toFixed(0)}% resolution rate
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Confidence</div>
          <div className="text-3xl font-bold">
            {((failures.reduce((acc, f) => acc + f.confidence, 0) / failures.length) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Detection accuracy</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search failures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-background">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="weld defect">Weld Defect</SelectItem>
              <SelectItem value="wire misalignment">Wire Misalignment</SelectItem>
              <SelectItem value="surface scratch">Surface Scratch</SelectItem>
              <SelectItem value="incomplete weld">Incomplete Weld</SelectItem>
              <SelectItem value="tube deformation">Tube Deformation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-48 bg-background">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange as any} />
            </PopoverContent>
          </Popover>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className={viewMode !== "grid" ? "bg-transparent" : ""}
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className={viewMode !== "list" ? "bg-transparent" : ""}
            >
              List
            </Button>
          </div>

          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {(searchQuery || filterType !== "all" || filterSeverity !== "all") && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            {filterType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Type: {filterType}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterType("all")} />
              </Badge>
            )}
            {filterSeverity !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Severity: {filterSeverity}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterSeverity("all")} />
              </Badge>
            )}
          </div>
        )}
      </Card>

      {/* Gallery */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredFailures.map((failure) => (
            <Card
              key={failure.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedFailure(failure)}
            >
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                <img
                  src={failure.imageUrl || "/placeholder.svg"}
                  alt={failure.reason}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getSeverityColor(failure.severity)}>{failure.severity.toUpperCase()}</Badge>
                </div>
                {failure.resolved && (
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-success/90 text-black">RESOLVED</Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{failure.reason}</h3>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{format(failure.timestamp, "MMM d, HH:mm")}</span>
                  <span className="font-mono">{(failure.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {filteredFailures.map((failure) => (
              <div
                key={failure.id}
                className="p-4 hover:bg-accent transition-colors cursor-pointer flex items-center gap-4"
                onClick={() => setSelectedFailure(failure)}
              >
                <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={failure.imageUrl || "/placeholder.svg"}
                    alt={failure.reason}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{failure.reason}</h3>
                    <Badge className={getSeverityColor(failure.severity)}>{failure.severity}</Badge>
                    {failure.resolved && <Badge className="bg-success/20 text-success">RESOLVED</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(failure.timestamp, "MMM d, yyyy HH:mm:ss")}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className="text-xl font-mono font-bold">{(failure.confidence * 100).toFixed(1)}%</div>
                </div>

                <Button size="sm" variant="ghost">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedFailure} onOpenChange={() => setSelectedFailure(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Failure Details</DialogTitle>
          </DialogHeader>

          {selectedFailure && (
            <Tabs defaultValue="image" className="mt-4">
              <TabsList className="grid w-full grid-cols-3 bg-card">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <img
                    src={selectedFailure.imageUrl || "/placeholder.svg"}
                    alt={selectedFailure.reason}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-accent/50">
                    <div className="text-sm text-muted-foreground mb-1">Failure Type</div>
                    <div className="text-lg font-semibold">{selectedFailure.reason}</div>
                  </Card>
                  <Card className="p-4 bg-accent/50">
                    <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                    <div className="text-lg font-semibold font-mono">
                      {(selectedFailure.confidence * 100).toFixed(1)}%
                    </div>
                  </Card>
                  <Card className="p-4 bg-accent/50">
                    <div className="text-sm text-muted-foreground mb-1">Severity</div>
                    <Badge className={getSeverityColor(selectedFailure.severity)}>
                      {selectedFailure.severity.toUpperCase()}
                    </Badge>
                  </Card>
                  <Card className="p-4 bg-accent/50">
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <Badge
                      className={selectedFailure.resolved ? "bg-success/20 text-success" : "bg-error/20 text-error"}
                    >
                      {selectedFailure.resolved ? "RESOLVED" : "OPEN"}
                    </Badge>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Inspection Data</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timestamp</span>
                      <span className="font-mono">{format(selectedFailure.timestamp, "yyyy-MM-dd HH:mm:ss")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inspection ID</span>
                      <span className="font-mono">{selectedFailure.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI</span>
                      <span className="font-mono">Tube Detection</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Time</span>
                      <span className="font-mono">67ms</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Notes</h4>
                  <Input placeholder="Add notes about this failure..." className="bg-background" />
                  <Button size="sm" className="mt-2">
                    Save Note
                  </Button>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Mark as Resolved
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Similar Failures</h4>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-accent rounded-lg">
                        <div className="w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={`/similar-failure-${i}.jpg?height=48&width=64`}
                            alt={`Similar ${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{selectedFailure.reason}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(Date.now() - (i + 1) * 86400000), "MMM d, HH:mm")}
                          </div>
                        </div>
                        <div className="text-sm font-mono">{(Math.random() * 0.2 + 0.8).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Trend Analysis</h4>
                  <div className="h-32 bg-muted rounded flex items-end gap-1 p-2">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-error rounded-t"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {selectedFailure.reason} occurrences over last 20 inspections
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

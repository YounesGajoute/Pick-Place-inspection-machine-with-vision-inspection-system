"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Play, Square, AlertTriangle, Home, SettingsIcon, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardPage() {
  const {
    systemState,
    system1Position,
    system2Position,
    lastInspection,
    metrics,
    logs,
    startCycle,
    stopCycle,
    addInspectionResult,
    addLogEntry,
  } = useAppStore()

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate inspection result every 20 seconds
      if (Math.random() > 0.5) {
        const isPass = Math.random() > 0.15
        const result = {
          id: Date.now().toString(),
          timestamp: new Date(),
          status: isPass ? ("PASS" as const) : ("FAIL" as const),
          reason: isPass ? "Tube detected" : ["No Tube", "Bad Weld", "Wire Missing"][Math.floor(Math.random() * 3)],
          confidence: 0.85 + Math.random() * 0.14,
          processingTime: 50 + Math.floor(Math.random() * 50),
          imageUrl: `/placeholder.svg?height=300&width=400&query=industrial+tube+inspection`,
        }
        addInspectionResult(result)

        addLogEntry({
          timestamp: new Date(),
          level: isPass ? "SUCCESS" : "WARNING",
          category: "VISION",
          message: `Inspection ${result.status}: ${result.reason} (${(result.confidence * 100).toFixed(1)}%)`,
        })
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [addInspectionResult, addLogEntry])

  const getYieldColor = (yield_: number) => {
    if (yield_ >= 95) return "text-success"
    if (yield_ >= 90) return "text-warning"
    return "text-error"
  }

  return (
    <div className="p-6 space-y-6">
      {/* System Status Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">System Status</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                System 1: <span className="text-system1 font-semibold">{system1Position}</span>
              </span>
              <span>|</span>
              <span>
                System 2: <span className="text-system2 font-semibold">{system2Position}</span>
              </span>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-6 py-4",
              systemState === "READY" && "bg-success/20 text-success",
              systemState === "RUNNING" && "bg-info/20 text-info",
              systemState === "ERROR" && "bg-error/20 text-error",
            )}
          >
            <div className="text-5xl">
              {systemState === "READY" && "✓"}
              {systemState === "RUNNING" && "⚡"}
              {systemState === "ERROR" && "✕"}
            </div>
            <div>
              <div className="text-3xl font-bold">{systemState}</div>
              <div className="text-sm opacity-80">Current State</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Production KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-4xl font-bold font-mono mb-2">{metrics.totalInspected.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mb-3">Total Inspected</div>
          <div className="flex gap-2">
            <Badge className="bg-success/20 text-success hover:bg-success/30">PASS: {metrics.totalPass}</Badge>
            <Badge className="bg-error/20 text-error hover:bg-error/30">FAIL: {metrics.totalFail}</Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className={cn("text-4xl font-bold font-mono mb-2", getYieldColor(metrics.yieldPercentage))}>
            {metrics.yieldPercentage.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground mb-3">Yield Rate</div>
          <div className="flex items-center gap-2 text-sm">
            {metrics.yieldPercentage >= 95 ? (
              <>
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success">Above target</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-error" />
                <span className="text-error">Below target (95%)</span>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-4xl font-bold font-mono mb-2">{metrics.partsPerHour}</div>
          <div className="text-sm text-muted-foreground mb-3">Parts/Hour</div>
          <div className="text-sm">
            <span className="text-muted-foreground">Target: </span>
            <span className="font-semibold">180</span>
            <span className={cn("ml-2", metrics.partsPerHour >= 180 ? "text-success" : "text-warning")}>
              ({metrics.partsPerHour >= 180 ? "+" : ""}
              {metrics.partsPerHour - 180})
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Last Inspection Result */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Last Inspection Result</h3>
          {lastInspection ? (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img
                  src={lastInspection.imageUrl || "/placeholder.svg"}
                  alt="Inspection"
                  className="w-full h-full object-cover"
                />
                <div
                  className={cn(
                    "absolute top-4 right-4 px-4 py-2 rounded-lg font-bold text-lg",
                    lastInspection.status === "PASS" ? "bg-success text-black" : "bg-error text-white",
                  )}
                >
                  {lastInspection.status === "PASS" ? "✓ PASS" : "✕ FAIL"}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Timestamp</div>
                  <div className="font-mono">{lastInspection.timestamp.toLocaleTimeString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Confidence</div>
                  <div className="font-mono">{(lastInspection.confidence * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Processing</div>
                  <div className="font-mono">{lastInspection.processingTime}ms</div>
                </div>
              </div>
              {lastInspection.status === "FAIL" && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                  <div className="text-sm font-semibold text-error">Failure Reason:</div>
                  <div className="text-sm">{lastInspection.reason}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">No inspection data yet</div>
          )}
        </Card>

        {/* Control Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Control Panel</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                className="h-16 bg-success hover:bg-success/90 text-black font-semibold"
                onClick={startCycle}
                disabled={systemState === "RUNNING"}
              >
                <Play className="mr-2 h-5 w-5" />
                START CYCLE
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-16 font-semibold"
                onClick={stopCycle}
                disabled={systemState !== "RUNNING"}
              >
                <Square className="mr-2 h-5 w-5" />
                STOP
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 border-emergency text-emergency hover:bg-emergency/10 font-semibold bg-transparent"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                E-STOP RESET
              </Button>
              <Button size="lg" variant="outline" className="h-16 font-semibold bg-transparent">
                <SettingsIcon className="mr-2 h-5 w-5" />
                MANUAL MODE
              </Button>
              <Button size="lg" variant="outline" className="h-16 col-span-2 font-semibold bg-transparent">
                <Home className="mr-2 h-5 w-5" />
                HOME ALL SYSTEMS
              </Button>
            </div>
          </Card>

          {/* Cycle Time Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cycle Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Average Cycle Time</span>
                  <span className="font-mono font-semibold">{metrics.averageCycleTime.toFixed(1)}s</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-info transition-all"
                    style={{ width: `${(metrics.averageCycleTime / 25) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0s</span>
                  <span>Target: 20s</span>
                  <span>25s</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Activity Log */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
        <div className="space-y-2">
          {logs.slice(0, 10).map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors"
            >
              <span className="font-mono text-xs text-muted-foreground w-20">{log.timestamp.toLocaleTimeString()}</span>
              <Badge
                className={cn(
                  "w-20 justify-center",
                  log.level === "SUCCESS" && "bg-success/20 text-success",
                  log.level === "INFO" && "bg-info/20 text-info",
                  log.level === "WARNING" && "bg-warning/20 text-warning",
                  log.level === "ERROR" && "bg-error/20 text-error",
                )}
              >
                {log.category}
              </Badge>
              <span className="text-sm flex-1">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-center text-muted-foreground py-8">No activity logged yet</div>}
        </div>
      </Card>
    </div>
  )
}

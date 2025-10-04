"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"

export function AppHeader() {
  const { systemState, metrics } = useAppStore()

  const getStatusColor = () => {
    switch (systemState) {
      case "READY":
        return "bg-success text-black"
      case "RUNNING":
        return "bg-info text-white animate-pulse-status"
      case "ERROR":
        return "bg-error text-white animate-shake-error"
      case "EMERGENCY_STOP":
        return "bg-emergency text-white animate-pulse-status"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = () => {
    switch (systemState) {
      case "READY":
        return "✓"
      case "RUNNING":
        return "⚡"
      case "ERROR":
        return "✕"
      case "EMERGENCY_STOP":
        return "🚨"
      default:
        return "○"
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Pick & Place Control System</h1>
            <p className="text-xs text-muted-foreground">Dual Axis Vision Inspection</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="font-mono text-2xl font-bold">{metrics.averageCycleTime.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Current Cycle</div>
          </div>

          <div className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold", getStatusColor())}>
            <span className="text-lg">{getStatusIcon()}</span>
            {systemState.replace("_", " ")}
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </header>
  )
}

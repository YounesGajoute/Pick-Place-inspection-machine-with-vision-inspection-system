"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Cpu,
  HardDrive,
  Thermometer,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  icon: any
}

interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error"
  component: string
  message: string
}

export default function DiagnosticsPage() {
  const [cpuUsage, setCpuUsage] = useState(45)
  const [memoryUsage, setMemoryUsage] = useState(62)
  const [diskUsage, setDiskUsage] = useState(38)
  const [temperature, setTemperature] = useState(58)
  const [networkLatency, setNetworkLatency] = useState(12)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setCpuUsage((prev) => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 10)))
      setMemoryUsage((prev) => Math.max(40, Math.min(85, prev + (Math.random() - 0.5) * 5)))
      setTemperature((prev) => Math.max(45, Math.min(75, prev + (Math.random() - 0.5) * 3)))
      setNetworkLatency((prev) => Math.max(5, Math.min(50, prev + (Math.random() - 0.5) * 5)))
    }, 2000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const systemMetrics: SystemMetric[] = [
    {
      name: "CPU Usage",
      value: cpuUsage,
      unit: "%",
      status: cpuUsage > 80 ? "critical" : cpuUsage > 60 ? "warning" : "good",
      icon: Cpu,
    },
    {
      name: "Memory",
      value: memoryUsage,
      unit: "%",
      status: memoryUsage > 80 ? "critical" : memoryUsage > 70 ? "warning" : "good",
      icon: Activity,
    },
    {
      name: "Disk Usage",
      value: diskUsage,
      unit: "%",
      status: diskUsage > 85 ? "critical" : diskUsage > 70 ? "warning" : "good",
      icon: HardDrive,
    },
    {
      name: "Temperature",
      value: temperature,
      unit: "°C",
      status: temperature > 70 ? "critical" : temperature > 60 ? "warning" : "good",
      icon: Thermometer,
    },
    {
      name: "Network",
      value: networkLatency,
      unit: "ms",
      status: networkLatency > 40 ? "critical" : networkLatency > 25 ? "warning" : "good",
      icon: Wifi,
    },
  ]

  const logs: LogEntry[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000),
      level: "info",
      component: "Vision System",
      message: "Inspection completed successfully",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 5000),
      level: "warning",
      component: "Camera",
      message: "Frame rate dropped to 28 FPS",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 12000),
      level: "error",
      component: "Network",
      message: "Connection timeout to PLC",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 18000),
      level: "info",
      component: "Database",
      message: "Backup completed",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 25000),
      level: "warning",
      component: "Vision System",
      message: "High processing time detected: 89ms",
    },
    {
      id: "6",
      timestamp: new Date(Date.now() - 32000),
      level: "info",
      component: "System",
      message: "Configuration updated",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-success"
      case "warning":
        return "text-warning"
      case "critical":
        return "text-error"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return "bg-success/20 text-success"
      case "warning":
        return "bg-warning/20 text-warning"
      case "critical":
        return "bg-error/20 text-error"
      default:
        return "bg-muted"
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "info":
        return <CheckCircle2 className="h-4 w-4 text-info" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "error":
        return <XCircle className="h-4 w-4 text-error" />
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Diagnostics</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={!autoRefresh ? "bg-transparent" : ""}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", autoRefresh && "animate-spin")} />
            {autoRefresh ? "Auto Refresh" : "Paused"}
          </Button>
          <Button size="sm" variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-5 gap-4">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.name} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("h-5 w-5", getStatusColor(metric.status))} />
                <Badge className={getStatusBadge(metric.status)}>{metric.status.toUpperCase()}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-1">{metric.name}</div>
              <div className="text-2xl font-bold font-mono">
                {metric.value.toFixed(0)}
                <span className="text-lg text-muted-foreground ml-1">{metric.unit}</span>
              </div>
              <Progress value={metric.value} className="mt-2 h-1" />
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-card">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* System Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operating System</span>
                  <span className="font-mono">Ubuntu 22.04 LTS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kernel Version</span>
                  <span className="font-mono">5.15.0-91</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System Uptime</span>
                  <span className="font-mono">15d 7h 23m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Reboot</span>
                  <span className="font-mono">2025-01-20 08:15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Software Version</span>
                  <span className="font-mono">v2.4.1</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hardware Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU</span>
                  <span className="font-mono">Intel i7-9700K @ 3.6GHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cores</span>
                  <span className="font-mono">8 cores / 8 threads</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAM</span>
                  <span className="font-mono">32 GB DDR4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-mono">512 GB NVMe SSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPU</span>
                  <span className="font-mono">NVIDIA RTX 3060</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Network Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono">192.168.1.100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gateway</span>
                  <span className="font-mono">192.168.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DNS Server</span>
                  <span className="font-mono">8.8.8.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connection</span>
                  <Badge className="bg-success/20 text-success">CONNECTED</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bandwidth</span>
                  <span className="font-mono">1 Gbps</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Storage Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">System Partition</span>
                    <span className="font-mono">195 GB / 512 GB</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Data Partition</span>
                    <span className="font-mono">1.2 TB / 2 TB</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Backup Drive</span>
                    <span className="font-mono">450 GB / 1 TB</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                name: "Vision System",
                status: "operational",
                uptime: "99.8%",
                lastCheck: "2 min ago",
                details: ["Processing: 67ms avg", "Queue: 0 items", "Errors: 0"],
              },
              {
                name: "Camera Module",
                status: "operational",
                uptime: "99.9%",
                lastCheck: "1 min ago",
                details: ["FPS: 30", "Resolution: 1920x1080", "Exposure: 5000μs"],
              },
              {
                name: "PLC Interface",
                status: "operational",
                uptime: "99.5%",
                lastCheck: "5 min ago",
                details: ["Connection: Active", "Response: 8ms", "Protocol: Modbus TCP"],
              },
              {
                name: "Database",
                status: "operational",
                uptime: "100%",
                lastCheck: "1 min ago",
                details: ["Queries: 1.2k/min", "Size: 2.4 GB", "Last backup: 2h ago"],
              },
              {
                name: "Web Server",
                status: "operational",
                uptime: "99.9%",
                lastCheck: "30 sec ago",
                details: ["Requests: 45/min", "Latency: 12ms", "Active users: 3"],
              },
              {
                name: "Lighting Control",
                status: "warning",
                uptime: "98.2%",
                lastCheck: "10 min ago",
                details: ["Brightness: 85%", "Temperature: 4500K", "Warning: Bulb aging"],
              },
            ].map((component) => (
              <Card key={component.name} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{component.name}</h4>
                  <Badge
                    className={
                      component.status === "operational"
                        ? "bg-success/20 text-success"
                        : component.status === "warning"
                          ? "bg-warning/20 text-warning"
                          : "bg-error/20 text-error"
                    }
                  >
                    {component.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-mono">{component.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Check</span>
                    <span className="font-mono">{component.lastCheck}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t space-y-1">
                  {component.details.map((detail, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      {detail}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Test
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Restart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent System Logs</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent">
                  Filter
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent">
                  Clear
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    log.level === "error" ? "bg-error/10" : log.level === "warning" ? "bg-warning/10" : "bg-accent/50",
                  )}
                >
                  <div className="mt-0.5">{getLogIcon(log.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {log.component}
                      </Badge>
                    </div>
                    <div className="text-sm">{log.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">CPU Usage History</h3>
              <div className="h-48 bg-muted rounded flex items-end gap-1 p-2">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-info rounded-t transition-all"
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Last 50 samples (2s interval)</div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Memory Usage History</h3>
              <div className="h-48 bg-muted rounded flex items-end gap-1 p-2">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-success rounded-t transition-all"
                    style={{ height: `${40 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Last 50 samples (2s interval)</div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Network Latency</h3>
              <div className="h-48 bg-muted rounded flex items-end gap-1 p-2">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-warning rounded-t transition-all"
                    style={{ height: `${10 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Last 50 pings (1s interval)</div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Processing Time</h3>
              <div className="h-48 bg-muted rounded flex items-end gap-1 p-2">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-error rounded-t transition-all"
                    style={{ height: `${30 + Math.random() * 50}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Last 50 inspections</div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

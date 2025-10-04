"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Video, Settings, Maximize, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

export default function CameraPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [fps, setFps] = useState(30)
  const [latency, setLatency] = useState(42)
  const [showOverlay, setShowOverlay] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { lastInspection } = useAppStore()

  // Simulate FPS and latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(28 + Math.floor(Math.random() * 4))
      setLatency(35 + Math.floor(Math.random() * 20))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Draw overlay on canvas
  useEffect(() => {
    if (!canvasRef.current || !showOverlay) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw ROI boundary (yellow dashed)
    ctx.strokeStyle = "#F59E0B"
    ctx.lineWidth = 2
    ctx.setLineDash([10, 5])
    ctx.strokeRect(100, 80, 600, 400)

    // Draw crosshairs at center
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 1
    ctx.setLineDash([])
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    ctx.beginPath()
    ctx.moveTo(centerX - 20, centerY)
    ctx.lineTo(centerX + 20, centerY)
    ctx.moveTo(centerX, centerY - 20)
    ctx.lineTo(centerX, centerY + 20)
    ctx.stroke()

    // Draw detection result if available
    if (lastInspection) {
      if (lastInspection.status === "PASS") {
        // Green bounding box
        ctx.strokeStyle = "#10B981"
        ctx.lineWidth = 3
        ctx.strokeRect(250, 180, 300, 200)

        // PASS label
        ctx.fillStyle = "#10B981"
        ctx.fillRect(250, 160, 120, 30)
        ctx.fillStyle = "#000000"
        ctx.font = "bold 16px sans-serif"
        ctx.fillText("✓ PASS", 260, 180)

        // Confidence
        ctx.fillStyle = "#10B981"
        ctx.font = "14px monospace"
        ctx.fillText(`${(lastInspection.confidence * 100).toFixed(1)}%`, 260, 200)
      } else {
        // Red circle for defect
        ctx.strokeStyle = "#EF4444"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(400, 280, 80, 0, Math.PI * 2)
        ctx.stroke()

        // FAIL label
        ctx.fillStyle = "#EF4444"
        ctx.fillRect(250, 160, 200, 30)
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 16px sans-serif"
        ctx.fillText(`✗ FAIL: ${lastInspection.reason}`, 260, 180)
      }
    }
  }, [showOverlay, lastInspection])

  const getLatencyColor = () => {
    if (latency < 50) return "text-success"
    if (latency < 100) return "text-warning"
    return "text-error"
  }

  return (
    <div className="p-6 space-y-4">
      {/* Controls Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="bg-transparent">
              <Camera className="mr-2 h-4 w-4" />
              Snapshot
            </Button>
            <Button
              size="sm"
              variant={isRecording ? "destructive" : "outline"}
              className={!isRecording ? "bg-transparent" : ""}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Video className="mr-2 h-4 w-4" />
              {isRecording ? "Stop Recording" : "Record"}
            </Button>
            <Button size="sm" variant="outline" className="bg-transparent">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button size="sm" variant="outline" className="bg-transparent">
              <Maximize className="mr-2 h-4 w-4" />
              Fullscreen
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">FPS:</span>
              <span className="font-mono font-semibold">{fps}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Latency:</span>
              <span className={cn("font-mono font-semibold", getLatencyColor())}>{latency}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Overlay:</span>
              <Button
                size="sm"
                variant={showOverlay ? "default" : "outline"}
                onClick={() => setShowOverlay(!showOverlay)}
                className={!showOverlay ? "bg-transparent" : ""}
              >
                {showOverlay ? "ON" : "OFF"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-[1fr_300px] gap-4">
        {/* Video Stream Area */}
        <Card className="p-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {/* Simulated video feed */}
            <img src="/industrial-manufacturing-tube-inspection-camera-vi.jpg" alt="Camera Feed" className="w-full h-full object-cover" />

            {/* Canvas overlay for annotations */}
            {showOverlay && (
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            )}

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-error px-3 py-1.5 rounded-full animate-pulse-status">
                <div className="h-2 w-2 rounded-full bg-white" />
                <span className="text-white text-sm font-semibold">REC</span>
              </div>
            )}

            {/* Camera info overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg text-xs font-mono text-white">
              <div>Resolution: 1920x1080</div>
              <div>Codec: H.264</div>
              <div>Bitrate: 8 Mbps</div>
            </div>
          </div>

          {/* Camera controls */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              Zoom In
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              Zoom Out
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              Reset View
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </Card>

        {/* Live Stats Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Current Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Inspection</span>
                <Badge
                  className={
                    lastInspection?.status === "PASS" ? "bg-success/20 text-success" : "bg-error/20 text-error"
                  }
                >
                  {lastInspection?.status || "IDLE"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Camera</span>
                <Badge className="bg-success/20 text-success">STREAMING</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Focus</span>
                <Badge className="bg-info/20 text-info">AUTO</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Last 5 Results</h3>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => {
                const isPass = Math.random() > 0.2
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="relative w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={`/inspection-result-.jpg?height=48&width=64&query=inspection+result+${i}`}
                        alt={`Result ${i}`}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center text-xs font-bold",
                          isPass ? "bg-success/80 text-black" : "bg-error/80 text-white",
                        )}
                      >
                        {isPass ? "✓" : "✕"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono truncate">
                        {new Date(Date.now() - i * 20000).toLocaleTimeString()}
                      </div>
                      <div className={cn("text-xs font-semibold", isPass ? "text-success" : "text-error")}>
                        {isPass ? "PASS" : "FAIL"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Camera Info</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model</span>
                <span className="font-mono">Basler acA1920-40gm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sensor</span>
                <span className="font-mono">Sony IMX249</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exposure</span>
                <span className="font-mono">5000 μs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gain</span>
                <span className="font-mono">12 dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">White Balance</span>
                <span className="font-mono">Auto</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Upload, Download, Save, RotateCcw, Camera } from "lucide-react"

interface ROI {
  id: string
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  active: boolean
  color: string
}

export default function ConfigPage() {
  const [rois, setRois] = useState<ROI[]>([
    {
      id: "1",
      name: "Tube Detection",
      type: "Tube Detection",
      x: 100,
      y: 80,
      width: 600,
      height: 400,
      active: true,
      color: "#10B981",
    },
    {
      id: "2",
      name: "Weld Quality",
      type: "Weld Quality",
      x: 300,
      y: 200,
      width: 200,
      height: 150,
      active: true,
      color: "#3B82F6",
    },
  ])

  const [hueRange, setHueRange] = useState([20, 40])
  const [satRange, setSatRange] = useState([100, 255])
  const [valRange, setValRange] = useState([100, 255])
  const [exposure, setExposure] = useState([5000])
  const [gain, setGain] = useState([12])
  const [brightness, setBrightness] = useState([0])
  const [contrast, setContrast] = useState([50])

  const addROI = () => {
    const newROI: ROI = {
      id: Date.now().toString(),
      name: `ROI ${rois.length + 1}`,
      type: "Custom",
      x: 150,
      y: 150,
      width: 300,
      height: 200,
      active: true,
      color: "#F59E0B",
    }
    setRois([...rois, newROI])
  }

  const deleteROI = (id: string) => {
    setRois(rois.filter((roi) => roi.id !== id))
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="roi" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-card">
          <TabsTrigger value="roi">ROI Editor</TabsTrigger>
          <TabsTrigger value="vision">Vision Parameters</TabsTrigger>
          <TabsTrigger value="camera">Camera Settings</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
        </TabsList>

        {/* ROI Editor Tab */}
        <TabsContent value="roi" className="space-y-4">
          <div className="grid grid-cols-[1fr_400px] gap-4">
            {/* Interactive Canvas */}
            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">ROI Canvas</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Zoom +
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Zoom -
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Grid
                  </Button>
                </div>
              </div>

              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src="/industrial-reference-image-for-roi-editing.jpg"
                  alt="Reference"
                  className="w-full h-full object-cover opacity-70"
                />

                {/* Draw ROIs */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {rois.map((roi) => (
                    <g key={roi.id}>
                      <rect
                        x={`${(roi.x / 800) * 100}%`}
                        y={`${(roi.y / 450) * 100}%`}
                        width={`${(roi.width / 800) * 100}%`}
                        height={`${(roi.height / 450) * 100}%`}
                        fill="none"
                        stroke={roi.color}
                        strokeWidth="2"
                        strokeDasharray={roi.active ? "0" : "5,5"}
                        opacity={roi.active ? "1" : "0.5"}
                      />
                      <text
                        x={`${(roi.x / 800) * 100}%`}
                        y={`${((roi.y - 10) / 450) * 100}%`}
                        fill={roi.color}
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {roi.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  Capture Reference
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export ROI Data
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  Import ROI Data
                </Button>
              </div>
            </Card>

            {/* ROI List */}
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">ROI List</h3>
                  <Button size="sm" onClick={addROI}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add ROI
                  </Button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {rois.map((roi) => (
                    <Card key={roi.id} className="p-3 bg-accent/50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded" style={{ backgroundColor: roi.color }} />
                            <Input
                              value={roi.name}
                              onChange={(e) => {
                                const updated = rois.map((r) => (r.id === roi.id ? { ...r, name: e.target.value } : r))
                                setRois(updated)
                              }}
                              className="h-8 w-32 bg-background"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={roi.active}
                              onCheckedChange={(checked) => {
                                const updated = rois.map((r) => (r.id === roi.id ? { ...r, active: checked } : r))
                                setRois(updated)
                              }}
                            />
                            <Button size="sm" variant="ghost" onClick={() => deleteROI(roi.id)}>
                              <Trash2 className="h-4 w-4 text-error" />
                            </Button>
                          </div>
                        </div>

                        <Select
                          value={roi.type}
                          onValueChange={(value) => {
                            const updated = rois.map((r) => (r.id === roi.id ? { ...r, type: value } : r))
                            setRois(updated)
                          }}
                        >
                          <SelectTrigger className="h-8 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tube Detection">Tube Detection</SelectItem>
                            <SelectItem value="Weld Quality">Weld Quality</SelectItem>
                            <SelectItem value="Wire Position">Wire Position</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div>
                            <span className="text-muted-foreground">X:</span> {roi.x}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Y:</span> {roi.y}
                          </div>
                          <div>
                            <span className="text-muted-foreground">W:</span> {roi.width}
                          </div>
                          <div>
                            <span className="text-muted-foreground">H:</span> {roi.height}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save All
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Vision Parameters Tab */}
        <TabsContent value="vision" className="space-y-4">
          <div className="grid grid-cols-[1fr_400px] gap-4">
            <div className="space-y-4">
              {/* HSV Color Detection */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">HSV Color Detection</h3>
                <div className="space-y-6">
                  <div>
                    <Label>Hue Range (0-180)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={hueRange}
                        onValueChange={setHueRange}
                        min={0}
                        max={180}
                        step={1}
                        className="flex-1"
                      />
                      <div className="flex gap-2 font-mono text-sm">
                        <Input value={hueRange[0]} className="w-16 h-8 bg-background" readOnly />
                        <Input value={hueRange[1]} className="w-16 h-8 bg-background" readOnly />
                      </div>
                    </div>
                    <div
                      className="mt-2 h-4 rounded"
                      style={{
                        background:
                          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                      }}
                    />
                  </div>

                  <div>
                    <Label>Saturation Range (0-255)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={satRange}
                        onValueChange={setSatRange}
                        min={0}
                        max={255}
                        step={1}
                        className="flex-1"
                      />
                      <div className="flex gap-2 font-mono text-sm">
                        <Input value={satRange[0]} className="w-16 h-8 bg-background" readOnly />
                        <Input value={satRange[1]} className="w-16 h-8 bg-background" readOnly />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Value/Brightness Range (0-255)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={valRange}
                        onValueChange={setValRange}
                        min={0}
                        max={255}
                        step={1}
                        className="flex-1"
                      />
                      <div className="flex gap-2 font-mono text-sm">
                        <Input value={valRange[0]} className="w-16 h-8 bg-background" readOnly />
                        <Input value={valRange[1]} className="w-16 h-8 bg-background" readOnly />
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="bg-transparent">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Auto
                  </Button>
                </div>
              </Card>

              {/* Contour Detection */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contour Detection</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Min Contour Area (pixels)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider defaultValue={[5000]} min={1000} max={100000} step={100} className="flex-1" />
                      <Input value="5000" className="w-24 h-8 bg-background font-mono" />
                    </div>
                  </div>

                  <div>
                    <Label>Max Contour Area (pixels)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider defaultValue={[50000]} min={1000} max={100000} step={100} className="flex-1" />
                      <Input value="50000" className="w-24 h-8 bg-background font-mono" />
                    </div>
                  </div>

                  <div>
                    <Label>Approximation Epsilon</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider defaultValue={[0.01]} min={0.001} max={0.1} step={0.001} className="flex-1" />
                      <Input value="0.010" className="w-24 h-8 bg-background font-mono" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Live Preview */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div className="space-y-3">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <img src="/processed-vision-image-with-hsv-filtering.jpg" alt="Preview" className="w-full h-full object-cover" />
                </div>

                <Select defaultValue="final">
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="hsv">HSV Filtered</SelectItem>
                    <SelectItem value="edges">Edge Detected</SelectItem>
                    <SelectItem value="contours">Contours</SelectItem>
                    <SelectItem value="final">Final Result</SelectItem>
                  </SelectContent>
                </Select>

                <div className="p-3 bg-accent rounded-lg">
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                  <div className="text-2xl font-mono font-bold">67ms</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button className="w-full">Apply Changes</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Save as Preset
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Load Preset
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Camera Settings Tab */}
        <TabsContent value="camera" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Exposure Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Mode</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Auto
                    </Button>
                    <Button size="sm" variant="default">
                      Manual
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Exposure Time (μs)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={exposure}
                      onValueChange={setExposure}
                      min={1}
                      max={10000}
                      step={1}
                      className="flex-1"
                    />
                    <Input value={exposure[0]} className="w-24 h-8 bg-background font-mono" readOnly />
                  </div>
                </div>

                <div className="p-3 bg-accent rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Lighting Level</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: "65%" }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Gain Control</h3>
              <div className="space-y-4">
                <div>
                  <Label>Gain (dB)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider value={gain} onValueChange={setGain} min={0} max={100} step={1} className="flex-1" />
                    <Input value={gain[0]} className="w-24 h-8 bg-background font-mono" readOnly />
                  </div>
                </div>

                <div className="p-3 bg-accent rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Histogram</div>
                  <div className="h-24 bg-muted rounded flex items-end gap-0.5 p-2">
                    {[...Array(50)].map((_, i) => (
                      <div key={i} className="flex-1 bg-info rounded-t" style={{ height: `${Math.random() * 100}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">White Balance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Mode</Label>
                  <Switch defaultChecked />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Daylight
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Tungsten
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Fluorescent
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Image Adjustments</h3>
              <div className="space-y-4">
                <div>
                  <Label>Brightness</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      min={-64}
                      max={64}
                      step={1}
                      className="flex-1"
                    />
                    <Input value={brightness[0]} className="w-20 h-8 bg-background font-mono" readOnly />
                  </div>
                </div>

                <div>
                  <Label>Contrast</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <Input value={contrast[0]} className="w-20 h-8 bg-background font-mono" readOnly />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-2">
            <Button>Apply Settings</Button>
            <Button variant="outline" className="bg-transparent">
              Save as Default
            </Button>
            <Button variant="outline" className="bg-transparent">
              Restart Camera
            </Button>
          </div>
        </TabsContent>

        {/* Calibration Tab */}
        <TabsContent value="calibration" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Calibration Wizard</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-[1fr_300px] gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <h4 className="font-semibold mb-2">Step 1: Capture Calibration Pattern</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Place calibration target (checkerboard) in view
                    </p>

                    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      <img src="/checkerboard-calibration-pattern.jpg" alt="Calibration" className="w-full h-full object-cover" />
                    </div>

                    <Button className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Calibration Image
                    </Button>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <h4 className="font-semibold mb-2">Step 2: Pattern Detection</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-success" />
                        <span>Pattern fully visible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-success" />
                        <span>Good lighting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-success" />
                        <span>In focus</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="p-4 bg-accent/50">
                    <h4 className="font-semibold mb-3">Calibration Results</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pixel/mm ratio</span>
                        <span className="font-mono">0.0527</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reprojection error</span>
                        <span className="font-mono text-success">0.23 px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="bg-success/20 text-success p-1 rounded">Good</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-accent/50">
                    <h4 className="font-semibold mb-3">Calibration History</h4>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-background rounded text-xs">
                          <div>
                            <div className="font-mono">{new Date(Date.now() - i * 86400000).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">0.0527 mm/px</div>
                          </div>
                          <Button size="sm" variant="ghost">
                            Load
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

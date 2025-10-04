"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Monitor,
  Network,
  Bell,
  Users,
  Database,
  Info,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("system")

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
      duration: 3000,
    })
  }

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to defaults.",
      duration: 3000,
    })
  }

  const handleExport = () => {
    toast({
      title: "Configuration Exported",
      description: "Configuration file downloaded successfully.",
      duration: 3000,
    })
  }

  const handleImport = () => {
    toast({
      title: "Configuration Imported",
      description: "Configuration has been imported successfully.",
      duration: 3000,
    })
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and parameters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto">
          <TabsTrigger value="system" className="gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <Monitor className="h-4 w-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Regional Settings</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dateformat">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="dateformat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="units">Measurement Units</Label>
                <Select defaultValue="metric">
                  <SelectTrigger id="units">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (mm, kg, °C)</SelectItem>
                    <SelectItem value="imperial">Imperial (in, lb, °F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Production Settings</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="target-rate">Target Production Rate (parts/hour)</Label>
                <Input id="target-rate" type="number" defaultValue="180" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shift-duration">Shift Duration (hours)</Label>
                <Input id="shift-duration" type="number" defaultValue="8" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="min-yield">Minimum Yield Threshold (%)</Label>
                <Input id="min-yield" type="number" defaultValue="95" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-restart on Error</Label>
                  <p className="text-sm text-muted-foreground">Automatically restart system after recoverable errors</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Interface Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme for reduced eye strain</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="refresh-rate">Dashboard Refresh Rate</Label>
                <Select defaultValue="1000">
                  <SelectTrigger id="refresh-rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">500ms (Fast)</SelectItem>
                    <SelectItem value="1000">1 second (Normal)</SelectItem>
                    <SelectItem value="2000">2 seconds (Slow)</SelectItem>
                    <SelectItem value="5000">5 seconds (Very Slow)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="chart-points">Chart Data Points</Label>
                <Select defaultValue="50">
                  <SelectTrigger id="chart-points">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 points</SelectItem>
                    <SelectItem value="50">50 points</SelectItem>
                    <SelectItem value="100">100 points</SelectItem>
                    <SelectItem value="200">200 points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Camera Display</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show ROI Overlay</Label>
                  <p className="text-sm text-muted-foreground">Display region of interest boxes on camera feed</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Measurement Annotations</Label>
                  <p className="text-sm text-muted-foreground">Display measurement values on inspection results</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="camera-fps">Camera Frame Rate</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="camera-fps">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 FPS</SelectItem>
                    <SelectItem value="30">30 FPS</SelectItem>
                    <SelectItem value="60">60 FPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Network Settings */}
        <TabsContent value="network" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Network Configuration</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="ip-address">IP Address</Label>
                <Input id="ip-address" defaultValue="192.168.1.100" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subnet">Subnet Mask</Label>
                <Input id="subnet" defaultValue="255.255.255.0" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gateway">Gateway</Label>
                <Input id="gateway" defaultValue="192.168.1.1" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dns">DNS Server</Label>
                <Input id="dns" defaultValue="8.8.8.8" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>DHCP Enabled</Label>
                  <p className="text-sm text-muted-foreground">Automatically obtain IP address</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Modbus TCP Settings</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="modbus-ip">PLC IP Address</Label>
                <Input id="modbus-ip" defaultValue="192.168.1.10" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="modbus-port">Modbus Port</Label>
                <Input id="modbus-port" type="number" defaultValue="502" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="unit-id">Unit ID</Label>
                <Input id="unit-id" type="number" defaultValue="1" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="poll-rate">Poll Rate (ms)</Label>
                <Input id="poll-rate" type="number" defaultValue="100" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-reconnect</Label>
                  <p className="text-sm text-muted-foreground">Automatically reconnect on connection loss</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Camera Network</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="camera1-ip">Camera 1 IP Address</Label>
                <Input id="camera1-ip" defaultValue="192.168.1.20" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="camera2-ip">Camera 2 IP Address</Label>
                <Input id="camera2-ip" defaultValue="192.168.1.21" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="camera-port">Camera Port</Label>
                <Input id="camera-port" type="number" defaultValue="8080" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Alert Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">Play sound for critical alerts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email alerts to configured addresses</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email-list">Email Recipients</Label>
                <Input id="email-list" placeholder="operator@company.com, supervisor@company.com" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Error Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify on system errors and failures</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Quality Threshold Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when yield drops below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Production Rate Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when production rate is below target</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send scheduled maintenance reminders</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Alert Thresholds</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="yield-threshold">Minimum Yield Alert (%)</Label>
                <Input id="yield-threshold" type="number" defaultValue="90" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rate-threshold">Minimum Rate Alert (parts/hour)</Label>
                <Input id="rate-threshold" type="number" defaultValue="150" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="temp-threshold">Maximum Temperature Alert (°C)</Label>
                <Input id="temp-threshold" type="number" defaultValue="75" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="consecutive-fails">Consecutive Failures Alert</Label>
                <Input id="consecutive-fails" type="number" defaultValue="5" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: "Admin User", role: "Administrator", email: "admin@company.com", status: "Active" },
                { name: "Operator 1", role: "Operator", email: "operator1@company.com", status: "Active" },
                { name: "Operator 2", role: "Operator", email: "operator2@company.com", status: "Active" },
                { name: "Supervisor", role: "Supervisor", email: "supervisor@company.com", status: "Active" },
                { name: "Maintenance", role: "Technician", email: "tech@company.com", status: "Inactive" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{user.role}</p>
                      <p className="text-xs text-muted-foreground">{user.status}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Role Permissions</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium">Administrator</h4>
                <p className="text-sm text-muted-foreground">
                  Full system access including configuration, user management, and all operations
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium">Supervisor</h4>
                <p className="text-sm text-muted-foreground">
                  View all data, modify production settings, manage operators
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium">Operator</h4>
                <p className="text-sm text-muted-foreground">
                  View dashboard, control production, view failures (no configuration access)
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium">Technician</h4>
                <p className="text-sm text-muted-foreground">
                  Access diagnostics, calibration, and maintenance functions
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Configuration Backup</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <p className="font-medium">Export Configuration</p>
                  <p className="text-sm text-muted-foreground">Download all system settings and parameters</p>
                </div>
                <Button onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <p className="font-medium">Import Configuration</p>
                  <p className="text-sm text-muted-foreground">Restore settings from a backup file</p>
                </div>
                <Button variant="outline" onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Database Backup</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup database daily</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="backup-time">Backup Time</Label>
                <Input id="backup-time" type="time" defaultValue="02:00" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="retention">Backup Retention (days)</Label>
                <Input id="retention" type="number" defaultValue="30" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="backup-path">Backup Location</Label>
                <Input id="backup-path" defaultValue="/var/backups/vision-system" />
              </div>

              <Button className="w-full">
                <Database className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Recent Backups</h3>
            <div className="space-y-2">
              {[
                { date: "2025-04-10 02:00", size: "245 MB", status: "Success" },
                { date: "2025-04-09 02:00", size: "243 MB", status: "Success" },
                { date: "2025-04-08 02:00", size: "241 MB", status: "Success" },
                { date: "2025-04-07 02:00", size: "239 MB", status: "Success" },
              ].map((backup, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{backup.date}</p>
                      <p className="text-xs text-muted-foreground">{backup.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Restore
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* About Settings */}
        <TabsContent value="about" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">System Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Software Version</span>
                <span className="font-mono font-medium">v2.5.1</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build Date</span>
                <span className="font-medium">2025-04-01</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">License Type</span>
                <span className="font-medium">Enterprise</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">License Expiry</span>
                <span className="font-medium">2026-12-31</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">System ID</span>
                <span className="font-mono text-sm">VS-2024-A7B3-C9D1</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Hardware Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPU</span>
                <span className="font-medium">Intel Core i7-12700K</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">RAM</span>
                <span className="font-medium">32 GB DDR4</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">1 TB NVMe SSD</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Camera 1</span>
                <span className="font-medium">Basler acA2440-75um</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Camera 2</span>
                <span className="font-medium">Basler acA2440-75um</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Technical Support</p>
                <p className="font-medium">support@visionsystem.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documentation</p>
                <a href="#" className="font-medium text-primary hover:underline">
                  View Online Manual
                </a>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                Check for Updates
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>© 2025 Vision Systems Inc. All rights reserved.</p>
              <p>This software is licensed under the terms of the Enterprise License Agreement.</p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="text-primary hover:underline">
                  Open Source Licenses
                </a>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

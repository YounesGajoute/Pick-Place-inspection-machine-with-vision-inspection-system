import { create } from "zustand"

export type SystemState = "INITIALIZING" | "READY" | "RUNNING" | "ERROR" | "EMERGENCY_STOP"
export type InspectionStatus = "PASS" | "FAIL"
export type FailureReason = "No Tube" | "Bad Weld" | "Wire Missing" | "Unknown"

export interface InspectionResult {
  id: string
  timestamp: Date
  status: InspectionStatus
  reason: string
  confidence: number
  processingTime: number
  imageUrl: string
}

export interface ProductionMetrics {
  totalInspected: number
  totalPass: number
  totalFail: number
  yieldPercentage: number
  averageCycleTime: number
  partsPerHour: number
}

export interface IOState {
  DI0_HOME: boolean
  DI1_TOP_POSITION: boolean
  DI2_PICKUP_POS: boolean
  DI3_TRANSFER_POS: boolean
  DI4_GRIPPER_OPEN: boolean
  DI5_SENSOR_1: boolean
  DI6_SENSOR_2: boolean
  DI8_E_STOP_OK: boolean
  DO0_MOTOR_ENABLE: boolean
  DO1_DIRECTION: boolean
  DO3_CYLINDER: boolean
  DO4_GRIPPER: boolean
  DO7_READY_LIGHT: boolean
  HR0_SPEED: number
  HR1_SYNC_SPEED: number
  HR2_POSITION: number
  HR3_TARGET_POS: number
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: "ERROR" | "WARNING" | "INFO" | "SUCCESS"
  category: "VISION" | "SYSTEM1" | "SYSTEM2" | "RS232" | "MODBUS"
  message: string
}

export interface AnalyticsData {
  totalInspections: number
  passRate: number
  avgProcessingTime: number
  systemUptime: number
  failureBreakdown: {
    type: string
    count: number
    percentage: number
  }[]
}

interface AppState {
  systemState: SystemState
  system1Position: string
  system2Position: string
  lastInspection: InspectionResult | null
  metrics: ProductionMetrics
  failureGallery: InspectionResult[]
  system1IO: IOState
  system2IO: IOState
  logs: LogEntry[]
  analytics: AnalyticsData

  // Actions
  setSystemState: (state: SystemState) => void
  addInspectionResult: (result: InspectionResult) => void
  addLogEntry: (entry: Omit<LogEntry, "id">) => void
  updateMetrics: (metrics: Partial<ProductionMetrics>) => void
  startCycle: () => void
  stopCycle: () => void
  resetEmergencyStop: () => void
  updateAnalytics: (data: Partial<AnalyticsData>) => void
}

export const useAppStore = create<AppState>((set) => ({
  systemState: "READY",
  system1Position: "HOME",
  system2Position: "HOME",
  lastInspection: null,
  metrics: {
    totalInspected: 1247,
    totalPass: 1189,
    totalFail: 58,
    yieldPercentage: 95.3,
    averageCycleTime: 18.3,
    partsPerHour: 196,
  },
  failureGallery: [],
  system1IO: {
    DI0_HOME: true,
    DI1_TOP_POSITION: true,
    DI2_PICKUP_POS: false,
    DI3_TRANSFER_POS: false,
    DI4_GRIPPER_OPEN: true,
    DI5_SENSOR_1: false,
    DI6_SENSOR_2: false,
    DI8_E_STOP_OK: true,
    DO0_MOTOR_ENABLE: true,
    DO1_DIRECTION: false,
    DO3_CYLINDER: false,
    DO4_GRIPPER: true,
    DO7_READY_LIGHT: true,
    HR0_SPEED: 500,
    HR1_SYNC_SPEED: 150,
    HR2_POSITION: 12500,
    HR3_TARGET_POS: 15000,
  },
  system2IO: {
    DI0_HOME: true,
    DI1_TOP_POSITION: false,
    DI2_PICKUP_POS: false,
    DI3_TRANSFER_POS: true,
    DI4_GRIPPER_OPEN: false,
    DI5_SENSOR_1: true,
    DI6_SENSOR_2: false,
    DI8_E_STOP_OK: true,
    DO0_MOTOR_ENABLE: true,
    DO1_DIRECTION: true,
    DO3_CYLINDER: true,
    DO4_GRIPPER: false,
    DO7_READY_LIGHT: true,
    HR0_SPEED: 450,
    HR1_SYNC_SPEED: 140,
    HR2_POSITION: 8300,
    HR3_TARGET_POS: 10000,
  },
  logs: [],
  analytics: {
    totalInspections: 12847,
    passRate: 94.3,
    avgProcessingTime: 67,
    systemUptime: 99.8,
    failureBreakdown: [
      { type: "Weld Defect", count: 234, percentage: 38 },
      { type: "Wire Misalignment", count: 156, percentage: 25 },
      { type: "Surface Scratch", count: 98, percentage: 16 },
      { type: "Incomplete Weld", count: 87, percentage: 14 },
      { type: "Other", count: 42, percentage: 7 },
    ],
  },

  setSystemState: (state) => set({ systemState: state }),

  addInspectionResult: (result) =>
    set((state) => {
      const newMetrics = {
        ...state.metrics,
        totalInspected: state.metrics.totalInspected + 1,
        totalPass: result.status === "PASS" ? state.metrics.totalPass + 1 : state.metrics.totalPass,
        totalFail: result.status === "FAIL" ? state.metrics.totalFail + 1 : state.metrics.totalFail,
      }
      newMetrics.yieldPercentage = (newMetrics.totalPass / newMetrics.totalInspected) * 100

      return {
        lastInspection: result,
        metrics: newMetrics,
        failureGallery: result.status === "FAIL" ? [result, ...state.failureGallery] : state.failureGallery,
      }
    }),

  addLogEntry: (entry) =>
    set((state) => ({
      logs: [{ ...entry, id: Date.now().toString() }, ...state.logs].slice(0, 100),
    })),

  updateMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),

  startCycle: () => set({ systemState: "RUNNING" }),
  stopCycle: () => set({ systemState: "READY" }),
  resetEmergencyStop: () => set({ systemState: "READY" }),
  updateAnalytics: (data) =>
    set((state) => ({
      analytics: { ...state.analytics, ...data },
    })),
}))

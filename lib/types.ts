// Configuration Types
export interface GlobalConfig {
  trigger_source: 'modbus' | 'rs232';
  trigger_modbus_address: number;
  trigger_modbus_register: number;
  trigger_rs232_port: string;
  trigger_rs232_baudrate: number;
  trigger_rs232_timeout: number;
}

export interface System1Config {
  motor: string;
  steps_per_mm: number;
  homing_speed: number;         // 50-500 rpm
  homing_accel: number;         // 100-1000 rpm/s
  cylinder_down_time: number;   // 0.3-2.0 s
  cylinder_up_time: number;     // 0.3-2.0 s
  gripper_close_time: number;   // 0.2-1.0 s
  gripper_open_time: number;    // 0.1-0.8 s
  transfer_distance: number;    // 50-500 mm
  transfer_speed: number;       // 100-1200 rpm
  transfer_accel: number;       // 200-2000 rpm/s
  return_speed: number;         // 100-1200 rpm
  return_accel: number;         // 200-2000 rpm/s
}

export interface System2Config {
  motor: string;
  steps_per_mm: number;
  homing_speed: number;           // 50-500 rpm
  homing_accel: number;           // 100-1000 rpm/s
  pickup_distance: number;        // 20-200 mm
  pickup_speed: number;           // 100-600 rpm
  pickup_accel: number;           // 200-1000 rpm/s
  gripper_close_time: number;     // 0.2-1.0 s
  gripper_open_time: number;      // 0.1-0.8 s
  slow_start_position: number;    // 50-150 mm
  slow_end_position: number;      // 100-180 mm
  release_position: number;       // 150-300 mm
  speed_slow: number;             // 50-300 rpm
  speed_fast: number;             // 300-800 rpm
  speed_feeding: number | null;   // Calculated from DB
  accel_slow_to_fast: number;     // 200-1500 rpm/s
  accel_fast_to_slow: number;     // 200-1500 rpm/s
  return_speed: number;           // 100-1200 rpm
  return_accel: number;           // 200-2000 rpm/s
  release_delay: number;          // 0.1-1.0 s
  post_release_delay: number;     // 0.1-1.0 s
}

export interface HandoverConfig {
  delay_before_s2_close: number;      // 0.0-2.0 s
  delay_s2_close_to_s1_open: number;  // 0.0-2.0 s
  timeout_s2_ready: number;           // 1.0-10.0 s
}

export interface EmergencyConfig {
  button_global: string[];        // ['DI8-S1', 'DI8-S2']
  rear_limit_s1: string;          // 'DI2-S1'
  rear_limit_s2: string;          // 'DI2-S2'
  polling_rate: number;           // 10-50 Hz
  homing_timeout: number;         // 5-20 s
  movement_timeout: number;       // 2-10 s
}

// Production Reference Types
export interface ProductionReference {
  id: number;
  ref_code: string;
  description: string;
  conveyor_speed_cs19: number;  // mm/s
  feeding_duration: number;     // Fixed at 1.0s
  welding_time: number | null;  // Info only
  tube_diameter: number | null;
  tube_length: number | null;
  wire_gauge: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductionReferenceRequest {
  ref_code: string;
  description: string;
  conveyor_speed_cs19: number;
  feeding_duration?: number;     // Default 1.0
  welding_time?: number | null;
  tube_diameter?: number | null;
  tube_length?: number | null;
  wire_gauge?: string | null;
}

export interface UpdateProductionReferenceRequest extends Partial<CreateProductionReferenceRequest> {}

// I/O Types
export interface IOPin {
  pin: string;  // e.g., 'DI0-S1', 'DO0-S1'
  name: string;
  type: 'input' | 'output';
  state: boolean;
  description: string;
  lastUpdated: string;
}

export interface WritePinRequest {
  value: boolean;
  timestamp?: string;
}

// Modbus Types
export interface ModbusRegister {
  register: number;  // HR0, HR1, etc.
  value: number;
  description: string;
}

export interface WriteRegisterRequest {
  value: number | boolean;
  timestamp?: string;
}

// System Control Types
export interface SystemStatus {
  systemStatus: 'INITIALIZING' | 'HOMING' | 'READY' | 'RUNNING' | 'ERROR' | 'EMERGENCY_STOP';
  system1State: string;
  system2State: string;
  homingDone: boolean;
  system1Initialized: boolean;
  system2Initialized: boolean;
  cycleRunning: boolean;
  emergencyStop: boolean;
  emergencySource: string[];
  alarmActive: boolean;
  weldingMachineEnabled: boolean;
  visionSystemReady: boolean;
  databaseConnected: boolean;
  activeProductionRef: string | null;
  currentCycleNumber: number;
}

export interface WeldingMachineStatus {
  enabled: boolean;
  conditions: {
    homingDone: boolean;
    noEmergency: boolean;
    notRunning: boolean;
    noAlarm: boolean;
    systemsReady: boolean;
  };
  blockingConditions: string[];
}

export interface HomingRequest {
  // Empty body - no parameters needed
}

export interface EmergencyResetRequest {
  // Empty body - no parameters needed
}

// Cycle Log Types
export interface CycleLog {
  id: number;
  cycle_number: number;
  production_ref: string;
  start_time: string;  // ISO8601
  end_time: string;    // ISO8601
  duration_total: number;
  vision_duration: number;
  system1_duration: number;
  system2_duration: number;
  vision_result: boolean;
  vision_confidence: number;
  vision_image_path: string;
  system1_final_position: number;
  system2_final_position: number;
  status: string;
  error_message: string | null;
  created_at: string;
}

export interface ErrorLog {
  id: number;
  cycle_id: number | null;
  error_type: string;
  error_code: string;
  error_message: string;
  system: string;
  phase: string;
  timestamp: string;
  context: object;
  resolution: string | null;
  resolved_at: string | null;
}

export interface ExportLogsRequest {
  format: 'csv' | 'json' | 'excel';
  type: 'cycles' | 'errors';
  filters: object;
}

// Analytics Types
export interface CycleBreakdown {
  phases: Array<{
    name: string;
    system: 'system1' | 'system2' | 'vision' | 'parallel';
    start: number;      // seconds from cycle start
    duration: number;   // seconds
    color: string;      // for visualization
  }>;
  total_duration: number;
  parallel_time: number;
  sequential_time: number;
}

export interface PerformanceMetrics {
  total_cycle_time: number;
  system1_time: number;
  system2_time: number;
  parallel_efficiency: number;    // percentage
  bottleneck_system: 'system1' | 'system2';
  target_cycle_time: number;
  achievement_rate: number;       // percentage
  average_yield: number;          // percentage
  cycles_completed: number;
  failures: number;
  emergency_stops: number;
}

export interface TimingHistory {
  data: Array<{
    timestamp: string;
    value: number;
    target: number;
  }>;
  average: number;
  min: number;
  max: number;
  std_dev: number;
}

// Common API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

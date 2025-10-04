# Pick-Place Inspection Machine API Documentation

## Overview

This API provides comprehensive control and monitoring capabilities for a Pick-Place inspection machine with vision inspection system. The API follows RESTful principles and includes extensive validation, safety checks, and business logic enforcement.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not implement authentication. In production, implement proper authentication for all endpoints.

## Error Response Format

All errors return a consistent format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "additional": "context"
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "path": "/api/endpoint"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `403` - Forbidden (safety interlock)
- `404` - Not Found
- `409` - Conflict (unique constraint)
- `500` - Internal Server Error
- `503` - Service Unavailable (hardware not responding)

---

## Configuration Endpoints

### Global Configuration

#### GET /api/config/global

Returns the global configuration.

**Response:**
```json
{
  "trigger_source": "modbus",
  "trigger_modbus_address": 1,
  "trigger_modbus_register": 40001,
  "trigger_rs232_port": "COM1",
  "trigger_rs232_baudrate": 9600,
  "trigger_rs232_timeout": 1000
}
```

#### PUT /api/config/global

Updates the global configuration.

**Request Body:**
```json
{
  "trigger_source": "modbus" | "rs232",
  "trigger_modbus_address": number,
  "trigger_modbus_register": number,
  "trigger_rs232_port": string,
  "trigger_rs232_baudrate": 9600 | 19200 | 38400 | 115200,
  "trigger_rs232_timeout": number
}
```

**Validation:**
- `trigger_source` must be 'modbus' or 'rs232'
- If modbus: `trigger_modbus_address` and `trigger_modbus_register` are required
- If rs232: `trigger_rs232_port`, `trigger_rs232_baudrate`, and `trigger_rs232_timeout` are required
- `trigger_rs232_baudrate` must be one of: 9600, 19200, 38400, 115200

### System 1 Configuration

#### GET /api/config/system1

Returns System 1 configuration.

**Response:**
```json
{
  "motor": "NEMA 23",
  "steps_per_mm": 200,
  "homing_speed": 100,
  "homing_accel": 500,
  "cylinder_down_time": 0.5,
  "cylinder_up_time": 0.5,
  "gripper_close_time": 0.3,
  "gripper_open_time": 0.2,
  "transfer_distance": 250,
  "transfer_speed": 400,
  "transfer_accel": 1000,
  "return_speed": 600,
  "return_accel": 1200
}
```

#### PUT /api/config/system1

Updates System 1 configuration with validation for all numeric ranges.

### System 2 Configuration

#### GET /api/config/system2

Returns System 2 configuration.

**Response:**
```json
{
  "motor": "NEMA 23",
  "steps_per_mm": 200,
  "homing_speed": 100,
  "homing_accel": 500,
  "pickup_distance": 100,
  "pickup_speed": 300,
  "pickup_accel": 600,
  "gripper_close_time": 0.3,
  "gripper_open_time": 0.2,
  "slow_start_position": 100,
  "slow_end_position": 150,
  "release_position": 200,
  "speed_slow": 100,
  "speed_fast": 400,
  "speed_feeding": 166.67,
  "accel_slow_to_fast": 800,
  "accel_fast_to_slow": 800,
  "return_speed": 600,
  "return_accel": 1200,
  "release_delay": 0.3,
  "post_release_delay": 0.2
}
```

#### PUT /api/config/system2

Updates System 2 configuration with complex validation:
- Position relationships: `slow_start_position < slow_end_position < release_position`
- Distance relationship: `pickup_distance < slow_start_position`
- Speed relationship: `speed_fast > speed_slow`
- `speed_feeding` is calculated from active production reference and cannot be set directly

### Handover Configuration

#### GET /api/config/handover

Returns handover configuration.

**Response:**
```json
{
  "delay_before_s2_close": 0.5,
  "delay_s2_close_to_s1_open": 0.3,
  "timeout_s2_ready": 5.0
}
```

### Emergency Configuration

#### GET /api/config/emergency

Returns emergency configuration.

**Response:**
```json
{
  "button_global": ["DI8-S1", "DI8-S2"],
  "rear_limit_s1": "DI2-S1",
  "rear_limit_s2": "DI2-S2",
  "polling_rate": 20,
  "homing_timeout": 10,
  "movement_timeout": 5
}
```

---

## Production References Endpoints

### GET /api/production-references

Returns all production references with optional filtering.

**Query Parameters:**
- `active=true` - Filter active references only
- `search=string` - Search by ref_code or description

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "ref_code": "SB-A-001",
      "description": "Steel Bracket A",
      "conveyor_speed_cs19": 10.0,
      "feeding_duration": 1.0,
      "welding_time": 2.5,
      "tube_diameter": 25.0,
      "tube_length": 100.0,
      "wire_gauge": "1.2mm",
      "active": true,
      "created_at": "2024-01-20T10:00:00Z",
      "updated_at": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### POST /api/production-references

Creates a new production reference.

**Request Body:**
```json
{
  "ref_code": "SB-A-002",
  "description": "Steel Bracket B",
  "conveyor_speed_cs19": 12.0,
  "welding_time": 3.0,
  "tube_diameter": 30.0,
  "tube_length": 120.0,
  "wire_gauge": "1.4mm"
}
```

**Validation:**
- `ref_code` must be unique and not empty
- `conveyor_speed_cs19` must be > 0
- `feeding_duration` is automatically set to 1.0
- `speed_feeding` is calculated as `(conveyor_speed_cs19 * 1000) / 60`

### GET /api/production-references/active

Returns the currently active production reference.

### PUT /api/production-references/:id/activate

**CRITICAL BUSINESS LOGIC:** Activates a production reference.

**Actions:**
1. Sets all other references `active = false`
2. Sets this reference `active = true`
3. Calculates `speed_feeding = (conveyor_speed_cs19 * 1000) / 60`
4. Updates `System2Config.speed_feeding` with calculated value

---

## I/O Monitoring Endpoints

### GET /api/io/system1/inputs

Returns System 1 input states.

**Response:**
```json
{
  "DI0-S1": true,
  "DI1-S1": true,
  "DI2-S1": false,
  "DI3-S1": false,
  "DI4-S1": true,
  "DI5-S1": false,
  "DI6-S1": false,
  "DI7-S1": false,
  "DI8-S1": false
}
```

### GET /api/io/system1/outputs

Returns System 1 output states.

**Response:**
```json
{
  "DO0-S1": false,
  "DO1-S1": false,
  "DO2-S1": false,
  "DO3-S1": false,
  "DO4-S1": false,
  "DO5-S1": false,
  "DO6-S1": false,
  "DO7-S1": true
}
```

### GET /api/io/system2/inputs

Returns System 2 input states (same structure as System 1).

### GET /api/io/system2/outputs

Returns System 2 output states including `DO7-S2` for welding machine control.

### POST /api/io/system1/outputs/:pin/write

Writes to a System 1 output pin.

**Request Body:**
```json
{
  "value": true
}
```

**Safety Checks:**
- `DO6-S1` (ALARM): Can only be cleared, not set manually
- `DO7-S1` (READY): Can only be set by system after homing

### POST /api/io/system2/outputs/:pin/write

Writes to a System 2 output pin.

**CRITICAL SAFETY LOGIC for DO7-S2 (Welding Machine):**

Can only be enabled if ALL conditions are met:
1. `homing_done = true`
2. `emergency_stop = false`
3. `cycle_running = false`
4. `DO6-S1` (alarm) = false
5. `systems_initialized = true`

If conditions not met, returns 403 with blocking reasons.

---

## Modbus Registers Endpoints

### GET /api/modbus/system1/registers

Returns all System 1 Modbus registers (HR0-HR7).

**Response:**
```json
{
  "0": 0,
  "1": 0,
  "2": 0,
  "3": 0,
  "4": 500,
  "5": 250,
  "6": 800,
  "7": 800
}
```

### GET /api/modbus/system2/registers

Returns all System 2 Modbus registers (HR0-HR11).

**Response:**
```json
{
  "0": 0,
  "1": 166.67,
  "2": 0,
  "3": 0,
  "4": 600,
  "5": 100,
  "6": 150,
  "7": 200,
  "8": 100,
  "9": 400,
  "10": 800,
  "11": 800
}
```

### GET /api/modbus/system1/register/:id

Returns a single System 1 register with description.

**Response:**
```json
{
  "register": 0,
  "value": 0,
  "description": "HR0: Current speed (rpm)"
}
```

### PUT /api/modbus/system1/register/:id/write

Writes to a System 1 register.

**Request Body:**
```json
{
  "value": 500
}
```

**Validation:**
- `HR2` (position) is read-only
- Value ranges validated for writable registers

### PUT /api/modbus/system2/register/:id/write

Writes to a System 2 register.

**Validation:**
- `HR1` (speed_feeding) is calculated from DB, cannot be written
- `HR2` (position) is read-only

---

## System Control Endpoints

### POST /api/system/homing

Initiates the homing sequence.

**Actions:**
1. Checks preconditions (no emergency, not homing, no cycle running)
2. Sets state to HOMING
3. Disables DO7-S2 (welding machine)
4. Starts parallel homing for S1 and S2
5. On success: sets homing_done, enables DO7-S1 (READY)
6. On failure: sets DO6-S1 (ALARM)

**Response:**
```json
{
  "success": true,
  "system1_time": 8.5,
  "system2_time": 7.2,
  "total_time": 8.5,
  "errors": []
}
```

### POST /api/system/emergency-reset

Resets an emergency stop.

**Actions:**
1. Verifies emergency buttons released
2. Verifies systems not at rear limits
3. Clears emergency flags
4. Triggers homing sequence

**Response:**
```json
{
  "success": true,
  "message": "Emergency reset successful, homing initiated",
  "canReset": true
}
```

### GET /api/system/status

Returns overall system status.

**Response:**
```json
{
  "systemStatus": "READY",
  "system1State": "READY",
  "system2State": "READY",
  "homingDone": true,
  "system1Initialized": true,
  "system2Initialized": true,
  "cycleRunning": false,
  "emergencyStop": false,
  "emergencySource": [],
  "alarmActive": false,
  "weldingMachineEnabled": false,
  "visionSystemReady": true,
  "databaseConnected": true,
  "activeProductionRef": "SB-A-001",
  "currentCycleNumber": 1247
}
```

### GET /api/system/welding-machine-status

Returns welding machine status with conditions.

**Response:**
```json
{
  "enabled": false,
  "conditions": {
    "homingDone": true,
    "noEmergency": true,
    "notRunning": true,
    "noAlarm": true,
    "systemsReady": true
  },
  "blockingConditions": []
}
```

---

## Cycle Logs Endpoints

### GET /api/logs/cycles

Returns cycle logs with filtering.

**Query Parameters:**
- `limit=100` - Number of records to return
- `offset=0` - Number of records to skip
- `start_date=ISO8601` - Filter by start date
- `end_date=ISO8601` - Filter by end date
- `status=success|error|emergency_stop|timeout` - Filter by status
- `production_ref=string` - Filter by production reference

**Response:**
```json
{
  "cycles": [
    {
      "id": 1,
      "cycle_number": 1247,
      "production_ref": "SB-A-001",
      "start_time": "2024-01-20T10:30:00Z",
      "end_time": "2024-01-20T10:30:45Z",
      "duration_total": 45,
      "vision_duration": 2.5,
      "system1_duration": 20,
      "system2_duration": 22,
      "vision_result": true,
      "vision_confidence": 95.5,
      "vision_image_path": "/images/inspection-result-1247.jpg",
      "system1_final_position": 250,
      "system2_final_position": 200,
      "status": "success",
      "error_message": null,
      "created_at": "2024-01-20T10:30:45Z"
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0
}
```

### GET /api/logs/cycles/:id

Returns a single cycle log with full details.

### GET /api/logs/errors

Returns error logs with filtering.

**Query Parameters:**
- `limit=50` - Number of records to return
- `error_type=vision_fail|emergency_stop|timeout|sensor_fail|position_error|handover_fail|init_fail|other`
- `system=system1|system2|vision|global`
- `start_date=ISO8601` - Filter by start date
- `end_date=ISO8601` - Filter by end date

**Response:**
```json
{
  "errors": [
    {
      "id": 1,
      "cycle_id": 3,
      "error_type": "vision_fail",
      "error_code": "VIF-001",
      "error_message": "Vision inspection failed - dimension out of tolerance",
      "system": "vision",
      "phase": "quality_check",
      "timestamp": "2024-01-20T10:32:38Z",
      "context": {
        "cycle_number": 1249,
        "production_ref": "SB-A-001",
        "confidence": 75.2
      },
      "resolution": null,
      "resolved_at": null
    }
  ],
  "total": 1
}
```

### POST /api/logs/export

Exports logs in various formats.

**Request Body:**
```json
{
  "format": "csv" | "json" | "excel",
  "type": "cycles" | "errors",
  "filters": {
    "start_date": "2024-01-20T00:00:00Z",
    "end_date": "2024-01-20T23:59:59Z",
    "status": "success"
  }
}
```

**Response:**
```json
{
  "downloadUrl": "/api/downloads/cycles_export_2024-01-20.csv",
  "filename": "cycles_export_2024-01-20.csv",
  "expiresAt": "2024-01-21T10:30:00Z"
}
```

---

## Analytics Endpoints

### GET /api/analytics/cycle-breakdown

Returns cycle breakdown analysis.

**Query Parameters:**
- `cycle_id=number` - Specific cycle breakdown
- `production_ref=string` - Filter by production reference
- `date=ISO8601` - Specific date analysis

**Response:**
```json
{
  "phases": [
    {
      "name": "System Initialization",
      "system": "system1",
      "start": 0,
      "duration": 2,
      "color": "#3b82f6"
    }
  ],
  "total_duration": 45,
  "parallel_time": 5,
  "sequential_time": 40
}
```

### GET /api/analytics/performance-metrics

Returns performance metrics.

**Query Parameters:**
- `period=today|week|month|custom`
- `start_date=ISO8601` - Custom period start
- `end_date=ISO8601` - Custom period end

**Response:**
```json
{
  "total_cycle_time": 42.5,
  "system1_time": 20.2,
  "system2_time": 18.8,
  "parallel_efficiency": 85.5,
  "bottleneck_system": "system1",
  "target_cycle_time": 40.0,
  "achievement_rate": 94.1,
  "average_yield": 96.8,
  "cycles_completed": 1247,
  "failures": 52,
  "emergency_stops": 3
}
```

### GET /api/analytics/timing-history

Returns timing history data.

**Query Parameters:**
- `period=24h|7d|30d`
- `granularity=hour|day`
- `metric=total_time|system1_time|system2_time|yield`

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2024-01-20T10:00:00Z",
      "value": 42.5,
      "target": 40.0
    }
  ],
  "average": 42.3,
  "min": 38.1,
  "max": 47.2,
  "std_dev": 2.1
}
```

---

## Security & Safety Features

### Critical Safety Interlocks

1. **Welding Machine Control (DO7-S2)**: Requires 5 conditions to be met
2. **Emergency Reset**: Verifies buttons released and systems not at limits
3. **Homing Sequence**: Checks preconditions before starting
4. **Read-only Registers**: HR1, HR2 cannot be written directly
5. **System State Validation**: All operations check system state

### Input Validation

- All numeric values validated against specified ranges
- String formats validated (pin names, ref codes)
- Required fields enforced
- Foreign key relationships validated
- Date ranges and formats validated

### Error Handling

- Consistent error response format
- Appropriate HTTP status codes
- Detailed error messages with context
- Blocking condition reporting for safety violations

---

## Real-time Updates (WebSocket)

The API supports WebSocket connections for real-time updates:

- `ws://localhost:3000/io-status` - I/O state updates at 20Hz
- `ws://localhost:3000/modbus-registers` - Register updates at 10Hz
- `ws://localhost:3000/system-state` - System state changes
- `ws://localhost:3000/cycle-events` - Cycle phase transitions
- `ws://localhost:3000/emergency` - Emergency events

---

## Testing

All endpoints include comprehensive mock data for testing. In production:

1. Replace mock data with real database connections
2. Implement actual hardware communication
3. Add proper authentication and authorization
4. Implement WebSocket real-time updates
5. Add comprehensive logging and monitoring

---

## Version History

- **v1.0** - Initial API implementation with comprehensive validation and safety checks
- All endpoints updated to match detailed verification checklist requirements
- Added critical business logic for production reference activation
- Implemented safety interlocks for welding machine control
- Added extensive input validation and error handling

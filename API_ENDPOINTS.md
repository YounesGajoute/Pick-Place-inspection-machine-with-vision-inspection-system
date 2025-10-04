# Pick-Place Inspection Machine API Endpoints

This document describes all the backend API endpoints for the Pick-Place Inspection Machine with Vision Inspection System.

## Base URL
All endpoints are prefixed with `/api`

## Authentication
*Note: Authentication is not implemented in this mock version. In a production system, you would add proper authentication middleware.*

## Response Format
All endpoints return JSON responses with the following structure:
```json
{
  "success": true|false,
  "data": <response_data>,
  "message": "<optional_message>",
  "error": "<error_message_if_failed>"
}
```

For paginated responses:
```json
{
  "success": true,
  "data": [<array_of_items>],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Configuration Endpoints

### Global Configuration
- **GET** `/api/config/global` - Get global system configuration
- **PUT** `/api/config/global` - Update global system configuration

### System1 Configuration
- **GET** `/api/config/system1` - Get System1 configuration
- **PUT** `/api/config/system1` - Update System1 configuration

### System2 Configuration
- **GET** `/api/config/system2` - Get System2 configuration
- **PUT** `/api/config/system2` - Update System2 configuration

### Handover Configuration
- **GET** `/api/config/handover` - Get handover configuration
- **PUT** `/api/config/handover` - Update handover configuration

### Emergency Configuration
- **GET** `/api/config/emergency` - Get emergency configuration
- **PUT** `/api/config/emergency` - Update emergency configuration

---

## Production References Endpoints

### Production References CRUD
- **GET** `/api/production-references` - Get all production references (with pagination and filtering)
  - Query parameters: `page`, `limit`, `active`, `search`
- **POST** `/api/production-references` - Create new production reference
- **GET** `/api/production-references/:id` - Get specific production reference
- **PUT** `/api/production-references/:id` - Update production reference
- **DELETE** `/api/production-references/:id` - Delete production reference

### Production References Management
- **GET** `/api/production-references/active` - Get currently active production reference
- **PUT** `/api/production-references/:id/activate` - Activate a production reference

---

## I/O Monitoring Endpoints

### System2 Outputs
- **GET** `/api/io/system2/outputs` - Get all System2 output pins status

### System1 Output Control
- **POST** `/api/io/system1/outputs/:pin/write` - Write value to System1 output pin
  - Body: `{ "value": boolean, "timestamp": "ISO_string" }`

### System2 Output Control
- **POST** `/api/io/system2/outputs/:pin/write` - Write value to System2 output pin
  - Body: `{ "value": boolean, "timestamp": "ISO_string" }`

---

## Modbus Register Endpoints

### System1 Modbus Registers
- **GET** `/api/modbus/system1/registers` - Get all System1 Modbus registers
- **GET** `/api/modbus/system1/register/:id` - Get specific System1 register
- **PUT** `/api/modbus/system1/register/:id/write` - Write value to System1 register
  - Body: `{ "value": number|boolean, "timestamp": "ISO_string" }`

### System2 Modbus Registers
- **GET** `/api/modbus/system2/registers` - Get all System2 Modbus registers
- **GET** `/api/modbus/system2/register/:id` - Get specific System2 register
- **PUT** `/api/modbus/system2/register/:id/write` - Write value to System2 register
  - Body: `{ "value": number|boolean, "timestamp": "ISO_string" }`

---

## System Control Endpoints

### System Operations
- **POST** `/api/system/homing` - Start homing operation
  - Body: `{ "system": "system1"|"system2"|"both", "forceHoming": boolean }`
- **POST** `/api/system/emergency-reset` - Start emergency reset
  - Body: `{ "system": "system1"|"system2"|"both", "clearErrors": boolean }`

### System Status
- **GET** `/api/system/status` - Get overall system status
- **GET** `/api/system/welding-machine-status` - Get welding machine status

---

## Cycle Logs Endpoints

### Cycle Logs
- **GET** `/api/logs/cycles` - Get cycle logs (with pagination and filtering)
  - Query parameters: `page`, `limit`, `status`, `productionReferenceId`, `operator`, `startDate`, `endDate`
- **GET** `/api/logs/cycles/:id` - Get specific cycle log details

### Error Logs
- **GET** `/api/logs/errors` - Get error logs (with pagination and filtering)
  - Query parameters: `page`, `limit`, `level`, `category`, `resolved`, `startDate`, `endDate`

### Log Export
- **POST** `/api/logs/export` - Export logs to file
  - Body: `{ "startDate": "ISO_string", "endDate": "ISO_string", "logTypes": ["cycles"|"errors"], "format": "csv"|"json"|"excel" }`

---

## Analytics Endpoints

### Performance Analytics
- **GET** `/api/analytics/cycle-breakdown` - Get cycle breakdown analytics
  - Query parameters: `period` (hour|day|week|month)
- **GET** `/api/analytics/performance-metrics` - Get performance metrics
  - Query parameters: `period` (day|week|month|quarter)
- **GET** `/api/analytics/timing-history` - Get timing history data
  - Query parameters: `period` (hour|day|week|month), `productionReference`

---

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists or operation not allowed |
| 500 | Internal Server Error |

---

## Example Usage

### Get System Status
```bash
curl -X GET http://localhost:3000/api/system/status
```

### Create Production Reference
```bash
curl -X POST http://localhost:3000/api/production-references \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Steel Bracket A",
    "partNumber": "SB-A-001",
    "customer": "AutoCorp Inc.",
    "material": "Steel",
    "dimensions": {"length": 120, "width": 80, "height": 25},
    "weight": 2.5,
    "cycleTime": 45,
    "qualitySpecs": {
      "tolerance": 0.1,
      "surfaceFinish": "Ra 1.6",
      "inspectionCriteria": ["dimensions", "surface_quality", "weld_integrity"]
    }
  }'
```

### Write to Output Pin
```bash
curl -X POST http://localhost:3000/api/io/system1/outputs/1/write \
  -H "Content-Type: application/json" \
  -d '{"value": true}'
```

### Start Homing Operation
```bash
curl -X POST http://localhost:3000/api/system/homing \
  -H "Content-Type: application/json" \
  -d '{"system": "system1", "forceHoming": false}'
```

---

## Data Models

See `lib/types.ts` for complete TypeScript type definitions for all data models used in the API.

---

## Notes

- This is a mock implementation using in-memory data storage
- In a production system, you would replace the mock data with actual database connections
- All timestamps are in ISO 8601 format
- The API includes comprehensive validation and error handling
- Safety checks are implemented for critical operations (e.g., emergency stops, conflicting operations)

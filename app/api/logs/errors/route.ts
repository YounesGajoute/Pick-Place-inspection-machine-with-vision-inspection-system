import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, parseQueryParams } from '@/lib/api-utils';
import { ErrorLog } from '@/lib/types';

// Mock data storage for error logs
let errorLogs: ErrorLog[] = [
  {
    id: 1,
    cycle_id: 3,
    error_type: 'vision_fail',
    error_code: 'VIF-001',
    error_message: 'Vision inspection failed - dimension out of tolerance',
    system: 'vision',
    phase: 'quality_check',
    timestamp: '2024-01-20T10:32:38Z',
    context: {
      cycle_number: 1249,
      production_ref: 'SB-A-001',
      confidence: 75.2,
      expected_dimensions: { width: 50, height: 30 },
      actual_dimensions: { width: 52, height: 31 }
    },
    resolution: null,
    resolved_at: null,
  },
  {
    id: 2,
    cycle_id: 4,
    error_type: 'emergency_stop',
    error_code: 'ESA-001',
    error_message: 'Emergency stop activated by operator',
    system: 'global',
    phase: 'pick_and_place',
    timestamp: '2024-01-20T10:33:15Z',
    context: {
      cycle_number: 1250,
      production_ref: 'SB-A-001',
      emergency_source: ['DI8-S1'],
      system1_position: 100,
      system2_position: 80
    },
    resolution: 'Operator released emergency stop, system reset performed',
    resolved_at: '2024-01-20T10:35:00Z',
  },
  {
    id: 3,
    cycle_id: null,
    error_type: 'init_fail',
    error_code: 'SIF-002',
    error_message: 'System 1 homing sequence failed - sensor timeout',
    system: 'system1',
    phase: 'initialization',
    timestamp: '2024-01-20T09:45:22Z',
    context: {
      sensor: 'DI0-S1',
      timeout_duration: 10,
      expected_state: true,
      actual_state: false
    },
    resolution: 'Sensor cleaned, homing sequence completed successfully',
    resolved_at: '2024-01-20T09:50:15Z',
  },
  {
    id: 4,
    cycle_id: null,
    error_type: 'sensor_fail',
    error_code: 'CT-001',
    error_message: 'Communication timeout with vision system',
    system: 'vision',
    phase: 'system_check',
    timestamp: '2024-01-20T08:20:10Z',
    context: {
      timeout_duration: 5,
      last_communication: '2024-01-20T08:19:55Z',
      system_status: 'initializing'
    },
    resolution: 'Vision system rebooted, communication restored',
    resolved_at: '2024-01-20T08:25:30Z',
  },
];

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { page, limit, offset, searchParams } = parseQueryParams(request);
  
  // Filter by error type if specified
  const error_type = searchParams.get('error_type');
  const system = searchParams.get('system');
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const limitParam = searchParams.get('limit');
  
  let filteredLogs = [...errorLogs];
  
  if (error_type) {
    filteredLogs = filteredLogs.filter(log => log.error_type === error_type);
  }
  
  if (system) {
    filteredLogs = filteredLogs.filter(log => log.system === system);
  }
  
  if (start_date) {
    const start = new Date(start_date);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
  }
  
  if (end_date) {
    const end = new Date(end_date);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
  }
  
  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Apply limit if specified
  if (limitParam) {
    const customLimit = parseInt(limitParam, 10);
    if (!isNaN(customLimit) && customLimit > 0) {
      filteredLogs = filteredLogs.slice(0, customLimit);
    }
  }
  
  const total = filteredLogs.length;
  
  const response = {
    errors: filteredLogs,
    total
  };
  
  return createResponse(response);
});
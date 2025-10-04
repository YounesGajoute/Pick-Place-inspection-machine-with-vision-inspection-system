import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, parseQueryParams } from '@/lib/api-utils';
import { CycleLog } from '@/lib/types';

// Mock data storage for cycle logs
let cycleLogs: CycleLog[] = [
  {
    id: 1,
    cycle_number: 1247,
    production_ref: 'SB-A-001',
    start_time: '2024-01-20T10:30:00Z',
    end_time: '2024-01-20T10:30:45Z',
    duration_total: 45,
    vision_duration: 2.5,
    system1_duration: 20,
    system2_duration: 22,
    vision_result: true,
    vision_confidence: 95.5,
    vision_image_path: '/images/inspection-result-1247.jpg',
    system1_final_position: 250,
    system2_final_position: 200,
    status: 'success',
    error_message: null,
    created_at: '2024-01-20T10:30:45Z',
  },
  {
    id: 2,
    cycle_number: 1248,
    production_ref: 'SB-A-001',
    start_time: '2024-01-20T10:31:00Z',
    end_time: '2024-01-20T10:31:42Z',
    duration_total: 42,
    vision_duration: 2.8,
    system1_duration: 18,
    system2_duration: 21,
    vision_result: true,
    vision_confidence: 92.3,
    vision_image_path: '/images/inspection-result-1248.jpg',
    system1_final_position: 245,
    system2_final_position: 195,
    status: 'success',
    error_message: null,
    created_at: '2024-01-20T10:31:42Z',
  },
  {
    id: 3,
    cycle_number: 1249,
    production_ref: 'SB-A-001',
    start_time: '2024-01-20T10:32:00Z',
    end_time: '2024-01-20T10:32:38Z',
    duration_total: 38,
    vision_duration: 2.2,
    system1_duration: 16,
    system2_duration: 19,
    vision_result: false,
    vision_confidence: 75.2,
    vision_image_path: '/images/inspection-result-1249.jpg',
    system1_final_position: 240,
    system2_final_position: 190,
    status: 'error',
    error_message: 'Vision inspection failed - dimension out of tolerance',
    created_at: '2024-01-20T10:32:38Z',
  },
  {
    id: 4,
    cycle_number: 1250,
    production_ref: 'SB-A-001',
    start_time: '2024-01-20T10:33:00Z',
    end_time: '2024-01-20T10:33:15Z',
    duration_total: 15,
    vision_duration: 0,
    system1_duration: 8,
    system2_duration: 7,
    vision_result: false,
    vision_confidence: 0,
    vision_image_path: '',
    system1_final_position: 100,
    system2_final_position: 80,
    status: 'emergency_stop',
    error_message: 'Emergency stop activated by operator',
    created_at: '2024-01-20T10:33:15Z',
  },
];

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { page, limit, offset, searchParams } = parseQueryParams(request);
  
  // Filter by status if specified
  const status = searchParams.get('status');
  const production_ref = searchParams.get('production_ref');
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const cycle_id = searchParams.get('cycle_id');
  
  let filteredLogs = [...cycleLogs];
  
  if (status) {
    filteredLogs = filteredLogs.filter(log => log.status === status);
  }
  
  if (production_ref) {
    filteredLogs = filteredLogs.filter(log => log.production_ref === production_ref);
  }
  
  if (cycle_id) {
    const id = parseInt(cycle_id, 10);
    filteredLogs = filteredLogs.filter(log => log.cycle_number === id);
  }
  
  if (start_date) {
    const start = new Date(start_date);
    filteredLogs = filteredLogs.filter(log => new Date(log.start_time) >= start);
  }
  
  if (end_date) {
    const end = new Date(end_date);
    filteredLogs = filteredLogs.filter(log => new Date(log.start_time) <= end);
  }
  
  // Sort by start time (newest first)
  filteredLogs.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  
  // Paginate
  const total = filteredLogs.length;
  const paginatedData = filteredLogs.slice(offset, offset + limit);
  
  const response = {
    cycles: paginatedData,
    total,
    limit,
    offset
  };
  
  return createResponse(response);
});

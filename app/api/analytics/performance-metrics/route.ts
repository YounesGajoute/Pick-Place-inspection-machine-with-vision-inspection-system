import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, parseQueryParams } from '@/lib/api-utils';
import { PerformanceMetrics } from '@/lib/types';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = parseQueryParams(request);
  
  const period = searchParams.get('period') || 'today';
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  
  // Mock performance metrics data
  const mockMetrics: PerformanceMetrics = {
    total_cycle_time: 42.5,
    system1_time: 20.2,
    system2_time: 18.8,
    parallel_efficiency: 85.5,
    bottleneck_system: 'system1',
    target_cycle_time: 40.0,
    achievement_rate: 94.1,
    average_yield: 96.8,
    cycles_completed: 1247,
    failures: 52,
    emergency_stops: 3,
  };
  
  return createResponse(mockMetrics);
});
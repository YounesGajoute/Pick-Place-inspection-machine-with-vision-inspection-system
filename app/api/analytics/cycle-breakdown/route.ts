import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, parseQueryParams } from '@/lib/api-utils';
import { CycleBreakdown } from '@/lib/types';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = parseQueryParams(request);
  
  const cycle_id = searchParams.get('cycle_id');
  const production_ref = searchParams.get('production_ref');
  const date = searchParams.get('date');
  
  // Mock cycle breakdown data
  const mockBreakdown: CycleBreakdown = {
    phases: [
      {
        name: 'System Initialization',
        system: 'system1',
        start: 0,
        duration: 2,
        color: '#3b82f6',
      },
      {
        name: 'Pick Operation',
        system: 'system1',
        start: 2,
        duration: 8,
        color: '#10b981',
      },
      {
        name: 'Vision Inspection',
        system: 'vision',
        start: 10,
        duration: 3,
        color: '#8b5cf6',
      },
      {
        name: 'Place Operation',
        system: 'system2',
        start: 13,
        duration: 12,
        color: '#f59e0b',
      },
      {
        name: 'Quality Check',
        system: 'vision',
        start: 25,
        duration: 2,
        color: '#8b5cf6',
      },
      {
        name: 'Return to Home',
        system: 'system1',
        start: 27,
        duration: 18,
        color: '#10b981',
      },
    ],
    total_duration: 45,
    parallel_time: 5,
    sequential_time: 40,
  };
  
  return createResponse(mockBreakdown);
});
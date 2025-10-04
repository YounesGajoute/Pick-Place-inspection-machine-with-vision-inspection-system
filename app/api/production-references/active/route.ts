import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';
import { ProductionReference } from '@/lib/types';

// Mock data storage (in a real app, this would be a database)
let productionReferences: ProductionReference[] = [
  {
    id: 1,
    ref_code: 'SB-A-001',
    description: 'Steel Bracket A',
    conveyor_speed_cs19: 10,
    feeding_duration: 1.0,
    welding_time: 2.5,
    tube_diameter: 25.0,
    tube_length: 100.0,
    wire_gauge: '1.0mm',
    active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    ref_code: 'AP-B-002',
    description: 'Aluminum Plate B',
    conveyor_speed_cs19: 8,
    feeding_duration: 1.0,
    welding_time: 3.0,
    tube_diameter: 30.0,
    tube_length: 120.0,
    wire_gauge: '1.2mm',
    active: false,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  },
];

export const GET = withErrorHandling(async (request: NextRequest) => {
  const activeReference = productionReferences.find(ref => ref.active);
  
  return createResponse(activeReference || null);
});
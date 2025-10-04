import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling } from '@/lib/api-utils';
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

// Mock System2Config for updating speed_feeding
let system2Config = {
  speed_feeding: null as number | null
};

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    return createErrorResponse('Invalid ID', 400);
  }
  
  const referenceIndex = productionReferences.findIndex(ref => ref.id === id);
  
  if (referenceIndex === -1) {
    return createErrorResponse('Production reference not found', 404);
  }
  
  // CRITICAL BUSINESS LOGIC: When activating a production reference
  // 1. Set all other references active = false
  productionReferences.forEach((ref, index) => {
    if (index !== referenceIndex) {
      productionReferences[index] = {
        ...ref,
        active: false,
        updated_at: new Date().toISOString(),
      };
    }
  });
  
  // 2. Set this reference active = true
  productionReferences[referenceIndex] = {
    ...productionReferences[referenceIndex],
    active: true,
    updated_at: new Date().toISOString(),
  };
  
  // 3. Calculate speed_feeding = (conveyor_speed_cs19 * 1000) / 60
  const conveyorSpeed = productionReferences[referenceIndex].conveyor_speed_cs19;
  const speedFeeding = (conveyorSpeed * 1000) / 60; // Convert mm/s to rpm
  
  // 4. Update system2_config.speed_feeding with calculated value
  system2Config.speed_feeding = speedFeeding;
  
  // In a real system, this would also update the System2Modbus HR1 register
  
  return createResponse(productionReferences[referenceIndex], 200, 'Production reference activated successfully');
});
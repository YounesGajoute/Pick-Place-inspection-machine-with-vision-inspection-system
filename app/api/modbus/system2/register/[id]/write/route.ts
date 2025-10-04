import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { WriteRegisterRequest } from '@/lib/types';

// Mock System2 register values
let system2Registers: Record<number, number> = {
  0: 0,      // HR0: Current speed (rpm)
  1: 166,    // HR1: Calculated speed_feeding from active production ref
  2: 0,      // HR2: Current position (steps) - READ ONLY
  3: 0,      // HR3: Target position (steps)
  4: 500,    // HR4: Acceleration (rpm/s)
  5: 80,     // HR5: Pickup distance (mm)
  6: 400,    // HR6: Pickup speed (rpm)
  7: 800,    // HR7: Pickup acceleration (rpm/s)
  8: 100,    // HR8: Slow start position (mm)
  9: 150,    // HR9: Slow end position (mm)
  10: 200,   // HR10: Release position (mm)
  11: 1000   // HR11: Return speed (rpm)
};

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  const writeRequest = await validateRequestBody<WriteRegisterRequest>(request);
  
  if (isNaN(id) || id < 0 || id > 11) {
    return createErrorResponse('Invalid register ID. Must be 0-11', 400);
  }
  
  // Check if register is writable (HR1 and HR2 are read-only)
  if (id === 1) {
    return createErrorResponse('HR1 (speed_feeding) is calculated from DB, cannot be written directly', 403);
  }
  
  if (id === 2) {
    return createErrorResponse('HR2 (position) is read-only', 403);
  }
  
  // Validate value type
  if (typeof writeRequest.value !== 'number') {
    return createErrorResponse('Value must be a number', 400);
  }
  
  // Validate value ranges for writable registers
  if (id === 0 && (writeRequest.value < 0 || writeRequest.value > 1200)) {
    return createErrorResponse('HR0 (speed) must be between 0-1200 rpm', 400);
  }
  
  if (id === 3 && (writeRequest.value < 0 || writeRequest.value > 10000)) {
    return createErrorResponse('HR3 (target position) must be between 0-10000 steps', 400);
  }
  
  if (id === 4 && (writeRequest.value < 0 || writeRequest.value > 2000)) {
    return createErrorResponse('HR4 (acceleration) must be between 0-2000 rpm/s', 400);
  }
  
  if (id === 5 && (writeRequest.value < 0 || writeRequest.value > 200)) {
    return createErrorResponse('HR5 (pickup distance) must be between 0-200 mm', 400);
  }
  
  if (id === 6 && (writeRequest.value < 0 || writeRequest.value > 600)) {
    return createErrorResponse('HR6 (pickup speed) must be between 0-600 rpm', 400);
  }
  
  if (id === 7 && (writeRequest.value < 0 || writeRequest.value > 1000)) {
    return createErrorResponse('HR7 (pickup acceleration) must be between 0-1000 rpm/s', 400);
  }
  
  if (id === 8 && (writeRequest.value < 0 || writeRequest.value > 150)) {
    return createErrorResponse('HR8 (slow start position) must be between 0-150 mm', 400);
  }
  
  if (id === 9 && (writeRequest.value < 0 || writeRequest.value > 180)) {
    return createErrorResponse('HR9 (slow end position) must be between 0-180 mm', 400);
  }
  
  if (id === 10 && (writeRequest.value < 0 || writeRequest.value > 300)) {
    return createErrorResponse('HR10 (release position) must be between 0-300 mm', 400);
  }
  
  if (id === 11 && (writeRequest.value < 0 || writeRequest.value > 1200)) {
    return createErrorResponse('HR11 (return speed) must be between 0-1200 rpm', 400);
  }
  
  // Update the register value
  system2Registers[id] = writeRequest.value;
  
  const response = {
    success: true,
    register: id,
    value: writeRequest.value,
  };
  
  return createResponse(response, 200, `System2 register HR${id} updated successfully`);
});

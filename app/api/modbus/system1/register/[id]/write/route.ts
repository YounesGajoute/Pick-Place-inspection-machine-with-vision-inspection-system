import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { WriteRegisterRequest } from '@/lib/types';

// Mock System1 register values
let system1Registers: Record<number, number> = {
  0: 0,      // HR0: Current speed (rpm)
  1: 0,      // HR1: Reserved
  2: 0,      // HR2: Current position (steps) - READ ONLY
  3: 0,      // HR3: Target position (steps)
  4: 500,    // HR4: Acceleration (rpm/s)
  5: 250,    // HR5: Transfer distance (mm)
  6: 800,    // HR6: Transfer speed (rpm)
  7: 800     // HR7: Return speed (rpm)
};

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  const writeRequest = await validateRequestBody<WriteRegisterRequest>(request);
  
  if (isNaN(id) || id < 0 || id > 7) {
    return createErrorResponse('Invalid register ID. Must be 0-7', 400);
  }
  
  // Check if register is writable (HR2 is read-only)
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
  
  if (id === 5 && (writeRequest.value < 0 || writeRequest.value > 500)) {
    return createErrorResponse('HR5 (transfer distance) must be between 0-500 mm', 400);
  }
  
  if (id === 6 && (writeRequest.value < 0 || writeRequest.value > 1200)) {
    return createErrorResponse('HR6 (transfer speed) must be between 0-1200 rpm', 400);
  }
  
  if (id === 7 && (writeRequest.value < 0 || writeRequest.value > 1200)) {
    return createErrorResponse('HR7 (return speed) must be between 0-1200 rpm', 400);
  }
  
  // Update the register value
  system1Registers[id] = writeRequest.value;
  
  const response = {
    success: true,
    register: id,
    value: writeRequest.value,
  };
  
  return createResponse(response, 200, `System1 register HR${id} updated successfully`);
});

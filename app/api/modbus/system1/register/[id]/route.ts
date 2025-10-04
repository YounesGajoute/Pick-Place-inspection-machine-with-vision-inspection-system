import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling } from '@/lib/api-utils';
import { ModbusRegister } from '@/lib/types';

// Mock System1 register descriptions
const system1RegisterDescriptions: Record<number, string> = {
  0: 'Current speed (rpm)',
  1: 'Reserved',
  2: 'Current position (steps) - READ ONLY',
  3: 'Target position (steps)',
  4: 'Acceleration (rpm/s)',
  5: 'Transfer distance (mm)',
  6: 'Transfer speed (rpm)',
  7: 'Return speed (rpm)'
};

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

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id) || id < 0 || id > 7) {
    return createErrorResponse('Invalid register ID. Must be 0-7', 400);
  }
  
  const register: ModbusRegister = {
    register: id,
    value: system1Registers[id],
    description: system1RegisterDescriptions[id]
  };
  
  return createResponse(register);
});

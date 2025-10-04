import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling } from '@/lib/api-utils';
import { ModbusRegister } from '@/lib/types';

// Mock System2 register descriptions
const system2RegisterDescriptions: Record<number, string> = {
  0: 'Current speed (rpm)',
  1: 'Calculated speed_feeding from active production ref - READ ONLY',
  2: 'Current position (steps) - READ ONLY',
  3: 'Target position (steps)',
  4: 'Acceleration (rpm/s)',
  5: 'Pickup distance (mm)',
  6: 'Pickup speed (rpm)',
  7: 'Pickup acceleration (rpm/s)',
  8: 'Slow start position (mm)',
  9: 'Slow end position (mm)',
  10: 'Release position (mm)',
  11: 'Return speed (rpm)'
};

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

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id) || id < 0 || id > 11) {
    return createErrorResponse('Invalid register ID. Must be 0-11', 400);
  }
  
  const register: ModbusRegister = {
    register: id,
    value: system2Registers[id],
    description: system2RegisterDescriptions[id]
  };
  
  return createResponse(register);
});

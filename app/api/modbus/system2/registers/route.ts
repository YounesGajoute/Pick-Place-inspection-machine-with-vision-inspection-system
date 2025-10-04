import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Mock System2 Modbus registers (HR0-HR11)
  const system2Registers: Record<number, number> = {
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
  
  return createResponse(system2Registers);
});

import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Mock System1 Modbus registers (HR0-HR7)
  const system1Registers: Record<number, number> = {
    0: 0,      // HR0: Current speed (rpm)
    1: 0,      // HR1: Reserved
    2: 0,      // HR2: Current position (steps) - READ ONLY
    3: 0,      // HR3: Target position (steps)
    4: 500,    // HR4: Acceleration (rpm/s)
    5: 250,    // HR5: Transfer distance (mm)
    6: 800,    // HR6: Transfer speed (rpm)
    7: 800     // HR7: Return speed (rpm)
  };
  
  return createResponse(system1Registers);
});

import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Mock System2 output data
  const system2Outputs = {
    'DO0-S2': false,  // Motor enable
    'DO1-S2': false,  // Direction
    'DO2-S2': false,  // Reserved
    'DO3-S2': false,  // Cylinder control
    'DO4-S2': false,  // Gripper
    'DO5-S2': false,  // Reserved
    'DO6-S2': false,  // ALARM
    'DO7-S2': false   // WELDING MACHINE control
  };
  
  return createResponse(system2Outputs);
});

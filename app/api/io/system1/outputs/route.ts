import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Mock System1 output data
  const system1Outputs = {
    'DO0-S1': false,  // Motor enable
    'DO1-S1': false,  // Direction
    'DO2-S1': false,  // Reserved
    'DO3-S1': false,  // Cylinder control
    'DO4-S1': false,  // Gripper
    'DO5-S1': false,  // Reserved
    'DO6-S1': false,  // ALARM
    'DO7-S1': true    // READY light
  };
  
  return createResponse(system1Outputs);
});

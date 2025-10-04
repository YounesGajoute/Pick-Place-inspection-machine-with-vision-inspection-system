import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Mock System2 input data
  const system2Inputs = {
    'DI0-S2': true,   // Front sensor (HOME)
    'DI1-S2': true,   // Cylinder UP
    'DI2-S2': false,  // Rear sensor (E-STOP)
    'DI3-S2': false,  // Reserved
    'DI4-S2': true,   // Gripper open
    'DI5-S2': false,  // Gripper sensor 1
    'DI6-S2': false,  // Gripper sensor 2
    'DI7-S2': false,  // Cylinder DOWN
    'DI8-S2': false   // Emergency button
  };
  
  return createResponse(system2Inputs);
});

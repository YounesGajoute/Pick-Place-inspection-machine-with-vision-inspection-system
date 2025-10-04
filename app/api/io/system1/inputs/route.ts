import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Mock System1 input data
  const system1Inputs = {
    'DI0-S1': true,   // Front sensor (HOME)
    'DI1-S1': true,   // Cylinder UP
    'DI2-S1': false,  // Rear sensor (E-STOP)
    'DI3-S1': false,  // Reserved
    'DI4-S1': true,   // Gripper open
    'DI5-S1': false,  // Gripper sensor 1
    'DI6-S1': false,  // Gripper sensor 2
    'DI7-S1': false,  // Cylinder DOWN
    'DI8-S1': false   // Emergency button
  };
  
  return createResponse(system1Inputs);
});

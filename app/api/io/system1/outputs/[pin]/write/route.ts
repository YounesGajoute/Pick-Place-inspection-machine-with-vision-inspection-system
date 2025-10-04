import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { WritePinRequest } from '@/lib/types';

// Mock data storage for System1 outputs
let system1Outputs: Record<string, boolean> = {
  'DO0-S1': false,  // Motor enable
  'DO1-S1': false,  // Direction
  'DO2-S1': false,  // Reserved
  'DO3-S1': false,  // Cylinder control
  'DO4-S1': false,  // Gripper
  'DO5-S1': false,  // Reserved
  'DO6-S1': false,  // ALARM
  'DO7-S1': true    // READY light
};

export const POST = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { pin: string } }
) => {
  const pin = params.pin;
  const writeRequest = await validateRequestBody<WritePinRequest>(request);
  
  // Validate pin exists in our system
  if (!system1Outputs.hasOwnProperty(pin)) {
    return createErrorResponse(`Pin ${pin} is not configured in System1`, 404);
  }
  
  // Validate value type
  if (typeof writeRequest.value !== 'boolean') {
    return createErrorResponse('Value must be a boolean', 400);
  }
  
  // Safety checks for critical outputs
  if (pin === 'DO6-S1' && writeRequest.value === true) {
    return createErrorResponse('Cannot manually set DO6-S1 (ALARM) - can only be cleared', 403);
  }
  
  if (pin === 'DO7-S1' && writeRequest.value === true) {
    return createErrorResponse('Cannot manually set DO7-S1 (READY) - can only be set by system after homing', 403);
  }
  
  // Update the pin value
  system1Outputs[pin] = writeRequest.value;
  
  // In a real system, this would interface with actual hardware
  const response = {
    success: true,
    pin,
    value: writeRequest.value,
  };
  
  return createResponse(response, 200, `System1 output pin ${pin} updated successfully`);
});

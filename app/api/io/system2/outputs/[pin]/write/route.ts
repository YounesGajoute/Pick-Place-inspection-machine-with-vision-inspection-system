import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { WritePinRequest } from '@/lib/types';

// Mock data storage for System2 outputs
let system2Outputs: Record<string, boolean> = {
  'DO0-S2': false,  // Motor enable
  'DO1-S2': false,  // Direction
  'DO2-S2': false,  // Reserved
  'DO3-S2': false,  // Cylinder control
  'DO4-S2': false,  // Gripper
  'DO5-S2': false,  // Reserved
  'DO6-S2': false,  // ALARM
  'DO7-S2': false   // WELDING MACHINE control
};

// Mock system state for safety checks
let systemState = {
  homingDone: true,
  emergencyStop: false,
  cycleRunning: false,
  alarmActive: false,
  systemsInitialized: true
};

export const POST = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { pin: string } }
) => {
  const pin = params.pin;
  const writeRequest = await validateRequestBody<WritePinRequest>(request);
  
  // Validate pin exists in our system
  if (!system2Outputs.hasOwnProperty(pin)) {
    return createErrorResponse(`Pin ${pin} is not configured in System2`, 404);
  }
  
  // Validate value type
  if (typeof writeRequest.value !== 'boolean') {
    return createErrorResponse('Value must be a boolean', 400);
  }
  
  // Critical safety logic for DO7-S2 (Welding Machine Control)
  if (pin === 'DO7-S2' && writeRequest.value === true) {
    // Check all 5 conditions for enabling welding machine
    const conditions = {
      homingDone: systemState.homingDone,
      noEmergency: !systemState.emergencyStop,
      notRunning: !systemState.cycleRunning,
      noAlarm: !systemState.alarmActive,
      systemsReady: systemState.systemsInitialized
    };
    
    const blockingConditions = Object.entries(conditions)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (blockingConditions.length > 0) {
      return createErrorResponse('Cannot enable welding machine', 403, {
        blockingConditions
      });
    }
  }
  
  // Safety checks for other critical outputs
  if (pin === 'DO6-S2' && writeRequest.value === true) {
    return createErrorResponse('Cannot manually set DO6-S2 (ALARM) - can only be cleared', 403);
  }
  
  // Update the pin value
  system2Outputs[pin] = writeRequest.value;
  
  // In a real system, this would interface with actual hardware
  const response = {
    success: true,
    pin,
    value: writeRequest.value,
  };
  
  return createResponse(response, 200, `System2 output pin ${pin} updated successfully`);
});

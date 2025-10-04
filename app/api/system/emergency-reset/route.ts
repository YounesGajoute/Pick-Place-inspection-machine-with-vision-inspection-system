import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { EmergencyResetRequest } from '@/lib/types';

// Mock system state
let systemState = {
  emergencyStop: true,
  emergencySource: ['DI8-S1'],
  alarmActive: true,
  homingDone: false,
  system1Initialized: false,
  system2Initialized: false
};

// Mock I/O state
let ioState = {
  'DI8-S1': false,  // Emergency button 1
  'DI8-S2': false,  // Emergency button 2
  'DI2-S1': false,  // Rear limit S1
  'DI2-S2': false   // Rear limit S2
};

export const POST = withErrorHandling(async (request: NextRequest) => {
  const resetRequest = await validateRequestBody<EmergencyResetRequest>(request);
  
  // Verify emergency buttons released
  const emergencyButtonsReleased = !ioState['DI8-S1'] && !ioState['DI8-S2'];
  
  // Verify systems not at rear limits
  const systemsNotAtRearLimits = !ioState['DI2-S1'] && !ioState['DI2-S2'];
  
  const canReset = emergencyButtonsReleased && systemsNotAtRearLimits;
  
  if (!canReset) {
    const blockingReasons = [];
    if (!emergencyButtonsReleased) {
      blockingReasons.push('Emergency buttons not released');
    }
    if (!systemsNotAtRearLimits) {
      blockingReasons.push('Systems at rear limits');
    }
    
    return createErrorResponse('Cannot reset emergency stop', 400, {
      canReset: false,
      blockingReasons
    });
  }
  
  // Clear emergency_stop flag
  systemState.emergencyStop = false;
  systemState.emergencySource = [];
  
  // Clear DO6-S1 (alarm)
  systemState.alarmActive = false;
  
  // Set homing_done = false
  systemState.homingDone = false;
  
  // Set systems_initialized = false
  systemState.system1Initialized = false;
  systemState.system2Initialized = false;
  
  // Automatically trigger homing sequence
  // In a real system, this would call the homing endpoint
  
  const response = {
    success: true,
    message: 'Emergency reset completed successfully. Homing sequence will start automatically.',
    canReset: true,
    blockingReasons: []
  };
  
  return createResponse(response, 200, 'Emergency reset completed successfully');
});

import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { HomingRequest } from '@/lib/types';

// Mock system state
let systemState = {
  systemStatus: 'READY' as 'INITIALIZING' | 'HOMING' | 'READY' | 'RUNNING' | 'ERROR' | 'EMERGENCY_STOP',
  homingInProgress: false,
  emergencyStop: false,
  cycleRunning: false,
  homingDone: true,
  system1Initialized: true,
  system2Initialized: true,
  alarmActive: false
};

export const POST = withErrorHandling(async (request: NextRequest) => {
  const homingRequest = await validateRequestBody<HomingRequest>(request);
  
  // Check preconditions
  if (systemState.emergencyStop) {
    return createErrorResponse('Cannot start homing - emergency stop is active', 400);
  }
  
  if (systemState.homingInProgress) {
    return createErrorResponse('Cannot start homing - homing operation already in progress', 400);
  }
  
  if (systemState.cycleRunning) {
    return createErrorResponse('Cannot start homing - cycle is running', 400);
  }
  
  // Set state to HOMING
  systemState.systemStatus = 'HOMING';
  systemState.homingInProgress = true;
  
  // Disable DO7-S2 (welding machine) - in real system would write to I/O
  // await writeDO('DO7-S2', false);
  
  // Start parallel homing threads for S1 and S2 (simulated)
  const startTime = Date.now();
  
  // Simulate parallel homing with different completion times
  const system1Time = 3000 + Math.random() * 2000; // 3-5 seconds
  const system2Time = 2500 + Math.random() * 1500; // 2.5-4 seconds
  
  setTimeout(() => {
    // System1 homing complete
    systemState.system1Initialized = true;
  }, system1Time);
  
  setTimeout(() => {
    // System2 homing complete
    systemState.system2Initialized = true;
  }, system2Time);
  
  // Wait for both to complete (max 10s timeout)
  setTimeout(() => {
    if (systemState.system1Initialized && systemState.system2Initialized) {
      // Success: Set homing_done = true, Set DO7-S1 = 1 (READY light)
      systemState.homingDone = true;
      systemState.systemStatus = 'READY';
      systemState.homingInProgress = false;
      // await writeDO('DO7-S1', true);
    } else {
      // Failure: Set state to ERROR, Set DO6-S1 = 1 (ALARM)
      systemState.systemStatus = 'ERROR';
      systemState.alarmActive = true;
      systemState.homingInProgress = false;
      // await writeDO('DO6-S1', true);
    }
  }, Math.max(system1Time, system2Time));
  
  const response = {
    success: true,
    system1_time: system1Time,
    system2_time: system2Time,
    total_time: Math.max(system1Time, system2Time),
    errors: [] // Will be populated if homing fails
  };
  
  return createResponse(response, 200, 'Homing operation initiated successfully');
});

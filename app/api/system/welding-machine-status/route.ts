import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';
import { WeldingMachineStatus } from '@/lib/types';

// Mock system state for welding machine conditions
let systemState = {
  homingDone: true,
  emergencyStop: false,
  cycleRunning: false,
  alarmActive: false,
  systemsInitialized: true
};

// Mock I/O state
let ioState = {
  'DO6-S1': false,  // Alarm
  'DO7-S2': false   // Welding machine control
};

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Check all 5 conditions for enabling welding machine
  const conditions = {
    homingDone: systemState.homingDone,
    noEmergency: !systemState.emergencyStop,
    notRunning: !systemState.cycleRunning,
    noAlarm: !ioState['DO6-S1'],
    systemsReady: systemState.systemsInitialized
  };
  
  const blockingConditions = Object.entries(conditions)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  const weldingMachineStatus: WeldingMachineStatus = {
    enabled: ioState['DO7-S2'] && blockingConditions.length === 0,
    conditions,
    blockingConditions
  };
  
  return createResponse(weldingMachineStatus);
});

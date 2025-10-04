import { NextRequest } from 'next/server';
import { createResponse, withErrorHandling } from '@/lib/api-utils';
import { SystemStatus } from '@/lib/types';

// Mock system status data
const systemStatus: SystemStatus = {
  systemStatus: 'READY',
  system1State: 'ready',
  system2State: 'ready',
  homingDone: true,
  system1Initialized: true,
  system2Initialized: true,
  cycleRunning: false,
  emergencyStop: false,
  emergencySource: [],
  alarmActive: false,
  weldingMachineEnabled: true,
  visionSystemReady: true,
  databaseConnected: true,
  activeProductionRef: 'SB-A-001',
  currentCycleNumber: 1247
};

export const GET = withErrorHandling(async (request: NextRequest) => {
  // In a real system, this would fetch live data from the machines
  // For now, we'll return mock data with some randomization to simulate real conditions
  
  const now = new Date();
  const randomizedStatus: SystemStatus = {
    ...systemStatus,
    systemStatus: ['INITIALIZING', 'HOMING', 'READY', 'RUNNING', 'ERROR', 'EMERGENCY_STOP'][Math.floor(Math.random() * 6)] as any,
    system1State: ['ready', 'busy', 'error'][Math.floor(Math.random() * 3)],
    system2State: ['ready', 'busy', 'error'][Math.floor(Math.random() * 3)],
    cycleRunning: Math.random() > 0.7,
    currentCycleNumber: systemStatus.currentCycleNumber + Math.floor(Math.random() * 10),
    emergencyStop: Math.random() > 0.95, // 5% chance of emergency stop
    alarmActive: Math.random() > 0.9, // 10% chance of alarm
    weldingMachineEnabled: Math.random() > 0.2, // 80% chance enabled
    visionSystemReady: Math.random() > 0.1, // 90% chance ready
    databaseConnected: Math.random() > 0.05, // 95% chance connected
  };
  
  return createResponse(randomizedStatus);
});

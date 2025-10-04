import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { EmergencyConfig } from '@/lib/types';

// Mock data storage
let emergencyConfig: EmergencyConfig = {
  button_global: ['DI8-S1', 'DI8-S2'],
  rear_limit_s1: 'DI2-S1',
  rear_limit_s2: 'DI2-S2',
  polling_rate: 20,           // 10-50 Hz
  homing_timeout: 10,         // 5-20 s
  movement_timeout: 5,        // 2-10 s
};

export const GET = withErrorHandling(async (request: NextRequest) => {
  return createResponse(emergencyConfig);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const updates = await validateRequestBody<Partial<EmergencyConfig>>(request);
  
  // Validate polling_rate
  if (updates.polling_rate !== undefined && (updates.polling_rate < 10 || updates.polling_rate > 50)) {
    return createErrorResponse('polling_rate must be between 10-50 Hz', 400);
  }
  
  // Validate homing_timeout
  if (updates.homing_timeout !== undefined && (updates.homing_timeout < 5 || updates.homing_timeout > 20)) {
    return createErrorResponse('homing_timeout must be between 5-20 s', 400);
  }
  
  // Validate movement_timeout
  if (updates.movement_timeout !== undefined && (updates.movement_timeout < 2 || updates.movement_timeout > 10)) {
    return createErrorResponse('movement_timeout must be between 2-10 s', 400);
  }
  
  // Update the configuration
  emergencyConfig = {
    ...emergencyConfig,
    ...updates,
  };
  
  return createResponse(emergencyConfig, 200, 'Emergency configuration updated successfully');
});

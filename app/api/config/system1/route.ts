import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { System1Config } from '@/lib/types';

// Mock data storage
let system1Config: System1Config = {
  motor: 'Stepper Motor S1',
  steps_per_mm: 200,
  homing_speed: 200,         // 50-500 rpm
  homing_accel: 500,         // 100-1000 rpm/s
  cylinder_down_time: 0.8,   // 0.3-2.0 s
  cylinder_up_time: 0.6,     // 0.3-2.0 s
  gripper_close_time: 0.5,   // 0.2-1.0 s
  gripper_open_time: 0.3,    // 0.1-0.8 s
  transfer_distance: 250,    // 50-500 mm
  transfer_speed: 800,       // 100-1200 rpm
  transfer_accel: 1200,      // 200-2000 rpm/s
  return_speed: 1000,        // 100-1200 rpm
  return_accel: 1500,        // 200-2000 rpm/s
};

export const GET = withErrorHandling(async (request: NextRequest) => {
  return createResponse(system1Config);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const updates = await validateRequestBody<Partial<System1Config>>(request);
  
  // Validate numeric values within specified ranges
  if (updates.homing_speed !== undefined && (updates.homing_speed < 50 || updates.homing_speed > 500)) {
    return createErrorResponse('homing_speed must be between 50-500 rpm', 400);
  }
  
  if (updates.homing_accel !== undefined && (updates.homing_accel < 100 || updates.homing_accel > 1000)) {
    return createErrorResponse('homing_accel must be between 100-1000 rpm/s', 400);
  }
  
  if (updates.cylinder_down_time !== undefined && (updates.cylinder_down_time < 0.3 || updates.cylinder_down_time > 2.0)) {
    return createErrorResponse('cylinder_down_time must be between 0.3-2.0 s', 400);
  }
  
  if (updates.cylinder_up_time !== undefined && (updates.cylinder_up_time < 0.3 || updates.cylinder_up_time > 2.0)) {
    return createErrorResponse('cylinder_up_time must be between 0.3-2.0 s', 400);
  }
  
  if (updates.gripper_close_time !== undefined && (updates.gripper_close_time < 0.2 || updates.gripper_close_time > 1.0)) {
    return createErrorResponse('gripper_close_time must be between 0.2-1.0 s', 400);
  }
  
  if (updates.gripper_open_time !== undefined && (updates.gripper_open_time < 0.1 || updates.gripper_open_time > 0.8)) {
    return createErrorResponse('gripper_open_time must be between 0.1-0.8 s', 400);
  }
  
  if (updates.transfer_distance !== undefined && (updates.transfer_distance < 50 || updates.transfer_distance > 500)) {
    return createErrorResponse('transfer_distance must be between 50-500 mm', 400);
  }
  
  if (updates.transfer_speed !== undefined && (updates.transfer_speed < 100 || updates.transfer_speed > 1200)) {
    return createErrorResponse('transfer_speed must be between 100-1200 rpm', 400);
  }
  
  if (updates.transfer_accel !== undefined && (updates.transfer_accel < 200 || updates.transfer_accel > 2000)) {
    return createErrorResponse('transfer_accel must be between 200-2000 rpm/s', 400);
  }
  
  if (updates.return_speed !== undefined && (updates.return_speed < 100 || updates.return_speed > 1200)) {
    return createErrorResponse('return_speed must be between 100-1200 rpm', 400);
  }
  
  if (updates.return_accel !== undefined && (updates.return_accel < 200 || updates.return_accel > 2000)) {
    return createErrorResponse('return_accel must be between 200-2000 rpm/s', 400);
  }
  
  // Update the configuration
  system1Config = {
    ...system1Config,
    ...updates,
  };
  
  return createResponse(system1Config, 200, 'System1 configuration updated successfully');
});

import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { System2Config } from '@/lib/types';

// Mock data storage
let system2Config: System2Config = {
  motor: 'Stepper Motor S2',
  steps_per_mm: 200,
  homing_speed: 200,           // 50-500 rpm
  homing_accel: 500,           // 100-1000 rpm/s
  pickup_distance: 80,         // 20-200 mm
  pickup_speed: 400,           // 100-600 rpm
  pickup_accel: 800,           // 200-1000 rpm/s
  gripper_close_time: 0.5,     // 0.2-1.0 s
  gripper_open_time: 0.3,      // 0.1-0.8 s
  slow_start_position: 100,    // 50-150 mm
  slow_end_position: 150,      // 100-180 mm
  release_position: 200,       // 150-300 mm
  speed_slow: 150,             // 50-300 rpm
  speed_fast: 500,             // 300-800 rpm
  speed_feeding: null,         // Calculated from DB
  accel_slow_to_fast: 800,     // 200-1500 rpm/s
  accel_fast_to_slow: 1000,    // 200-1500 rpm/s
  return_speed: 1000,          // 100-1200 rpm
  return_accel: 1500,          // 200-2000 rpm/s
  release_delay: 0.5,          // 0.1-1.0 s
  post_release_delay: 0.3,     // 0.1-1.0 s
};

export const GET = withErrorHandling(async (request: NextRequest) => {
  return createResponse(system2Config);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const updates = await validateRequestBody<Partial<System2Config>>(request);
  
  // Validate all numeric values within ranges
  if (updates.homing_speed !== undefined && (updates.homing_speed < 50 || updates.homing_speed > 500)) {
    return createErrorResponse('homing_speed must be between 50-500 rpm', 400);
  }
  
  if (updates.homing_accel !== undefined && (updates.homing_accel < 100 || updates.homing_accel > 1000)) {
    return createErrorResponse('homing_accel must be between 100-1000 rpm/s', 400);
  }
  
  if (updates.pickup_distance !== undefined && (updates.pickup_distance < 20 || updates.pickup_distance > 200)) {
    return createErrorResponse('pickup_distance must be between 20-200 mm', 400);
  }
  
  if (updates.pickup_speed !== undefined && (updates.pickup_speed < 100 || updates.pickup_speed > 600)) {
    return createErrorResponse('pickup_speed must be between 100-600 rpm', 400);
  }
  
  if (updates.pickup_accel !== undefined && (updates.pickup_accel < 200 || updates.pickup_accel > 1000)) {
    return createErrorResponse('pickup_accel must be between 200-1000 rpm/s', 400);
  }
  
  if (updates.gripper_close_time !== undefined && (updates.gripper_close_time < 0.2 || updates.gripper_close_time > 1.0)) {
    return createErrorResponse('gripper_close_time must be between 0.2-1.0 s', 400);
  }
  
  if (updates.gripper_open_time !== undefined && (updates.gripper_open_time < 0.1 || updates.gripper_open_time > 0.8)) {
    return createErrorResponse('gripper_open_time must be between 0.1-0.8 s', 400);
  }
  
  if (updates.slow_start_position !== undefined && (updates.slow_start_position < 50 || updates.slow_start_position > 150)) {
    return createErrorResponse('slow_start_position must be between 50-150 mm', 400);
  }
  
  if (updates.slow_end_position !== undefined && (updates.slow_end_position < 100 || updates.slow_end_position > 180)) {
    return createErrorResponse('slow_end_position must be between 100-180 mm', 400);
  }
  
  if (updates.release_position !== undefined && (updates.release_position < 150 || updates.release_position > 300)) {
    return createErrorResponse('release_position must be between 150-300 mm', 400);
  }
  
  if (updates.speed_slow !== undefined && (updates.speed_slow < 50 || updates.speed_slow > 300)) {
    return createErrorResponse('speed_slow must be between 50-300 rpm', 400);
  }
  
  if (updates.speed_fast !== undefined && (updates.speed_fast < 300 || updates.speed_fast > 800)) {
    return createErrorResponse('speed_fast must be between 300-800 rpm', 400);
  }
  
  if (updates.accel_slow_to_fast !== undefined && (updates.accel_slow_to_fast < 200 || updates.accel_slow_to_fast > 1500)) {
    return createErrorResponse('accel_slow_to_fast must be between 200-1500 rpm/s', 400);
  }
  
  if (updates.accel_fast_to_slow !== undefined && (updates.accel_fast_to_slow < 200 || updates.accel_fast_to_slow > 1500)) {
    return createErrorResponse('accel_fast_to_slow must be between 200-1500 rpm/s', 400);
  }
  
  if (updates.return_speed !== undefined && (updates.return_speed < 100 || updates.return_speed > 1200)) {
    return createErrorResponse('return_speed must be between 100-1200 rpm', 400);
  }
  
  if (updates.return_accel !== undefined && (updates.return_accel < 200 || updates.return_accel > 2000)) {
    return createErrorResponse('return_accel must be between 200-2000 rpm/s', 400);
  }
  
  if (updates.release_delay !== undefined && (updates.release_delay < 0.1 || updates.release_delay > 1.0)) {
    return createErrorResponse('release_delay must be between 0.1-1.0 s', 400);
  }
  
  if (updates.post_release_delay !== undefined && (updates.post_release_delay < 0.1 || updates.post_release_delay > 1.0)) {
    return createErrorResponse('post_release_delay must be between 0.1-1.0 s', 400);
  }
  
  // Create temporary config to validate relationships
  const tempConfig = { ...system2Config, ...updates };
  
  // Validate position relationships
  if (tempConfig.slow_start_position >= tempConfig.slow_end_position) {
    return createErrorResponse('slow_start_position must be less than slow_end_position', 400);
  }
  
  if (tempConfig.slow_end_position >= tempConfig.release_position) {
    return createErrorResponse('slow_end_position must be less than release_position', 400);
  }
  
  if (tempConfig.pickup_distance >= tempConfig.slow_start_position) {
    return createErrorResponse('pickup_distance must be less than slow_start_position', 400);
  }
  
  if (tempConfig.speed_fast <= tempConfig.speed_slow) {
    return createErrorResponse('speed_fast must be greater than speed_slow', 400);
  }
  
  // speed_feeding cannot be written directly - it's calculated from active production reference
  if (updates.speed_feeding !== undefined) {
    return createErrorResponse('speed_feeding is calculated from active production reference and cannot be set directly', 400);
  }
  
  // Update the configuration
  system2Config = tempConfig;
  
  return createResponse(system2Config, 200, 'System2 configuration updated successfully');
});

import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { HandoverConfig } from '@/lib/types';

// Mock data storage
let handoverConfig: HandoverConfig = {
  delay_before_s2_close: 0.5,      // 0.0-2.0 s
  delay_s2_close_to_s1_open: 0.3,  // 0.0-2.0 s
  timeout_s2_ready: 3.0,           // 1.0-10.0 s
};

export const GET = withErrorHandling(async (request: NextRequest) => {
  return createResponse(handoverConfig);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const updates = await validateRequestBody<Partial<HandoverConfig>>(request);
  
  // Validate delay ranges
  if (updates.delay_before_s2_close !== undefined && (updates.delay_before_s2_close < 0.0 || updates.delay_before_s2_close > 2.0)) {
    return createErrorResponse('delay_before_s2_close must be between 0.0-2.0 s', 400);
  }
  
  if (updates.delay_s2_close_to_s1_open !== undefined && (updates.delay_s2_close_to_s1_open < 0.0 || updates.delay_s2_close_to_s1_open > 2.0)) {
    return createErrorResponse('delay_s2_close_to_s1_open must be between 0.0-2.0 s', 400);
  }
  
  if (updates.timeout_s2_ready !== undefined && (updates.timeout_s2_ready < 1.0 || updates.timeout_s2_ready > 10.0)) {
    return createErrorResponse('timeout_s2_ready must be between 1.0-10.0 s', 400);
  }
  
  // Update the configuration
  handoverConfig = {
    ...handoverConfig,
    ...updates,
  };
  
  return createResponse(handoverConfig, 200, 'Handover configuration updated successfully');
});

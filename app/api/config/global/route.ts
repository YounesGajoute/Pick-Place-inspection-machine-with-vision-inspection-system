import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { GlobalConfig } from '@/lib/types';

// Mock data storage (in a real application, this would be a database)
let globalConfig: GlobalConfig = {
  trigger_source: 'modbus',
  trigger_modbus_address: 1,
  trigger_modbus_register: 40001,
  trigger_rs232_port: 'COM1',
  trigger_rs232_baudrate: 9600,
  trigger_rs232_timeout: 5000,
};

export const GET = withErrorHandling(async (request: NextRequest) => {
  return createResponse(globalConfig);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const updates = await validateRequestBody<Partial<GlobalConfig>>(request);
  
  // Validate trigger_source
  if (updates.trigger_source && !['modbus', 'rs232'].includes(updates.trigger_source)) {
    return createErrorResponse('trigger_source must be modbus or rs232', 400);
  }
  
  // If modbus: address and register required
  if (updates.trigger_source === 'modbus') {
    if (updates.trigger_modbus_address === undefined || updates.trigger_modbus_register === undefined) {
      return createErrorResponse('trigger_modbus_address and trigger_modbus_register are required for modbus', 400);
    }
  }
  
  // If rs232: port, baudrate, timeout required
  if (updates.trigger_source === 'rs232') {
    if (updates.trigger_rs232_port === undefined || updates.trigger_rs232_baudrate === undefined || updates.trigger_rs232_timeout === undefined) {
      return createErrorResponse('trigger_rs232_port, trigger_rs232_baudrate, and trigger_rs232_timeout are required for rs232', 400);
    }
  }
  
  // Validate baudrate
  if (updates.trigger_rs232_baudrate && ![9600, 19200, 38400, 115200].includes(updates.trigger_rs232_baudrate)) {
    return createErrorResponse('trigger_rs232_baudrate must be one of: 9600, 19200, 38400, 115200', 400);
  }
  
  // Update the configuration
  globalConfig = {
    ...globalConfig,
    ...updates,
  };
  
  return createResponse(globalConfig, 200, 'Global configuration updated successfully');
});

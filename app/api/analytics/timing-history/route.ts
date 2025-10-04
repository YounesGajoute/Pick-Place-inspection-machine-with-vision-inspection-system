import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, parseQueryParams } from '@/lib/api-utils';
import { TimingHistory } from '@/lib/types';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = parseQueryParams(request);
  
  const period = searchParams.get('period') || '24h';
  const granularity = searchParams.get('granularity') || 'hour';
  const metric = searchParams.get('metric') || 'total_time';
  
  // Generate mock timing history data
  const now = new Date();
  const data = [];
  
  let points = 24; // Default to 24 hours
  let interval = 60 * 60 * 1000; // 1 hour in milliseconds
  
  if (period === '7d') {
    points = granularity === 'hour' ? 168 : 7;
    interval = granularity === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  } else if (period === '30d') {
    points = granularity === 'hour' ? 720 : granularity === 'day' ? 30 : 4;
    interval = granularity === 'hour' ? 60 * 60 * 1000 : granularity === 'day' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  }
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval);
    let value = 40 + Math.random() * 10; // Base value around 40-50
    let target = 40; // Target cycle time
    
    if (metric === 'yield') {
      value = 95 + Math.random() * 5; // Yield percentage
      target = 95;
    }
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value * 100) / 100,
      target: target,
    });
  }
  
  // Calculate statistics
  const values = data.map(d => d.value);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / values.length;
  const std_dev = Math.sqrt(variance);
  
  const mockTimingHistory: TimingHistory = {
    data,
    average: Math.round(average * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    std_dev: Math.round(std_dev * 100) / 100,
  };
  
  return createResponse(mockTimingHistory);
});
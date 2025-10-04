import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse } from './types';

// Helper function to create standardized API responses
export function createResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      data,
      message,
    },
    { status }
  );
}

export function createErrorResponse(
  error: string,
  status: number = 500,
  details?: any
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
    },
    { status }
  );
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);
  
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

// Helper function to parse query parameters
export function parseQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset, searchParams };
}

// Helper function to validate request body
export async function validateRequestBody<T>(
  request: NextRequest,
  validator?: (data: any) => T
): Promise<T> {
  try {
    const body = await request.json();
    
    if (validator) {
      return validator(body);
    }
    
    return body;
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

// Helper function to handle async route handlers with error catching
export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      const message = error instanceof Error ? error.message : 'Internal server error';
      return createErrorResponse(message, 500);
    }
  };
}

// Helper function to generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to format timestamps
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

// Mock data generators for development
export function generateMockProductionReference(overrides: any = {}) {
  return {
    id: generateId(),
    name: `Part ${Math.floor(Math.random() * 1000)}`,
    description: 'Sample production reference',
    partNumber: `PN-${Math.floor(Math.random() * 10000)}`,
    customer: 'Sample Customer',
    material: 'Steel',
    dimensions: {
      length: 100 + Math.random() * 50,
      width: 50 + Math.random() * 25,
      height: 25 + Math.random() * 15,
    },
    weight: 1 + Math.random() * 5,
    cycleTime: 30 + Math.random() * 60,
    qualitySpecs: {
      tolerance: 0.1,
      surfaceFinish: 'Ra 1.6',
      inspectionCriteria: ['dimensions', 'surface_quality', 'weld_integrity'],
    },
    isActive: false,
    createdAt: formatTimestamp(),
    updatedAt: formatTimestamp(),
    createdBy: 'system',
    ...overrides,
  };
}

export function generateMockCycleLog(overrides: any = {}) {
  return {
    id: generateId(),
    cycleNumber: Math.floor(Math.random() * 10000),
    startTime: formatTimestamp(new Date(Date.now() - Math.random() * 86400000)),
    endTime: formatTimestamp(),
    duration: 30 + Math.random() * 60,
    status: ['success', 'failure', 'aborted'][Math.floor(Math.random() * 3)] as any,
    productionReferenceId: generateId(),
    productionReferenceName: `Part ${Math.floor(Math.random() * 1000)}`,
    qualityScore: 70 + Math.random() * 30,
    defects: [],
    operator: 'operator1',
    ...overrides,
  };
}

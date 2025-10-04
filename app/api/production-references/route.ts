import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, createPaginatedResponse, withErrorHandling, validateRequestBody, parseQueryParams } from '@/lib/api-utils';
import { ProductionReference, CreateProductionReferenceRequest, PaginatedResponse } from '@/lib/types';

// Mock data storage
let productionReferences: ProductionReference[] = [
  {
    id: 1,
    ref_code: 'SB-A-001',
    description: 'Steel Bracket A',
    conveyor_speed_cs19: 10,  // mm/s
    feeding_duration: 1.0,    // Fixed at 1.0s
    welding_time: 2.5,
    tube_diameter: 25.0,
    tube_length: 100.0,
    wire_gauge: '1.0mm',
    active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    ref_code: 'AP-B-002',
    description: 'Aluminum Plate B',
    conveyor_speed_cs19: 8,   // mm/s
    feeding_duration: 1.0,    // Fixed at 1.0s
    welding_time: 3.0,
    tube_diameter: 30.0,
    tube_length: 120.0,
    wire_gauge: '1.2mm',
    active: false,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  },
];

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { page, limit, offset, searchParams } = parseQueryParams(request);
  
  // Filter by active status if specified
  const activeOnly = searchParams.get('active') === 'true';
  const search = searchParams.get('search');
  
  let filteredReferences = productionReferences.filter(ref => !ref.active); // Show only non-deleted
  
  if (activeOnly) {
    filteredReferences = filteredReferences.filter(ref => ref.active);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredReferences = filteredReferences.filter(ref => 
      ref.ref_code.toLowerCase().includes(searchLower) ||
      ref.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by ref_code
  filteredReferences.sort((a, b) => a.ref_code.localeCompare(b.ref_code));
  
  // Paginate
  const total = filteredReferences.length;
  const paginatedData = filteredReferences.slice(offset, offset + limit);
  
  return createPaginatedResponse(paginatedData, page, limit, total);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const newReference = await validateRequestBody<CreateProductionReferenceRequest>(request);
  
  // Validate required fields
  if (!newReference.ref_code?.trim()) {
    return createErrorResponse('ref_code is required', 400);
  }
  
  if (!newReference.conveyor_speed_cs19 || newReference.conveyor_speed_cs19 <= 0) {
    return createErrorResponse('conveyor_speed_cs19 must be positive', 400);
  }
  
  // Check if ref_code already exists
  const existingReference = productionReferences.find(ref => 
    ref.ref_code.toLowerCase() === newReference.ref_code.toLowerCase()
  );
  
  if (existingReference) {
    return createErrorResponse('ref_code already exists', 409);
  }
  
  // Create new reference
  const reference: ProductionReference = {
    id: Date.now(),
    ref_code: newReference.ref_code.trim(),
    description: newReference.description?.trim() || '',
    conveyor_speed_cs19: newReference.conveyor_speed_cs19,
    feeding_duration: newReference.feeding_duration || 1.0, // Always 1.0
    welding_time: newReference.welding_time || null,
    tube_diameter: newReference.tube_diameter || null,
    tube_length: newReference.tube_length || null,
    wire_gauge: newReference.wire_gauge || null,
    active: false, // New references are inactive by default
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  productionReferences.push(reference);
  
  return createResponse(reference, 201, 'Production reference created successfully');
});

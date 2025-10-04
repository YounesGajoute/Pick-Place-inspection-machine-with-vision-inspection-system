import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, withErrorHandling, validateRequestBody } from '@/lib/api-utils';
import { ProductionReference, UpdateProductionReferenceRequest } from '@/lib/types';

// Mock data storage (in a real app, this would be a database)
let productionReferences: ProductionReference[] = [
  {
    id: 1,
    ref_code: 'SB-A-001',
    description: 'Steel Bracket A',
    conveyor_speed_cs19: 10,
    feeding_duration: 1.0,
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
    conveyor_speed_cs19: 8,
    feeding_duration: 1.0,
    welding_time: 3.0,
    tube_diameter: 30.0,
    tube_length: 120.0,
    wire_gauge: '1.2mm',
    active: false,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  },
];

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    return createErrorResponse('Invalid ID', 400);
  }
  
  const reference = productionReferences.find(ref => ref.id === id);
  
  if (!reference) {
    return createResponse(null, 404, 'Production reference not found');
  }
  
  return createResponse(reference);
});

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  const updates = await validateRequestBody<UpdateProductionReferenceRequest>(request);
  
  if (isNaN(id)) {
    return createErrorResponse('Invalid ID', 400);
  }
  
  const referenceIndex = productionReferences.findIndex(ref => ref.id === id);
  
  if (referenceIndex === -1) {
    return createErrorResponse('Production reference not found', 404);
  }
  
  // Validate updates
  if (updates.ref_code !== undefined && !updates.ref_code.trim()) {
    return createErrorResponse('ref_code cannot be empty', 400);
  }
  
  // Check if ref_code already exists (excluding current reference)
  if (updates.ref_code) {
    const existingReference = productionReferences.find(ref => 
      ref.id !== id && ref.ref_code.toLowerCase() === updates.ref_code!.toLowerCase()
    );
    
    if (existingReference) {
      return createErrorResponse('ref_code already exists', 409);
    }
  }
  
  // Validate conveyor_speed_cs19 if provided
  if (updates.conveyor_speed_cs19 !== undefined && updates.conveyor_speed_cs19 <= 0) {
    return createErrorResponse('conveyor_speed_cs19 must be positive', 400);
  }
  
  // Update the reference
  productionReferences[referenceIndex] = {
    ...productionReferences[referenceIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  return createResponse(productionReferences[referenceIndex], 200, 'Production reference updated successfully');
});

export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    return createErrorResponse('Invalid ID', 400);
  }
  
  const referenceIndex = productionReferences.findIndex(ref => ref.id === id);
  
  if (referenceIndex === -1) {
    return createErrorResponse('Production reference not found', 404);
  }
  
  // Check if reference is currently active
  if (productionReferences[referenceIndex].active) {
    return createErrorResponse('Cannot delete active production reference', 409);
  }
  
  // Soft delete: Set active = false
  productionReferences[referenceIndex].active = false;
  productionReferences[referenceIndex].updated_at = new Date().toISOString();
  
  return createResponse({ success: true }, 200, 'Production reference deleted successfully');
});
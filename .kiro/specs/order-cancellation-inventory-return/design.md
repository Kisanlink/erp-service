# Order Cancellation Inventory Return System - Technical Design

## Overview

This document outlines the technical design for implementing order (sale) cancellation functionality with proper inventory return handling in the ERP API client.

## Scope

### In Scope
- Full order cancellation with inventory return
- Partial item cancellation
- Cancellation history tracking
- Type definitions for cancellation operations

### Out of Scope
- Backend service implementation (this is an API client)
- Database schema changes
- Discount reversal logic (handled by backend)
- Tax voiding logic (handled by backend)

## API Endpoints

### Full Order Cancellation
```
POST /api/v1/sales/{id}/cancel
```

Request Body:
```typescript
{
  reason?: string;
  cancelled_by?: string;
}
```

Response: Full `SaleResponse` with `status: 'cancelled'`

### Partial Item Cancellation
```
POST /api/v1/sales/{id}/cancel-items
```

Request Body:
```typescript
{
  items: Array<{
    item_id: string;
    quantity?: number; // If not provided, cancels entire item
    reason?: string;
  }>;
  reason?: string;
}
```

Response: `SaleCancellationResponse`

### Cancellation History
```
GET /api/v1/sales/{id}/cancellations
```

Query Parameters:
- `limit?: number`
- `offset?: number`

Response: `Array<SaleCancellationResponse>`

## Type Definitions

### SaleCancellation
```typescript
interface SaleCancellationResponse {
  id: string;
  sale_id: string;
  cancellation_type: 'full' | 'partial';
  reason?: string;
  cancelled_by: string;
  cancelled_at: string;
  items: SaleCancellationItemResponse[];
  inventory_returned: boolean;
  discount_reversed: boolean;
  tax_voided: boolean;
  refund_amount: number;
  created_at: string;
}
```

### SaleCancellationItem
```typescript
interface SaleCancellationItemResponse {
  id: string;
  cancellation_id: string;
  sale_item_id: string;
  batch_id: string;
  quantity_cancelled: number;
  refund_amount: number;
  inventory_transaction_id?: string;
  created_at: string;
}
```

### Request Types
```typescript
interface CancelSaleRequest {
  reason?: string;
  cancelled_by?: string;
}

interface CancelSaleItemsRequest {
  items: CancelSaleItemRequest[];
  reason?: string;
}

interface CancelSaleItemRequest {
  item_id: string;
  quantity?: number;
  reason?: string;
}
```

## Service Methods

### Enhanced Cancel Method
The existing `cancel` method signature remains unchanged but the backend will now:
1. Mark sale as cancelled
2. Return inventory to original batches
3. Reverse discount usage
4. Void tax records

### New Methods

#### cancelItems
```typescript
cancelItems: (saleId: string, payload: CancelSaleItemsRequest) =>
  apiClient.post<ApiResponse<SaleCancellationResponse>>(
    `/api/v1/sales/${saleId}/cancel-items`,
    payload
  )
```

#### getCancellations
```typescript
getCancellations: (saleId: string, params?: PaginationParams) =>
  apiClient.get<ApiResponse<SaleCancellationResponse[]>>(
    `/api/v1/sales/${saleId}/cancellations`,
    { params }
  )
```

## Cancellation Rules

| Current Status | Can Cancel? | Notes |
|----------------|-------------|-------|
| pending | Yes | Full/partial allowed |
| confirmed | Yes | Full/partial allowed |
| processing | Yes | With conditions |
| shipped | No | Use Returns instead |
| delivered | No | Use Returns instead |
| cancelled | No | Already cancelled |

## Error Handling

The API client will propagate errors from the backend:
- `ValidationError` (400) - Invalid cancellation request
- `NotFoundError` (404) - Sale or item not found
- `ConflictError` (409) - Sale cannot be cancelled (wrong status)
- `ServerError` (500) - Backend processing error

## Integration with Existing Services

### Inventory Service
The backend will create `cancellation_return` transactions. The API client can query these via:
```typescript
inventoryService.transactions.list({
  transaction_type: 'cancellation_return',
  reference_id: saleId
});
```

### Discount Service
Discount usage can be verified via:
```typescript
discountService.getUsageBySale(saleId);
```

## Security Considerations

- Cancellation operations require proper authentication
- Audit trail maintained by backend
- User ID captured for all cancellation actions

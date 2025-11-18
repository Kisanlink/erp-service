# ERP API Client Service Modules

## Overview

This document specifies all service modules for the ERP API client, detailing each service's methods, parameters, and return types. Each service follows the functional factory pattern established in the auth-service.

## Service Factory Pattern

Each service follows this standard pattern:

```typescript
import { ApiClient } from '../utils/apiClient';
import { RequestType, ResponseType } from '../types';

const createServiceName = (apiClient: ApiClient) => {
  return {
    methodName: (params: ParamType) =>
      apiClient.method<ResponseType>(endpoint, params)
  };
};

export default createServiceName;
```

## 1. Attachment Service

**File:** `services/attachmentService.ts`

```typescript
const createAttachmentService = (apiClient: ApiClient) => {
  return {
    // List attachments with filters
    list: (params?: {
      entity_type?: string;
      entity_id?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<AttachmentResponse[]>>('/api/v1/attachments', { params }),

    // Get attachment by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<AttachmentResponse>>(`/api/v1/attachments/${id}`),

    // Get attachments by entity
    getByEntity: (entityType: string, entityId: string) =>
      apiClient.get<ApiResponse<AttachmentResponse[]>>(
        `/api/v1/attachments/entity/${entityType}/${entityId}`
      ),

    // Upload attachment
    upload: (file: File, entityType: string, entityId: string) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId);
      return apiClient.post<ApiResponse<AttachmentResponse>>(
        '/api/v1/attachments',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    },

    // Get attachment info
    getInfo: (id: string) =>
      apiClient.get<ApiResponse<AttachmentInfoResponse>>(`/api/v1/attachments/${id}/info`),

    // Get download URL
    getDownloadUrl: (id: string) =>
      apiClient.get<ApiResponse<{ url: string }>>(`/api/v1/attachments/${id}/url`),

    // Download attachment
    download: (id: string) =>
      apiClient.get<Blob>(`/api/v1/attachments/${id}/download`, {
        headers: { 'Accept': 'application/octet-stream' }
      }),

    // Delete attachment
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/attachments/${id}`)
  };
};
```

## 2. Bank Payment Service

**File:** `services/bankPaymentService.ts`

```typescript
const createBankPaymentService = (apiClient: ApiClient) => {
  return {
    // List bank payments
    list: (params?: {
      sale_id?: string;
      return_id?: string;
      payment_method?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<BankPaymentResponse[]>>('/api/v1/bank-payments', { params }),

    // Get payment by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<BankPaymentResponse>>(`/api/v1/bank-payments/${id}`),

    // Get payments for sale
    getBySale: (saleId: string) =>
      apiClient.get<ApiResponse<BankPaymentResponse[]>>(`/api/v1/bank-payments/sale/${saleId}`),

    // Get payments for return
    getByReturn: (returnId: string) =>
      apiClient.get<ApiResponse<BankPaymentResponse[]>>(`/api/v1/bank-payments/return/${returnId}`),

    // Create payment
    create: (payload: CreateBankPaymentRequest) =>
      apiClient.post<ApiResponse<BankPaymentResponse>>('/api/v1/bank-payments', payload),

    // Update payment
    update: (id: string, payload: Partial<CreateBankPaymentRequest>) =>
      apiClient.put<ApiResponse<BankPaymentResponse>>(`/api/v1/bank-payments/${id}`, payload),

    // Delete payment
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/bank-payments/${id}`)
  };
};
```

## 3. Collaborator Service

**File:** `services/collaboratorService.ts`

```typescript
const createCollaboratorService = (apiClient: ApiClient) => {
  return {
    // List collaborators
    list: (params?: {
      search?: string;
      is_active?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<CollaboratorResponse[]>>('/api/v1/collaborators', { params }),

    // Get active collaborators
    getActive: () =>
      apiClient.get<ApiResponse<CollaboratorResponse[]>>('/api/v1/collaborators/active'),

    // Search collaborators
    search: (query: string) =>
      apiClient.get<ApiResponse<CollaboratorResponse[]>>('/api/v1/collaborators/search', {
        params: { q: query }
      }),

    // Get collaborator by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<CollaboratorResponse>>(`/api/v1/collaborators/${id}`),

    // Create collaborator
    create: (payload: CreateCollaboratorRequest) =>
      apiClient.post<ApiResponse<CollaboratorResponse>>('/api/v1/collaborators', payload),

    // Update collaborator
    update: (id: string, payload: UpdateCollaboratorRequest) =>
      apiClient.put<ApiResponse<CollaboratorResponse>>(`/api/v1/collaborators/${id}`, payload),

    // Delete collaborator
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/collaborators/${id}`),

    // Collaborator products management
    products: {
      // List products for collaborator
      list: (collaboratorId: string) =>
        apiClient.get<ApiResponse<CollaboratorProductResponse[]>>(
          `/api/v1/collaborators/${collaboratorId}/products`
        ),

      // Get specific product
      get: (collaboratorId: string, productId: string) =>
        apiClient.get<ApiResponse<CollaboratorProductResponse>>(
          `/api/v1/collaborators/${collaboratorId}/products/${productId}`
        ),

      // Add product to collaborator
      add: (collaboratorId: string, payload: CreateCollaboratorProductRequest) =>
        apiClient.post<ApiResponse<CollaboratorProductResponse>>(
          `/api/v1/collaborators/${collaboratorId}/products`,
          payload
        ),

      // Update collaborator product
      update: (id: string, payload: UpdateCollaboratorProductRequest) =>
        apiClient.put<ApiResponse<CollaboratorProductResponse>>(
          `/api/v1/collaborator-products/${id}`,
          payload
        ),

      // Remove product from collaborator
      remove: (collaboratorId: string, productId: string) =>
        apiClient.delete<ApiResponse<void>>(
          `/api/v1/collaborators/${collaboratorId}/products/${productId}`
        )
    },

    // Get purchase orders for collaborator
    getPurchaseOrders: (id: string, params?: {
      status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<PurchaseOrderResponse[]>>(
      `/api/v1/collaborators/${id}/purchase-orders`,
      { params }
    )
  };
};
```

## 4. Discount Service

**File:** `services/discountService.ts`

```typescript
const createDiscountService = (apiClient: ApiClient) => {
  return {
    // List discounts
    list: (params?: {
      is_active?: boolean;
      discount_type?: DiscountType;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<DiscountResponse[]>>('/api/v1/discounts', { params }),

    // Get active discounts
    getActive: () =>
      apiClient.get<ApiResponse<DiscountResponse[]>>('/api/v1/discounts/active'),

    // Get applicable discounts
    getApplicable: (params: {
      order_value: number;
      products?: Array<{ product_id: string; quantity: number; price: number }>;
    }) => apiClient.post<ApiResponse<DiscountResponse[]>>('/api/v1/discounts/applicable', params),

    // Calculate optimal discount
    calculateOptimal: (params: {
      order_value: number;
      products: Array<{ product_id: string; quantity: number; price: number }>;
      available_codes?: string[];
    }) => apiClient.post<ApiResponse<{
      optimal_code: string;
      discount_amount: number;
      final_amount: number;
    }>>('/api/v1/discounts/calculate-optimal', params),

    // Get discounts by status
    getByStatus: (status: 'active' | 'expired' | 'upcoming') =>
      apiClient.get<ApiResponse<DiscountResponse[]>>(`/api/v1/discounts/status/${status}`),

    // Get discounts by type
    getByType: (type: DiscountType) =>
      apiClient.get<ApiResponse<DiscountResponse[]>>(`/api/v1/discounts/type/${type}`),

    // Get discount usage for sale
    getUsageBySale: (saleId: string) =>
      apiClient.get<ApiResponse<DiscountUsageResponse[]>>(`/api/v1/discounts/usage/sale/${saleId}`),

    // Get discount by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<DiscountResponse>>(`/api/v1/discounts/${id}`),

    // Get discount by code
    getByCode: (code: string) =>
      apiClient.get<ApiResponse<DiscountResponse>>(`/api/v1/discounts/code/${code}`),

    // Validate discount
    validate: (payload: ValidateDiscountRequest) =>
      apiClient.post<ApiResponse<DiscountValidationResponse>>('/api/v1/discounts/validate', payload),

    // Create discount
    create: (payload: CreateDiscountRequest) =>
      apiClient.post<ApiResponse<DiscountResponse>>('/api/v1/discounts', payload),

    // Update discount
    update: (id: string, payload: UpdateDiscountRequest) =>
      apiClient.put<ApiResponse<DiscountResponse>>(`/api/v1/discounts/${id}`, payload),

    // Delete discount
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/discounts/${id}`),

    // Get usage statistics
    getUsageStats: (id: string) =>
      apiClient.get<ApiResponse<{
        total_uses: number;
        total_discount_given: number;
        average_order_value: number;
        top_customers: Array<{ customer_id: string; uses: number; total_saved: number }>;
      }>>(`/api/v1/discounts/${id}/stats`)
  };
};
```

## 5. GRN Service

**File:** `services/grnService.ts`

```typescript
const createGRNService = (apiClient: ApiClient) => {
  return {
    // List GRNs
    list: (params?: {
      purchase_order_id?: string;
      status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<GRNResponse[]>>('/api/v1/grns', { params }),

    // Get GRN by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}`),

    // Get GRNs by purchase order
    getByPurchaseOrder: (poId: string) =>
      apiClient.get<ApiResponse<GRNResponse[]>>(`/api/v1/grns/purchase-order/${poId}`),

    // Create GRN
    create: (payload: CreateGRNRequest) =>
      apiClient.post<ApiResponse<GRNResponse>>('/api/v1/grns', payload),

    // Update GRN
    update: (id: string, payload: UpdateGRNRequest) =>
      apiClient.put<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}`, payload),

    // Add items to GRN
    addItems: (id: string, items: CreateGRNItemRequest[]) =>
      apiClient.post<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}/items`, { items }),

    // Update GRN item
    updateItem: (grnId: string, itemId: string, payload: Partial<CreateGRNItemRequest>) =>
      apiClient.put<ApiResponse<GRNItemResponse>>(`/api/v1/grns/${grnId}/items/${itemId}`, payload),

    // Remove item from GRN
    removeItem: (grnId: string, itemId: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/grns/${grnId}/items/${itemId}`),

    // Confirm GRN receipt
    confirm: (id: string) =>
      apiClient.post<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}/confirm`, {}),

    // Cancel GRN
    cancel: (id: string, reason?: string) =>
      apiClient.post<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}/cancel`, { reason }),

    // Delete GRN
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/grns/${id}`)
  };
};
```

## 6. Inventory Service

**File:** `services/inventoryService.ts`

```typescript
const createInventoryService = (apiClient: ApiClient) => {
  return {
    // Batch management
    batches: {
      // List batches
      list: (params?: {
        product_id?: string;
        warehouse_id?: string;
        expiring_in_days?: number;
        low_stock?: boolean;
        limit?: number;
        offset?: number;
      }) => apiClient.get<ApiResponse<InventoryBatchResponse[]>>('/api/v1/batches', { params }),

      // Get batch by ID
      get: (id: string) =>
        apiClient.get<ApiResponse<InventoryBatchResponse>>(`/api/v1/batches/${id}`),

      // Get expiring batches
      getExpiring: (days: number = 30) =>
        apiClient.get<ApiResponse<InventoryBatchResponse[]>>('/api/v1/batches/expiring', {
          params: { days }
        }),

      // Get low stock batches
      getLowStock: () =>
        apiClient.get<ApiResponse<InventoryBatchResponse[]>>('/api/v1/batches/low-stock'),

      // Create batch
      create: (payload: CreateInventoryBatchRequest) =>
        apiClient.post<ApiResponse<InventoryBatchResponse>>('/api/v1/batches', payload),

      // Update batch
      update: (id: string, payload: Partial<CreateInventoryBatchRequest>) =>
        apiClient.put<ApiResponse<InventoryBatchResponse>>(`/api/v1/batches/${id}`, payload),

      // Get batch transactions
      getTransactions: (id: string, params?: {
        transaction_type?: string;
        from_date?: string;
        to_date?: string;
        limit?: number;
        offset?: number;
      }) => apiClient.get<ApiResponse<InventoryTransactionResponse[]>>(
        `/api/v1/batches/${id}/transactions`,
        { params }
      ),

      // Delete batch
      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/batches/${id}`)
    },

    // Transaction management
    transactions: {
      // List transactions
      list: (params?: {
        batch_id?: string;
        transaction_type?: string;
        reference_type?: string;
        reference_id?: string;
        from_date?: string;
        to_date?: string;
        limit?: number;
        offset?: number;
      }) => apiClient.get<ApiResponse<InventoryTransactionResponse[]>>('/api/v1/inventory/transactions', { params }),

      // Create transaction
      create: (payload: CreateInventoryTransactionRequest) =>
        apiClient.post<ApiResponse<InventoryTransactionResponse>>('/api/v1/inventory/transactions', payload),

      // Get transaction by ID
      get: (id: string) =>
        apiClient.get<ApiResponse<InventoryTransactionResponse>>(`/api/v1/inventory/transactions/${id}`)
    },

    // Stock management
    stock: {
      // Check product availability
      checkAvailability: (productId: string, variantId?: string) =>
        apiClient.get<ApiResponse<ProductAvailabilityResponse>>('/api/v1/inventory/availability', {
          params: { product_id: productId, variant_id: variantId }
        }),

      // Reserve stock
      reserve: (payload: {
        product_id: string;
        variant_id?: string;
        batch_id?: string;
        quantity: number;
        reference_type: string;
        reference_id: string;
      }) => apiClient.post<ApiResponse<{ reservation_id: string }>>('/api/v1/inventory/reserve', payload),

      // Release reserved stock
      release: (reservationId: string) =>
        apiClient.post<ApiResponse<void>>(`/api/v1/inventory/reservations/${reservationId}/release`, {}),

      // Transfer stock between warehouses
      transfer: (payload: {
        from_warehouse_id: string;
        to_warehouse_id: string;
        batch_id: string;
        quantity: number;
        notes?: string;
      }) => apiClient.post<ApiResponse<InventoryTransactionResponse>>('/api/v1/inventory/transfer', payload),

      // Adjust stock
      adjust: (payload: {
        batch_id: string;
        adjustment_type: 'ADD' | 'REMOVE' | 'SET';
        quantity: number;
        reason: string;
        notes?: string;
      }) => apiClient.post<ApiResponse<InventoryTransactionResponse>>('/api/v1/inventory/adjust', payload)
    },

    // Analytics
    analytics: {
      // Get inventory metrics
      getMetrics: () =>
        apiClient.get<ApiResponse<InventoryMetrics>>('/api/v1/inventory/metrics'),

      // Get stock valuation
      getValuation: (warehouseId?: string) =>
        apiClient.get<ApiResponse<{
          total_value: number;
          by_category: Array<{ category: string; value: number }>;
          by_warehouse: Array<{ warehouse_id: string; warehouse_name: string; value: number }>;
        }>>('/api/v1/inventory/valuation', {
          params: { warehouse_id: warehouseId }
        }),

      // Get turnover report
      getTurnover: (params: {
        from_date: string;
        to_date: string;
        product_id?: string;
        category?: string;
      }) => apiClient.get<ApiResponse<{
        turnover_ratio: number;
        average_days_in_stock: number;
        products: Array<{
          product_id: string;
          product_name: string;
          turnover_ratio: number;
          days_in_stock: number;
        }>;
      }>>('/api/v1/inventory/turnover', { params })
    }
  };
};
```

## 7. Product Service

**File:** `services/productService.ts`

```typescript
const createProductService = (apiClient: ApiClient) => {
  return {
    // Product management
    list: (params?: {
      search?: string;
      category?: string;
      is_active?: boolean;
      is_perishable?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<ProductResponse[]>>('/api/v1/products', { params }),

    get: (id: string) =>
      apiClient.get<ApiResponse<ProductResponse>>(`/api/v1/products/${id}`),

    getWithPrices: (id: string) =>
      apiClient.get<ApiResponse<ProductWithPricesResponse>>(`/api/v1/products/${id}/detailed`),

    create: (payload: CreateProductRequest) =>
      apiClient.post<ApiResponse<ProductResponse>>('/api/v1/products', payload),

    update: (id: string, payload: UpdateProductRequest) =>
      apiClient.put<ApiResponse<ProductResponse>>(`/api/v1/products/${id}`, payload),

    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/products/${id}`),

    // Bulk operations
    bulkCreate: (products: CreateProductRequest[]) =>
      apiClient.post<ApiResponse<BulkOperationResponse>>('/api/v1/products/bulk', { products }),

    bulkUpdate: (updates: Array<{ id: string } & UpdateProductRequest>) =>
      apiClient.put<ApiResponse<BulkOperationResponse>>('/api/v1/products/bulk', { updates }),

    // Variant management
    variants: {
      list: (productId: string) =>
        apiClient.get<ApiResponse<ProductVariantResponse[]>>(`/api/v1/products/${productId}/variants`),

      get: (productId: string, variantId: string) =>
        apiClient.get<ApiResponse<ProductVariantResponse>>(`/api/v1/products/${productId}/variants/${variantId}`),

      create: (payload: CreateProductVariantRequest) =>
        apiClient.post<ApiResponse<ProductVariantResponse>>('/api/v1/product-variants', payload),

      update: (id: string, payload: UpdateProductVariantRequest) =>
        apiClient.put<ApiResponse<ProductVariantResponse>>(`/api/v1/product-variants/${id}`, payload),

      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/product-variants/${id}`)
    },

    // Price management
    prices: {
      list: (productId: string) =>
        apiClient.get<ApiResponse<ProductPriceResponse[]>>(`/api/v1/products/${productId}/prices`),

      getActive: (productId: string, priceType?: 'PURCHASE' | 'SALE' | 'MRP') =>
        apiClient.get<ApiResponse<ProductPriceResponse>>(`/api/v1/products/${productId}/prices/active`, {
          params: { price_type: priceType }
        }),

      create: (payload: CreateProductPriceRequest) =>
        apiClient.post<ApiResponse<ProductPriceResponse>>('/api/v1/product-prices', payload),

      update: (id: string, payload: UpdateProductPriceRequest) =>
        apiClient.put<ApiResponse<ProductPriceResponse>>(`/api/v1/product-prices/${id}`, payload),

      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/product-prices/${id}`),

      // Bulk price update
      bulkUpdate: (updates: Array<{ product_id: string; variant_id?: string; price_type: string; price: number }>) =>
        apiClient.post<ApiResponse<BulkOperationResponse>>('/api/v1/product-prices/bulk-update', { updates })
    },

    // Search and filter
    search: (query: string, params?: {
      category?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<ProductResponse[]>>('/api/v1/products/search', {
      params: { q: query, ...params }
    }),

    getByCategory: (category: string) =>
      apiClient.get<ApiResponse<ProductResponse[]>>(`/api/v1/products/category/${category}`),

    getByBarcode: (barcode: string) =>
      apiClient.get<ApiResponse<ProductResponse>>(`/api/v1/products/barcode/${barcode}`),

    // Analytics
    getTopSelling: (params?: {
      from_date?: string;
      to_date?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<TopSellingProductResponse[]>>('/api/v1/products/top-selling', { params }),

    getSlowMoving: (days: number = 90) =>
      apiClient.get<ApiResponse<ProductResponse[]>>('/api/v1/products/slow-moving', {
        params: { days }
      })
  };
};
```

## 8. Purchase Order Service

**File:** `services/purchaseOrderService.ts`

```typescript
const createPurchaseOrderService = (apiClient: ApiClient) => {
  return {
    // List purchase orders
    list: (params?: {
      collaborator_id?: string;
      status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<PurchaseOrderResponse[]>>('/api/v1/purchase-orders', { params }),

    // Get purchase order by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}`),

    // Get by PO number
    getByNumber: (poNumber: string) =>
      apiClient.get<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/number/${poNumber}`),

    // Create purchase order
    create: (payload: CreatePurchaseOrderRequest) =>
      apiClient.post<ApiResponse<PurchaseOrderResponse>>('/api/v1/purchase-orders', payload),

    // Update purchase order
    update: (id: string, payload: Partial<CreatePurchaseOrderRequest>) =>
      apiClient.put<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}`, payload),

    // Update status
    updateStatus: (id: string, payload: UpdatePOStatusRequest) =>
      apiClient.patch<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/status`, payload),

    // Update payment
    updatePayment: (id: string, payload: UpdatePOPaymentRequest) =>
      apiClient.patch<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/payment`, payload),

    // Send to supplier
    send: (id: string) =>
      apiClient.post<ApiResponse<{ sent: boolean; message: string }>>(`/api/v1/purchase-orders/${id}/send`, {}),

    // Confirm order
    confirm: (id: string) =>
      apiClient.post<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/confirm`, {}),

    // Cancel order
    cancel: (id: string, reason?: string) =>
      apiClient.post<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/cancel`, { reason }),

    // Delete purchase order
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/purchase-orders/${id}`),

    // Items management
    items: {
      add: (poId: string, items: CreatePurchaseOrderItemRequest[]) =>
        apiClient.post<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${poId}/items`, { items }),

      update: (poId: string, itemId: string, payload: Partial<CreatePurchaseOrderItemRequest>) =>
        apiClient.put<ApiResponse<PurchaseOrderItemResponse>>(`/api/v1/purchase-orders/${poId}/items/${itemId}`, payload),

      remove: (poId: string, itemId: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/purchase-orders/${poId}/items/${itemId}`)
    },

    // Generate PO PDF
    generatePDF: (id: string) =>
      apiClient.get<Blob>(`/api/v1/purchase-orders/${id}/pdf`, {
        headers: { 'Accept': 'application/pdf' }
      }),

    // Analytics
    getStatistics: (params?: {
      collaborator_id?: string;
      from_date?: string;
      to_date?: string;
    }) => apiClient.get<ApiResponse<{
      total_orders: number;
      total_value: number;
      average_order_value: number;
      pending_orders: number;
      pending_value: number;
      by_status: Array<{ status: string; count: number; value: number }>;
    }>>('/api/v1/purchase-orders/statistics', { params })
  };
};
```

## 9. Return Service

**File:** `services/returnService.ts`

```typescript
const createReturnService = (apiClient: ApiClient) => {
  return {
    // List returns
    list: (params?: {
      return_type?: 'CUSTOMER' | 'SUPPLIER';
      status?: string;
      sale_id?: string;
      purchase_order_id?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<ReturnResponse[]>>('/api/v1/returns', { params }),

    // Get return by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}`),

    // Get by return number
    getByNumber: (returnNumber: string) =>
      apiClient.get<ApiResponse<ReturnResponse>>(`/api/v1/returns/number/${returnNumber}`),

    // Create return
    create: (payload: CreateReturnRequest) =>
      apiClient.post<ApiResponse<ReturnResponse>>('/api/v1/returns', payload),

    // Update return
    update: (id: string, payload: UpdateReturnRequest) =>
      apiClient.put<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}`, payload),

    // Update status
    updateStatus: (id: string, payload: UpdateReturnStatusRequest) =>
      apiClient.patch<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/status`, payload),

    // Approve return
    approve: (id: string, notes?: string) =>
      apiClient.post<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/approve`, { notes }),

    // Reject return
    reject: (id: string, reason: string) =>
      apiClient.post<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/reject`, { reason }),

    // Process return
    process: (id: string) =>
      apiClient.post<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/process`, {}),

    // Issue refund
    refund: (id: string, payload: {
      refund_amount: number;
      refund_method: string;
      notes?: string;
    }) => apiClient.post<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/refund`, payload),

    // Delete return
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/returns/${id}`),

    // Refund policies
    refundPolicies: {
      list: (params?: { is_active?: boolean }) =>
        apiClient.get<ApiResponse<RefundPolicyResponse[]>>('/api/v1/refund-policies', { params }),

      get: (id: string) =>
        apiClient.get<ApiResponse<RefundPolicyResponse>>(`/api/v1/refund-policies/${id}`),

      create: (payload: CreateRefundPolicyRequest) =>
        apiClient.post<ApiResponse<RefundPolicyResponse>>('/api/v1/refund-policies', payload),

      update: (id: string, payload: UpdateRefundPolicyRequest) =>
        apiClient.put<ApiResponse<RefundPolicyResponse>>(`/api/v1/refund-policies/${id}`, payload),

      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/refund-policies/${id}`)
    },

    // Analytics
    getMostReturned: (params?: {
      from_date?: string;
      to_date?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<MostReturnedProductResponse[]>>('/api/v1/returns/analytics/most-returned', { params }),

    getMetrics: (params?: {
      from_date?: string;
      to_date?: string;
    }) => apiClient.get<ApiResponse<ReturnMetrics>>('/api/v1/returns/metrics', { params })
  };
};
```

## 10. Sales Service

**File:** `services/salesService.ts`

```typescript
const createSalesService = (apiClient: ApiClient) => {
  return {
    // List sales
    list: (params?: {
      customer_id?: string;
      status?: string;
      payment_status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<SaleResponse[]>>('/api/v1/sales', { params }),

    // Get sale by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}`),

    // Get by sale number
    getByNumber: (saleNumber: string) =>
      apiClient.get<ApiResponse<SaleResponse>>(`/api/v1/sales/number/${saleNumber}`),

    // Create sale
    create: (payload: CreateSaleRequest) =>
      apiClient.post<ApiResponse<SaleResponse>>('/api/v1/sales', payload),

    // Update sale
    update: (id: string, payload: UpdateSaleRequest) =>
      apiClient.put<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}`, payload),

    // Update status
    updateStatus: (id: string, payload: UpdateSaleStatusRequest) =>
      apiClient.patch<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/status`, payload),

    // Confirm sale
    confirm: (id: string) =>
      apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/confirm`, {}),

    // Ship sale
    ship: (id: string, payload: {
      tracking_number?: string;
      carrier?: string;
      estimated_delivery?: string;
    }) => apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/ship`, payload),

    // Deliver sale
    deliver: (id: string, payload: {
      delivered_items: Array<{
        product_id: string;
        variant_id?: string;
        delivered_quantity: number;
      }>;
      delivery_notes?: string;
    }) => apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/deliver`, payload),

    // Cancel sale
    cancel: (id: string, reason?: string) =>
      apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/cancel`, { reason }),

    // Delete sale
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/sales/${id}`),

    // Items management
    items: {
      add: (saleId: string, items: CreateSaleItemRequest[]) =>
        apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${saleId}/items`, { items }),

      update: (saleId: string, itemId: string, payload: Partial<CreateSaleItemRequest>) =>
        apiClient.put<ApiResponse<SaleItemResponse>>(`/api/v1/sales/${saleId}/items/${itemId}`, payload),

      remove: (saleId: string, itemId: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/sales/${saleId}/items/${itemId}`)
    },

    // Payment management
    recordPayment: (id: string, payload: {
      amount: number;
      payment_method: string;
      reference?: string;
      notes?: string;
    }) => apiClient.post<ApiResponse<BankPaymentResponse>>(`/api/v1/sales/${id}/payment`, payload),

    // Invoice generation
    generateInvoice: (id: string) =>
      apiClient.get<Blob>(`/api/v1/sales/${id}/invoice`, {
        headers: { 'Accept': 'application/pdf' }
      }),

    // Analytics
    getMetrics: (params?: {
      from_date?: string;
      to_date?: string;
    }) => apiClient.get<ApiResponse<SalesMetrics>>('/api/v1/sales/metrics', { params }),

    getDashboard: () =>
      apiClient.get<ApiResponse<DashboardMetrics>>('/api/v1/sales/dashboard'),

    getTopCustomers: (params?: {
      from_date?: string;
      to_date?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<Array<{
      customer_id: string;
      customer_name: string;
      total_orders: number;
      total_value: number;
    }>>>('/api/v1/sales/top-customers', { params })
  };
};
```

## 11. Tax Service

**File:** `services/taxService.ts`

```typescript
const createTaxService = (apiClient: ApiClient) => {
  return {
    // List taxes
    list: (params?: {
      tax_type?: TaxType;
      is_active?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<TaxResponse[]>>('/api/v1/taxes', { params }),

    // Get tax by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<TaxResponse>>(`/api/v1/taxes/${id}`),

    // Get by tax code
    getByCode: (code: string) =>
      apiClient.get<ApiResponse<TaxResponse>>(`/api/v1/taxes/code/${code}`),

    // Get applicable taxes
    getApplicable: (params: {
      product_id?: string;
      hsn_code?: string;
      transaction_type: 'SALE' | 'PURCHASE';
    }) => apiClient.get<ApiResponse<TaxApplicationResponse>>('/api/v1/taxes/applicable', { params }),

    // Calculate taxes
    calculate: (payload: TaxCalculationRequest) =>
      apiClient.post<ApiResponse<TaxCalculationResponse>>('/api/v1/taxes/calculate', payload),

    // Create tax
    create: (payload: CreateTaxRequest) =>
      apiClient.post<ApiResponse<TaxResponse>>('/api/v1/taxes', payload),

    // Update tax
    update: (id: string, payload: UpdateTaxRequest) =>
      apiClient.put<ApiResponse<TaxResponse>>(`/api/v1/taxes/${id}`, payload),

    // Delete tax
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/taxes/${id}`),

    // Tax reports
    reports: {
      // Get tax summary
      getSummary: (params: {
        from_date: string;
        to_date: string;
        tax_type?: TaxType;
      }) => apiClient.get<ApiResponse<TaxSummaryResponse>>('/api/v1/taxes/reports/summary', { params }),

      // Get detailed report
      getDetailed: (params: {
        from_date: string;
        to_date: string;
        report_type: 'GSTR1' | 'GSTR2' | 'GSTR3B';
      }) => apiClient.get<ApiResponse<any>>('/api/v1/taxes/reports/detailed', { params }),

      // Export report
      export: (params: {
        from_date: string;
        to_date: string;
        format: 'pdf' | 'excel' | 'csv';
      }) => apiClient.get<Blob>('/api/v1/taxes/reports/export', {
        params,
        headers: { 'Accept': 'application/octet-stream' }
      })
    },

    // HSN code management
    hsn: {
      search: (query: string) =>
        apiClient.get<ApiResponse<Array<{
          code: string;
          description: string;
          gst_rate: number;
        }>>>('/api/v1/taxes/hsn/search', { params: { q: query } }),

      validate: (code: string) =>
        apiClient.get<ApiResponse<{ valid: boolean; description?: string }>>(`/api/v1/taxes/hsn/validate/${code}`)
    }
  };
};
```

## 12. Warehouse Service

**File:** `services/warehouseService.ts`

```typescript
const createWarehouseService = (apiClient: ApiClient) => {
  return {
    // List warehouses
    list: (params?: {
      type?: string;
      is_active?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<WarehouseResponse[]>>('/api/v1/warehouses', { params }),

    // Get warehouse by ID
    get: (id: string) =>
      apiClient.get<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/${id}`),

    // Get by warehouse code
    getByCode: (code: string) =>
      apiClient.get<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/code/${code}`),

    // Get default warehouse
    getDefault: () =>
      apiClient.get<ApiResponse<WarehouseResponse>>('/api/v1/warehouses/default'),

    // Create warehouse
    create: (payload: CreateWarehouseRequest) =>
      apiClient.post<ApiResponse<WarehouseResponse>>('/api/v1/warehouses', payload),

    // Update warehouse
    update: (id: string, payload: UpdateWarehouseRequest) =>
      apiClient.put<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/${id}`, payload),

    // Set as default
    setDefault: (id: string) =>
      apiClient.post<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/${id}/set-default`, {}),

    // Delete warehouse
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/warehouses/${id}`),

    // Stock management
    stock: {
      // Get warehouse stock
      getStock: (id: string, params?: {
        product_id?: string;
        category?: string;
        low_stock_only?: boolean;
        limit?: number;
        offset?: number;
      }) => apiClient.get<ApiResponse<InventoryBatchResponse[]>>(`/api/v1/warehouses/${id}/stock`, { params }),

      // Get stock summary
      getSummary: (id: string) =>
        apiClient.get<ApiResponse<{
          total_items: number;
          total_value: number;
          capacity_used: number;
          low_stock_items: number;
          expiring_items: number;
        }>>(`/api/v1/warehouses/${id}/stock-summary`),

      // Transfer stock
      transfer: (payload: {
        from_warehouse_id: string;
        to_warehouse_id: string;
        items: Array<{
          batch_id: string;
          quantity: number;
        }>;
        notes?: string;
      }) => apiClient.post<ApiResponse<{ transfer_id: string }>>('/api/v1/warehouses/transfer', payload)
    },

    // Analytics
    getUtilization: (id?: string) =>
      apiClient.get<ApiResponse<{
        overall_utilization: number;
        by_warehouse: Array<{
          warehouse_id: string;
          warehouse_name: string;
          utilization: number;
          capacity: number;
          occupied: number;
        }>;
      }>>('/api/v1/warehouses/utilization', {
        params: { warehouse_id: id }
      }),

    getActivity: (id: string, params?: {
      from_date?: string;
      to_date?: string;
      activity_type?: string;
    }) => apiClient.get<ApiResponse<Array<{
      timestamp: string;
      activity_type: string;
      description: string;
      user: string;
      reference_id?: string;
    }>>>(`/api/v1/warehouses/${id}/activity`, { params })
  };
};
```

## 13. Webhook Service

**File:** `services/webhookService.ts`

```typescript
const createWebhookService = (apiClient: ApiClient) => {
  return {
    // List webhook configurations
    list: () =>
      apiClient.get<ApiResponse<Array<{
        id: string;
        url: string;
        events: string[];
        is_active: boolean;
        created_at: string;
      }>>>('/api/v1/webhooks'),

    // Register webhook
    register: (payload: {
      url: string;
      events: string[];
      secret?: string;
    }) => apiClient.post<ApiResponse<{
      id: string;
      url: string;
      events: string[];
      secret: string;
    }>>('/api/v1/webhooks', payload),

    // Update webhook
    update: (id: string, payload: {
      url?: string;
      events?: string[];
      is_active?: boolean;
    }) => apiClient.put<ApiResponse<{
      id: string;
      url: string;
      events: string[];
      is_active: boolean;
    }>>(`/api/v1/webhooks/${id}`, payload),

    // Delete webhook
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/webhooks/${id}`),

    // Test webhook
    test: (id: string, eventType?: string) =>
      apiClient.post<ApiResponse<{
        success: boolean;
        response_code?: number;
        response_body?: string;
        error?: string;
      }>>(`/api/v1/webhooks/${id}/test`, { event_type: eventType }),

    // Get webhook logs
    getLogs: (id: string, params?: {
      from_date?: string;
      to_date?: string;
      status?: 'success' | 'failed';
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<Array<{
      id: string;
      webhook_id: string;
      event_type: string;
      payload: any;
      response_code: number;
      response_body?: string;
      error?: string;
      timestamp: string;
      retry_count: number;
    }>>>(`/api/v1/webhooks/${id}/logs`, { params }),

    // Retry failed webhook
    retry: (logId: string) =>
      apiClient.post<ApiResponse<{
        success: boolean;
        response_code?: number;
        error?: string;
      }>>(`/api/v1/webhooks/logs/${logId}/retry`, {}),

    // Get webhook statistics
    getStats: () =>
      apiClient.get<ApiResponse<{
        total_webhooks: number;
        active_webhooks: number;
        total_events_sent: number;
        success_rate: number;
        by_event_type: Array<{
          event_type: string;
          count: number;
          success_count: number;
        }>;
      }>>('/api/v1/webhooks/stats'),

    // Webhook signature verification helper
    verifySignature: (payload: string, signature: string, secret: string): boolean => {
      // This would be implemented client-side
      // Example: HMAC-SHA256 verification
      return true; // Placeholder
    }
  };
};
```

## Main Factory Function

**File:** `index.ts`

```typescript
import createApiClient from './utils/apiClient';
import { ERPServiceConfig } from './config';

// Import all services
import createAttachmentService from './services/attachmentService';
import createBankPaymentService from './services/bankPaymentService';
import createCollaboratorService from './services/collaboratorService';
import createDiscountService from './services/discountService';
import createGRNService from './services/grnService';
import createInventoryService from './services/inventoryService';
import createProductService from './services/productService';
import createPurchaseOrderService from './services/purchaseOrderService';
import createReturnService from './services/returnService';
import createSalesService from './services/salesService';
import createTaxService from './services/taxService';
import createWarehouseService from './services/warehouseService';
import createWebhookService from './services/webhookService';

const createERPService = (config: ERPServiceConfig) => {
  // Initialize API client with config
  const apiClient = createApiClient({
    baseURL: config.baseURL,
    defaultHeaders: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': config.tenantId || '',
      ...config.defaultHeaders
    },
    getAccessToken: config.getAccessToken,
    requestTimeout: config.requestTimeout,
    retryConfig: config.retryConfig
  });

  // Initialize all services
  return {
    attachments: createAttachmentService(apiClient),
    bankPayments: createBankPaymentService(apiClient),
    collaborators: createCollaboratorService(apiClient),
    discounts: createDiscountService(apiClient),
    grns: createGRNService(apiClient),
    inventory: createInventoryService(apiClient),
    products: createProductService(apiClient),
    purchaseOrders: createPurchaseOrderService(apiClient),
    returns: createReturnService(apiClient),
    sales: createSalesService(apiClient),
    taxes: createTaxService(apiClient),
    warehouses: createWarehouseService(apiClient),
    webhooks: createWebhookService(apiClient)
  };
};

export default createERPService;

// Export all types and interfaces
export * from './types';
export * from './config';

// Export individual service factories for advanced usage
export {
  createAttachmentService,
  createBankPaymentService,
  createCollaboratorService,
  createDiscountService,
  createGRNService,
  createInventoryService,
  createProductService,
  createPurchaseOrderService,
  createReturnService,
  createSalesService,
  createTaxService,
  createWarehouseService,
  createWebhookService
};
```

## Service Interface Types

Each service returns a strongly-typed interface that can be extracted for type safety:

```typescript
// Type extraction helpers
export type ERPService = ReturnType<typeof createERPService>;
export type AttachmentService = ReturnType<typeof createAttachmentService>;
export type BankPaymentService = ReturnType<typeof createBankPaymentService>;
export type CollaboratorService = ReturnType<typeof createCollaboratorService>;
export type DiscountService = ReturnType<typeof createDiscountService>;
export type GRNService = ReturnType<typeof createGRNService>;
export type InventoryService = ReturnType<typeof createInventoryService>;
export type ProductService = ReturnType<typeof createProductService>;
export type PurchaseOrderService = ReturnType<typeof createPurchaseOrderService>;
export type ReturnService = ReturnType<typeof createReturnService>;
export type SalesService = ReturnType<typeof createSalesService>;
export type TaxService = ReturnType<typeof createTaxService>;
export type WarehouseService = ReturnType<typeof createWarehouseService>;
export type WebhookService = ReturnType<typeof createWebhookService>;
```

## Testing Helpers

Each service should have corresponding test helpers:

```typescript
// test-utils.ts
export const createMockApiClient = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
});

export const createTestService = <T>(
  serviceFactory: (client: any) => T
): T => {
  const mockClient = createMockApiClient();
  return serviceFactory(mockClient);
};
```

This comprehensive service specification provides:
1. Complete coverage of all ERP API endpoints
2. Consistent method naming and patterns
3. Full type safety with TypeScript
4. Nested resource management
5. Analytics and reporting capabilities
6. Bulk operations support
7. File handling (uploads/downloads)
8. Testable architecture
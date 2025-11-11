import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  InventoryBatchResponse,
  CreateInventoryBatchRequest,
  InventoryTransactionResponse,
  CreateInventoryTransactionRequest,
  ProductAvailabilityResponse,
} from '../types/index.js';

/**
 * Inventory metrics response
 */
export interface InventoryMetrics {
  total_batches: number;
  total_value: number;
  low_stock_count: number;
  expiring_soon_count: number;
  out_of_stock_count: number;
}

/**
 * Creates inventory service with batch and stock management
 *
 * @param apiClient - Configured API client instance
 * @returns Inventory service methods
 *
 * @example
 * ```typescript
 * const inventoryService = createInventoryService(apiClient);
 * const availability = await inventoryService.stock.checkAvailability('P_001');
 * ```
 */
const createInventoryService = (apiClient: ApiClient) => {
  return {
    /**
     * Batch management operations
     */
    batches: {
      /**
       * List inventory batches
       *
       * @param params - Filter parameters
       * @returns List of batches
       */
      list: (params?: {
        product_id?: string;
        warehouse_id?: string;
        expiring_in_days?: number;
        low_stock?: boolean;
        limit?: number;
        offset?: number;
      }) => apiClient.get<ApiResponse<InventoryBatchResponse[]>>('/api/v1/batches', { params }),

      /**
       * Get batch by ID
       *
       * @param id - Batch ID
       * @returns Batch details
       */
      get: (id: string) =>
        apiClient.get<ApiResponse<InventoryBatchResponse>>(`/api/v1/batches/${id}`),

      /**
       * Get batches expiring soon
       *
       * @param days - Number of days to look ahead (default: 30)
       * @returns Expiring batches
       */
      getExpiring: (days: number = 30) =>
        apiClient.get<ApiResponse<InventoryBatchResponse[]>>('/api/v1/batches/expiring', {
          params: { days },
        }),

      /**
       * Get low stock batches
       *
       * @returns Low stock batches
       */
      getLowStock: () =>
        apiClient.get<ApiResponse<InventoryBatchResponse[]>>('/api/v1/batches/low-stock'),

      /**
       * Create inventory batch
       *
       * @param payload - Batch creation data
       * @returns Created batch
       */
      create: (payload: CreateInventoryBatchRequest) =>
        apiClient.post<ApiResponse<InventoryBatchResponse>>('/api/v1/batches', payload),

      /**
       * Update inventory batch
       *
       * @param id - Batch ID
       * @param payload - Batch update data
       * @returns Updated batch
       */
      update: (id: string, payload: Partial<CreateInventoryBatchRequest>) =>
        apiClient.put<ApiResponse<InventoryBatchResponse>>(`/api/v1/batches/${id}`, payload),

      /**
       * Get batch transactions
       *
       * @param id - Batch ID
       * @param params - Filter parameters
       * @returns Batch transaction history
       */
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

      /**
       * Delete inventory batch
       *
       * @param id - Batch ID
       * @returns Void on success
       */
      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/batches/${id}`),
    },

    /**
     * Transaction management operations
     */
    transactions: {
      /**
       * List inventory transactions
       *
       * @param params - Filter parameters
       * @returns List of transactions
       */
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

      /**
       * Create inventory transaction
       *
       * @param payload - Transaction data
       * @returns Created transaction
       */
      create: (payload: CreateInventoryTransactionRequest) =>
        apiClient.post<ApiResponse<InventoryTransactionResponse>>('/api/v1/inventory/transactions', payload),

      /**
       * Get transaction by ID
       *
       * @param id - Transaction ID
       * @returns Transaction details
       */
      get: (id: string) =>
        apiClient.get<ApiResponse<InventoryTransactionResponse>>(`/api/v1/inventory/transactions/${id}`),
    },

    /**
     * Stock management operations
     */
    stock: {
      /**
       * Check product availability
       *
       * @param productId - Product ID
       * @param variantId - Variant ID (optional)
       * @returns Product availability across warehouses
       */
      checkAvailability: (productId: string, variantId?: string) =>
        apiClient.get<ApiResponse<ProductAvailabilityResponse>>('/api/v1/inventory/availability', {
          params: { product_id: productId, variant_id: variantId },
        }),

      /**
       * Reserve stock for order
       *
       * @param payload - Reservation details
       * @returns Reservation confirmation
       */
      reserve: (payload: {
        product_id: string;
        variant_id?: string;
        batch_id?: string;
        quantity: number;
        reference_type: string;
        reference_id: string;
      }) => apiClient.post<ApiResponse<{ reservation_id: string }>>('/api/v1/inventory/reserve', payload),

      /**
       * Release reserved stock
       *
       * @param reservationId - Reservation ID
       * @returns Void on success
       */
      release: (reservationId: string) =>
        apiClient.post<ApiResponse<void>>(`/api/v1/inventory/reservations/${reservationId}/release`, {}),

      /**
       * Transfer stock between warehouses
       *
       * @param payload - Transfer details
       * @returns Transfer transaction
       */
      transfer: (payload: {
        from_warehouse_id: string;
        to_warehouse_id: string;
        batch_id: string;
        quantity: number;
        notes?: string;
      }) => apiClient.post<ApiResponse<InventoryTransactionResponse>>('/api/v1/inventory/transfer', payload),

      /**
       * Adjust stock levels
       *
       * @param payload - Adjustment details
       * @returns Adjustment transaction
       */
      adjust: (payload: {
        batch_id: string;
        adjustment_type: 'ADD' | 'REMOVE' | 'SET';
        quantity: number;
        reason: string;
        notes?: string;
      }) => apiClient.post<ApiResponse<InventoryTransactionResponse>>('/api/v1/inventory/adjust', payload),
    },

    /**
     * Analytics and reporting operations
     */
    analytics: {
      /**
       * Get inventory metrics
       *
       * @returns Inventory metrics
       */
      getMetrics: () =>
        apiClient.get<ApiResponse<InventoryMetrics>>('/api/v1/inventory/metrics'),

      /**
       * Get stock valuation
       *
       * @param warehouseId - Warehouse ID (optional)
       * @returns Stock valuation breakdown
       */
      getValuation: (warehouseId?: string) =>
        apiClient.get<ApiResponse<{
          total_value: number;
          by_category: Array<{ category: string; value: number }>;
          by_warehouse: Array<{ warehouse_id: string; warehouse_name: string; value: number }>;
        }>>('/api/v1/inventory/valuation', {
          params: { warehouse_id: warehouseId },
        }),

      /**
       * Get inventory turnover report
       *
       * @param params - Report parameters
       * @returns Turnover analysis
       */
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
      }>>('/api/v1/inventory/turnover', { params }),
    },
  };
};

export default createInventoryService;

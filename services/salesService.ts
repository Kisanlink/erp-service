import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  SaleResponse,
  SaleListResponse,
  CreateSaleRequest,
  UpdateSaleRequest,
  UpdateSaleStatusRequest,
  SaleItemResponse,
  CreateSaleItemRequest,
  BankPaymentResponse,
  CancelSaleRequest,
  CancelSaleItemsRequest,
  SaleCancellationResponse,
} from '../types/index.js';

/**
 * Sales metrics response
 */
export interface SalesMetrics {
  total_sales: number;
  total_revenue: number;
  average_order_value: number;
  total_profit: number;
  profit_margin: number;
}

/**
 * Dashboard metrics response
 */
export interface DashboardMetrics {
  today_sales: number;
  today_revenue: number;
  month_sales: number;
  month_revenue: number;
  pending_orders: number;
  low_stock_items: number;
}

/**
 * Creates sales service with order management and analytics
 *
 * @param apiClient - Configured API client instance
 * @returns Sales service methods
 *
 * @example
 * ```typescript
 * const salesService = createSalesService(apiClient);
 * const sale = await salesService.create({
 *   warehouse_id: 'WH_001',
 *   sale_type: 'in_store',
 *   payment_mode: 'cash',
 *   items: [{ variant_id: 'V_001', quantity: 5 }]
 * });
 * ```
 */
const createSalesService = (apiClient: ApiClient) => {
  return {
    /**
     * List sales with optional filters
     * Note: items and breakdown are NOT included in list response for performance
     * Use get(id) to fetch full sale details with items and breakdown
     *
     * @param params - Filter parameters
     * @returns List of sales (without items and breakdown)
     */
    list: (params?: {
      customer_id?: string;
      status?: string;
      payment_status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<SaleListResponse[]>>('/api/v1/sales', { params }),

    /**
     * Get sale by ID
     *
     * @param id - Sale ID
     * @returns Sale details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}`),

    /**
     * Get sale by sale number
     *
     * @param saleNumber - Sale number
     * @returns Sale details
     */
    getByNumber: (saleNumber: string) =>
      apiClient.get<ApiResponse<SaleResponse>>(`/api/v1/sales/number/${saleNumber}`),

    /**
     * Create new sale
     *
     * @param payload - Sale creation data
     * @returns Created sale
     */
    create: (payload: CreateSaleRequest) =>
      apiClient.post<ApiResponse<SaleResponse>>('/api/v1/sales', payload),

    /**
     * Update existing sale
     *
     * @param id - Sale ID
     * @param payload - Sale update data
     * @returns Updated sale
     */
    update: (id: string, payload: UpdateSaleRequest) =>
      apiClient.put<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}`, payload),

    /**
     * Partially update a sale (PATCH)
     * Only pending sales can be updated
     * Updateable fields: payment_mode, sale_type, customer_phone, customer_name
     *
     * @param id - Sale ID
     * @param payload - Partial sale update data
     * @returns Updated sale
     */
    patch: (id: string, payload: Partial<UpdateSaleRequest>) =>
      apiClient.patch<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}`, payload),

    /**
     * Update sale status
     *
     * @param id - Sale ID
     * @param payload - Status update data
     * @returns Updated sale
     */
    updateStatus: (id: string, payload: UpdateSaleStatusRequest) =>
      apiClient.patch<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/status`, payload),

    /**
     * Confirm sale
     *
     * @param id - Sale ID
     * @returns Confirmed sale
     */
    confirm: (id: string) =>
      apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/confirm`, {}),

    /**
     * Ship sale
     *
     * @param id - Sale ID
     * @param payload - Shipping details
     * @returns Updated sale
     */
    ship: (id: string, payload: {
      tracking_number?: string;
      carrier?: string;
      estimated_delivery?: string;
    }) => apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/ship`, payload),

    /**
     * Mark sale as delivered
     *
     * @param id - Sale ID
     * @param payload - Delivery details
     * @returns Updated sale
     */
    deliver: (id: string, payload: {
      delivered_items: Array<{
        product_id: string;
        variant_id?: string;
        delivered_quantity: number;
      }>;
      delivery_notes?: string;
    }) => apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/deliver`, payload),

    /**
     * Cancel entire sale with inventory return
     *
     * Cancels the sale and returns inventory to original batches.
     * The backend will also reverse discount usage and void tax records.
     *
     * Only sales with status: pending, confirmed, or processing can be cancelled.
     * For shipped or delivered orders, use the returns service instead.
     *
     * @param id - Sale ID
     * @param payload - Cancellation details (reason, cancelled_by)
     * @returns Cancelled sale
     *
     * @example
     * ```typescript
     * const cancelled = await salesService.cancel('SALE_001', {
     *   reason: 'Customer requested cancellation',
     *   cancelled_by: 'USER_001'
     * });
     * ```
     */
    cancel: (id: string, payload?: CancelSaleRequest) =>
      apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/cancel`, payload ?? {}),

    /**
     * Cancel specific items from a sale (partial cancellation)
     *
     * Allows cancelling individual items or partial quantities from a sale.
     * Inventory for cancelled items is returned to original batches.
     *
     * @param id - Sale ID
     * @param payload - Items to cancel with optional quantities and reasons
     * @returns Cancellation record with details
     *
     * @example
     * ```typescript
     * const cancellation = await salesService.cancelItems('SALE_001', {
     *   items: [
     *     { item_id: 'ITEM_001', quantity: 2, reason: 'Damaged' },
     *     { item_id: 'ITEM_002' } // Cancels entire item
     *   ],
     *   reason: 'Partial order cancellation'
     * });
     * ```
     */
    cancelItems: (id: string, payload: CancelSaleItemsRequest | any) => {
      // Accept both PascalCase (for backward compatibility) and lowercase/snake_case formats
      // Backend expects lowercase/snake_case: { reason, performed_by, items: [{ sale_item_id, quantity, reason? }] }
      
      // Extract and validate reason - handle both formats
      const reason = payload.reason 
        ? String(payload.reason).trim() 
        : (payload.Reason ? String(payload.Reason).trim() : '');
      if (!reason || reason.length === 0) {
        throw new Error('Reason is required and cannot be empty');
      }
      
      // Extract and validate performed_by - handle both formats
      const performedBy = payload.performed_by 
        ? String(payload.performed_by).trim() 
        : (payload.PerformedBy ? String(payload.PerformedBy).trim() : '');
      if (!performedBy || performedBy.length === 0) {
        throw new Error('PerformedBy is required and cannot be empty');
      }
      
      // Validate and transform items
      if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
        throw new Error('At least one item is required');
      }
      
      // Transform items to backend format (lowercase/snake_case)
      const items = payload.items.map((item: any, index: number) => {
        // Extract sale_item_id - handle both SaleItemID and sale_item_id
        const saleItemId = item.sale_item_id 
          ? String(item.sale_item_id).trim() 
          : (item.SaleItemID ? String(item.SaleItemID).trim() : '');
        
        if (!saleItemId || saleItemId.length === 0) {
          throw new Error(`SaleItemID is required for item at index ${index} and cannot be empty`);
        }
        
        // Return in backend format (snake_case)
        return {
          sale_item_id: saleItemId, // Backend expects snake_case
          quantity: item.quantity !== undefined ? Number(item.quantity) : undefined,
          reason: item.reason ? String(item.reason).trim() : undefined,
        };
      });
      
      // Backend expects all fields in lowercase/snake_case format
      const backendPayload: any = {
        reason: reason, // Backend expects lowercase
        performed_by: performedBy, // Backend expects snake_case
        items: items, // Already in correct format (snake_case)
      };
      
      // Always log the transformed payload to verify it's correct
      console.log('[SalesService] cancelItems - Backend payload:', JSON.stringify(backendPayload, null, 2));
      
      return apiClient.post<ApiResponse<SaleCancellationResponse>>(`/api/v1/sales/${id}/cancel-items`, backendPayload);
    },

    /**
     * Get cancellation history for a sale
     *
     * Returns all cancellation events for a sale, including both full
     * and partial cancellations with item details.
     *
     * @param id - Sale ID
     * @param params - Pagination parameters
     * @returns List of cancellation records
     *
     * @example
     * ```typescript
     * const history = await salesService.getCancellations('SALE_001', {
     *   limit: 10,
     *   offset: 0
     * });
     * ```
     */
    getCancellations: (id: string, params?: {
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<SaleCancellationResponse[]>>(`/api/v1/sales/${id}/cancellations`, { params }),

    /**
     * Delete sale
     *
     * @param id - Sale ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/sales/${id}`),

    /**
     * Sale items management
     */
    items: {
      /**
       * Add items to sale
       *
       * @param saleId - Sale ID
       * @param items - Items to add
       * @returns Updated sale
       */
      add: (saleId: string, items: CreateSaleItemRequest[]) =>
        apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${saleId}/items`, { items }),

      /**
       * Update sale item
       *
       * @param saleId - Sale ID
       * @param itemId - Item ID
       * @param payload - Item update data
       * @returns Updated item
       */
      update: (saleId: string, itemId: string, payload: Partial<CreateSaleItemRequest>) =>
        apiClient.put<ApiResponse<SaleItemResponse>>(`/api/v1/sales/${saleId}/items/${itemId}`, payload),

      /**
       * Remove item from sale
       *
       * @param saleId - Sale ID
       * @param itemId - Item ID
       * @returns Void on success
       */
      remove: (saleId: string, itemId: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/sales/${saleId}/items/${itemId}`),
    },

    /**
     * Record payment for sale
     *
     * @param id - Sale ID
     * @param payload - Payment details
     * @returns Payment record
     */
    recordPayment: (id: string, payload: {
      amount: number;
      payment_method: string;
      reference?: string;
      notes?: string;
    }) => apiClient.post<ApiResponse<BankPaymentResponse>>(`/api/v1/sales/${id}/payment`, payload),

    /**
     * Check invoice requirements
     * Verifies if all required settings are configured for invoice generation
     *
     * @returns Invoice requirements status with missing settings list
     */
    checkInvoiceRequirements: () =>
      apiClient.get<ApiResponse<{
        ready: boolean;
        missing_settings: string[];
      }>>('/api/v1/sales/invoice-requirements'),

    /**
     * Generate invoice PDF
     *
     * @param id - Sale ID
     * @returns Invoice PDF blob
     */
    generateInvoice: (id: string) =>
      apiClient.get<Blob>(`/api/v1/sales/${id}/invoice`, {
        headers: { 'Accept': 'application/pdf' },
      }),

    /**
     * Get sales metrics
     *
     * @param params - Date range parameters
     * @returns Sales metrics
     */
    getMetrics: (params?: {
      from_date?: string;
      to_date?: string;
    }) => apiClient.get<ApiResponse<SalesMetrics>>('/api/v1/sales/metrics', { params }),

    /**
     * Get dashboard metrics
     *
     * @returns Dashboard metrics
     */
    getDashboard: () =>
      apiClient.get<ApiResponse<DashboardMetrics>>('/api/v1/sales/dashboard'),

    /**
     * Get top customers
     *
     * @param params - Filter parameters
     * @returns Top customers by value
     */
    getTopCustomers: (params?: {
      from_date?: string;
      to_date?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<Array<{
      customer_id: string;
      customer_name: string;
      total_orders: number;
      total_value: number;
    }>>>('/api/v1/sales/top-customers', { params }),
  };
};

export default createSalesService;

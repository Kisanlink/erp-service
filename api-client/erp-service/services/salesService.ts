import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  SaleResponse,
  CreateSaleRequest,
  UpdateSaleRequest,
  UpdateSaleStatusRequest,
  SaleItemResponse,
  CreateSaleItemRequest,
  BankPaymentResponse,
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
     *
     * @param params - Filter parameters
     * @returns List of sales
     */
    list: (params?: {
      customer_id?: string;
      status?: string;
      payment_status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<SaleResponse[]>>('/api/v1/sales', { params }),

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
     * Cancel sale
     *
     * @param id - Sale ID
     * @param reason - Cancellation reason (optional)
     * @returns Cancelled sale
     */
    cancel: (id: string, reason?: string) =>
      apiClient.post<ApiResponse<SaleResponse>>(`/api/v1/sales/${id}/cancel`, { reason }),

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

import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  PurchaseOrderResponse,
  CreatePurchaseOrderRequest,
  UpdatePOStatusRequest,
  UpdatePOPaymentRequest,
  PurchaseOrderItemResponse,
  CreatePurchaseOrderItemRequest,
} from '../types/index.js';

/**
 * Creates purchase order service with workflow management
 *
 * @param apiClient - Configured API client instance
 * @returns Purchase order service methods
 *
 * @example
 * ```typescript
 * const purchaseOrderService = createPurchaseOrderService(apiClient);
 * const po = await purchaseOrderService.create({
 *   collaborator_id: 'CLAB_001',
 *   warehouse_id: 'WH_001',
 *   expected_delivery_date: '2024-12-01',
 *   items: [{ variant_id: 'V_001', quantity: 100, unit_price: 50 }]
 * });
 * ```
 */
const createPurchaseOrderService = (apiClient: ApiClient) => {
  return {
    /**
     * List purchase orders with optional filters
     *
     * @param params - Filter parameters
     * @returns List of purchase orders
     */
    list: (params?: {
      collaborator_id?: string;
      status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => {
      // If status is provided and not empty, use path parameter endpoint: /api/v1/purchase-orders/status/:status
      if (params?.status && params.status.trim().length > 0 && params.status !== 'all') {
        const { status, ...otherParams } = params;
        return apiClient.get<ApiResponse<PurchaseOrderResponse[]>>(
          `/api/v1/purchase-orders/status/${status}`,
          { params: otherParams }
        );
      }
      // Otherwise use the standard endpoint with query parameters
      // Remove status from params if it exists to avoid sending it as query param
      const { status: _, ...paramsWithoutStatus } = params || {};
      return apiClient.get<ApiResponse<PurchaseOrderResponse[]>>('/api/v1/purchase-orders', { params: paramsWithoutStatus });
    },

    /**
     * Get purchase order by ID
     *
     * @param id - Purchase order ID
     * @returns Purchase order details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}`),

    /**
     * Get purchase order by PO number
     *
     * @param poNumber - PO number
     * @returns Purchase order details
     */
    getByNumber: (poNumber: string) =>
      apiClient.get<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/number/${poNumber}`),

    /**
     * Create new purchase order
     *
     * @param payload - Purchase order creation data
     * @returns Created purchase order
     */
    create: (payload: CreatePurchaseOrderRequest) =>
      apiClient.post<ApiResponse<PurchaseOrderResponse>>('/api/v1/purchase-orders', payload),

    /**
     * Update existing purchase order
     *
     * @param id - Purchase order ID
     * @param payload - Purchase order update data
     * @returns Updated purchase order
     */
    update: (id: string, payload: Partial<CreatePurchaseOrderRequest>) =>
      apiClient.put<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}`, payload),

    /**
     * Update purchase order status
     *
     * @param id - Purchase order ID
     * @param payload - Status update data
     * @returns Updated purchase order
     */
    updateStatus: (id: string, payload: UpdatePOStatusRequest) =>
      apiClient.patch<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/status`, payload),

    /**
     * Update purchase order payment
     *
     * @param id - Purchase order ID
     * @param payload - Payment update data
     * @returns Updated purchase order
     */
    updatePayment: (id: string, payload: UpdatePOPaymentRequest) =>
      apiClient.patch<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/payment`, payload),

    /**
     * Send purchase order to supplier
     *
     * @param id - Purchase order ID
     * @returns Send confirmation
     */
    send: (id: string) =>
      apiClient.post<ApiResponse<{ sent: boolean; message: string }>>(`/api/v1/purchase-orders/${id}/send`, {}),

    /**
     * Confirm purchase order
     *
     * @param id - Purchase order ID
     * @returns Confirmed purchase order
     */
    confirm: (id: string) =>
      apiClient.post<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/confirm`, {}),

    /**
     * Cancel purchase order
     *
     * @param id - Purchase order ID
     * @param reason - Cancellation reason (optional)
     * @returns Cancelled purchase order
     */
    cancel: (id: string, reason?: string) =>
      apiClient.post<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${id}/cancel`, { reason }),

    /**
     * Delete purchase order
     *
     * @param id - Purchase order ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/purchase-orders/${id}`),

    /**
     * Purchase order items management
     */
    items: {
      /**
       * Add items to purchase order
       *
       * @param poId - Purchase order ID
       * @param items - Items to add
       * @returns Updated purchase order
       */
      add: (poId: string, items: CreatePurchaseOrderItemRequest[]) =>
        apiClient.post<ApiResponse<PurchaseOrderResponse>>(`/api/v1/purchase-orders/${poId}/items`, { items }),

      /**
       * Update purchase order item
       *
       * @param poId - Purchase order ID
       * @param itemId - Item ID
       * @param payload - Item update data
       * @returns Updated item
       */
      update: (poId: string, itemId: string, payload: Partial<CreatePurchaseOrderItemRequest>) =>
        apiClient.put<ApiResponse<PurchaseOrderItemResponse>>(`/api/v1/purchase-orders/${poId}/items/${itemId}`, payload),

      /**
       * Remove item from purchase order
       *
       * @param poId - Purchase order ID
       * @param itemId - Item ID
       * @returns Void on success
       */
      remove: (poId: string, itemId: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/purchase-orders/${poId}/items/${itemId}`),
    },

    /**
     * Generate purchase order PDF
     *
     * @param id - Purchase order ID
     * @returns PDF blob
     */
    generatePDF: (id: string) =>
      apiClient.get<Blob>(`/api/v1/purchase-orders/${id}/pdf`, {
        headers: { 'Accept': 'application/pdf' },
      }),

    /**
     * Get purchase order statistics
     *
     * @param params - Filter parameters
     * @returns Statistics
     */
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
    }>>('/api/v1/purchase-orders/statistics', { params }),
  };
};

export default createPurchaseOrderService;

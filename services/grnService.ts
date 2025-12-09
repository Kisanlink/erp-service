import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  GRNResponse,
  CreateGRNRequest,
  UpdateGRNRequest,
  CreateGRNItemRequest,
  GRNItemResponse,
} from '../types/index.js';

/**
 * Creates GRN (Goods Receipt Note) service for receiving goods
 *
 * @param apiClient - Configured API client instance
 * @returns GRN service methods
 *
 * @example
 * ```typescript
 * const grnService = createGRNService(apiClient);
 * const grn = await grnService.create({
 *   po_id: 'PO_001',
 *   grn_number: 'GRN-2024-001',
 *   received_by: 'user@example.com',
 *   quality_status: 'accepted',
 *   items: [{ po_item_id: 'POI_001', received_quantity: 100, accepted_quantity: 100, expiry_date: '2025-12-31' }]
 * });
 * ```
 */
const createGRNService = (apiClient: ApiClient) => {
  return {
    /**
     * List GRNs with optional filters
     *
     * @param params - Filter parameters
     * @returns List of GRNs
     */
    list: (params?: {
      purchase_order_id?: string;
      status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<GRNResponse[]>>('/api/v1/grns', { params }),

    /**
     * Get GRN by ID
     *
     * @param id - GRN ID
     * @returns GRN details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}`),

    /**
     * Get GRNs by purchase order
     *
     * @param poId - Purchase order ID
     * @returns List of GRNs for the PO
     */
    getByPurchaseOrder: (poId: string) =>
      apiClient.get<ApiResponse<GRNResponse[]>>(`/api/v1/grns/purchase-order/${poId}`),

    /**
     * Create new GRN
     *
     * @param payload - GRN creation data
     * @returns Created GRN
     */
    create: (payload: CreateGRNRequest) =>
      apiClient.post<ApiResponse<GRNResponse>>('/api/v1/grns', payload),

    /**
     * Update existing GRN
     *
     * @param id - GRN ID
     * @param payload - GRN update data
     * @returns Updated GRN
     */
    update: (id: string, payload: UpdateGRNRequest) =>
      apiClient.put<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}`, payload),

    /**
     * Add items to GRN
     *
     * @param id - GRN ID
     * @param items - Items to add
     * @returns Updated GRN
     */
    addItems: (id: string, items: CreateGRNItemRequest[]) =>
      apiClient.post<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}/items`, { items }),

    /**
     * Update GRN item
     *
     * @param grnId - GRN ID
     * @param itemId - Item ID
     * @param payload - Item update data
     * @returns Updated item
     */
    updateItem: (grnId: string, itemId: string, payload: Partial<CreateGRNItemRequest>) =>
      apiClient.put<ApiResponse<GRNItemResponse>>(`/api/v1/grns/${grnId}/items/${itemId}`, payload),

    /**
     * Remove item from GRN
     *
     * @param grnId - GRN ID
     * @param itemId - Item ID
     * @returns Void on success
     */
    removeItem: (grnId: string, itemId: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/grns/${grnId}/items/${itemId}`),

    /**
     * Confirm GRN receipt
     *
     * @param id - GRN ID
     * @returns Confirmed GRN
     */
    confirm: (id: string) =>
      apiClient.post<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}/confirm`, {}),

    /**
     * Cancel GRN
     *
     * @param id - GRN ID
     * @param reason - Cancellation reason (optional)
     * @returns Cancelled GRN
     */
    cancel: (id: string, reason?: string) =>
      apiClient.post<ApiResponse<GRNResponse>>(`/api/v1/grns/${id}/cancel`, { reason }),

    /**
     * Delete GRN
     *
     * @param id - GRN ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/grns/${id}`),

    /**
     * Get rejected items from a GRN
     *
     * Returns all GRN items that were rejected during quality check.
     *
     * @param id - GRN ID
     * @returns List of rejected GRN items with return tracking information
     *
     * @example
     * ```typescript
     * const rejectedItems = await grnService.getRejectedItems('GRN_001');
     * ```
     */
    getRejectedItems: (id: string) =>
      apiClient.get<ApiResponse<GRNItemResponse[]>>(`/api/v1/grns/${id}/rejected-items`),

    /**
     * Update return status for a rejected GRN item
     *
     * Tracks the return process: pending → sent → received_by_vendor → closed
     *
     * @param itemId - GRN item ID
     * @param payload - Return status update data
     * @returns Updated GRN item
     *
     * @example
     * ```typescript
     * const updated = await grnService.updateReturnStatus('GRIT_001', {
     *   return_status: 'sent',
     *   return_sent_date: '2025-12-01T10:00:00Z',
     *   return_remarks: 'Shipped via courier'
     * });
     * ```
     */
    updateReturnStatus: (itemId: string, payload: {
      return_status?: 'pending' | 'sent' | 'received_by_vendor' | 'closed';
      return_sent_date?: string;
      return_received_date?: string;
      return_closed_date?: string;
      return_remarks?: string;
    }) =>
      apiClient.patch<ApiResponse<GRNItemResponse>>(`/api/v1/grns/items/${itemId}/return-status`, payload),
  };
};

export default createGRNService;

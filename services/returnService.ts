import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  ReturnResponse,
  CreateReturnRequest,
  UpdateReturnRequest,
  UpdateReturnStatusRequest,
  RefundPolicyResponse,
  CreateRefundPolicyRequest,
  UpdateRefundPolicyRequest,
  MostReturnedProductResponse,
} from '../types/index.js';

/**
 * Return metrics response
 */
export interface ReturnMetrics {
  total_returns: number;
  total_refund_amount: number;
  return_rate: number;
  average_refund_amount: number;
  by_status: Array<{ status: string; count: number; amount: number }>;
}

/**
 * Creates return service with refund processing and policy management
 *
 * @param apiClient - Configured API client instance
 * @returns Return service methods
 *
 * @example
 * ```typescript
 * const returnService = createReturnService(apiClient);
 * const returnOrder = await returnService.create({
 *   sale_id: 'SALE_001',
 *   items: [{ batch_id: 'BATCH_001', quantity: 2, refund_amount: 100 }]
 * });
 * ```
 */
const createReturnService = (apiClient: ApiClient) => {
  return {
    /**
     * List returns with optional filters
     *
     * @param params - Filter parameters
     * @returns List of returns
     */
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

    /**
     * Get return by ID
     *
     * @param id - Return ID
     * @returns Return details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}`),

    /**
     * Get return by return number
     *
     * @param returnNumber - Return number
     * @returns Return details
     */
    getByNumber: (returnNumber: string) =>
      apiClient.get<ApiResponse<ReturnResponse>>(`/api/v1/returns/number/${returnNumber}`),

    /**
     * Create new return
     *
     * @param payload - Return creation data
     * @returns Created return
     */
    create: (payload: CreateReturnRequest) =>
      apiClient.post<ApiResponse<ReturnResponse>>('/api/v1/returns', payload),

    /**
     * Update existing return
     *
     * @param id - Return ID
     * @param payload - Return update data
     * @returns Updated return
     */
    update: (id: string, payload: UpdateReturnRequest) =>
      apiClient.put<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}`, payload),

    /**
     * Update return status
     *
     * @param id - Return ID
     * @param payload - Status update data
     * @returns Updated return
     */
    updateStatus: (id: string, payload: UpdateReturnStatusRequest) =>
      apiClient.patch<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/status`, payload),

    /**
     * Approve return
     * Uses PATCH /api/v1/returns/:id/status with status "approved"
     *
     * @param id - Return ID
     * @param notes - Approval notes (optional)
     * @returns Approved return
     */
    approve: (id: string, notes?: string) =>
      apiClient.patch<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/status`, {
        status: 'approved',
        notes,
      }),

    /**
     * Reject return
     * Uses PATCH /api/v1/returns/:id/status with status "rejected"
     *
     * @param id - Return ID
     * @param reason - Rejection reason
     * @returns Rejected return
     */
    reject: (id: string, reason: string) =>
      apiClient.patch<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/status`, {
        status: 'rejected',
        reason,
      }),

    /**
     * Process return
     * Uses PATCH /api/v1/returns/:id/status with status "processed"
     *
     * @param id - Return ID
     * @returns Processed return
     */
    process: (id: string) =>
      apiClient.patch<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/status`, {
        status: 'processed',
      }),

    /**
     * Issue refund for return
     *
     * @param id - Return ID
     * @param payload - Refund details
     * @returns Updated return with refund
     */
    refund: (id: string, payload: {
      refund_amount: number;
      refund_method: string;
      notes?: string;
    }) => apiClient.post<ApiResponse<ReturnResponse>>(`/api/v1/returns/${id}/refund`, payload),

    /**
     * Delete return
     *
     * @param id - Return ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/returns/${id}`),

    /**
     * Refund policy management
     */
    refundPolicies: {
      /**
       * List refund policies
       *
       * @param params - Filter parameters
       * @returns List of refund policies
       */
      list: (params?: { is_active?: boolean }) =>
        apiClient.get<ApiResponse<RefundPolicyResponse[]>>('/api/v1/refund-policies', { params }),

      /**
       * Get refund policy by ID
       *
       * @param id - Policy ID
       * @returns Policy details
       */
      get: (id: string) =>
        apiClient.get<ApiResponse<RefundPolicyResponse>>(`/api/v1/refund-policies/${id}`),

      /**
       * Create refund policy
       *
       * @param payload - Policy creation data
       * @returns Created policy
       */
      create: (payload: CreateRefundPolicyRequest) =>
        apiClient.post<ApiResponse<RefundPolicyResponse>>('/api/v1/refund-policies', payload),

      /**
       * Update refund policy
       *
       * @param id - Policy ID
       * @param payload - Policy update data
       * @returns Updated policy
       */
      update: (id: string, payload: UpdateRefundPolicyRequest) =>
        apiClient.put<ApiResponse<RefundPolicyResponse>>(`/api/v1/refund-policies/${id}`, payload),

      /**
       * Delete refund policy
       *
       * @param id - Policy ID
       * @returns Void on success
       */
      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/refund-policies/${id}`),
    },

    /**
     * Get most returned products
     *
     * @param params - Filter parameters
     * @returns Most returned products
     */
    getMostReturned: (params?: {
      from_date?: string;
      to_date?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<MostReturnedProductResponse[]>>('/api/v1/returns/analytics/most-returned', { params }),

    /**
     * Get return metrics
     *
     * @param params - Date range parameters
     * @returns Return metrics
     */
    getMetrics: (params?: {
      from_date?: string;
      to_date?: string;
    }) => apiClient.get<ApiResponse<ReturnMetrics>>('/api/v1/returns/metrics', { params }),
  };
};

export default createReturnService;

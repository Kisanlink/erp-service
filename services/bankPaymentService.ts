import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  BankPaymentResponse,
  CreateBankPaymentRequest,
} from '../types/index.js';

/**
 * Creates bank payment service for payment tracking
 *
 * @param apiClient - Configured API client instance
 * @returns Bank payment service methods
 *
 * @example
 * ```typescript
 * const bankPaymentService = createBankPaymentService(apiClient);
 * const payment = await bankPaymentService.create({
 *   sale_id: 'SALE_001',
 *   amount: 1000,
 *   payment_method: 'upi'
 * });
 * ```
 */
const createBankPaymentService = (apiClient: ApiClient) => {
  return {
    /**
     * List bank payments with optional filters
     *
     * @param params - Filter parameters
     * @returns List of bank payments
     */
    list: (params?: {
      sale_id?: string;
      return_id?: string;
      payment_method?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<BankPaymentResponse[]>>('/api/v1/bank-payments', { params }),

    /**
     * Get payment by ID
     *
     * @param id - Payment ID
     * @returns Payment details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<BankPaymentResponse>>(`/api/v1/bank-payments/${id}`),

    /**
     * Get payments for a sale
     *
     * @param saleId - Sale ID
     * @returns List of payments for the sale
     */
    getBySale: (saleId: string) =>
      apiClient.get<ApiResponse<BankPaymentResponse[]>>(`/api/v1/bank-payments/sale/${saleId}`),

    /**
     * Get payments for a return
     *
     * @param returnId - Return ID
     * @returns List of payments for the return
     */
    getByReturn: (returnId: string) =>
      apiClient.get<ApiResponse<BankPaymentResponse[]>>(`/api/v1/bank-payments/return/${returnId}`),

    /**
     * Create new payment record
     *
     * @param payload - Payment creation data
     * @returns Created payment
     */
    create: (payload: CreateBankPaymentRequest) =>
      apiClient.post<ApiResponse<BankPaymentResponse>>('/api/v1/bank-payments', payload),

    /**
     * Update payment record
     *
     * @param id - Payment ID
     * @param payload - Payment update data
     * @returns Updated payment
     */
    update: (id: string, payload: Partial<CreateBankPaymentRequest>) =>
      apiClient.put<ApiResponse<BankPaymentResponse>>(`/api/v1/bank-payments/${id}`, payload),

    /**
     * Delete payment record
     *
     * @param id - Payment ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/bank-payments/${id}`),
  };
};

export default createBankPaymentService;

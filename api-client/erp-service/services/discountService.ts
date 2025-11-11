import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  DiscountType,
  DiscountResponse,
  CreateDiscountRequest,
  UpdateDiscountRequest,
  ValidateDiscountRequest,
  DiscountValidationResponse,
  DiscountUsageResponse,
} from '../types/index.js';

/**
 * Creates discount service with validation and application logic
 *
 * @param apiClient - Configured API client instance
 * @returns Discount service methods
 *
 * @example
 * ```typescript
 * const discountService = createDiscountService(apiClient);
 * const validation = await discountService.validate({ discount_code: 'SAVE20', order_value: 1000, warehouse_id: 'WH_001' });
 * ```
 */
const createDiscountService = (apiClient: ApiClient) => {
  return {
    /**
     * List discounts with optional filters
     *
     * @param params - Filter parameters
     * @returns List of discounts
     */
    list: (params?: {
      is_active?: boolean;
      discount_type?: DiscountType;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<DiscountResponse[]>>('/api/v1/discounts', { params }),

    /**
     * Get active discounts only
     *
     * @returns List of active discounts
     */
    getActive: () =>
      apiClient.get<ApiResponse<DiscountResponse[]>>('/api/v1/discounts/active'),

    /**
     * Get applicable discounts for an order
     *
     * @param params - Order details
     * @returns List of applicable discounts
     */
    getApplicable: (params: {
      order_value: number;
      products?: Array<{ product_id: string; quantity: number; price: number }>;
    }) => apiClient.post<ApiResponse<DiscountResponse[]>>('/api/v1/discounts/applicable', params),

    /**
     * Calculate optimal discount for an order
     *
     * @param params - Order details with available codes
     * @returns Optimal discount calculation
     */
    calculateOptimal: (params: {
      order_value: number;
      products: Array<{ product_id: string; quantity: number; price: number }>;
      available_codes?: string[];
    }) => apiClient.post<ApiResponse<{
      optimal_code: string;
      discount_amount: number;
      final_amount: number;
    }>>('/api/v1/discounts/calculate-optimal', params),

    /**
     * Get discounts by status
     *
     * @param status - Discount status (active, expired, upcoming)
     * @returns Filtered discounts
     */
    getByStatus: (status: 'active' | 'expired' | 'upcoming') =>
      apiClient.get<ApiResponse<DiscountResponse[]>>(`/api/v1/discounts/status/${status}`),

    /**
     * Get discounts by type
     *
     * @param type - Discount type
     * @returns Filtered discounts
     */
    getByType: (type: DiscountType) =>
      apiClient.get<ApiResponse<DiscountResponse[]>>(`/api/v1/discounts/type/${type}`),

    /**
     * Get discount usage for a sale
     *
     * @param saleId - Sale ID
     * @returns Discount usage records
     */
    getUsageBySale: (saleId: string) =>
      apiClient.get<ApiResponse<DiscountUsageResponse[]>>(`/api/v1/discounts/usage/sale/${saleId}`),

    /**
     * Get discount by ID
     *
     * @param id - Discount ID
     * @returns Discount details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<DiscountResponse>>(`/api/v1/discounts/${id}`),

    /**
     * Get discount by code
     *
     * @param code - Discount code
     * @returns Discount details
     */
    getByCode: (code: string) =>
      apiClient.get<ApiResponse<DiscountResponse>>(`/api/v1/discounts/code/${code}`),

    /**
     * Validate discount for an order
     *
     * @param payload - Validation request
     * @returns Validation result with discount amount
     */
    validate: (payload: ValidateDiscountRequest) =>
      apiClient.post<ApiResponse<DiscountValidationResponse>>('/api/v1/discounts/validate', payload),

    /**
     * Create new discount
     *
     * @param payload - Discount creation data
     * @returns Created discount
     */
    create: (payload: CreateDiscountRequest) =>
      apiClient.post<ApiResponse<DiscountResponse>>('/api/v1/discounts', payload),

    /**
     * Update existing discount
     *
     * @param id - Discount ID
     * @param payload - Discount update data
     * @returns Updated discount
     */
    update: (id: string, payload: UpdateDiscountRequest) =>
      apiClient.put<ApiResponse<DiscountResponse>>(`/api/v1/discounts/${id}`, payload),

    /**
     * Delete discount
     *
     * @param id - Discount ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/discounts/${id}`),

    /**
     * Get usage statistics for discount
     *
     * @param id - Discount ID
     * @returns Usage statistics
     */
    getUsageStats: (id: string) =>
      apiClient.get<ApiResponse<{
        total_uses: number;
        total_discount_given: number;
        average_order_value: number;
        top_customers: Array<{ customer_id: string; uses: number; total_saved: number }>;
      }>>(`/api/v1/discounts/${id}/stats`),
  };
};

export default createDiscountService;

import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  TaxType,
  TaxResponse,
  CreateTaxRequest,
  UpdateTaxRequest,
  TaxApplicationResponse,
  TaxCalculationRequest,
  TaxCalculationResponse,
  TaxSummaryResponse,
} from '../types/index.js';

/**
 * Creates tax service with calculation and reporting capabilities
 *
 * @param apiClient - Configured API client instance
 * @returns Tax service methods
 *
 * @example
 * ```typescript
 * const taxService = createTaxService(apiClient);
 * const calculation = await taxService.calculate({
 *   warehouse_id: 'WH_001',
 *   warehouse_state: 'Karnataka',
 *   items: [{ product_id: 'P_001', quantity: 10, unit_price: 100, line_total: 1000 }]
 * });
 * ```
 */
const createTaxService = (apiClient: ApiClient) => {
  return {
    /**
     * List taxes with optional filters
     *
     * @param params - Filter parameters
     * @returns List of taxes
     */
    list: (params?: {
      tax_type?: TaxType;
      is_active?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<TaxResponse[]>>('/api/v1/taxes', { params }),

    /**
     * Get tax by ID
     *
     * @param id - Tax ID
     * @returns Tax details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<TaxResponse>>(`/api/v1/taxes/${id}`),

    /**
     * Get tax by code
     *
     * @param code - Tax code
     * @returns Tax details
     */
    getByCode: (code: string) =>
      apiClient.get<ApiResponse<TaxResponse>>(`/api/v1/taxes/code/${code}`),

    /**
     * Get applicable taxes for a transaction
     *
     * @param params - Transaction context
     * @returns Applicable taxes
     */
    getApplicable: (params: {
      product_id?: string;
      hsn_code?: string;
      transaction_type: 'SALE' | 'PURCHASE';
    }) => apiClient.get<ApiResponse<TaxApplicationResponse>>('/api/v1/taxes/applicable', { params }),

    /**
     * Calculate taxes for a transaction
     *
     * @param payload - Tax calculation request
     * @returns Tax calculation result
     */
    calculate: (payload: TaxCalculationRequest) =>
      apiClient.post<ApiResponse<TaxCalculationResponse>>('/api/v1/taxes/calculate', payload),

    /**
     * Create new tax
     *
     * @param payload - Tax creation data
     * @returns Created tax
     */
    create: (payload: CreateTaxRequest) =>
      apiClient.post<ApiResponse<TaxResponse>>('/api/v1/taxes', payload),

    /**
     * Update existing tax
     *
     * @param id - Tax ID
     * @param payload - Tax update data
     * @returns Updated tax
     */
    update: (id: string, payload: UpdateTaxRequest) =>
      apiClient.put<ApiResponse<TaxResponse>>(`/api/v1/taxes/${id}`, payload),

    /**
     * Delete tax
     *
     * @param id - Tax ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/taxes/${id}`),

    /**
     * Tax reporting operations
     */
    reports: {
      /**
       * Get tax summary report
       *
       * @param params - Report parameters
       * @returns Tax summary
       */
      getSummary: (params: {
        from_date: string;
        to_date: string;
        tax_type?: TaxType;
      }) => apiClient.get<ApiResponse<TaxSummaryResponse>>('/api/v1/taxes/reports/summary', { params }),

      /**
       * Get detailed tax report
       *
       * @param params - Report parameters
       * @returns Detailed report data
       */
      getDetailed: (params: {
        from_date: string;
        to_date: string;
        report_type: 'GSTR1' | 'GSTR2' | 'GSTR3B';
      }) => apiClient.get<ApiResponse<unknown>>('/api/v1/taxes/reports/detailed', { params }),

      /**
       * Export tax report
       *
       * @param params - Export parameters
       * @returns Report file blob
       */
      export: (params: {
        from_date: string;
        to_date: string;
        format: 'pdf' | 'excel' | 'csv';
      }) => apiClient.get<Blob>('/api/v1/taxes/reports/export', {
        params,
        headers: { 'Accept': 'application/octet-stream' },
      }),
    },

    /**
     * HSN code operations
     */
    hsn: {
      /**
       * Search HSN codes
       *
       * @param query - Search query
       * @returns HSN code results
       */
      search: (query: string) =>
        apiClient.get<ApiResponse<Array<{
          code: string;
          description: string;
          gst_rate: number;
        }>>>('/api/v1/taxes/hsn/search', { params: { q: query } }),

      /**
       * Validate HSN code
       *
       * @param code - HSN code to validate
       * @returns Validation result
       */
      validate: (code: string) =>
        apiClient.get<ApiResponse<{ valid: boolean; description?: string }>>(`/api/v1/taxes/hsn/validate/${code}`),
    },
  };
};

export default createTaxService;

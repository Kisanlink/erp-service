import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  WarehouseResponse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  InventoryBatchResponse,
} from '../types/index.js';

/**
 * Creates warehouse service with warehouse and stock management operations
 *
 * @param apiClient - Configured API client instance
 * @returns Warehouse service methods
 *
 * @example
 * ```typescript
 * const warehouseService = createWarehouseService(apiClient);
 * const defaultWarehouse = await warehouseService.getDefault();
 * ```
 */
const createWarehouseService = (apiClient: ApiClient) => {
  return {
    /**
     * List warehouses with optional filters
     *
     * @param params - Filter parameters
     * @returns List of warehouses
     */
    list: (params?: {
      type?: string;
      is_active?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<WarehouseResponse[]>>('/api/v1/warehouses', { params }),

    /**
     * Get warehouse by ID
     *
     * @param id - Warehouse ID
     * @returns Warehouse details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/${id}`),

    /**
     * Get warehouse by code
     *
     * @param code - Warehouse code
     * @returns Warehouse details
     */
    getByCode: (code: string) =>
      apiClient.get<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/code/${code}`),

    /**
     * Get default warehouse
     *
     * @returns Default warehouse
     */
    getDefault: () =>
      apiClient.get<ApiResponse<WarehouseResponse>>('/api/v1/warehouses/default'),

    /**
     * Create new warehouse
     *
     * @param payload - Warehouse creation data
     * @returns Created warehouse
     */
    create: (payload: CreateWarehouseRequest) =>
      apiClient.post<ApiResponse<WarehouseResponse>>('/api/v1/warehouses', payload),

    /**
     * Update existing warehouse
     *
     * @param id - Warehouse ID
     * @param payload - Warehouse update data
     * @returns Updated warehouse
     */
    update: (id: string, payload: UpdateWarehouseRequest) =>
      apiClient.put<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/${id}`, payload),

    /**
     * Set warehouse as default
     *
     * @param id - Warehouse ID
     * @returns Updated warehouse
     */
    setDefault: (id: string) =>
      apiClient.post<ApiResponse<WarehouseResponse>>(`/api/v1/warehouses/${id}/set-default`, {}),

    /**
     * Delete warehouse
     *
     * @param id - Warehouse ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/warehouses/${id}`),

    /**
     * Warehouse stock management operations
     */
    stock: {
      /**
       * Get stock levels for warehouse
       *
       * @param id - Warehouse ID
       * @param params - Filter parameters
       * @returns List of inventory batches
       */
      getStock: (id: string, params?: {
        product_id?: string;
        category?: string;
        low_stock_only?: boolean;
        limit?: number;
        offset?: number;
      }) => apiClient.get<ApiResponse<InventoryBatchResponse[]>>(`/api/v1/warehouses/${id}/stock`, { params }),

      /**
       * Get stock summary for warehouse
       *
       * @param id - Warehouse ID
       * @returns Stock summary metrics
       */
      getSummary: (id: string) =>
        apiClient.get<ApiResponse<{
          total_items: number;
          total_value: number;
          capacity_used: number;
          low_stock_items: number;
          expiring_items: number;
        }>>(`/api/v1/warehouses/${id}/stock-summary`),

      /**
       * Transfer stock between warehouses
       *
       * @param payload - Transfer details
       * @returns Transfer confirmation
       */
      transfer: (payload: {
        from_warehouse_id: string;
        to_warehouse_id: string;
        items: Array<{
          batch_id: string;
          quantity: number;
        }>;
        notes?: string;
      }) => apiClient.post<ApiResponse<{ transfer_id: string }>>('/api/v1/warehouses/transfer', payload),
    },

    /**
     * Get warehouse utilization metrics
     *
     * @param id - Warehouse ID (optional, returns all warehouses if omitted)
     * @returns Utilization metrics
     */
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
        params: { warehouse_id: id },
      }),

    /**
     * Get warehouse activity log
     *
     * @param id - Warehouse ID
     * @param params - Filter parameters
     * @returns Activity log entries
     */
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
    }>>>(`/api/v1/warehouses/${id}/activity`, { params }),
  };
};

export default createWarehouseService;

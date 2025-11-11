import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  CollaboratorResponse,
  CreateCollaboratorRequest,
  UpdateCollaboratorRequest,
  CollaboratorProductResponse,
  CreateCollaboratorProductRequest,
  UpdateCollaboratorProductRequest,
  PurchaseOrderResponse,
} from '../types/index.js';

/**
 * Creates collaborator service with supplier/vendor management operations
 *
 * @param apiClient - Configured API client instance
 * @returns Collaborator service methods
 *
 * @example
 * ```typescript
 * const collaboratorService = createCollaboratorService(apiClient);
 * const suppliers = await collaboratorService.getActive();
 * ```
 */
const createCollaboratorService = (apiClient: ApiClient) => {
  return {
    /**
     * List collaborators with optional filters
     *
     * @param params - Filter parameters
     * @returns List of collaborators
     */
    list: (params?: {
      search?: string;
      is_active?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<CollaboratorResponse[]>>('/api/v1/collaborators', { params }),

    /**
     * Get active collaborators only
     *
     * @returns List of active collaborators
     */
    getActive: () =>
      apiClient.get<ApiResponse<CollaboratorResponse[]>>('/api/v1/collaborators/active'),

    /**
     * Search collaborators by query
     *
     * @param query - Search query string
     * @returns Search results
     */
    search: (query: string) =>
      apiClient.get<ApiResponse<CollaboratorResponse[]>>('/api/v1/collaborators/search', {
        params: { q: query },
      }),

    /**
     * Get collaborator by ID
     *
     * @param id - Collaborator ID
     * @returns Collaborator details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<CollaboratorResponse>>(`/api/v1/collaborators/${id}`),

    /**
     * Create new collaborator
     *
     * @param payload - Collaborator creation data
     * @returns Created collaborator
     */
    create: (payload: CreateCollaboratorRequest) =>
      apiClient.post<ApiResponse<CollaboratorResponse>>('/api/v1/collaborators', payload),

    /**
     * Update existing collaborator
     *
     * @param id - Collaborator ID
     * @param payload - Collaborator update data
     * @returns Updated collaborator
     */
    update: (id: string, payload: UpdateCollaboratorRequest) =>
      apiClient.put<ApiResponse<CollaboratorResponse>>(`/api/v1/collaborators/${id}`, payload),

    /**
     * Delete collaborator
     *
     * @param id - Collaborator ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/collaborators/${id}`),

    /**
     * Collaborator product catalog management
     */
    products: {
      /**
       * List products for collaborator
       *
       * @param collaboratorId - Collaborator ID
       * @returns List of collaborator products
       */
      list: (collaboratorId: string) =>
        apiClient.get<ApiResponse<CollaboratorProductResponse[]>>(
          `/api/v1/collaborators/${collaboratorId}/products`
        ),

      /**
       * Get specific product for collaborator
       *
       * @param collaboratorId - Collaborator ID
       * @param productId - Product ID
       * @returns Collaborator product details
       */
      get: (collaboratorId: string, productId: string) =>
        apiClient.get<ApiResponse<CollaboratorProductResponse>>(
          `/api/v1/collaborators/${collaboratorId}/products/${productId}`
        ),

      /**
       * Add product to collaborator catalog
       *
       * @param collaboratorId - Collaborator ID
       * @param payload - Product association data
       * @returns Created collaborator product
       */
      add: (collaboratorId: string, payload: CreateCollaboratorProductRequest) =>
        apiClient.post<ApiResponse<CollaboratorProductResponse>>(
          `/api/v1/collaborators/${collaboratorId}/products`,
          payload
        ),

      /**
       * Update collaborator product details
       *
       * @param id - Collaborator product ID
       * @param payload - Update data
       * @returns Updated collaborator product
       */
      update: (id: string, payload: UpdateCollaboratorProductRequest) =>
        apiClient.put<ApiResponse<CollaboratorProductResponse>>(
          `/api/v1/collaborator-products/${id}`,
          payload
        ),

      /**
       * Remove product from collaborator catalog
       *
       * @param collaboratorId - Collaborator ID
       * @param productId - Product ID
       * @returns Void on success
       */
      remove: (collaboratorId: string, productId: string) =>
        apiClient.delete<ApiResponse<void>>(
          `/api/v1/collaborators/${collaboratorId}/products/${productId}`
        ),
    },

    /**
     * Get purchase orders for collaborator
     *
     * @param id - Collaborator ID
     * @param params - Filter parameters
     * @returns List of purchase orders
     */
    getPurchaseOrders: (id: string, params?: {
      status?: string;
      from_date?: string;
      to_date?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<PurchaseOrderResponse[]>>(
      `/api/v1/collaborators/${id}/purchase-orders`,
      { params }
    ),
  };
};

export default createCollaboratorService;

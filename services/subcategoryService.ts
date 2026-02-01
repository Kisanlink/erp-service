import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  SubcategoryResponse,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest,
} from '../types/index.js';

/**
 * Creates subcategory service for managing product subcategories
 *
 * @param apiClient - Configured API client instance
 * @returns Subcategory service methods
 *
 * @example
 * ```typescript
 * const subcategoryService = createSubcategoryService(apiClient);
 * const subcategories = await subcategoryService.getByCategory('CATG00000001');
 * ```
 */
const createSubcategoryService = (apiClient: ApiClient) => {
  return {
    /**
     * List all subcategories
     *
     * @returns List of subcategories
     */
    list: () => apiClient.get<ApiResponse<SubcategoryResponse[]>>('/api/v1/subcategories'),

    /**
     * Get subcategory by ID
     *
     * @param id - Subcategory ID
     * @returns Subcategory details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<SubcategoryResponse>>(`/api/v1/subcategories/${id}`),

    /**
     * Get subcategory by name
     *
     * @param name - Subcategory name
     * @returns Subcategory details
     */
    getByName: (name: string) =>
      apiClient.get<ApiResponse<SubcategoryResponse>>(`/api/v1/subcategories/name/${name}`),

    /**
     * Get subcategories by category ID
     *
     * @param categoryId - Category ID
     * @returns List of subcategories for the category
     */
    getByCategory: (categoryId: string) =>
      apiClient.get<ApiResponse<SubcategoryResponse[]>>(
        `/api/v1/subcategories/category/${categoryId}`
      ),

    /**
     * Create new subcategory
     *
     * @param data - Subcategory creation data
     * @returns Created subcategory
     */
    create: (data: CreateSubcategoryRequest) =>
      apiClient.post<ApiResponse<SubcategoryResponse>>('/api/v1/subcategories', data),

    /**
     * Update subcategory
     *
     * @param id - Subcategory ID
     * @param data - Subcategory update data
     * @returns Updated subcategory
     */
    update: (id: string, data: UpdateSubcategoryRequest) =>
      apiClient.patch<ApiResponse<SubcategoryResponse>>(`/api/v1/subcategories/${id}`, data),

    /**
     * Delete subcategory
     *
     * @param id - Subcategory ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/subcategories/${id}`),
  };
};

export default createSubcategoryService;





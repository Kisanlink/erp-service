import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/index.js';

/**
 * Creates category service for managing product categories
 *
 * @param apiClient - Configured API client instance
 * @returns Category service methods
 *
 * @example
 * ```typescript
 * const categoryService = createCategoryService(apiClient);
 * const categories = await categoryService.list();
 * ```
 */
const createCategoryService = (apiClient: ApiClient) => {
  return {
    /**
     * List all categories with subcategories
     *
     * @returns List of categories with their subcategories
     */
    list: () => apiClient.get<ApiResponse<CategoryResponse[]>>('/api/v1/categories'),

    /**
     * Get category by ID with subcategories
     *
     * @param id - Category ID
     * @returns Category details with subcategories
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<CategoryResponse>>(`/api/v1/categories/${id}`),

    /**
     * Get category by name with subcategories
     *
     * @param name - Category name
     * @returns Category details with subcategories
     */
    getByName: (name: string) =>
      apiClient.get<ApiResponse<CategoryResponse>>(`/api/v1/categories/name/${name}`),

    /**
     * Create new category
     *
     * @param data - Category creation data
     * @returns Created category
     */
    create: (data: CreateCategoryRequest) =>
      apiClient.post<ApiResponse<CategoryResponse>>('/api/v1/categories', data),

    /**
     * Update category
     *
     * @param id - Category ID
     * @param data - Category update data
     * @returns Updated category
     */
    update: (id: string, data: UpdateCategoryRequest) =>
      apiClient.patch<ApiResponse<CategoryResponse>>(`/api/v1/categories/${id}`, data),

    /**
     * Delete category
     *
     * @param id - Category ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/categories/${id}`),

    /**
     * Seed predefined categories (admin-only, idempotent)
     *
     * @returns Seeding result message
     */
    seed: () =>
      apiClient.post<ApiResponse<{ message: string }>>('/api/v1/categories/seed', {}),
  };
};

export default createCategoryService;



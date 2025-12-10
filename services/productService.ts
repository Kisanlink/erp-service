import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductWithPricesResponse,
  ProductVariantResponse,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  ProductPriceResponse,
  CreateProductPriceRequest,
  UpdateProductPriceRequest,
  TopSellingProductResponse,
} from '../types/index.js';

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  success_count: number;
  error_count: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

/**
 * Creates product service with all product-related operations
 *
 * @param apiClient - Configured API client instance
 * @returns Product service methods
 *
 * @example
 * ```typescript
 * const productService = createProductService(apiClient);
 * const products = await productService.list({ is_active: true });
 * ```
 */
const createProductService = (apiClient: ApiClient) => {
  return {
    /**
     * List products with optional filters
     *
     * @param params - Filter parameters
     * @returns List of products
     */
    list: (params?: {
      search?: string;
      category?: string;
      is_active?: boolean;
      is_perishable?: boolean;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<ProductResponse[]>>('/api/v1/products', { params }),

    /**
     * Get product by ID
     *
     * @param id - Product ID
     * @returns Product details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<ProductResponse>>(`/api/v1/products/${id}`),

    /**
     * Get product with detailed pricing information
     *
     * @param id - Product ID
     * @returns Product with prices
     */
    getWithPrices: (id: string) =>
      apiClient.get<ApiResponse<ProductWithPricesResponse>>(`/api/v1/products/${id}/detailed`),

    /**
     * Create new product
     *
     * @param payload - Product creation data
     * @returns Created product
     */
    create: (payload: CreateProductRequest) =>
      apiClient.post<ApiResponse<ProductResponse>>('/api/v1/products', payload),

    /**
     * Update existing product
     *
     * @param id - Product ID
     * @param payload - Product update data
     * @returns Updated product
     */
    update: (id: string, payload: UpdateProductRequest) =>
      apiClient.patch<ApiResponse<ProductResponse>>(`/api/v1/products/${id}`, payload),

    /**
     * Delete product
     *
     * @param id - Product ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/products/${id}`),

    /**
     * Bulk create products
     *
     * @param products - Array of product creation requests
     * @returns Bulk operation result
     */
    bulkCreate: (products: CreateProductRequest[]) =>
      apiClient.post<ApiResponse<BulkOperationResponse>>('/api/v1/products/bulk', { products }),

    /**
     * Bulk update products
     *
     * @param updates - Array of product updates with IDs
     * @returns Bulk operation result
     */
    bulkUpdate: (updates: Array<{ id: string } & UpdateProductRequest>) =>
      apiClient.put<ApiResponse<BulkOperationResponse>>('/api/v1/products/bulk', { updates }),

    /**
     * Product variant management operations
     */
    variants: {
      /**
       * List variants for a product
       *
       * @param productId - Product ID
       * @returns List of variants
       */
      list: (productId: string) =>
        apiClient.get<ApiResponse<ProductVariantResponse[]>>(`/api/v1/products/${productId}/variants`),

      /**
       * Get specific variant
       *
       * @param productId - Product ID
       * @param variantId - Variant ID
       * @returns Variant details
       */
      get: (productId: string, variantId: string) =>
        apiClient.get<ApiResponse<ProductVariantResponse>>(`/api/v1/products/${productId}/variants/${variantId}`),

      /**
       * Create product variant
       *
       * @param productId - Product ID
       * @param payload - Variant creation data
       * @returns Created variant
       */
      create: (productId: string, payload: CreateProductVariantRequest) =>
        apiClient.post<ApiResponse<ProductVariantResponse>>(`/api/v1/products/${productId}/variants`, payload),

      /**
       * Update product variant
       *
       * @param id - Variant ID
       * @param payload - Variant update data
       * @returns Updated variant
       */
      update: (id: string, payload: UpdateProductVariantRequest) =>
        apiClient.put<ApiResponse<ProductVariantResponse>>(`/api/v1/product-variants/${id}`, payload),

      /**
       * Delete product variant
       *
       * @param id - Variant ID
       * @returns Void on success
       */
      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/product-variants/${id}`),

      /**
       * Variant pricing management operations
       */
      prices: {
        /**
         * List prices for a variant
         *
         * @param variantId - Variant ID
         * @returns List of prices for the variant
         */
        list: (variantId: string) =>
          apiClient.get<ApiResponse<ProductPriceResponse[]>>(`/api/v1/variants/${variantId}/prices`),

        /**
         * Get active price for a variant
         *
         * @param variantId - Variant ID
         * @param priceType - Price type filter (PURCHASE, SALE, MRP)
         * @returns Active price
         */
        getActive: (variantId: string, priceType?: 'PURCHASE' | 'SALE' | 'MRP') =>
          apiClient.get<ApiResponse<ProductPriceResponse>>(`/api/v1/variants/${variantId}/prices/active`, {
            params: { price_type: priceType },
          }),

        /**
         * Create price for a variant
         *
         * @param variantId - Variant ID
         * @param payload - Price creation data (variant_id will be added automatically)
         * @returns Created price
         */
        create: (variantId: string, payload: Omit<CreateProductPriceRequest, 'variant_id'>) =>
          apiClient.post<ApiResponse<ProductPriceResponse>>(`/api/v1/variants/${variantId}/prices`, {
            ...payload,
            variant_id: variantId,
          }),

        /**
         * Update variant price
         *
         * @param variantId - Variant ID
         * @param priceId - Price ID
         * @param payload - Price update data
         * @returns Updated price
         */
        update: (variantId: string, priceId: string, payload: UpdateProductPriceRequest) =>
          apiClient.put<ApiResponse<ProductPriceResponse>>(`/api/v1/variants/${variantId}/prices/${priceId}`, payload),

        /**
         * Delete variant price
         *
         * @param variantId - Variant ID
         * @param priceId - Price ID
         * @returns Void on success
         */
        delete: (variantId: string, priceId: string) =>
          apiClient.delete<ApiResponse<void>>(`/api/v1/variants/${variantId}/prices/${priceId}`),
      },
    },

    /**
     * Product pricing management operations
     */
    prices: {
      /**
       * List prices for a product
       *
       * @param productId - Product ID
       * @returns List of prices
       */
      list: (productId: string) =>
        apiClient.get<ApiResponse<ProductPriceResponse[]>>(`/api/v1/products/${productId}/prices`),

      /**
       * Get active/current price for a product
       *
       * @param productId - Product ID
       * @param priceType - Price type filter (PURCHASE, SALE, MRP)
       * @returns Active price
       */
      getActive: (productId: string, priceType?: 'PURCHASE' | 'SALE' | 'MRP') =>
        apiClient.get<ApiResponse<ProductPriceResponse>>(`/api/v1/products/${productId}/prices/active`, {
          params: { price_type: priceType },
        }),

      /**
       * Get current price for a product (alias for getActive)
       *
       * @param productId - Product ID
       * @param type - Price type (default: retail)
       * @returns Current active price
       */
      getCurrent: (productId: string, type: string = 'retail') =>
        apiClient.get<ApiResponse<ProductPriceResponse>>(`/api/v1/products/${productId}/prices/current`, {
          params: { type },
        }),

      /**
       * Create product price
       *
       * @param payload - Price creation data
       * @returns Created price
       */
      create: (payload: CreateProductPriceRequest) =>
        apiClient.post<ApiResponse<ProductPriceResponse>>('/api/v1/product-prices', payload),

      /**
       * Update product price
       *
       * @param id - Price ID
       * @param payload - Price update data
       * @returns Updated price
       */
      update: (id: string, payload: UpdateProductPriceRequest) =>
        apiClient.put<ApiResponse<ProductPriceResponse>>(`/api/v1/product-prices/${id}`, payload),

      /**
       * Delete product price
       *
       * @param id - Price ID
       * @returns Void on success
       */
      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/product-prices/${id}`),

      /**
       * Bulk update product prices
       *
       * @param updates - Array of price updates
       * @returns Bulk operation result
       */
      bulkUpdate: (updates: Array<{ product_id: string; variant_id?: string; price_type: string; price: number }>) =>
        apiClient.post<ApiResponse<BulkOperationResponse>>('/api/v1/product-prices/bulk-update', { updates }),

      /**
       * Get a specific price by ID
       *
       * @param id - Price ID
       * @returns Price details
       */
      get: (id: string) =>
        apiClient.get<ApiResponse<ProductPriceResponse>>(`/api/v1/prices/${id}`),

      /**
       * Update a specific price by ID (using PATCH)
       *
       * @param id - Price ID
       * @param payload - Price update data
       * @returns Updated price
       */
      patch: (id: string, payload: UpdateProductPriceRequest) =>
        apiClient.patch<ApiResponse<ProductPriceResponse>>(`/api/v1/prices/${id}`, payload),

      /**
       * Delete a specific price by ID
       *
       * @param id - Price ID
       * @returns Void on success
       */
      deleteById: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/api/v1/prices/${id}`),

      /**
       * Get all expired prices
       *
       * @returns List of expired prices
       */
      getExpired: () =>
        apiClient.get<ApiResponse<ProductPriceResponse[]>>('/api/v1/prices/expired'),
    },

    /**
     * Search products by query
     *
     * @param query - Search query string
     * @param params - Additional filter parameters
     * @returns Search results
     */
    search: (query: string, params?: {
      category?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<ProductResponse[]>>('/api/v1/products/search', {
      params: { q: query, ...params },
    }),

    /**
     * Get products by category ID
     *
     * @param categoryId - Category ID
     * @param params - Additional filter parameters
     * @returns Products in category
     */
    getByCategory: (categoryId: string, params?: {
      subcategory_id?: string;
      limit?: number;
      offset?: number;
      is_active?: boolean;
    }) =>
      apiClient.get<ApiResponse<ProductResponse[]>>(`/api/v1/products/category/${categoryId}`, { params }),

    /**
     * Get product by barcode
     *
     * @param barcode - Product barcode
     * @returns Product details
     */
    getByBarcode: (barcode: string) =>
      apiClient.get<ApiResponse<ProductResponse>>(`/api/v1/products/barcode/${barcode}`),

    /**
     * Get top selling products
     *
     * @param params - Date range and limit
     * @returns Top selling products
     */
    getTopSelling: (params?: {
      from_date?: string;
      to_date?: string;
      limit?: number;
    }) => apiClient.get<ApiResponse<TopSellingProductResponse[]>>('/api/v1/products/top-selling', { params }),

    /**
     * Get slow moving products
     *
     * @param days - Number of days to consider (default: 90)
     * @returns Slow moving products
     */
    getSlowMoving: (days: number = 90) =>
      apiClient.get<ApiResponse<ProductResponse[]>>('/api/v1/products/slow-moving', {
        params: { days },
      }),

    /**
     * Get products filtered by total inventory quantity across all warehouses
     *
     * @param params - Filter parameters
     * @returns Products within the specified quantity range
     */
    getByQuantity: (params: {
      min: number;
      max: number;
      limit?: number;
      offset?: number;
    }) =>
      apiClient.get<ApiResponse<ProductResponse[]>>('/api/v1/products/by-quantity', {
        params,
      }),
  };
};

export default createProductService;

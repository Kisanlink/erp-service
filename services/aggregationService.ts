import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  ProductResponse,
  ProductVariantResponse,
  PurchaseOrderResponse,
  InventoryBatchResponse,
} from '../types/index.js';

/**
 * Product detail aggregation response
 */
export interface ProductDetailResponse {
  product: ProductResponse;
  variants?: ProductVariantResponse[];
  prices?: any[];
  inventory?: any[];
  collaborators?: any[];
  taxes?: any[];
}

/**
 * Variant detail aggregation response
 */
export interface VariantDetailResponse {
  variant: ProductVariantResponse;
  prices?: any[];
  inventory?: any[];
  product?: ProductResponse;
  collaborator?: any;
  taxes?: any[];
}

/**
 * Sales context aggregation response
 */
export interface SalesContextResponse {
  products?: ProductResponse[];
  variants?: ProductVariantResponse[];
  inventory?: any[];
  warehouses?: any[];
}

/**
 * Purchase order detail aggregation response
 */
export interface PurchaseOrderDetailResponse {
  purchase_order: PurchaseOrderResponse;
  collaborator?: any;
  warehouse?: any;
  items?: any[];
  grns?: any[];
  inventory?: any[];
  payments?: any[];
  timeline?: any[];
}

/**
 * Creates aggregation service for performance-optimized data fetching
 *
 * Reduces frontend API calls by 75-85% through data aggregation.
 *
 * @param apiClient - Configured API client instance
 * @returns Aggregation service methods
 *
 * @example
 * ```typescript
 * const aggregationService = createAggregationService(apiClient);
 *
 * // Get full product with variants, prices, and inventory in one call
 * const productDetail = await aggregationService.getProductDetail('PROD_001', {
 *   include: 'variants,prices,inventory',
 *   warehouse_id: 'WH_001'
 * });
 * ```
 */
const createAggregationService = (apiClient: ApiClient) => {
  return {
    /**
     * Get detailed product information with optional related data
     *
     * @param id - Product ID
     * @param params - Query parameters for filtering and including related data
     * @returns Product detail with optional variants, prices, inventory, collaborators, taxes
     *
     * @example
     * ```typescript
     * const detail = await aggregationService.getProductDetail('PROD_001', {
     *   include: 'variants,prices,inventory',
     *   warehouse_id: 'WH_001',
     *   price_type: 'retail',
     *   active_only: true
     * });
     * ```
     */
    getProductDetail: (
      id: string,
      params?: {
        include?: string; // Comma-separated: variants,prices,inventory,collaborators,taxes
        warehouse_id?: string;
        price_type?: 'retail' | 'wholesale' | 'bulk' | 'all';
        active_only?: boolean;
        in_stock_only?: boolean;
      }
    ) =>
      apiClient.get<ApiResponse<ProductDetailResponse>>(`/api/v1/products/${id}/detail`, { params }),

    /**
     * Get detailed variant information with optional related data
     *
     * @param id - Variant ID
     * @param params - Query parameters for filtering and including related data
     * @returns Variant detail with optional prices, inventory, product, collaborator, taxes
     *
     * @example
     * ```typescript
     * const detail = await aggregationService.getVariantDetail('VAR_001', {
     *   include: 'prices,inventory,product',
     *   warehouse_id: 'WH_001'
     * });
     * ```
     */
    getVariantDetail: (
      id: string,
      params?: {
        include?: string; // Comma-separated: prices,inventory,product,collaborator,taxes
        warehouse_id?: string;
      }
    ) =>
      apiClient.get<ApiResponse<VariantDetailResponse>>(`/api/v1/products/variants/${id}/detail`, { params }),

    /**
     * Get sales context data for POS/sales workflows
     *
     * Returns products, variants, inventory, and warehouses needed for sales operations.
     *
     * @param params - Query parameters for filtering
     * @returns Sales context with products, variants, inventory, warehouses
     *
     * @example
     * ```typescript
     * const context = await aggregationService.getSalesContext({
     *   warehouse_id: 'WH_001',
     *   include_zero_stock: false,
     *   price_type: 'retail',
     *   effective_date: '2025-12-01T00:00:00Z'
     * });
     * ```
     */
    getSalesContext: (params?: {
      warehouse_id?: string;
      include_zero_stock?: boolean;
      price_type?: string;
      effective_date?: string; // ISO date string
    }) => apiClient.get<ApiResponse<SalesContextResponse>>('/api/v1/sales/context', { params }),

    /**
     * Get detailed purchase order information with optional related data
     *
     * @param id - Purchase order ID
     * @param params - Query parameters for including related data
     * @returns Purchase order detail with optional collaborator, warehouse, items, GRNs, inventory, payments, timeline
     *
     * @example
     * ```typescript
     * const detail = await aggregationService.getPurchaseOrderDetail('PO_001', {
     *   include: 'collaborator,warehouse,items,grns,inventory,payments,timeline'
     * });
     * ```
     */
    getPurchaseOrderDetail: (
      id: string,
      params?: {
        include?: string; // Comma-separated: collaborator,warehouse,items,grns,inventory,payments,timeline
      }
    ) =>
      apiClient.get<ApiResponse<PurchaseOrderDetailResponse>>(`/api/v1/purchase-orders/${id}/detail`, { params }),

    /**
     * List inventory batches with filters and optional related data
     *
     * @param params - Query parameters for filtering and including related data
     * @returns List of inventory batches with optional variant, product, warehouse, prices, taxes
     *
     * @example
     * ```typescript
     * const batches = await aggregationService.listBatches({
     *   warehouse_id: 'WH_001',
     *   variant_id: 'VAR_001',
     *   in_stock_only: true,
     *   include: 'variant,product,warehouse',
     *   sort_by: 'expiry_date',
     *   sort_order: 'asc',
     *   limit: 50,
     *   offset: 0
     * });
     * ```
     */
    listBatches: (params?: {
      warehouse_id?: string;
      variant_id?: string;
      product_id?: string;
      category?: string;
      in_stock_only?: boolean;
      expiring_soon?: boolean;
      low_stock_threshold?: number;
      include?: string; // Comma-separated: variant,product,warehouse,prices,taxes
      sort_by?: string;
      sort_order?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<InventoryBatchResponse[]>>('/api/v1/inventory/batches/list', { params }),
  };
};

export default createAggregationService;


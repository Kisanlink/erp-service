import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  BaseReportFilter,
  ProductReportFilter,
  ProductReportResponse,
  VendorReportFilter,
  VendorReportResponse,
  CustomerReportFilter,
  CustomerReportResponse,
  InventoryReportFilter,
  InventoryReportResponse,
  PurchaseReportFilter,
  PurchaseReportResponse,
  SalesReportFilter,
  SalesReportResponse,
  ReturnsReportFilter,
  ReturnsReportResponse,
} from '../types/index.js';

/**
 * Converts filter object to query params, handling undefined values
 */
function toQueryParams<T extends BaseReportFilter>(
  filter?: T
): Record<string, string | number | boolean | undefined> | undefined {
  if (!filter) return undefined;

  const params: Record<string, string | number | boolean | undefined> = {};

  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        params[key] = value;
      } else if (typeof value === 'number') {
        params[key] = value;
      } else {
        params[key] = String(value);
      }
    }
  }

  return Object.keys(params).length > 0 ? params : undefined;
}

/**
 * Creates report service for generating and exporting business reports
 *
 * @param apiClient - Configured API client instance
 * @returns Report service methods
 *
 * @example
 * ```typescript
 * const reportService = createReportService(apiClient);
 *
 * // Get sales report as JSON
 * const salesReport = await reportService.sales({
 *   start_date: '2024-01-01',
 *   end_date: '2024-01-31',
 *   warehouse_id: 'WH_001'
 * });
 *
 * // Export inventory report as Excel
 * const excelBlob = await reportService.inventory({ format: 'xlsx' });
 *
 * // Get product master report with pagination
 * const products = await reportService.products({
 *   limit: 100,
 *   offset: 0,
 *   is_active: true
 * });
 * ```
 */
const createReportService = (apiClient: ApiClient) => {
  /**
   * Helper to handle report requests that may return JSON or binary (xlsx/pdf)
   */
  const getReport = async <T, F extends BaseReportFilter>(
    endpoint: string,
    filter?: F
  ): Promise<ApiResponse<T> | Blob> => {
    const params = toQueryParams(filter);
    const format = filter?.format;

    // For xlsx/pdf formats, we need to handle binary response
    if (format === 'xlsx' || format === 'pdf') {
      const response = await apiClient.get<Blob>(endpoint, {
        params,
        headers: {
          Accept:
            format === 'xlsx'
              ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              : 'application/pdf',
        },
      });
      return response;
    }

    // Default JSON response
    return apiClient.get<ApiResponse<T>>(endpoint, { params });
  };

  return {
    /**
     * Generate product master report
     *
     * Returns product catalog with variant counts, stock levels, and activity status.
     *
     * @param filter - Filter and pagination parameters
     * @returns Product report data or binary file (xlsx/pdf)
     *
     * @example
     * ```typescript
     * // Get active products with variants
     * const report = await reportService.products({
     *   is_active: true,
     *   has_variants: true,
     *   limit: 50
     * });
     *
     * // Search products
     * const searchResults = await reportService.products({
     *   search: 'fertilizer'
     * });
     *
     * // Export to Excel
     * const excel = await reportService.products({ format: 'xlsx' });
     * ```
     */
    products: (filter?: ProductReportFilter) =>
      getReport<ProductReportResponse, ProductReportFilter>('/api/v1/reports/products', filter),

    /**
     * Generate vendor/supplier master report
     *
     * Returns vendor information with contact details, GST status, and purchase order values.
     *
     * @param filter - Filter and pagination parameters
     * @returns Vendor report data or binary file (xlsx/pdf)
     *
     * @example
     * ```typescript
     * // Get all active vendors with GST
     * const report = await reportService.vendors({
     *   is_active: true,
     *   has_gst: true
     * });
     *
     * // Search vendors
     * const searchResults = await reportService.vendors({
     *   search: 'ABC Suppliers'
     * });
     * ```
     */
    vendors: (filter?: VendorReportFilter) =>
      getReport<VendorReportResponse, VendorReportFilter>('/api/v1/reports/vendors', filter),

    /**
     * Generate customer report
     *
     * Returns customer purchase history with revenue metrics and warehouse associations.
     *
     * @param filter - Filter and pagination parameters
     * @returns Customer report data or binary file (xlsx/pdf)
     *
     * @example
     * ```typescript
     * // Get high-value customers
     * const report = await reportService.customers({
     *   min_purchase_value: 50000,
     *   start_date: '2024-01-01',
     *   end_date: '2024-12-31'
     * });
     *
     * // Filter by warehouse
     * const warehouseCustomers = await reportService.customers({
     *   warehouse_id: 'WH_001'
     * });
     * ```
     */
    customers: (filter?: CustomerReportFilter) =>
      getReport<CustomerReportResponse, CustomerReportFilter>('/api/v1/reports/customers', filter),

    /**
     * Generate inventory report
     *
     * Returns inventory batches with stock levels, valuations, and expiry tracking.
     *
     * @param filter - Filter and pagination parameters
     * @returns Inventory report data or binary file (xlsx/pdf)
     *
     * @example
     * ```typescript
     * // Get low stock items
     * const lowStock = await reportService.inventory({
     *   low_stock: true
     * });
     *
     * // Get items expiring soon
     * const expiring = await reportService.inventory({
     *   expiring_soon: true
     * });
     *
     * // Filter by warehouse and product
     * const warehouseInventory = await reportService.inventory({
     *   warehouse_id: 'WH_001',
     *   product_id: 'PROD_001'
     * });
     * ```
     */
    inventory: (filter?: InventoryReportFilter) =>
      getReport<InventoryReportResponse, InventoryReportFilter>('/api/v1/reports/inventory', filter),

    /**
     * Generate purchase orders report
     *
     * Returns purchase order history with payment status, delivery tracking, and vendor breakdown.
     *
     * @param filter - Filter and pagination parameters
     * @returns Purchase report data or binary file (xlsx/pdf)
     *
     * @example
     * ```typescript
     * // Get orders by status
     * const pendingOrders = await reportService.purchases({
     *   status: 'confirmed,out_for_delivery',
     *   payment_status: 'unpaid,partial'
     * });
     *
     * // Filter by vendor and date range
     * const vendorOrders = await reportService.purchases({
     *   collaborator_id: 'CLAB_001',
     *   start_date: '2024-01-01',
     *   end_date: '2024-03-31'
     * });
     *
     * // Search by PO number
     * const poSearch = await reportService.purchases({
     *   po_number: 'PO-2024-001'
     * });
     * ```
     */
    purchases: (filter?: PurchaseReportFilter) =>
      getReport<PurchaseReportResponse, PurchaseReportFilter>('/api/v1/reports/purchases', filter),

    /**
     * Generate sales report
     *
     * Returns sales transactions with revenue, tax, margin analysis, and payment breakdown.
     *
     * @param filter - Filter and pagination parameters
     * @returns Sales report data or binary file (xlsx/pdf)
     *
     * @example
     * ```typescript
     * // Get monthly sales report
     * const monthlySales = await reportService.sales({
     *   start_date: '2024-01-01',
     *   end_date: '2024-01-31',
     *   warehouse_id: 'WH_001'
     * });
     *
     * // Filter by payment mode and sale type
     * const cashSales = await reportService.sales({
     *   payment_mode: 'cash',
     *   sale_type: 'in_store'
     * });
     *
     * // Get high-value sales
     * const highValue = await reportService.sales({
     *   min_amount: 10000
     * });
     *
     * // Export to PDF
     * const pdf = await reportService.sales({
     *   format: 'pdf',
     *   start_date: '2024-01-01',
     *   end_date: '2024-01-31'
     * });
     * ```
     */
    sales: (filter?: SalesReportFilter) =>
      getReport<SalesReportResponse, SalesReportFilter>('/api/v1/reports/sales', filter),

    /**
     * Generate returns report
     *
     * Returns return transactions with refund amounts, status breakdown, and warehouse tracking.
     *
     * @param filter - Filter and pagination parameters
     * @returns Returns report data or binary file (xlsx/pdf)
     *
     * @example
     * ```typescript
     * // Get pending returns
     * const pendingReturns = await reportService.returns({
     *   status: 'pending'
     * });
     *
     * // Get returns for a specific sale
     * const saleReturns = await reportService.returns({
     *   sale_id: 'SALE_001'
     * });
     *
     * // Filter by refund amount range
     * const highRefunds = await reportService.returns({
     *   min_refund: 5000,
     *   max_refund: 50000
     * });
     *
     * // Get returns by date range
     * const monthlyReturns = await reportService.returns({
     *   start_date: '2024-01-01',
     *   end_date: '2024-01-31',
     *   warehouse_id: 'WH_001'
     * });
     * ```
     */
    returns: (filter?: ReturnsReportFilter) =>
      getReport<ReturnsReportResponse, ReturnsReportFilter>('/api/v1/reports/returns', filter),
  };
};

export default createReportService;

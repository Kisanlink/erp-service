/**
 * TypeScript type definitions for Reports API
 * Supports 7 report types: products, vendors, customers, inventory, purchases, sales, returns
 */

// ============================================================================
// Common Report Types
// ============================================================================

/**
 * Report output format
 */
export type ReportFormat = 'json' | 'xlsx' | 'pdf';

/**
 * Sort order for report queries
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Base filter parameters common to all reports
 */
export interface BaseReportFilter {
  /** Output format: json (default), xlsx, or pdf */
  format?: ReportFormat;
  /** Records per page (default: 50, max: 500) */
  limit?: number;
  /** Records to skip for pagination (default: 0) */
  offset?: number;
  /** Field to sort by */
  sort_by?: string;
  /** Sort order: asc or desc */
  sort_order?: SortOrder;
}

/**
 * Pagination information in report responses
 */
export interface ReportPagination {
  /** Total number of records */
  total: number;
  /** Records per page */
  limit: number;
  /** Records skipped */
  offset: number;
  /** Whether more records exist */
  has_more: boolean;
}

/**
 * Generic report response wrapper
 */
export interface ReportResponse<TSummary, TRecord> {
  /** Report type identifier */
  report_type: string;
  /** Timestamp when report was generated */
  generated_at: string;
  /** Filters that were applied */
  filters_applied?: Record<string, unknown>;
  /** Aggregated summary data */
  summary: TSummary;
  /** Individual report records */
  records: TRecord[];
  /** Pagination information */
  pagination?: ReportPagination;
}

// ============================================================================
// Product Report Types
// ============================================================================

/**
 * Filter parameters for product master report
 */
export interface ProductReportFilter extends BaseReportFilter {
  /** Search by product name or description */
  search?: string;
  /** Filter products with/without variants */
  has_variants?: boolean;
  /** Filter by active status */
  is_active?: boolean;
}

/**
 * Summary statistics for product report
 */
export interface ProductReportSummary {
  /** Total number of products */
  total_products: number;
  /** Total number of variants across all products */
  total_variants: number;
  /** Number of products with stock available */
  products_with_stock: number;
}

/**
 * Individual product record in report
 */
export interface ProductReportRecord {
  /** Product ID */
  id: string;
  /** Product name */
  name: string;
  /** Product description */
  description?: string;
  /** External reference ID */
  external_id?: string;
  /** Number of variants for this product */
  variant_count: number;
  /** Total stock across all variants */
  total_stock: number;
  /** Product creation timestamp */
  created_at: string;
  /** Product last update timestamp */
  updated_at: string;
}

/**
 * Product master report response
 */
export type ProductReportResponse = ReportResponse<ProductReportSummary, ProductReportRecord>;

// ============================================================================
// Vendor Report Types
// ============================================================================

/**
 * Filter parameters for vendor master report
 */
export interface VendorReportFilter extends BaseReportFilter {
  /** Search by company name, contact person, or GST */
  search?: string;
  /** Filter by active status */
  is_active?: boolean;
  /** Filter vendors with/without GST */
  has_gst?: boolean;
}

/**
 * Summary statistics for vendor report
 */
export interface VendorReportSummary {
  /** Total number of vendors */
  total_vendors: number;
  /** Number of active vendors */
  active_vendors: number;
  /** Number of vendors with GST registered */
  vendors_with_gst: number;
  /** Total value of all purchase orders */
  total_po_value: number;
}

/**
 * Individual vendor record in report
 */
export interface VendorReportRecord {
  /** Vendor/Collaborator ID */
  id: string;
  /** Company name */
  company_name: string;
  /** Contact person name */
  contact_person?: string;
  /** Contact phone number */
  contact_number?: string;
  /** Email address */
  email?: string;
  /** GST registration number */
  gst_number?: string;
  /** PAN number */
  pan_number?: string;
  /** Bank account number */
  bank_account_no?: string;
  /** Bank IFSC code */
  bank_ifsc?: string;
  /** Bank name */
  bank_name?: string;
  /** Whether vendor is active */
  is_active: boolean;
  /** Number of products from this vendor */
  product_count: number;
  /** Total purchase order value from this vendor */
  total_po_value: number;
  /** Vendor creation timestamp */
  created_at: string;
  /** Vendor last update timestamp */
  updated_at: string;
}

/**
 * Vendor master report response
 */
export type VendorReportResponse = ReportResponse<VendorReportSummary, VendorReportRecord>;

// ============================================================================
// Customer Report Types
// ============================================================================

/**
 * Filter parameters for customer report
 */
export interface CustomerReportFilter extends BaseReportFilter {
  /** Search by farmer ID */
  search?: string;
  /** Filter by warehouse ID */
  warehouse_id?: string;
  /** Minimum total purchase value */
  min_purchase_value?: number;
  /** Maximum total purchase value */
  max_purchase_value?: number;
  /** Filter start date (YYYY-MM-DD) */
  start_date?: string;
  /** Filter end date (YYYY-MM-DD) */
  end_date?: string;
}

/**
 * Summary statistics for customer report
 */
export interface CustomerReportSummary {
  /** Total number of customers */
  total_customers: number;
  /** Total revenue from all customers */
  total_revenue: number;
  /** Average purchase value per customer */
  average_purchase_value: number;
}

/**
 * Individual customer record in report
 */
export interface CustomerReportRecord {
  /** Customer ID */
  customer_id: string;
  /** Total number of purchases */
  total_purchases: number;
  /** Total amount spent */
  total_amount: number;
  /** Date of last purchase */
  last_purchase_date?: string;
  /** Warehouse ID where customer shops */
  warehouse_id: string;
  /** Warehouse name */
  warehouse_name: string;
  /** Number of purchase transactions */
  purchase_count: number;
}

/**
 * Customer report response
 */
export type CustomerReportResponse = ReportResponse<CustomerReportSummary, CustomerReportRecord>;

// ============================================================================
// Inventory Report Types
// ============================================================================

/**
 * Filter parameters for inventory report
 */
export interface InventoryReportFilter extends BaseReportFilter {
  /** Filter by warehouse ID */
  warehouse_id?: string;
  /** Filter by product ID */
  product_id?: string;
  /** Filter by variant ID */
  variant_id?: string;
  /** Show only low stock items */
  low_stock?: boolean;
  /** Show items expiring within 30 days */
  expiring_soon?: boolean;
  /** Include expired items */
  expired?: boolean;
  /** Minimum quantity filter */
  min_quantity?: number;
  /** Maximum quantity filter */
  max_quantity?: number;
}

/**
 * Summary statistics for inventory report
 */
export interface InventoryReportSummary {
  /** Total number of inventory batches */
  total_batches: number;
  /** Total quantity across all batches */
  total_quantity: number;
  /** Total inventory value */
  total_value: number;
  /** Number of items expiring soon */
  expiring_soon_count: number;
  /** Number of low stock items */
  low_stock_count: number;
}

/**
 * Individual inventory batch record in report
 */
export interface InventoryReportRecord {
  /** Batch ID */
  batch_id: string;
  /** Warehouse ID */
  warehouse_id: string;
  /** Warehouse name */
  warehouse_name: string;
  /** Product variant ID */
  variant_id: string;
  /** Product name */
  product_name: string;
  /** Variant SKU */
  variant_sku: string;
  /** Total quantity in batch */
  total_quantity: number;
  /** Cost price per unit */
  cost_price: number;
  /** Total value of batch */
  total_value: number;
  /** Expiry date */
  expiry_date?: string;
  /** Days until expiry */
  days_to_expiry?: number;
  /** CGST tax rate */
  cgst_rate?: number;
  /** SGST tax rate */
  sgst_rate?: number;
  /** Whether batch is tax exempt */
  is_tax_exempt?: boolean;
  /** Batch creation timestamp */
  created_at: string;
  /** Batch last update timestamp */
  updated_at: string;
}

/**
 * Inventory report response
 */
export type InventoryReportResponse = ReportResponse<InventoryReportSummary, InventoryReportRecord>;

// ============================================================================
// Purchase Report Types
// ============================================================================

/**
 * Filter parameters for purchase orders report
 */
export interface PurchaseReportFilter extends BaseReportFilter {
  /** Filter by vendor/collaborator ID */
  collaborator_id?: string;
  /** Filter by warehouse ID */
  warehouse_id?: string;
  /** Filter by status (comma-separated for multiple) */
  status?: string;
  /** Filter by payment status (comma-separated for multiple) */
  payment_status?: string;
  /** Search by PO number */
  po_number?: string;
  /** Filter start date (YYYY-MM-DD) */
  start_date?: string;
  /** Filter end date (YYYY-MM-DD) */
  end_date?: string;
}

/**
 * Status breakdown in purchase report summary
 */
export interface PurchaseStatusBreakdown {
  draft?: number;
  confirmed?: number;
  delivered?: number;
  cancelled?: number;
  [key: string]: number | undefined;
}

/**
 * Summary statistics for purchase report
 */
export interface PurchaseReportSummary {
  /** Total number of purchase orders */
  total_orders: number;
  /** Total amount of all orders */
  total_amount: number;
  /** Total paid amount */
  paid_amount: number;
  /** Total outstanding amount */
  outstanding_amount: number;
  /** Breakdown by order status */
  by_status: PurchaseStatusBreakdown;
}

/**
 * Individual purchase order record in report
 */
export interface PurchaseReportRecord {
  /** Purchase order ID */
  id: string;
  /** PO number */
  po_number: string;
  /** External order reference ID */
  external_order_id?: string;
  /** Vendor/Collaborator ID */
  collaborator_id: string;
  /** Vendor/Collaborator name */
  collaborator_name: string;
  /** Warehouse ID */
  warehouse_id: string;
  /** Warehouse name */
  warehouse_name: string;
  /** Order date */
  order_date: string;
  /** Expected delivery date */
  expected_delivery_date?: string;
  /** Actual delivery date */
  actual_delivery_date?: string;
  /** Order status */
  status: string;
  /** Payment status */
  payment_status: string;
  /** Total order amount */
  total_amount: number;
  /** Amount paid */
  paid_amount: number;
  /** Outstanding amount */
  outstanding_amount: number;
  /** Number of items in order */
  item_count: number;
  /** Order creation timestamp */
  created_at: string;
  /** Order last update timestamp */
  updated_at: string;
}

/**
 * Purchase orders report response
 */
export type PurchaseReportResponse = ReportResponse<PurchaseReportSummary, PurchaseReportRecord>;

// ============================================================================
// Sales Report Types
// ============================================================================

/**
 * Filter parameters for sales report
 */
export interface SalesReportFilter extends BaseReportFilter {
  /** Filter by warehouse ID */
  warehouse_id?: string;
  /** Filter by customer ID */
  customer_id?: string;
  /** Filter by status (comma-separated for multiple) */
  status?: string;
  /** Filter by payment mode (comma-separated for multiple) */
  payment_mode?: string;
  /** Filter by sale type (comma-separated for multiple) */
  sale_type?: string;
  /** Minimum sale amount */
  min_amount?: number;
  /** Maximum sale amount */
  max_amount?: number;
  /** Filter start date (YYYY-MM-DD) */
  start_date?: string;
  /** Filter end date (YYYY-MM-DD) */
  end_date?: string;
}

/**
 * Payment mode breakdown in sales report summary
 */
export interface PaymentModeBreakdown {
  cash?: number;
  card?: number;
  upi?: number;
  online?: number;
  [key: string]: number | undefined;
}

/**
 * Sale type breakdown in sales report summary
 */
export interface SaleTypeBreakdown {
  retail?: number;
  wholesale?: number;
  in_store?: number;
  delivery?: number;
  [key: string]: number | undefined;
}

/**
 * Summary statistics for sales report
 */
export interface SalesReportSummary {
  /** Total number of sales */
  total_sales: number;
  /** Total revenue */
  total_revenue: number;
  /** Total tax collected */
  total_tax: number;
  /** Total margin/profit */
  total_margin: number;
  /** Average sale value */
  average_sale_value: number;
  /** Breakdown by payment mode */
  by_payment_mode: PaymentModeBreakdown;
  /** Breakdown by sale type */
  by_sale_type: SaleTypeBreakdown;
}

/**
 * Individual sale record in report
 */
export interface SalesReportRecord {
  /** Sale ID */
  id: string;
  /** Warehouse ID */
  warehouse_id: string;
  /** Warehouse name */
  warehouse_name: string;
  /** Sale date */
  sale_date: string;
  /** Sale status */
  status: string;
  /** Customer ID */
  customer_id?: string;
  /** Payment mode */
  payment_mode: string;
  /** Sale type */
  sale_type: string;
  /** Total amount */
  total_amount: number;
  /** Whether taxes were applied */
  apply_taxes: boolean;
  /** Total tax amount */
  total_tax: number;
  /** Total margin/profit */
  total_margin: number;
  /** Number of items in sale */
  item_count: number;
  /** Cancellation timestamp if cancelled */
  cancelled_at?: string;
  /** Reason for cancellation */
  cancellation_reason?: string;
  /** Sale creation timestamp */
  created_at: string;
  /** Sale last update timestamp */
  updated_at: string;
}

/**
 * Sales report response
 */
export type SalesReportResponse = ReportResponse<SalesReportSummary, SalesReportRecord>;

// ============================================================================
// Returns Report Types
// ============================================================================

/**
 * Filter parameters for returns report
 */
export interface ReturnsReportFilter extends BaseReportFilter {
  /** Filter by original sale ID */
  sale_id?: string;
  /** Filter by warehouse ID */
  warehouse_id?: string;
  /** Filter by status (comma-separated for multiple) */
  status?: string;
  /** Minimum refund amount */
  min_refund?: number;
  /** Maximum refund amount */
  max_refund?: number;
  /** Filter start date (YYYY-MM-DD) */
  start_date?: string;
  /** Filter end date (YYYY-MM-DD) */
  end_date?: string;
}

/**
 * Status breakdown in returns report summary
 */
export interface ReturnsStatusBreakdown {
  pending?: number;
  approved?: number;
  rejected?: number;
  [key: string]: number | undefined;
}

/**
 * Summary statistics for returns report
 */
export interface ReturnsReportSummary {
  /** Total number of returns */
  total_returns: number;
  /** Total refund amount */
  total_refund_amount: number;
  /** Average refund value */
  average_refund_value: number;
  /** Breakdown by return status */
  by_status: ReturnsStatusBreakdown;
}

/**
 * Individual return record in report
 */
export interface ReturnsReportRecord {
  /** Return ID */
  id: string;
  /** Original sale ID */
  sale_id: string;
  /** Return date */
  return_date: string;
  /** Return status */
  status: string;
  /** Total refund amount */
  total_refund: number;
  /** Warehouse ID */
  warehouse_id: string;
  /** Warehouse name */
  warehouse_name: string;
  /** Number of items returned */
  item_count: number;
  /** Return creation timestamp */
  created_at: string;
  /** Return last update timestamp */
  updated_at: string;
}

/**
 * Returns report response
 */
export type ReturnsReportResponse = ReportResponse<ReturnsReportSummary, ReturnsReportRecord>;

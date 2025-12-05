/**
 * TypeScript type definitions for Kisanlink ERP Service API
 * Generated from Swagger/OpenAPI specification
 */

// ============================================================================
// Common Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Error response model
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  timestamp: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// ============================================================================
// Address Types
// ============================================================================

export interface AddressInfo {
  id: string;
  type: string;
  house?: string;
  street?: string;
  landmark?: string;
  vtc?: string; // Village/Town/City
  subdistrict?: string;
  district?: string;
  state?: string;
  post_office?: string;
  pincode?: string;
  country?: string;
  full_address?: string;
}

export interface CreateAddressRequest {
  type: string; // HOME, WORK, OTHER
  house?: string;
  street?: string;
  landmark?: string;
  vtc?: string;
  subdistrict?: string;
  district?: string;
  state?: string;
  post_office?: string;
  pincode?: string;
  country?: string;
  is_primary?: boolean;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: string;
}

// ============================================================================
// Attachment Types
// ============================================================================

export interface AttachmentResponse {
  id: string;
  entity_type: string; // "logo", "po", "grn", etc.
  entity_id: string; // CLAB_xxx, PO_xxx, etc.
  file_path: string; // S3 key/path
  file_type: string; // MIME type
  download_url?: string; // Presigned S3 URL for downloading
  uploaded_by: string; // User ID
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface AttachmentInfoResponse extends AttachmentResponse {
  file_size: number; // File size in bytes
}

export interface GetAttachmentsParams extends PaginationParams {
  entity_type?: string;
  entity_id?: string;
}

// ============================================================================
// Collaborator Types
// ============================================================================

export interface CollaboratorResponse {
  id: string;
  company_name: string;
  contact_person: string;
  contact_number: string;
  email?: string;
  gst_number?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no: string;
  bank_ifsc: string;
  experience?: string;
  logo?: string;
  address?: AddressInfo;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCollaboratorRequest {
  company_name: string;
  contact_person: string;
  contact_number: string;
  email?: string;
  gst_number?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no: string;
  bank_ifsc: string;
  experience?: string;
  logo?: string;
  address?: CreateAddressRequest;
}

export interface UpdateCollaboratorRequest {
  company_name?: string;
  contact_person?: string;
  contact_number?: string;
  email?: string;
  gst_number?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  experience?: string;
  logo?: string;
  is_active?: boolean;
  address?: UpdateAddressRequest;
}

// ============================================================================
// Collaborator Product Types
// ============================================================================

export interface ProductSummary {
  id: string;
  name: string;
  description?: string;
}

export interface CollaboratorProductResponse {
  id: string;
  collaborator_id: string;
  collaborator_name: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product?: ProductSummary;
  brand_name: string;
  hsn_code: string;
  gst_rate: number;
  dosage_instructions?: string;
  usage_details?: string;
  images?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCollaboratorProductRequest {
  product_id: string;
  brand_name: string;
  hsn_code: string;
  gst_rate: number;
  dosage_instructions?: string;
  usage_details?: string;
  images?: string[];
}

export interface UpdateCollaboratorProductRequest {
  brand_name?: string;
  hsn_code?: string;
  gst_rate?: number;
  dosage_instructions?: string;
  usage_details?: string;
  images?: string[];
  is_active?: boolean;
}

// ============================================================================
// Product Types
// ============================================================================

export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  variants?: ProductVariantResponse[];
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
}

// ============================================================================
// Product Variant Types
// ============================================================================

export interface ProductVariantResponse {
  id: string;
  product_id: string;
  variant_name: string;
  sku?: string;
  barcode?: string;
  pack_size: string;
  quantity: string;
  description?: string;
  collaborator_id?: string;
  brand_name?: string;
  hsn_code?: string;
  gst_rate?: number;
  dosage_instructions?: string;
  usage_details?: string;
  images?: string[];
  image_urls?: string[]; // Presigned S3 URLs for images
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductVariantRequest {
  variant_name: string;
  pack_size: string;
  quantity: string;
  sku?: string;
  barcode?: string;
  description?: string;
  collaborator_id?: string;
  brand_name?: string;
  hsn_code?: string;
  gst_rate?: number;
  dosage_instructions?: string;
  usage_details?: string;
  images?: string[];
}

export interface UpdateProductVariantRequest {
  variant_name?: string;
  pack_size?: string;
  quantity?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  brand_name?: string;
  hsn_code?: string;
  gst_rate?: number;
  dosage_instructions?: string;
  usage_details?: string;
  images?: string[];
  is_active?: boolean;
}

// ============================================================================
// Product Price Types
// ============================================================================

export interface ProductPriceResponse {
  id: string;
  variant_id: string;
  price_type: string;
  price: number;
  currency: string;
  effective_from?: string;
  effective_to?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPriceRequest {
  variant_id: string;
  price_type: string;
  price: number;
  currency?: string;
  effective_from?: string;
  effective_to?: string;
  is_active?: boolean;
}

export interface UpdateProductPriceRequest {
  price?: number;
  price_type?: string;
  currency?: string;
  effective_from?: string;
  effective_to?: string;
  is_active?: boolean;
}

export interface ProductWithPricesResponse extends ProductResponse {
  prices: ProductPriceResponse[];
}

// ============================================================================
// Warehouse Types
// ============================================================================

export interface WarehouseResponse {
  id: string;
  name: string;
  address?: AddressInfo;
  created_at: string;
  updated_at: string;
}

export interface CreateWarehouseRequest {
  name: string;
  address_id?: string;
  address?: CreateAddressRequest;
}

export interface UpdateWarehouseRequest {
  name?: string;
  address_id?: string;
  address?: UpdateAddressRequest;
}

// ============================================================================
// Inventory Types
// ============================================================================

export interface InventoryBatchResponse {
  id: string;
  variant_id: string;
  warehouse_id: string;
  total_quantity: number;
  cost_price: number;
  expiry_date: string;
  cgst_rate?: number;
  sgst_rate?: number;
  custom_tax_ids?: string[];
  is_tax_exempt?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryBatchRequest {
  variant_id: string;
  warehouse_id: string;
  quantity: number;
  cost_price: number;
  expiry_date: string;
  cgst_rate?: number;
  sgst_rate?: number;
  custom_tax_ids?: string[];
  is_tax_exempt?: boolean;
}

export interface InventoryTransactionResponse {
  id: string;
  batch_id: string;
  transaction_type: string;
  quantity_change: number;
  related_entity_id?: string;
  note?: string;
  performed_by: string;
  occurred_at: string;
}

export interface CreateInventoryTransactionRequest {
  transaction_type: string;
  quantity_change: number;
  related_entity_id?: string;
  note?: string;
}

export interface ProductAvailabilityResponse {
  id: string;
  variant_id: string;
  warehouse_id: string;
  warehouse_name: string;
  address?: AddressInfo;
  product_name: string;
  product_sku: string;
  product_description?: string;
  total_quantity: number;
  cost_price: number;
  expiry_date: string;
  cgst_rate?: number;
  sgst_rate?: number;
  custom_tax_ids?: string[];
  is_tax_exempt?: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Purchase Order Types
// ============================================================================

export interface PurchaseOrderItemResponse {
  id: string;
  po_id: string;
  variant_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  received_quantity: number;
  created_at: string;
}

export interface PurchaseOrderResponse {
  id: string;
  po_number: string;
  collaborator_id: string;
  collaborator_name: string;
  warehouse_id: string;
  warehouse_name: string;
  order_date: string;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  status: string; // placed, confirmed, out_for_delivery, delivered, paid
  payment_status: string; // unpaid, partial, paid
  paid_amount: number;
  total_amount: number;
  items: PurchaseOrderItemResponse[];
  created_at: string;
  updated_at: string;
}

export interface CreatePurchaseOrderItemRequest {
  variant_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreatePurchaseOrderRequest {
  collaborator_id: string;
  warehouse_id: string;
  order_date?: string;
  expected_delivery_date: string;
  items: CreatePurchaseOrderItemRequest[];
}

export interface UpdatePOStatusRequest {
  status: string;
  actual_delivery_date?: string;
  accept_all?: boolean;
  default_expiry_date?: string;
  items?: DeliveryItemRequest[];
}

export interface DeliveryItemRequest {
  po_item_id: string;
  expiry_date: string;
  accept?: boolean;
  received_quantity?: number;
  accepted_quantity?: number;
  batch_number?: string;
  rejection_reason?: string;
}

export interface UpdatePOPaymentRequest {
  payment_status: string;
  paid_amount: number;
}

// ============================================================================
// GRN Types
// ============================================================================

export interface GRNItemResponse {
  id: string;
  grn_id: string;
  po_item_id: string;
  variant_id: string;
  product_name: string;
  product_sku: string;
  ordered_quantity: number;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  batch_number?: string;
  expiry_date: string;
  inventory_batch_id?: string;
  created_at: string;
}

export interface GRNResponse {
  id: string;
  grn_number: string;
  po_id: string;
  po_number: string;
  warehouse_id: string;
  warehouse_name: string;
  received_date: string;
  received_by: string;
  quality_status: string; // accepted, rejected, partial
  remarks?: string;
  grn_document?: string; // Attachment ID
  items: GRNItemResponse[];
  created_at: string;
  updated_at: string;
}

export interface CreateGRNItemRequest {
  po_item_id: string;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity?: number;
  batch_number?: string;
  expiry_date: string;
}

export interface CreateGRNRequest {
  po_id: string;
  grn_number: string;
  received_date?: string;
  received_by: string;
  quality_status: string;
  remarks?: string;
  items: CreateGRNItemRequest[];
}

export interface UpdateGRNRequest {
  quality_status?: string;
  remarks?: string;
  grn_document?: string;
}

// ============================================================================
// Discount Types
// ============================================================================

export enum DiscountType {
  Flat = 'flat',
  Percentage = 'percentage',
  BuyXGetY = 'buy_x_get_y',
  Seasonal = 'seasonal',
  Bulk = 'bulk',
}

export interface DiscountResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: DiscountType;
  value: number;
  min_order_value?: number;
  max_order_value?: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  current_usage: number;
  is_active: boolean;
  is_stackable: boolean;
  priority: number;
  applicable_products?: string;
  applicable_categories?: string;
  applicable_warehouses?: string;
  excluded_products?: string;
  excluded_categories?: string;
  buy_quantity?: number;
  get_quantity?: number;
  get_discount_type?: string;
  get_discount_value?: number;
  terms?: string;
  status: string; // active, expired, inactive, usage_limit_reached, scheduled
  created_at: string;
  updated_at: string;
}

export interface CreateDiscountRequest {
  code: string;
  name: string;
  description?: string;
  discount_type: DiscountType;
  value?: number;
  min_order_value?: number;
  max_order_value?: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  is_active?: boolean;
  is_stackable?: boolean;
  priority?: number;
  applicable_products?: string;
  applicable_categories?: string;
  applicable_warehouses?: string;
  excluded_products?: string;
  excluded_categories?: string;
  buy_quantity?: number;
  get_quantity?: number;
  get_discount_type?: string;
  get_discount_value?: number;
  terms?: string;
}

export interface UpdateDiscountRequest {
  name?: string;
  description?: string;
  value?: number;
  min_order_value?: number;
  max_order_value?: number;
  max_discount_amount?: number;
  valid_from?: string;
  valid_until?: string;
  usage_limit?: number;
  is_active?: boolean;
  is_stackable?: boolean;
  priority?: number;
  applicable_products?: string;
  applicable_categories?: string;
  applicable_warehouses?: string;
  excluded_products?: string;
  excluded_categories?: string;
  terms?: string;
}

export interface ValidateDiscountRequest {
  discount_code: string;
  order_value: number;
  product_ids?: string[];
  category_ids?: string[];
  warehouse_id: string;
}

export interface DiscountValidationResponse {
  is_valid: boolean;
  message: string;
  discount_id?: string;
  discount_code?: string;
  discount_name?: string;
  discount_type?: string;
  value?: number;
  calculated_discount?: number;
  max_discount_amount?: number;
}

export interface DiscountUsageResponse {
  id: string;
  discount_id: string;
  sale_id: string;
  amount: number;
  used_at: string;
  created_at: string;
}

// ============================================================================
// Sales Types
// ============================================================================

export interface DiscountApplication {
  discount_id: string;
  discount_name: string;
  discount_code: string;
  discount_type: string;
  amount: number;
  applied_by: string; // "manual", "coupon", "auto"
}

export interface TaxSummaryBreakdown {
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  vat_amount: number;
  other_tax_amount: number;
  total_tax_amount: number;
}

export interface SaleBreakdown {
  base_amount: number;
  discount_amount: number;
  total_savings: number;
  tax_amount: number;
  final_amount: number;
  applied_discounts: DiscountApplication[];
  tax_breakdown: TaxSummaryBreakdown;
}

export interface SaleItemResponse {
  id: string;
  sale_id: string;
  batch_id: string;
  quantity: number;
  selling_price: number;
  cost_price: number;
  margin: number;
  line_total: number;
  cgst_amount: number;
  sgst_amount: number;
  custom_tax_amount: number;
  total_tax_amount: number;
  created_at: string;
}

export interface SaleResponse {
  id: string;
  warehouse_id: string;
  customer_id?: string;
  sale_date: string;
  sale_type: string; // in_store, delivery
  payment_mode: string; // cash, upi, online
  status: string;
  total_amount: number;
  apply_taxes: boolean;
  breakdown: SaleBreakdown;
  items: SaleItemResponse[];
  created_at: string;
  updated_at: string;
}

export interface CreateSaleItemRequest {
  variant_id: string;
  quantity: number;
}

export interface CreateSaleRequest {
  warehouse_id: string;
  customer_id?: string;
  sale_date?: string;
  sale_type: string;
  payment_mode: string;
  items: CreateSaleItemRequest[];
  apply_taxes?: boolean;
  auto_apply_discounts?: boolean;
  discount_id?: string;
  coupon_code?: string;
}

export interface UpdateSaleRequest {
  status?: string;
}

export interface UpdateSaleStatusRequest {
  status: string;
}

export interface TopSellingProductResponse {
  product_id: string;
  product_name: string;
  total_sold: number;
  total_amount: number;
}

// ============================================================================
// Sale Cancellation Types
// ============================================================================

/**
 * Cancellation item response for individual cancelled items
 */
export interface SaleCancellationItemResponse {
  id: string;
  cancellation_id: string;
  sale_item_id: string;
  batch_id: string;
  quantity_cancelled: number;
  refund_amount: number;
  inventory_transaction_id?: string;
  created_at: string;
}

/**
 * Cancellation response for sale cancellation events
 */
export interface SaleCancellationResponse {
  id: string;
  sale_id: string;
  cancellation_type: 'full' | 'partial';
  reason?: string;
  cancelled_by: string;
  cancelled_at: string;
  items: SaleCancellationItemResponse[];
  inventory_returned: boolean;
  discount_reversed: boolean;
  tax_voided: boolean;
  refund_amount: number;
  created_at: string;
}

/**
 * Request to cancel an entire sale
 */
export interface CancelSaleRequest {
  reason?: string;
  cancelled_by?: string;
}

/**
 * Request to cancel a specific sale item
 */
export interface CancelSaleItemRequest {
  item_id: string;
  quantity?: number;
  reason?: string;
}

/**
 * Request to cancel multiple items from a sale
 */
export interface CancelSaleItemsRequest {
  items: CancelSaleItemRequest[];
  reason?: string;
}

// ============================================================================
// Return Types
// ============================================================================

export interface ReturnItemResponse {
  id: string;
  return_id: string;
  batch_id: string;
  quantity: number;
  refund_amount: number;
  created_at: string;
}

export interface ReturnResponse {
  id: string;
  sale_id: string;
  return_date: string;
  status: string;
  total_refund: number;
  items: ReturnItemResponse[];
  created_at: string;
  updated_at: string;
}

export interface CreateReturnItemRequest {
  batch_id: string;
  quantity: number;
  refund_amount: number;
}

export interface CreateReturnRequest {
  sale_id: string;
  return_date?: string;
  items: CreateReturnItemRequest[];
}

export interface UpdateReturnRequest {
  status?: string;
}

export interface UpdateReturnStatusRequest {
  status: string;
  notes?: string;
  reason?: string;
}

export interface MostReturnedProductResponse {
  product_id: string;
  product_name: string;
  total_returned: number;
  return_amount: number;
}

// ============================================================================
// Refund Policy Types
// ============================================================================

export interface RefundPolicyResponse {
  id: string;
  policy_name: string;
  description?: string;
  max_days: number;
  restocking_fee: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRefundPolicyRequest {
  policy_name: string;
  description?: string;
  max_days: number;
  restocking_fee?: number;
}

export interface UpdateRefundPolicyRequest {
  description?: string;
  max_days?: number;
  restocking_fee?: number;
}

// ============================================================================
// Bank Payment Types
// ============================================================================

export interface BankPaymentResponse {
  id: string;
  sale_id?: string;
  return_id?: string;
  amount: number;
  payment_method: string;
  transaction_ref?: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBankPaymentRequest {
  sale_id?: string;
  return_id?: string;
  amount: number;
  payment_method: string;
}

// ============================================================================
// Tax Types
// ============================================================================

export enum TaxType {
  CGST = 'cgst',
  SGST = 'sgst',
  IGST = 'igst',
  VAT = 'vat',
  STT = 'stt',
  TDS = 'tds',
  TCS = 'tcs',
  Excise = 'excise',
  Customs = 'customs',
  ItemSpecific = 'item_specific',
  Category = 'category',
  Flat = 'flat',
}

export enum TaxCalculationType {
  Percentage = 'percentage',
  Fixed = 'fixed',
  Tiered = 'tiered',
}

export interface TaxResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  tax_type: TaxType;
  calculation_type: TaxCalculationType;
  rate: number;
  min_amount?: number;
  max_amount?: number;
  min_order_value?: number;
  max_order_value?: number;
  is_active: boolean;
  is_stackable: boolean;
  is_inter_state?: boolean;
  requires_gstin?: boolean;
  requires_pan?: boolean;
  priority: number;
  stacking_order?: number;
  valid_from: string;
  valid_until?: string;
  hsn_code?: string;
  sac_code?: string;
  tax_category?: string;
  applicable_products?: string[];
  applicable_categories?: string[];
  applicable_states?: string[];
  applicable_warehouses?: string[];
  applicable_customer_groups?: string[];
  excluded_products?: string[];
  excluded_categories?: string[];
  excluded_states?: string[];
  excluded_warehouses?: string[];
  excluded_customer_groups?: string[];
  status: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaxRequest {
  code: string;
  name: string;
  description?: string;
  tax_type: TaxType;
  calculation_type: TaxCalculationType;
  rate: number;
  min_amount?: number;
  max_amount?: number;
  min_order_value?: number;
  max_order_value?: number;
  is_active?: boolean;
  is_stackable?: boolean;
  is_inter_state?: boolean;
  requires_gstin?: boolean;
  requires_pan?: boolean;
  priority?: number;
  stacking_order?: number;
  valid_from: string;
  valid_until?: string;
  hsn_code?: string;
  sac_code?: string;
  tax_category?: string;
  applicable_products?: string[];
  applicable_categories?: string[];
  applicable_states?: string[];
  applicable_warehouses?: string[];
  applicable_customer_groups?: string[];
  excluded_products?: string[];
  excluded_categories?: string[];
  excluded_states?: string[];
  excluded_warehouses?: string[];
  excluded_customer_groups?: string[];
}

export interface UpdateTaxRequest {
  name?: string;
  description?: string;
  calculation_type?: TaxCalculationType;
  rate?: number;
  min_amount?: number;
  max_amount?: number;
  min_order_value?: number;
  max_order_value?: number;
  is_active?: boolean;
  is_stackable?: boolean;
  is_inter_state?: boolean;
  requires_gstin?: boolean;
  requires_pan?: boolean;
  priority?: number;
  stacking_order?: number;
  valid_from?: string;
  valid_until?: string;
  hsn_code?: string;
  sac_code?: string;
  tax_category?: string;
  applicable_products?: string[];
  applicable_categories?: string[];
  applicable_states?: string[];
  applicable_warehouses?: string[];
  applicable_customer_groups?: string[];
  excluded_products?: string[];
  excluded_categories?: string[];
  excluded_states?: string[];
  excluded_warehouses?: string[];
  excluded_customer_groups?: string[];
}

export interface TaxCalculationItem {
  product_id: string;
  category_id?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface TaxCalculationRequest {
  warehouse_id: string;
  warehouse_state: string;
  customer_id?: string;
  customer_state?: string;
  customer_gstin?: string;
  customer_pan?: string;
  is_inter_state?: boolean;
  items: TaxCalculationItem[];
}

export interface AppliedTax {
  tax_id: string;
  tax_name: string;
  tax_code: string;
  tax_type: TaxType;
  rate: number;
  base_amount: number;
  amount: number;
}

export interface TaxBreakdown {
  tax_name: string;
  tax_code: string;
  tax_type: TaxType;
  rate: number;
  amount: number;
  hsn_code?: string;
  sac_code?: string;
}

export interface TaxCalculationResponse {
  sub_total: number;
  total_tax_amount: number;
  grand_total: number;
  applied_taxes: AppliedTax[];
  tax_breakdown: TaxBreakdown[];
}

export interface TaxApplicationResponse {
  id: string;
  tax_id: string;
  sale_id?: string;
  tax_rate: number;
  base_amount: number;
  tax_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  vat_amount: number;
  tds_amount: number;
  tcs_amount: number;
  stt_amount: number;
  excise_amount: number;
  customs_amount: number;
  other_tax_amount: number;
  total_tax_amount: number;
  taxable_amount: number;
  sub_total: number;
  grand_total: number;
  created_at: string;
  updated_at: string;
}

export interface TaxSummaryResponse {
  id: string;
  warehouse_id: string;
  summary_date: string;
  total_cgst: number;
  total_sgst: number;
  total_igst: number;
  total_vat: number;
  total_tds: number;
  total_tcs: number;
  total_stt: number;
  total_excise: number;
  total_customs: number;
  total_other_tax: number;
  total_tax: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface WebhookAddress {
  address_id: string;
  type: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface WebhookCollaborator {
  external_id: string;
  company_name?: string;
  contact_person?: string;
  contact_number?: string;
  email?: string;
  gst_number?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  experience?: string;
  address_id?: string;
}

export interface WebhookFPO {
  fpo_id: string;
  delivery_address: WebhookAddress;
}

export interface WebhookProduct {
  external_id: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  unit: string;
  hsn_code?: string;
}

export interface WebhookVariant {
  external_id: string;
  name: string;
  sku: string;
  pack_size: string;
  quantity_text: string;
  brand_name?: string;
  gst_rate?: number;
  dosage_instructions?: string;
  usage_details?: string;
  images?: string[];
}

export interface WebhookOrderItem {
  product: WebhookProduct;
  variant: WebhookVariant;
  quantity: number;
  unit_price: number;
}

export interface WebhookOrder {
  external_order_id: string;
  order_date?: string;
  expected_delivery_date: string;
  total_amount?: number;
  currency?: string;
}

export interface OrderCreatedWebhook {
  event_type: string;
  event_id: string;
  timestamp: string;
  collaborator: WebhookCollaborator;
  fpo: WebhookFPO;
  order: WebhookOrder;
  items: WebhookOrderItem[];
}

export interface OrderConfirmedWebhook {
  event_type: string;
  event_id: string;
  timestamp: string;
  external_order_id: string;
  confirmed_date?: string;
  expected_delivery_date?: string;
}

export interface OrderShippedWebhook {
  event_type: string;
  event_id: string;
  timestamp: string;
  external_order_id: string;
  shipped_date?: string;
  expected_delivery_date?: string;
  tracking_number?: string;
  carrier?: string;
}

export interface WebhookDeliveryItem {
  external_product_id: string;
  external_variant_id: string;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity?: number;
  batch_number: string;
  expiry_date: string;
  manufacturing_date?: string;
  cost_price: number;
  rejection_reason?: string;
}

export interface OrderDeliveredWebhook {
  event_type: string;
  event_id: string;
  timestamp: string;
  external_order_id: string;
  delivery_date?: string;
  grn_number?: string;
  invoice_number?: string;
  items: WebhookDeliveryItem[];
}

export interface OrderPaymentWebhook {
  event_type: string;
  event_id: string;
  timestamp: string;
  external_order_id: string;
  payment_status: string;
  paid_amount: number;
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
  remarks?: string;
}

export interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  external_order_id?: string;
  purchase_order_id?: string;
  status: string;
  payload_hash?: string;
  signature_valid?: boolean;
  request_body?: string;
  source_ip?: string;
  user_agent?: string;
  error_message?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
  deleted_by?: string;
}

// ============================================================================
// Report Types
// ============================================================================

export * from './reports.js';

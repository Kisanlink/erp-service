# ERP API Client TypeScript Types

## Overview

This document defines all TypeScript types needed for the ERP API client, derived from the Swagger/OpenAPI specification. Types are organized by domain and follow strict typing principles for maximum type safety.

## Common Types

### Base Response Types

```typescript
// Generic API response wrapper
export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

// Error response model
export interface ErrorResponse {
  status: boolean;
  message: string;
  error?: {
    code: string;
    details?: Record<string, unknown>;
    timestamp?: string;
    traceId?: string;
  };
}

// Pagination parameters
export interface PaginationParams {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Common query parameters
export interface QueryParams extends PaginationParams {
  search?: string;
  filters?: Record<string, unknown>;
}
```

## Address Types

```typescript
export interface AddressInfo {
  id: string;
  type: string;
  house?: string;
  street?: string;
  landmark?: string;
  vtc?: string; // Village/Town/City
  post_office?: string;
  subdistrict?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  full_address?: string;
}

export interface CreateAddressRequest {
  type: 'HOME' | 'WORK' | 'OTHER';
  house?: string;
  street?: string;
  landmark?: string;
  vtc?: string;
  post_office?: string;
  subdistrict?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  is_primary?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
  is_primary?: boolean;
}
```

## Attachment Types

```typescript
export interface AttachmentResponse {
  id: string;
  entity_type: string; // "logo", "po", "grn", etc.
  entity_id: string; // CLAB_xxx, PO_xxx, etc.
  file_path: string; // S3 key/path
  file_type: string; // MIME type
  uploaded_at: string;
  uploaded_by: string; // User ID
  created_at: string;
  updated_at: string;
}

export interface AttachmentInfoResponse extends AttachmentResponse {
  file_size: number; // File size in bytes
}

export interface AttachmentQueryParams extends PaginationParams {
  entity_type?: string;
  entity_id?: string;
}
```

## Bank Payment Types

```typescript
export interface BankPaymentResponse {
  id: string;
  sale_id?: string;
  return_id?: string;
  amount: number;
  payment_method: string;
  transaction_ref?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBankPaymentRequest {
  sale_id?: string;
  return_id?: string;
  amount: number;
  payment_method: string;
}
```

## Collaborator Types

```typescript
export interface CollaboratorResponse {
  id: string;
  company_name: string;
  contact_person: string;
  contact_number: string;
  email?: string;
  experience?: string;
  gst_number?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no: string;
  bank_ifsc: string;
  logo?: string;
  is_active: boolean;
  address?: AddressInfo;
  created_at: string;
  updated_at: string;
}

export interface CreateCollaboratorRequest {
  company_name: string;
  contact_person: string;
  contact_number: string;
  email?: string;
  experience?: string;
  gst_number?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no: string;
  bank_ifsc: string;
  logo?: string;
  address?: CreateAddressRequest;
}

export interface UpdateCollaboratorRequest extends Partial<CreateCollaboratorRequest> {
  is_active?: boolean;
}

export interface CollaboratorProductResponse {
  id: string;
  collaborator_id: string;
  collaborator_name: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  brand_name: string;
  hsn_code: string;
  gst_rate: number;
  images?: string[];
  usage_details?: string;
  dosage_instructions?: string;
  is_active: boolean;
  product?: ProductSummary;
  created_at: string;
  updated_at: string;
}

export interface CreateCollaboratorProductRequest {
  product_id: string;
  brand_name: string;
  hsn_code: string; // 8 digit HSN code
  gst_rate: number; // 0-100
  images?: string[]; // Array of S3 paths
  usage_details?: string;
  dosage_instructions?: string;
}

export interface UpdateCollaboratorProductRequest extends Partial<CreateCollaboratorProductRequest> {
  is_active?: boolean;
}
```

## Discount Types

```typescript
export type DiscountType = 'PERCENTAGE' | 'FIXED' | 'BUY_X_GET_Y' | 'VOLUME' | 'SEASONAL';

export interface DiscountResponse {
  id: string;
  code: string;
  description?: string;
  discount_type: DiscountType;
  value: number;
  min_order_value?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_products?: string[];
  applicable_categories?: string[];
  usage_limit?: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDiscountRequest {
  code: string;
  description?: string;
  discount_type: DiscountType;
  value: number;
  min_order_value?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  applicable_products?: string[];
  applicable_categories?: string[];
  usage_limit?: number;
}

export interface UpdateDiscountRequest extends Partial<CreateDiscountRequest> {
  is_active?: boolean;
}

export interface ValidateDiscountRequest {
  code: string;
  order_value: number;
  products?: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

export interface DiscountValidationResponse {
  valid: boolean;
  discount_amount: number;
  final_amount: number;
  reason?: string;
}

export interface DiscountApplication {
  discount_id: string;
  discount_code: string;
  discount_type: DiscountType;
  discount_value: number;
  discount_amount: number;
}

export interface DiscountUsageResponse {
  sale_id: string;
  discount_id: string;
  discount_code: string;
  discount_amount: number;
  used_at: string;
}
```

## GRN (Goods Receipt Note) Types

```typescript
export interface GRNResponse {
  id: string;
  grn_number: string;
  purchase_order_id: string;
  supplier_invoice_no?: string;
  supplier_invoice_date?: string;
  received_date: string;
  total_amount: number;
  tax_amount: number;
  net_amount: number;
  status: 'DRAFT' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELLED';
  notes?: string;
  items: GRNItemResponse[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GRNItemResponse {
  id: string;
  grn_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  variant_id?: string;
  variant_name?: string;
  ordered_quantity: number;
  received_quantity: number;
  rejected_quantity?: number;
  unit_price: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  notes?: string;
}

export interface CreateGRNRequest {
  purchase_order_id: string;
  supplier_invoice_no?: string;
  supplier_invoice_date?: string;
  received_date: string;
  notes?: string;
  items: CreateGRNItemRequest[];
}

export interface CreateGRNItemRequest {
  product_id: string;
  variant_id?: string;
  received_quantity: number;
  rejected_quantity?: number;
  unit_price: number;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  notes?: string;
}

export interface UpdateGRNRequest {
  status?: 'DRAFT' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELLED';
  notes?: string;
}
```

## Inventory Types

```typescript
export interface InventoryBatchResponse {
  id: string;
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  batch_number: string;
  manufacturing_date?: string;
  expiry_date?: string;
  quantity_available: number;
  quantity_reserved: number;
  warehouse_id: string;
  warehouse_name: string;
  location?: string;
  unit_cost: number;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryBatchRequest {
  product_id: string;
  variant_id?: string;
  batch_number: string;
  manufacturing_date?: string;
  expiry_date?: string;
  quantity: number;
  warehouse_id: string;
  location?: string;
  unit_cost: number;
}

export interface InventoryTransactionResponse {
  id: string;
  batch_id: string;
  transaction_type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reference_type: string; // 'PURCHASE_ORDER', 'SALE', 'RETURN', etc.
  reference_id: string;
  notes?: string;
  performed_by: string;
  created_at: string;
}

export interface CreateInventoryTransactionRequest {
  batch_id: string;
  transaction_type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reference_type: string;
  reference_id: string;
  notes?: string;
}
```

## Product Types

```typescript
export interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit_of_measure: string;
  hsn_code?: string;
  barcode?: string;
  manufacturer?: string;
  brand?: string;
  is_active: boolean;
  is_perishable: boolean;
  shelf_life_days?: number;
  min_stock_quantity?: number;
  max_stock_quantity?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductSummary {
  id: string;
  sku: string;
  name: string;
  category?: string;
  unit_of_measure: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit_of_measure: string;
  hsn_code?: string;
  barcode?: string;
  manufacturer?: string;
  brand?: string;
  is_perishable?: boolean;
  shelf_life_days?: number;
  min_stock_quantity?: number;
  max_stock_quantity?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  images?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  is_active?: boolean;
}

export interface ProductVariantResponse {
  id: string;
  product_id: string;
  variant_name: string;
  variant_sku: string;
  attributes: Record<string, any>; // JSON object for variant attributes
  barcode?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductVariantRequest {
  product_id: string;
  variant_name: string;
  variant_sku: string;
  attributes: Record<string, any>;
  barcode?: string;
}

export interface UpdateProductVariantRequest extends Partial<CreateProductVariantRequest> {
  is_active?: boolean;
}

export interface ProductPriceResponse {
  id: string;
  product_id: string;
  variant_id?: string;
  price_type: 'PURCHASE' | 'SALE' | 'MRP';
  price: number;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPriceRequest {
  product_id: string;
  variant_id?: string;
  price_type: 'PURCHASE' | 'SALE' | 'MRP';
  price: number;
  effective_from: string;
  effective_to?: string;
}

export interface UpdateProductPriceRequest extends Partial<CreateProductPriceRequest> {
  is_active?: boolean;
}

export interface ProductWithPricesResponse extends ProductResponse {
  variants?: ProductVariantResponse[];
  prices?: ProductPriceResponse[];
}

export interface ProductAvailabilityResponse {
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  total_available: number;
  total_reserved: number;
  warehouse_availability: Array<{
    warehouse_id: string;
    warehouse_name: string;
    available: number;
    reserved: number;
  }>;
}
```

## Purchase Order Types

```typescript
export interface PurchaseOrderResponse {
  id: string;
  po_number: string;
  collaborator_id: string;
  collaborator_name: string;
  order_date: string;
  expected_delivery?: string;
  status: 'DRAFT' | 'SENT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
  total_amount: number;
  tax_amount: number;
  discount_amount?: number;
  net_amount: number;
  payment_terms?: string;
  delivery_terms?: string;
  notes?: string;
  items: PurchaseOrderItemResponse[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItemResponse {
  id: string;
  po_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  variant_id?: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  notes?: string;
}

export interface CreatePurchaseOrderRequest {
  collaborator_id: string;
  order_date: string;
  expected_delivery?: string;
  payment_terms?: string;
  delivery_terms?: string;
  notes?: string;
  items: CreatePurchaseOrderItemRequest[];
}

export interface CreatePurchaseOrderItemRequest {
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  notes?: string;
}

export interface UpdatePOStatusRequest {
  status: 'DRAFT' | 'SENT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
  notes?: string;
}

export interface UpdatePOPaymentRequest {
  payment_status: 'PENDING' | 'PARTIAL' | 'PAID';
  payment_date?: string;
  payment_reference?: string;
  amount_paid?: number;
}
```

## Return Types

```typescript
export interface ReturnResponse {
  id: string;
  return_number: string;
  sale_id?: string;
  purchase_order_id?: string;
  return_type: 'CUSTOMER' | 'SUPPLIER';
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'REFUNDED';
  total_amount: number;
  tax_amount: number;
  refund_amount: number;
  notes?: string;
  items: ReturnItemResponse[];
  created_by: string;
  approved_by?: string;
  processed_by?: string;
  created_at: string;
  approved_at?: string;
  processed_at?: string;
  updated_at: string;
}

export interface ReturnItemResponse {
  id: string;
  return_id: string;
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  batch_number?: string;
  quantity: number;
  unit_price: number;
  reason: string;
  condition: 'GOOD' | 'DAMAGED' | 'EXPIRED';
  refund_amount: number;
}

export interface CreateReturnRequest {
  sale_id?: string;
  purchase_order_id?: string;
  return_type: 'CUSTOMER' | 'SUPPLIER';
  reason: string;
  notes?: string;
  items: CreateReturnItemRequest[];
}

export interface CreateReturnItemRequest {
  product_id: string;
  variant_id?: string;
  batch_number?: string;
  quantity: number;
  unit_price: number;
  reason: string;
  condition: 'GOOD' | 'DAMAGED' | 'EXPIRED';
}

export interface UpdateReturnRequest {
  notes?: string;
}

export interface UpdateReturnStatusRequest {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'REFUNDED';
  notes?: string;
}

export interface RefundPolicyResponse {
  id: string;
  name: string;
  description?: string;
  days_allowed: number;
  conditions?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRefundPolicyRequest {
  name: string;
  description?: string;
  days_allowed: number;
  conditions?: string[];
}

export interface UpdateRefundPolicyRequest extends Partial<CreateRefundPolicyRequest> {
  is_active?: boolean;
}

export interface MostReturnedProductResponse {
  product_id: string;
  product_name: string;
  return_count: number;
  total_quantity_returned: number;
  main_reason: string;
}
```

## Sales Types

```typescript
export interface SaleResponse {
  id: string;
  sale_number: string;
  customer_id: string;
  customer_name?: string;
  sale_date: string;
  due_date?: string;
  status: 'DRAFT' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  subtotal: number;
  discount_amount?: number;
  tax_amount: number;
  shipping_amount?: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  shipping_address?: AddressInfo;
  billing_address?: AddressInfo;
  notes?: string;
  items: SaleItemResponse[];
  applied_discounts?: DiscountApplication[];
  applied_taxes?: AppliedTax[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItemResponse {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  variant_id?: string;
  variant_name?: string;
  batch_id?: string;
  batch_number?: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  notes?: string;
}

export interface CreateSaleRequest {
  customer_id: string;
  sale_date: string;
  due_date?: string;
  shipping_address_id?: string;
  billing_address_id?: string;
  notes?: string;
  items: CreateSaleItemRequest[];
  discount_codes?: string[];
}

export interface CreateSaleItemRequest {
  product_id: string;
  variant_id?: string;
  batch_id?: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  notes?: string;
}

export interface UpdateSaleRequest {
  due_date?: string;
  shipping_address_id?: string;
  billing_address_id?: string;
  notes?: string;
}

export interface UpdateSaleStatusRequest {
  status: 'DRAFT' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
}

export interface SaleBreakdown {
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
}

export interface TopSellingProductResponse {
  product_id: string;
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
  sale_count: number;
}
```

## Tax Types

```typescript
export type TaxType = 'GST' | 'CGST' | 'SGST' | 'IGST' | 'CESS' | 'OTHER';
export type TaxCalculationType = 'EXCLUSIVE' | 'INCLUSIVE';

export interface TaxResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  tax_type: TaxType;
  rate: number; // Percentage
  calculation_type: TaxCalculationType;
  is_active: boolean;
  applicable_from: string;
  applicable_to?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaxRequest {
  code: string;
  name: string;
  description?: string;
  tax_type: TaxType;
  rate: number;
  calculation_type: TaxCalculationType;
  applicable_from: string;
  applicable_to?: string;
}

export interface UpdateTaxRequest extends Partial<CreateTaxRequest> {
  is_active?: boolean;
}

export interface AppliedTax {
  tax_id: string;
  tax_code: string;
  tax_name: string;
  tax_type: TaxType;
  rate: number;
  base_amount: number;
  amount: number;
}

export interface TaxCalculationRequest {
  items: TaxCalculationItem[];
  shipping_amount?: number;
  discount_amount?: number;
}

export interface TaxCalculationItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  hsn_code?: string;
}

export interface TaxCalculationResponse {
  items: Array<{
    product_id: string;
    taxes: AppliedTax[];
    tax_amount: number;
  }>;
  total_tax: number;
  breakdown: TaxBreakdown;
}

export interface TaxBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  other: number;
  total: number;
}

export interface TaxApplicationResponse {
  applicable_taxes: TaxResponse[];
  total_rate: number;
  calculation_type: TaxCalculationType;
}

export interface TaxSummaryResponse {
  period: string;
  total_collected: number;
  total_paid: number;
  net_liability: number;
  breakdown: TaxSummaryBreakdown;
}

export interface TaxSummaryBreakdown {
  gst: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  other: number;
}
```

## Warehouse Types

```typescript
export interface WarehouseResponse {
  id: string;
  code: string;
  name: string;
  type: 'MAIN' | 'BRANCH' | 'DISTRIBUTION' | 'TEMPORARY';
  manager_id?: string;
  manager_name?: string;
  contact_number?: string;
  email?: string;
  capacity?: number;
  current_occupancy?: number;
  is_active: boolean;
  is_default: boolean;
  address?: AddressInfo;
  operating_hours?: string;
  facilities?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateWarehouseRequest {
  code: string;
  name: string;
  type: 'MAIN' | 'BRANCH' | 'DISTRIBUTION' | 'TEMPORARY';
  manager_id?: string;
  contact_number?: string;
  email?: string;
  capacity?: number;
  address?: CreateAddressRequest;
  operating_hours?: string;
  facilities?: string[];
}

export interface UpdateWarehouseRequest extends Partial<CreateWarehouseRequest> {
  is_active?: boolean;
  is_default?: boolean;
}
```

## Webhook Types

```typescript
export interface WebhookEvent {
  event_id: string;
  event_type: 'order.created' | 'order.confirmed' | 'order.shipped' | 'order.delivered' | 'order.payment';
  timestamp: string;
  data: WebhookOrder;
}

export interface WebhookOrder {
  order_id: string;
  order_number: string;
  status: string;
  customer: WebhookCollaborator;
  fpo: WebhookFPO;
  items: WebhookOrderItem[];
  total_amount: number;
  payment_status?: string;
  delivery_date?: string;
  tracking_number?: string;
  payment_method?: string;
  transaction_id?: string;
}

export interface WebhookCollaborator {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface WebhookFPO {
  id: string;
  name: string;
  code: string;
}

export interface WebhookOrderItem {
  product: WebhookProduct;
  variant?: WebhookVariant;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface WebhookProduct {
  id: string;
  name: string;
  sku: string;
}

export interface WebhookVariant {
  id: string;
  name: string;
  sku: string;
}

export interface WebhookAddress {
  type: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface WebhookDeliveryItem {
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  delivered_quantity: number;
  unit_price: number;
}

// Specific webhook payload types
export interface OrderCreatedWebhook extends WebhookEvent {
  event_type: 'order.created';
}

export interface OrderConfirmedWebhook extends WebhookEvent {
  event_type: 'order.confirmed';
}

export interface OrderShippedWebhook extends WebhookEvent {
  event_type: 'order.shipped';
}

export interface OrderDeliveredWebhook extends WebhookEvent {
  event_type: 'order.delivered';
  data: WebhookOrder & {
    delivery_items: WebhookDeliveryItem[];
  };
}

export interface OrderPaymentWebhook extends WebhookEvent {
  event_type: 'order.payment';
  data: WebhookOrder & {
    payment_method: string;
    transaction_id: string;
  };
}
```

## Service Method Response Types

```typescript
// Generic list response
export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

// Bulk operation response
export interface BulkOperationResponse {
  succeeded: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

// File upload response
export interface FileUploadResponse {
  attachment_id: string;
  file_url: string;
  file_path: string;
}

// Analytics response types
export interface AnalyticsDateRange {
  start_date: string;
  end_date: string;
}

export interface DashboardMetrics {
  total_sales: number;
  total_purchases: number;
  pending_orders: number;
  low_stock_items: number;
  expiring_items: number;
  active_customers: number;
  active_suppliers: number;
}

export interface InventoryMetrics {
  total_products: number;
  total_value: number;
  low_stock_alerts: number;
  expiry_alerts: number;
  warehouse_utilization: number;
}

export interface SalesMetrics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  top_selling_products: TopSellingProductResponse[];
  sales_by_period: Array<{
    period: string;
    revenue: number;
    order_count: number;
  }>;
}

export interface ReturnMetrics {
  total_returns: number;
  return_value: number;
  return_rate: number;
  most_returned_products: MostReturnedProductResponse[];
  return_reasons: Array<{
    reason: string;
    count: number;
  }>;
}
```

## Error Types

```typescript
export class ERPError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ERPError';
  }
}

export class ValidationError extends ERPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ERPError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ERPError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ERPError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ERPError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

export class ServerError extends ERPError {
  constructor(message: string = 'Internal server error') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
  }
}

export class NetworkError extends ERPError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ERPError {
  constructor(message: string = 'Request timeout') {
    super(message, 'TIMEOUT_ERROR', 408);
    this.name = 'TimeoutError';
  }
}
```

## Utility Types

```typescript
// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract keys of a certain type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Omit multiple properties
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Make specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// API method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Sort order
export type SortOrder = 'asc' | 'desc';

// Date range filter
export interface DateRangeFilter {
  from?: string;
  to?: string;
}

// Status filters
export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED';
export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
```

## Type Guards

```typescript
// Type guard functions for runtime type checking
export const isErrorResponse = (response: any): response is ErrorResponse => {
  return response && typeof response.status === 'boolean' && !response.status && typeof response.message === 'string';
};

export const isApiResponse = <T>(response: any): response is ApiResponse<T> => {
  return response && typeof response.status === 'boolean' && response.status === true && 'data' in response;
};

export const isListResponse = <T>(response: any): response is ListResponse<T> => {
  return response && Array.isArray(response.items) && typeof response.total === 'number';
};

export const isWebhookEvent = (data: any): data is WebhookEvent => {
  return data && typeof data.event_id === 'string' && typeof data.event_type === 'string' && typeof data.timestamp === 'string';
};
```

## Enum Types

```typescript
// Entity types for attachments
export enum EntityType {
  LOGO = 'logo',
  PURCHASE_ORDER = 'po',
  GRN = 'grn',
  SALE = 'sale',
  RETURN = 'return',
  PRODUCT = 'product',
  COLLABORATOR = 'collaborator'
}

// Transaction types
export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER'
}

// Warehouse types
export enum WarehouseType {
  MAIN = 'MAIN',
  BRANCH = 'BRANCH',
  DISTRIBUTION = 'DISTRIBUTION',
  TEMPORARY = 'TEMPORARY'
}

// Product condition for returns
export enum ProductCondition {
  GOOD = 'GOOD',
  DAMAGED = 'DAMAGED',
  EXPIRED = 'EXPIRED'
}

// Price types
export enum PriceType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  MRP = 'MRP'
}
```

## Type Exports

All types should be exported from a central `types/index.ts` file:

```typescript
// Re-export all types
export * from './common';
export * from './attachments';
export * from './bank-payments';
export * from './collaborators';
export * from './discounts';
export * from './grns';
export * from './inventory';
export * from './products';
export * from './purchase-orders';
export * from './returns';
export * from './sales';
export * from './taxes';
export * from './warehouses';
export * from './webhooks';
export * from './errors';
export * from './utils';
```

This comprehensive type system ensures:
1. Complete type coverage for all API operations
2. Runtime type safety with guards
3. Proper error handling
4. Flexibility with utility types
5. Clear organization by domain
6. Easy maintenance and extension
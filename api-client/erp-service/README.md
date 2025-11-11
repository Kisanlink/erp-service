# Kisanlink ERP Service API Client

TypeScript API client for the Kisanlink ERP Service, following the same patterns as the auth-service client.

## Features

- ✅ **Zero Dependencies**: Uses native `fetch` API
- ✅ **Type-Safe**: Comprehensive TypeScript types for all API endpoints
- ✅ **Functional Design**: Factory pattern with pure functions
- ✅ **Framework Agnostic**: Works in any JavaScript/TypeScript environment
- ✅ **Error Handling**: Custom error classes with status codes
- ✅ **Flexible Authentication**: Inject your own token management strategy

## Installation

```bash
npm install @kisanlink/erp-service
```

## Quick Start

```typescript
import createERPService from '@kisanlink/erp-service';

// Initialize the client
const erpClient = createERPService({
  baseURL: 'https://erp-api.kisanlink.in',
  getAccessToken: () => localStorage.getItem('access_token'),
});

// Use the services
const products = await erpClient.products.list();
const sale = await erpClient.sales.create({
  warehouse_id: 'WHSE_12345678',
  sale_type: 'in_store',
  payment_mode: 'cash',
  items: [
    { variant_id: 'PVAR_12345678', quantity: 10 },
  ],
});
```

## Available Services

The client provides access to all ERP endpoints organized by domain:

### Product Management
- `products` - Product catalog operations
- `variants` - Product variant management
- `prices` - Product pricing

### Supplier Management
- `collaborators` - Supplier/vendor management
- `collaboratorProducts` - Supplier product associations

### Inventory Management
- `warehouses` - Warehouse operations
- `inventory` - Stock and batch management
- `purchaseOrders` - Purchase order workflow
- `grns` - Goods receipt notes

### Sales & Returns
- `sales` - Sales order management
- `returns` - Return and refund processing
- `discounts` - Discount rules and validation

### Financial
- `taxes` - Tax calculation and reporting
- `bankPayments` - Payment tracking
- `refundPolicies` - Refund policy management

### Integrations
- `attachments` - File upload and management
- `webhooks` - Webhook event handling

## Configuration

### ERPServiceConfig

```typescript
interface ERPServiceConfig {
  /** Base URL of the ERP API server */
  baseURL: string;

  /** Default headers for all requests */
  defaultHeaders?: Record<string, string>;

  /** Function to retrieve current access token */
  getAccessToken?: () => string | undefined;

  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}
```

## Error Handling

The client provides typed error classes:

```typescript
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  NetworkError
} from '@kisanlink/erp-service';

try {
  await erpClient.products.get('invalid-id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Product not found');
  } else if (error instanceof AuthenticationError) {
    console.log('Please login');
  }
}
```

## Examples

### Create a Sale with Discounts

```typescript
const sale = await erpClient.sales.create({
  warehouse_id: 'WHSE_12345678',
  sale_type: 'in_store',
  payment_mode: 'upi',
  apply_taxes: true,
  auto_apply_discounts: true,
  items: [
    { variant_id: 'PVAR_11111111', quantity: 5 },
    { variant_id: 'PVAR_22222222', quantity: 3 },
  ],
});

console.log('Final amount:', sale.breakdown.final_amount);
console.log('Savings:', sale.breakdown.total_savings);
```

### Process a Purchase Order

```typescript
// Create purchase order
const po = await erpClient.purchaseOrders.create({
  collaborator_id: 'CLAB_12345678',
  warehouse_id: 'WHSE_12345678',
  expected_delivery_date: '2025-12-31',
  items: [
    { variant_id: 'PVAR_11111111', quantity: 100, unit_price: 50.00 },
  ],
});

// Update status when delivered
await erpClient.purchaseOrders.updateStatus(po.id, {
  status: 'delivered',
  accept_all: true,
  default_expiry_date: '2026-12-31',
});

// Create GRN
const grn = await erpClient.grns.create({
  po_id: po.id,
  grn_number: 'GRN-2025-001',
  received_by: 'user-123',
  quality_status: 'accepted',
  items: [
    {
      po_item_id: po.items[0].id,
      received_quantity: 100,
      accepted_quantity: 100,
      expiry_date: '2026-12-31',
    },
  ],
});
```

### Check Inventory Availability

```typescript
// Get all product availability across warehouses
const availability = await erpClient.inventory.getProductsAvailability();

availability.forEach(item => {
  console.log(`${item.product_name} at ${item.warehouse_name}: ${item.total_quantity} units`);
});

// Get low stock batches
const lowStock = await erpClient.inventory.getLowStockBatches({ threshold: 10 });
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run tests with coverage
npm test:coverage
```

## Best Practices

### Inventory Management

Always check inventory availability before creating sales to prevent overselling:

```typescript
// Check availability before creating sale
const availability = await erpClient.inventory.batches.list({
  variant_id: 'PVAR_12345678',
  warehouse_id: 'WHSE_12345678',
});

const totalAvailable = availability.data?.reduce(
  (sum, batch) => sum + batch.quantity_available,
  0
) || 0;

if (totalAvailable < requestedQuantity) {
  throw new Error('Insufficient inventory');
}

// Now safe to create sale
const sale = await erpClient.sales.create({
  warehouse_id: 'WHSE_12345678',
  sale_type: 'in_store',
  payment_mode: 'cash',
  items: [{ variant_id: 'PVAR_12345678', quantity: requestedQuantity }],
});
```

### Discount Management

Control discount stacking by checking existing discounts:

```typescript
// Validate discount before applying
const discountValidation = await erpClient.discounts.validate({
  discount_id: 'DISC_12345678',
  items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
  subtotal: 500.00,
});

if (!discountValidation.data?.valid) {
  console.log('Discount not applicable:', discountValidation.data?.reason);
}

// Use auto_apply_discounts for automatic discount selection
const sale = await erpClient.sales.create({
  warehouse_id: 'WHSE_12345678',
  sale_type: 'in_store',
  payment_mode: 'cash',
  auto_apply_discounts: true,
  items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
});
```

### GRN Validation

Ensure received quantities don't exceed purchase order quantities:

```typescript
// Get PO details first
const po = await erpClient.purchaseOrders.get('PO_12345678');

// Validate quantities against PO
const grn = await erpClient.grns.create({
  po_id: po.data!.id,
  grn_number: 'GRN-2025-001',
  received_by: 'user-123',
  quality_status: 'accepted',
  items: po.data!.items.map(poItem => ({
    po_item_id: poItem.id,
    received_quantity: poItem.quantity, // Match PO quantity
    accepted_quantity: poItem.quantity,
    expiry_date: '2026-12-31',
  })),
});
```

### Concurrent Operations

Handle race conditions when multiple users access inventory:

```typescript
// Implement optimistic locking pattern
try {
  const sale = await erpClient.sales.create({
    warehouse_id: 'WHSE_12345678',
    sale_type: 'in_store',
    payment_mode: 'cash',
    items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
  });
} catch (error) {
  if (error instanceof ConflictError) {
    // Inventory changed, refresh and retry
    console.log('Inventory conflict, please retry');
  }
  throw error;
}
```

## Advanced Examples

### Complete Purchase-to-Sale Workflow

```typescript
// 1. Create Purchase Order
const po = await erpClient.purchaseOrders.create({
  collaborator_id: 'CLAB_12345678',
  warehouse_id: 'WHSE_12345678',
  expected_delivery_date: '2025-12-31',
  items: [
    { variant_id: 'PVAR_11111111', quantity: 100, unit_price: 50.00 },
  ],
});

// 2. Update PO status when goods arrive
await erpClient.purchaseOrders.updateStatus(po.data!.id, {
  status: 'delivered',
  accept_all: true,
  default_expiry_date: '2026-12-31',
});

// 3. Create GRN
const grn = await erpClient.grns.create({
  po_id: po.data!.id,
  grn_number: 'GRN-2025-001',
  received_by: 'user-123',
  quality_status: 'accepted',
  items: po.data!.items.map(item => ({
    po_item_id: item.id,
    received_quantity: item.quantity,
    accepted_quantity: item.quantity,
    expiry_date: '2026-12-31',
  })),
});

// 4. Verify inventory updated
const batches = await erpClient.inventory.batches.list({
  variant_id: 'PVAR_11111111',
  warehouse_id: 'WHSE_12345678',
});
console.log('Stock available:', batches.data?.[0].quantity_available);

// 5. Create sale
const sale = await erpClient.sales.create({
  warehouse_id: 'WHSE_12345678',
  sale_type: 'in_store',
  payment_mode: 'cash',
  apply_taxes: true,
  items: [{ variant_id: 'PVAR_11111111', quantity: 10 }],
});

// 6. Generate invoice
const invoice = await erpClient.sales.generateInvoice(sale.data!.id);
console.log('Invoice URL:', invoice.data?.invoice_url);
```

### Webhook Integration

```typescript
// Register webhook for inventory events
const webhook = await erpClient.webhooks.create({
  url: 'https://your-app.com/webhooks/inventory',
  events: ['inventory.low_stock', 'inventory.batch_expired'],
  is_active: true,
});

// Test webhook
await erpClient.webhooks.test(webhook.data!.id);

// List webhook deliveries
const deliveries = await erpClient.webhooks.listDeliveries(webhook.data!.id);
```

### Tax Reporting

```typescript
// Generate GST report for a period
const gstReport = await erpClient.taxes.reports.gst({
  start_date: '2025-01-01',
  end_date: '2025-01-31',
  warehouse_id: 'WHSE_12345678',
});

console.log('Total CGST:', gstReport.data?.total_cgst);
console.log('Total SGST:', gstReport.data?.total_sgst);
console.log('Total IGST:', gstReport.data?.total_igst);

// Get HSN-wise summary
const hsnReport = await erpClient.taxes.reports.hsnSummary({
  start_date: '2025-01-01',
  end_date: '2025-01-31',
});
```

### Return Processing

```typescript
// Create customer return
const customerReturn = await erpClient.returns.create({
  sale_id: 'SALE_12345678',
  return_type: 'customer_return',
  reason: 'Damaged product',
  items: [
    {
      sale_item_id: 'SITM_12345678',
      quantity: 2,
      return_to_inventory: true,
    },
  ],
});

// Process refund
await erpClient.returns.updateStatus(customerReturn.data!.id, {
  status: 'approved',
});

// Verify inventory restored
const batches = await erpClient.inventory.batches.list({
  variant_id: 'PVAR_12345678',
});
```

## Error Handling Patterns

### Retry Logic for Network Errors

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof NetworkError && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const sale = await withRetry(() =>
  erpClient.sales.create({
    warehouse_id: 'WHSE_12345678',
    sale_type: 'in_store',
    payment_mode: 'cash',
    items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
  })
);
```

### Graceful Degradation

```typescript
try {
  // Try to apply discounts
  const sale = await erpClient.sales.create({
    warehouse_id: 'WHSE_12345678',
    sale_type: 'in_store',
    payment_mode: 'cash',
    auto_apply_discounts: true,
    items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
  });
} catch (error) {
  if (error instanceof ValidationError) {
    // Fallback: create without discounts
    console.log('Discounts unavailable, proceeding without');
    const sale = await erpClient.sales.create({
      warehouse_id: 'WHSE_12345678',
      sale_type: 'in_store',
      payment_mode: 'cash',
      auto_apply_discounts: false,
      items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
    });
  }
  throw error;
}
```

## TypeScript Usage

### Typed Responses

```typescript
import type { SaleResponse, ApiResponse } from '@kisanlink/erp-service';

async function processSale(): Promise<SaleResponse> {
  const response: ApiResponse<SaleResponse> = await erpClient.sales.create({
    warehouse_id: 'WHSE_12345678',
    sale_type: 'in_store',
    payment_mode: 'cash',
    items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
  });

  if (!response.data) {
    throw new Error('Sale creation failed');
  }

  return response.data;
}
```

### Type Guards

```typescript
import {
  ValidationError,
  AuthenticationError,
  NotFoundError
} from '@kisanlink/erp-service';

function handleError(error: unknown): string {
  if (error instanceof ValidationError) {
    return `Validation failed: ${error.message}`;
  } else if (error instanceof AuthenticationError) {
    return 'Please login to continue';
  } else if (error instanceof NotFoundError) {
    return 'Resource not found';
  }
  return 'An unexpected error occurred';
}
```

## Testing

### Mock API Client

```typescript
import createERPService from '@kisanlink/erp-service';

// Create mock for testing
const mockClient = createERPService({
  baseURL: 'http://localhost:3000',
  getAccessToken: () => 'mock-token-for-testing',
});

// Use in tests
describe('Sales Flow', () => {
  it('should create sale successfully', async () => {
    const sale = await mockClient.sales.create({
      warehouse_id: 'WHSE_TEST',
      sale_type: 'in_store',
      payment_mode: 'cash',
      items: [{ variant_id: 'PVAR_TEST', quantity: 1 }],
    });

    expect(sale.data?.id).toBeDefined();
  });
});
```

## License

MIT

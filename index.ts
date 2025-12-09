/**
 * Kisanlink ERP Service API Client
 * Main entry point - exports the factory function to create ERP service instance
 */

import { validateConfig, type ERPServiceConfig } from './config.js';
import { createApiClient } from './utils/apiClient.js';

// Import all service factories
import createAttachmentService from './services/attachmentService.js';
import createBankPaymentService from './services/bankPaymentService.js';
import createCategoryService from './services/categoryService.js';
import createCollaboratorService from './services/collaboratorService.js';
import createDiscountService from './services/discountService.js';
import createGRNService from './services/grnService.js';
import createInventoryService from './services/inventoryService.js';
import createProductService from './services/productService.js';
import createPurchaseOrderService from './services/purchaseOrderService.js';
import createReturnService from './services/returnService.js';
import createSalesService from './services/salesService.js';
import createSubcategoryService from './services/subcategoryService.js';
// Tax service removed - tax endpoints no longer exist in API
// import createTaxService from './services/taxService.js';
import createWarehouseService from './services/warehouseService.js';
import createWebhookService from './services/webhookService.js';
import createReportService from './services/reportService.js';
import createAggregationService from './services/aggregationService.js';
import createSettingsService from './services/settingsService.js';

// Re-export types for convenience
export * from './types/index.js';
export * from './utils/errors.js';
export type { ERPServiceConfig } from './config.js';

/**
 * Creates an instance of the ERP Service API client
 *
 * @param config - Configuration object for the ERP service
 * @returns Object containing all ERP service modules
 *
 * @example
 * ```typescript
 * import createERPService from '@kisanlink/erp-service';
 *
 * const erpClient = createERPService({
 *   baseURL: 'https://erp-api.kisanlink.in',
 *   getAccessToken: () => localStorage.getItem('access_token'),
 * });
 *
 * // Use the services
 * const products = await erpClient.products.list();
 * const sale = await erpClient.sales.create({
 *   warehouse_id: 'WHSE_12345678',
 *   sale_type: 'in_store',
 *   payment_mode: 'cash',
 *   items: [{ variant_id: 'PVAR_12345678', quantity: 10 }],
 * });
 * ```
 */
const createERPService = (config: ERPServiceConfig) => {
  // Validate and normalize configuration
  const validatedConfig = validateConfig(config);

  // Create the shared API client instance
  const apiClient = createApiClient(validatedConfig);

  // Return all service modules with the same apiClient instance
  return {
    /**
     * File attachment management service
     * Upload, download, and manage file attachments for various entities
     */
    attachments: createAttachmentService(apiClient),

    /**
     * Bank payment tracking service
     * Track payments for sales and returns across different payment methods
     */
    bankPayments: createBankPaymentService(apiClient),

    /**
     * Category management service
     * Manage product categories with subcategories
     */
    categories: createCategoryService(apiClient),

    /**
     * Collaborator (supplier/vendor) management service
     * Manage suppliers, their products, and associations
     */
    collaborators: createCollaboratorService(apiClient),

    /**
     * Discount management service
     * Create, validate, and apply discounts with complex rules
     */
    discounts: createDiscountService(apiClient),

    /**
     * Goods Receipt Note (GRN) service
     * Process incoming goods, track quality checks, and update inventory
     */
    grns: createGRNService(apiClient),

    /**
     * Inventory management service
     * Track batches, stock levels, transactions, and valuation
     */
    inventory: createInventoryService(apiClient),

    /**
     * Product catalog service
     * Manage products, variants, and pricing across the system
     */
    products: createProductService(apiClient),

    /**
     * Purchase order management service
     * Create and track purchase orders from suppliers
     */
    purchaseOrders: createPurchaseOrderService(apiClient),

    /**
     * Return management service
     * Handle customer and supplier returns with refund policies
     */
    returns: createReturnService(apiClient),

    /**
     * Sales order management service
     * Process sales, apply discounts and taxes, generate invoices
     */
    sales: createSalesService(apiClient),

    /**
     * Subcategory management service
     * Manage product subcategories within categories
     */
    subcategories: createSubcategoryService(apiClient),

    /**
     * @deprecated Tax service removed - tax endpoints no longer exist in API
     * Tax calculation is now automatic based on variant's gst_rate and sale's apply_taxes field
     */
    // taxes: createTaxService(apiClient),

    /**
     * Warehouse management service
     * Manage warehouse locations, stock, and transfers
     */
    warehouses: createWarehouseService(apiClient),

    /**
     * Webhook management service
     * Register, manage, and track webhook event notifications
     */
    webhooks: createWebhookService(apiClient),

    /**
     * Reports service
     * Generate and export business reports (products, vendors, customers, inventory, purchases, sales, returns)
     */
    reports: createReportService(apiClient),

    /**
     * Aggregation service
     * Performance-optimized endpoints that reduce API calls by aggregating related data
     */
    aggregation: createAggregationService(apiClient),

    /**
     * Settings service
     * Manage FPO and system settings (company name, logo, addresses, bank details)
     */
    settings: createSettingsService(apiClient),
  };
};

export default createERPService;

/**
 * Type of the ERP service client instance
 * Useful for TypeScript consumers who need to type the service
 */
export type ERPServiceClient = ReturnType<typeof createERPService>;

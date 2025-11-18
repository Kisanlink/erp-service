# ERP API Client Architecture

## Overview

The ERP API Client is a TypeScript SDK designed to provide seamless integration with the Kisanlink ERP API. Following the proven patterns from the auth-service, this client library adopts a functional factory pattern with zero dependencies, ensuring framework agnosticism and comprehensive type safety.

## Core Design Principles

### 1. Functional Factory Pattern
- All services are created through factory functions
- No class-based implementations
- Composable and testable architecture
- Injectable dependencies for flexibility

### 2. Zero Dependencies
- No external runtime dependencies
- Uses native Fetch API for HTTP requests
- TypeScript for type safety only
- Self-contained implementation

### 3. Type Safety
- Comprehensive TypeScript types for all API operations
- Request/Response type definitions
- Strict type checking throughout
- Generated from Swagger definitions

### 4. Framework Agnostic
- Works in any JavaScript/TypeScript environment
- Browser and Node.js compatible
- No framework-specific abstractions
- Clean separation of concerns

## Directory Structure

```
erp-service/
├── src/
│   ├── index.ts                    # Main entry point and exports
│   ├── config.ts                   # Configuration interfaces
│   ├── types/                      # TypeScript type definitions
│   │   ├── index.ts                # Type exports
│   │   ├── common.ts               # Common/shared types
│   │   ├── attachments.ts          # Attachment-related types
│   │   ├── bank-payments.ts        # Bank payment types
│   │   ├── collaborators.ts        # Collaborator types
│   │   ├── discounts.ts            # Discount types
│   │   ├── grns.ts                 # GRN types
│   │   ├── inventory.ts            # Inventory types
│   │   ├── products.ts             # Product types
│   │   ├── purchase-orders.ts      # Purchase order types
│   │   ├── returns.ts              # Return types
│   │   ├── sales.ts                # Sales types
│   │   ├── taxes.ts                # Tax types
│   │   ├── warehouses.ts           # Warehouse types
│   │   └── webhooks.ts             # Webhook types
│   ├── services/                   # Service modules
│   │   ├── attachmentService.ts    # Attachment operations
│   │   ├── bankPaymentService.ts   # Bank payment operations
│   │   ├── collaboratorService.ts  # Collaborator management
│   │   ├── discountService.ts      # Discount management
│   │   ├── grnService.ts           # GRN operations
│   │   ├── inventoryService.ts     # Inventory management
│   │   ├── productService.ts       # Product management
│   │   ├── purchaseOrderService.ts # Purchase order operations
│   │   ├── returnService.ts        # Return management
│   │   ├── salesService.ts         # Sales operations
│   │   ├── taxService.ts           # Tax management
│   │   ├── warehouseService.ts     # Warehouse operations
│   │   └── webhookService.ts       # Webhook management
│   └── utils/                      # Utility modules
│       ├── apiClient.ts            # HTTP client implementation
│       ├── errors.ts               # Error handling utilities
│       └── helpers.ts              # Helper functions
├── tests/                          # Test files
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── fixtures/                   # Test fixtures
├── docs/                           # Documentation
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Component Architecture

### 1. Configuration Module (`config.ts`)
```typescript
interface ERPServiceConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  getAccessToken?: () => string | undefined;
  tenantId?: string;
  apiVersion?: string;
  requestTimeout?: number;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    retryableStatuses: number[];
  };
}
```

### 2. API Client (`utils/apiClient.ts`)
- Central HTTP client factory
- Request/Response interceptors
- Error handling and retry logic
- Authentication token injection
- Request timeout handling
- Response transformation

### 3. Service Modules
Each service module follows a consistent pattern:
- Factory function accepting API client
- Methods for all CRUD operations
- Proper typing for requests/responses
- Query parameter handling
- Error propagation

### 4. Type System
- Comprehensive type definitions
- Swagger-generated types
- Runtime type validation (optional)
- Type guards and assertions
- Shared type utilities

## Service Architecture Pattern

Each service follows this standard pattern:

```typescript
// services/exampleService.ts
import { ApiClient } from '../utils/apiClient';
import { Request, Response, QueryParams } from '../types';

const createExampleService = (apiClient: ApiClient) => {
  return {
    // List/Search operations
    list: (params?: QueryParams) =>
      apiClient.get<Response[]>('/endpoint', { params }),

    // Get single resource
    get: (id: string) =>
      apiClient.get<Response>(`/endpoint/${id}`),

    // Create resource
    create: (payload: Request) =>
      apiClient.post<Response>('/endpoint', payload),

    // Update resource
    update: (id: string, payload: Partial<Request>) =>
      apiClient.put<Response>(`/endpoint/${id}`, payload),

    // Delete resource
    delete: (id: string) =>
      apiClient.delete<void>(`/endpoint/${id}`),

    // Specialized operations
    specialOperation: (id: string, data: SpecialRequest) =>
      apiClient.post<SpecialResponse>(`/endpoint/${id}/special`, data)
  };
};

export default createExampleService;
```

## Error Handling Strategy

### Error Types
1. **NetworkError**: Connection failures
2. **AuthenticationError**: 401 responses
3. **AuthorizationError**: 403 responses
4. **ValidationError**: 400 with validation details
5. **ServerError**: 5xx responses
6. **TimeoutError**: Request timeouts
7. **BusinessLogicError**: Domain-specific errors

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    traceId?: string;
  };
  status: number;
}
```

### Error Handling Flow
1. API client catches raw errors
2. Transforms to typed error objects
3. Preserves original error context
4. Propagates to service consumers
5. Allows for retry logic
6. Logs errors appropriately

## Authentication & Security

### Token Management
- Bearer token authentication
- Token injection via config
- Automatic token refresh (optional)
- Secure token storage recommendations

### Security Headers
- CORS handling
- CSRF protection
- Content-Type enforcement
- Custom security headers

## Performance Optimizations

### Request Optimization
- Connection pooling (browser-managed)
- Request deduplication
- Caching strategies (optional)
- Batch operations support

### Response Handling
- Streaming for large responses
- Pagination support
- Response compression
- Progress tracking

## Testing Strategy

### Unit Tests
- Service method isolation
- Mock API client
- Type validation
- Error scenario coverage

### Integration Tests
- End-to-end API calls
- Mock server setup
- Response validation
- Error handling verification

### Contract Tests
- Swagger compliance
- Type consistency
- API versioning tests

## Monitoring & Observability

### Logging
- Request/Response logging
- Error tracking
- Performance metrics
- Debug mode support

### Metrics
- Request duration
- Success/failure rates
- Response sizes
- Retry attempts

## Migration Path

### From Existing Implementations
1. Install package
2. Initialize with config
3. Replace service calls
4. Update error handling
5. Remove old dependencies

### Version Upgrades
- Semantic versioning
- Breaking change documentation
- Migration guides
- Deprecation warnings

## Best Practices

### Usage Patterns
```typescript
// Initialize client
const erpClient = createERPService({
  baseURL: 'https://api.kisanlink.in',
  getAccessToken: () => localStorage.getItem('token'),
  tenantId: 'TENANT_001'
});

// Use services
const products = await erpClient.products.list({ limit: 10 });
const newProduct = await erpClient.products.create(productData);

// Error handling
try {
  const result = await erpClient.sales.create(saleData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.details);
  }
}
```

### Configuration Management
- Environment-based configs
- Secure credential storage
- Config validation
- Default value handling

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies
3. Run type generation
4. Implement services
5. Write tests
6. Build and test

### CI/CD Pipeline
1. Lint and format
2. Type checking
3. Unit tests
4. Integration tests
5. Build artifacts
6. Publish to registry

## API Versioning Strategy

### Version Handling
- API version in config
- Path-based versioning
- Header-based versioning
- Graceful degradation

### Backward Compatibility
- Deprecation notices
- Feature flags
- Progressive enhancement
- Migration windows

## Documentation Requirements

### API Documentation
- Method signatures
- Parameter descriptions
- Response examples
- Error scenarios

### Usage Examples
- Common use cases
- Integration patterns
- Best practices
- Troubleshooting guides

## Security Considerations

### Data Protection
- Sensitive data handling
- PII management
- Encryption requirements
- Audit logging

### Access Control
- Role-based access
- Permission validation
- Rate limiting
- IP restrictions

## Compliance & Standards

### Code Standards
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Naming conventions

### API Standards
- RESTful principles
- HTTP status codes
- Response formats
- Error conventions

## Future Enhancements

### Planned Features
- WebSocket support
- GraphQL integration
- Offline support
- Real-time synchronization

### Performance Improvements
- Response caching
- Request batching
- Connection optimization
- Lazy loading

## Dependencies & Constraints

### Runtime Dependencies
- None (zero-dependency goal)

### Development Dependencies
- TypeScript
- Testing frameworks
- Build tools
- Documentation generators

### Browser Support
- Modern browsers
- IE11 (with polyfills)
- Mobile browsers
- Progressive enhancement

## Conclusion

This architecture provides a robust, maintainable, and scalable foundation for the ERP API client. By following established patterns from the auth-service and adhering to best practices, the client library will deliver a superior developer experience while maintaining high performance and reliability standards.
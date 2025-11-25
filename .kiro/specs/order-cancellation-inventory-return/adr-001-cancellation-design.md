# ADR-001: Order Cancellation Design Decisions

## Status
Accepted

## Context
The ERP system needs to support order (sale) cancellation with proper inventory return handling. This is an API client library, so we need to define the interface for interacting with the backend cancellation APIs.

## Decision

### 1. Separate from Returns
**Decision**: Cancellation is distinct from customer returns.

**Rationale**:
- Returns are for delivered goods that customers want to send back
- Cancellations are for orders that haven't been fulfilled yet
- Different business rules apply (e.g., restocking fees for returns)

### 2. API Contract
**Decision**: Follow existing service patterns with POST for actions, GET for queries.

**Rationale**:
- Consistent with existing `confirm`, `ship`, `deliver` actions
- `cancelItems` as POST because it modifies state
- `getCancellations` as GET for read-only history

### 3. Type Definitions
**Decision**: Add comprehensive types for all cancellation operations.

**Rationale**:
- Type safety is a core principle of this API client
- Clear contracts between client and backend
- Better developer experience with IDE support

### 4. Method Placement
**Decision**: Add cancellation methods to existing salesService.

**Rationale**:
- Cancellation is a sale lifecycle operation
- No need for separate cancellation service
- Keeps related functionality together

## Consequences

### Positive
- Clear separation between cancellation and returns
- Type-safe API interactions
- Consistent with existing codebase patterns

### Negative
- Relies on backend implementing matching endpoints
- No offline/optimistic update support

## Alternatives Considered

### Separate CancellationService
Rejected because:
- Adds unnecessary complexity
- Cancellation is inherently tied to sales
- Would require cross-service coordination

### Generic Status Update
Rejected because:
- Doesn't capture cancellation metadata (reason, items)
- Loses type safety for the operation
- Backend needs structured input for inventory return

# Order Cancellation Implementation Tasks

## Phase 1: Type Definitions

### CANC-001: Add Cancellation Response Types
- [ ] Add `SaleCancellationResponse` interface
- [ ] Add `SaleCancellationItemResponse` interface
- [ ] Export types from `types/index.ts`

### CANC-002: Add Cancellation Request Types
- [ ] Add `CancelSaleRequest` interface
- [ ] Add `CancelSaleItemsRequest` interface
- [ ] Add `CancelSaleItemRequest` interface

## Phase 2: Service Implementation

### CANC-003: Add cancelItems Method
- [ ] Add `cancelItems` method to salesService
- [ ] Proper typing for request/response
- [ ] JSDoc documentation

### CANC-004: Add getCancellations Method
- [ ] Add `getCancellations` method to salesService
- [ ] Support pagination parameters
- [ ] JSDoc documentation

### CANC-005: Update cancel Method Documentation
- [ ] Update JSDoc to reflect inventory return behavior
- [ ] Document cancellation rules

## Phase 3: Build & Verification

### CANC-006: Build Verification
- [ ] Run TypeScript build
- [ ] Fix any type errors
- [ ] Verify exports work correctly

## Task Dependencies

```
CANC-001 → CANC-002 → CANC-003 → CANC-006
                   ↘        ↗
                    CANC-004
                        ↓
                    CANC-005
```

## Commit Strategy

Each task should be a single, atomic commit:
1. `feat(types): add sale cancellation response types`
2. `feat(types): add sale cancellation request types`
3. `feat(sales): add cancelItems method for partial cancellation`
4. `feat(sales): add getCancellations method for history`
5. `docs(sales): update cancel method documentation`
6. `chore: verify build passes`

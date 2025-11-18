import type { ApiClient } from '../utils/apiClient.js';
import type { ApiResponse } from '../types/index.js';

/**
 * Webhook configuration response
 */
export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
}

/**
 * Webhook log entry
 */
export interface WebhookLog {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: unknown;
  response_code: number;
  response_body?: string;
  error?: string;
  timestamp: string;
  retry_count: number;
}

/**
 * Creates webhook service for event notifications
 *
 * @param apiClient - Configured API client instance
 * @returns Webhook service methods
 *
 * @example
 * ```typescript
 * const webhookService = createWebhookService(apiClient);
 * const webhook = await webhookService.register({
 *   url: 'https://example.com/webhook',
 *   events: ['order.created', 'order.confirmed']
 * });
 * ```
 */
const createWebhookService = (apiClient: ApiClient) => {
  return {
    /**
     * List webhook configurations
     *
     * @returns List of webhooks
     */
    list: () =>
      apiClient.get<ApiResponse<Array<{
        id: string;
        url: string;
        events: string[];
        is_active: boolean;
        created_at: string;
      }>>>('/api/v1/webhooks'),

    /**
     * Register new webhook
     *
     * @param payload - Webhook registration data
     * @returns Registered webhook with secret
     */
    register: (payload: {
      url: string;
      events: string[];
      secret?: string;
    }) => apiClient.post<ApiResponse<{
      id: string;
      url: string;
      events: string[];
      secret: string;
    }>>('/api/v1/webhooks', payload),

    /**
     * Update webhook configuration
     *
     * @param id - Webhook ID
     * @param payload - Update data
     * @returns Updated webhook
     */
    update: (id: string, payload: {
      url?: string;
      events?: string[];
      is_active?: boolean;
    }) => apiClient.put<ApiResponse<{
      id: string;
      url: string;
      events: string[];
      is_active: boolean;
    }>>(`/api/v1/webhooks/${id}`, payload),

    /**
     * Delete webhook
     *
     * @param id - Webhook ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/webhooks/${id}`),

    /**
     * Test webhook
     *
     * @param id - Webhook ID
     * @param eventType - Event type to test (optional)
     * @returns Test result
     */
    test: (id: string, eventType?: string) =>
      apiClient.post<ApiResponse<{
        success: boolean;
        response_code?: number;
        response_body?: string;
        error?: string;
      }>>(`/api/v1/webhooks/${id}/test`, { event_type: eventType }),

    /**
     * Get webhook logs
     *
     * @param id - Webhook ID
     * @param params - Filter parameters
     * @returns Webhook delivery logs
     */
    getLogs: (id: string, params?: {
      from_date?: string;
      to_date?: string;
      status?: 'success' | 'failed';
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<Array<{
      id: string;
      webhook_id: string;
      event_type: string;
      payload: unknown;
      response_code: number;
      response_body?: string;
      error?: string;
      timestamp: string;
      retry_count: number;
    }>>>(`/api/v1/webhooks/${id}/logs`, { params }),

    /**
     * Retry failed webhook delivery
     *
     * @param logId - Webhook log ID
     * @returns Retry result
     */
    retry: (logId: string) =>
      apiClient.post<ApiResponse<{
        success: boolean;
        response_code?: number;
        error?: string;
      }>>(`/api/v1/webhooks/logs/${logId}/retry`, {}),

    /**
     * Get webhook statistics
     *
     * @returns Webhook statistics
     */
    getStats: () =>
      apiClient.get<ApiResponse<{
        total_webhooks: number;
        active_webhooks: number;
        total_events_sent: number;
        success_rate: number;
        by_event_type: Array<{
          event_type: string;
          count: number;
          success_count: number;
        }>;
      }>>('/api/v1/webhooks/stats'),

    /**
     * Webhook signature verification helper
     * This is a client-side utility function for verifying webhook signatures
     *
     * @param payload - Webhook payload string
     * @param signature - Received signature
     * @param secret - Webhook secret
     * @returns Validation result
     */
    verifySignature: (_payload: string, _signature: string, _secret: string): boolean => {
      // This would be implemented client-side using crypto library
      // Example: HMAC-SHA256 verification
      // For now, this is a placeholder that would need actual crypto implementation
      return true;
    },
  };
};

export default createWebhookService;

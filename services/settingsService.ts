import type { ApiClient } from '../utils/apiClient.js';
import type { ApiResponse } from '../types/index.js';

/**
 * Setting response model
 */
export interface SettingResponse {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

/**
 * Header field response model
 */
export interface HeaderFieldResponse {
  key: string;
  label: string;
  value: string;
  display_order: number;
}

/**
 * Upsert setting request
 */
export interface UpsertSettingRequest {
  value: string;
}

/**
 * Creates settings service for managing FPO and system settings
 *
 * @param apiClient - Configured API client instance
 * @returns Settings service methods
 *
 * @example
 * ```typescript
 * const settingsService = createSettingsService(apiClient);
 * const setting = await settingsService.upsert('fpo_name', { value: 'Kisanlink FPO' });
 * ```
 */
const createSettingsService = (apiClient: ApiClient) => {
  return {
    /**
     * List all settings
     *
     * @returns List of all settings
     */
    list: () => apiClient.get<ApiResponse<SettingResponse[]>>('/api/v1/settings'),

    /**
     * Get setting by key
     *
     * @param key - Setting key (e.g., 'fpo_name', 'fpo_logo_attachment_id')
     * @returns Setting details
     */
    get: (key: string) =>
      apiClient.get<ApiResponse<SettingResponse>>(`/api/v1/settings/${key}`),

    /**
     * Create or update setting (upsert)
     *
     * @param key - Setting key
     * @param payload - Setting value
     * @returns Created or updated setting
     */
    upsert: (key: string, payload: UpsertSettingRequest) =>
      apiClient.put<ApiResponse<SettingResponse>>(`/api/v1/settings/${key}`, payload),

    /**
     * Delete setting
     *
     * @param key - Setting key
     * @returns Void on success
     */
    delete: (key: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/settings/${key}`),

    /**
     * Get header fields for invoice/display
     *
     * @returns List of header fields with display order
     */
    getHeaderFields: () =>
      apiClient.get<ApiResponse<HeaderFieldResponse[]>>('/api/v1/settings/header-fields'),
  };
};

export default createSettingsService;




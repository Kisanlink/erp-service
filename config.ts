/**
 * Configuration interface for ERP Service API client
 */
export interface ERPServiceConfig {
  /**
   * Base URL of the ERP API server
   * @example 'https://erp-api.kisanlink.in'
   */
  baseURL: string;

  /**
   * Default headers to include in all requests
   * @example { 'Content-Type': 'application/json' }
   */
  defaultHeaders?: Record<string, string>;

  /**
   * Function to retrieve the current access token
   * This allows the consuming application to manage token storage
   * @returns The current access token or undefined if not authenticated
   */
  getAccessToken?: () => string | undefined;

  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;
}

/**
 * Internal API configuration with required fields
 * @internal
 */
export interface ApiConfig {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  getAccessToken?: () => string | undefined;
  timeout: number;
}

/**
 * Validates and normalizes the ERP service configuration
 * @param config - User-provided configuration
 * @returns Normalized configuration with defaults
 * @throws {Error} If baseURL is missing or invalid
 */
export function validateConfig(config: ERPServiceConfig): ApiConfig {
  if (!config.baseURL) {
    throw new Error('ERPServiceConfig.baseURL is required');
  }

  // Remove trailing slash from baseURL
  const baseURL = config.baseURL.replace(/\/$/, '');

  return {
    baseURL,
    defaultHeaders: config.defaultHeaders || {},
    getAccessToken: config.getAccessToken,
    timeout: config.timeout || 30000,
  };
}

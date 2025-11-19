import type { ApiConfig } from '../config.js';
import { NetworkError, createErrorFromStatus } from './errors.js';

/**
 * Options for API requests
 */
export interface RequestOptions {
  /**
   * Additional headers to include in the request
   */
  headers?: Record<string, string>;

  /**
   * Query parameters to append to the URL
   */
  params?: Record<string, string | number | boolean | undefined>;

  /**
   * Custom timeout for this request (overrides config timeout)
   */
  timeout?: number;
}

/**
 * Builds headers for the request, including authorization if available
 * @param config - API configuration
 * @param extraHeaders - Additional headers to include
 * @param isFormData - Whether the request body is FormData
 * @returns Headers object for fetch
 */
function buildHeaders(
  config: ApiConfig,
  extraHeaders?: Record<string, string>,
  isFormData?: boolean
): HeadersInit {
  const headers: Record<string, string> = {
    ...config.defaultHeaders,
    ...(extraHeaders || {}),
  };

  // Only add Content-Type for JSON if not FormData
  // FormData needs the browser to set Content-Type with boundary
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Add authorization header if token is available
  const token = config.getAccessToken?.();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Normalizes URL path by removing trailing slashes
 * @param path - URL path to normalize
 * @returns Normalized path without trailing slash
 */
function normalizeURLPath(path: string): string {
  return path.replace(/\/+$/, '');
}

/**
 * Builds URL with query parameters
 * @param baseURL - Base URL of the API
 * @param endpoint - API endpoint path
 * @param params - Query parameters
 * @returns Complete URL string with query string
 */
function buildURL(
  baseURL: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const normalizedBase = normalizeURLPath(baseURL);
  const normalizedEndpoint = normalizeURLPath(endpoint);
  const url = new URL(normalizedEndpoint, normalizedBase);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Performs HTTP request with timeout support
 * @param config - API configuration
 * @param method - HTTP method
 * @param endpoint - API endpoint
 * @param body - Request body (for POST, PUT, PATCH)
 * @param options - Request options
 * @returns Parsed response data
 * @throws {NetworkError} If network request fails
 * @throws {ERPServiceError} If API returns error status
 */
async function request<T>(
  config: ApiConfig,
  method: string,
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> {
  const url = buildURL(config.baseURL, endpoint, options?.params);

  // Check if body is FormData to handle Content-Type correctly
  const isFormData = body instanceof FormData;
  const headers = buildHeaders(config, options?.headers, isFormData);
  const timeout = options?.timeout || config.timeout;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers,
      // Send FormData as-is, JSON stringify everything else
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let errorMessage = `API ${method} ${endpoint} failed: ${response.status}`;

      try {
        const errorJson = JSON.parse(text);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        if (text) {
          errorMessage += ` - ${text}`;
        }
      }

      throw createErrorFromStatus(response.status, errorMessage, text);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    // Parse JSON response
    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new NetworkError('Failed to parse response JSON', error as Error);
    }
  } catch (error) {
    clearTimeout(timeoutId);

    // Re-throw our custom errors
    if (error instanceof Error && error.name.includes('Error')) {
      throw error;
    }

    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError(`Request timeout after ${timeout}ms`);
    }

    // Handle network errors
    throw new NetworkError('Network request failed', error as Error);
  }
}

/**
 * Creates an API client with HTTP methods
 * @param config - API configuration
 * @returns API client instance with HTTP methods
 */
export function createApiClient(config: ApiConfig) {
  return {
    /**
     * Performs GET request
     * @param endpoint - API endpoint
     * @param options - Request options
     * @returns Parsed response data
     */
    get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
      request<T>(config, 'GET', endpoint, undefined, options),

    /**
     * Performs POST request
     * @param endpoint - API endpoint
     * @param body - Request body
     * @param options - Request options
     * @returns Parsed response data
     */
    post: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
      request<T>(config, 'POST', endpoint, body, options),

    /**
     * Performs PUT request
     * @param endpoint - API endpoint
     * @param body - Request body
     * @param options - Request options
     * @returns Parsed response data
     */
    put: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
      request<T>(config, 'PUT', endpoint, body, options),

    /**
     * Performs PATCH request
     * @param endpoint - API endpoint
     * @param body - Request body
     * @param options - Request options
     * @returns Parsed response data
     */
    patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
      request<T>(config, 'PATCH', endpoint, body, options),

    /**
     * Performs DELETE request
     * @param endpoint - API endpoint
     * @param options - Request options
     * @returns Parsed response data
     */
    delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
      request<T>(config, 'DELETE', endpoint, undefined, options),
  };
}

/**
 * Type of the API client returned by createApiClient
 */
export type ApiClient = ReturnType<typeof createApiClient>;

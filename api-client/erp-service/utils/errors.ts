/**
 * Base error class for all ERP service errors
 */
export class ERPServiceError extends Error {
  public readonly status?: number;
  public readonly response?: {
    status: number;
    data: unknown;
  };

  constructor(message: string, status?: number, response?: { status: number; data: unknown }) {
    super(message);
    this.name = 'ERPServiceError';
    this.status = status;
    this.response = response;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends ERPServiceError {
  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
    if (originalError && originalError.stack) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}

/**
 * Error thrown when request validation fails (400 Bad Request)
 */
export class ValidationError extends ERPServiceError {
  constructor(message: string, response?: { status: number; data: unknown }) {
    super(message, 400, response);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when authentication fails (401 Unauthorized)
 */
export class AuthenticationError extends ERPServiceError {
  constructor(message: string, response?: { status: number; data: unknown }) {
    super(message, 401, response);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when authorization fails (403 Forbidden)
 */
export class AuthorizationError extends ERPServiceError {
  constructor(message: string, response?: { status: number; data: unknown }) {
    super(message, 403, response);
    this.name = 'AuthorizationError';
  }
}

/**
 * Error thrown when resource is not found (404 Not Found)
 */
export class NotFoundError extends ERPServiceError {
  constructor(message: string, response?: { status: number; data: unknown }) {
    super(message, 404, response);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when request conflicts with current state (409 Conflict)
 */
export class ConflictError extends ERPServiceError {
  constructor(message: string, response?: { status: number; data: unknown }) {
    super(message, 409, response);
    this.name = 'ConflictError';
  }
}

/**
 * Error thrown when server error occurs (500+ status codes)
 */
export class ServerError extends ERPServiceError {
  constructor(message: string, status: number, response?: { status: number; data: unknown }) {
    super(message, status, response);
    this.name = 'ServerError';
  }
}

/**
 * Creates appropriate error based on HTTP status code
 * @param status - HTTP status code
 * @param message - Error message
 * @param responseBody - Raw response body
 * @returns Appropriate error instance
 */
export function createErrorFromStatus(
  status: number,
  message: string,
  responseBody?: unknown
): ERPServiceError {
  const response = responseBody ? { status, data: responseBody } : undefined;

  switch (status) {
    case 400:
      return new ValidationError(message, response);
    case 401:
      return new AuthenticationError(message, response);
    case 403:
      return new AuthorizationError(message, response);
    case 404:
      return new NotFoundError(message, response);
    case 409:
      return new ConflictError(message, response);
    default:
      if (status >= 500) {
        return new ServerError(message, status, response);
      }
      return new ERPServiceError(message, status, response);
  }
}

/**
 * Stable error envelope for all API error responses (AURA API Design).
 *
 * Shape:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human readable message" | string[],
 *     "details": { "statusCode": 400, "path": "/api/v1/...", "timestamp": "ISO" }
 *   }
 * }
 *
 * Field names are English; user-facing localized messages are a later concern.
 * Success responses use plain DTOs (not wrapped) per DEV-003 decision.
 * Internal stack traces are never exposed.
 */
export interface ApiErrorDetails {
  statusCode: number;
  path: string;
  timestamp: string; // ISO 8601, UTC
}

export interface ApiError {
  error: {
    code: string;
    message: string | string[];
    details: ApiErrorDetails;
  };
}

/** Stable, status-derived error codes. */
export const ERROR_CODES: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_ERROR",
  500: "INTERNAL_SERVER_ERROR",
};

/** Resolve a stable error code for an HTTP status, defaulting sensibly. */
export function errorCodeForStatus(statusCode: number): string {
  if (ERROR_CODES[statusCode]) {
    return ERROR_CODES[statusCode];
  }
  if (statusCode >= 500) {
    return "INTERNAL_SERVER_ERROR";
  }
  return "BAD_REQUEST";
}

export interface ApiResponse<T = unknown, E = unknown> {
  success: boolean;
  data?: T;
  error?: E;
  metadata?: Record<string, unknown>;
  path?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error?: unknown;
  message?: string;
  errors?: string[] | ValidationError[];
  path?: string;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  public readonly success = false as const;
  public readonly errors?: string[] | ValidationError[];
  public readonly timestamp: string;
  public readonly status?: number;
  public readonly raw?: unknown;

  constructor(
    message: string,
    errors?: string[] | ValidationError[],
    timestamp?: string,
    status?: number,
    raw?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
    this.timestamp = timestamp || new Date().toISOString();
    this.status = status;
    this.raw = raw;
  }

  isValidationError(): boolean {
    return (
      Array.isArray(this.errors) &&
      this.errors.length > 0 &&
      typeof this.errors[0] === 'object' &&
      this.errors[0] !== null &&
      'field' in this.errors[0]
    );
  }

  getValidationErrors(): ValidationError[] {
    return this.isValidationError() ? (this.errors as ValidationError[]) : [];
  }

  getErrorMessages(): string[] {
    if (this.isValidationError()) {
      return (this.errors as ValidationError[]).map((e) => `${e.field}: ${e.message}`);
    }
    return (this.errors as string[]) || [this.message];
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[] | ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  public readonly success: false = false;
  public readonly errors?: string[] | ValidationError[];
  public readonly timestamp: string;
  public readonly status?: number;

  constructor(
    message: string,
    errors?: string[] | ValidationError[],
    timestamp?: string,
    status?: number
  ) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
    this.timestamp = timestamp || new Date().toISOString();
    this.status = status;
  }

  isValidationError(): boolean {
    return Array.isArray(this.errors) && 
           this.errors.length > 0 && 
           typeof this.errors[0] === 'object' && 
           'field' in this.errors[0];
  }

  getValidationErrors(): ValidationError[] {
    return this.isValidationError() ? this.errors as ValidationError[] : [];
  }

  getErrorMessages(): string[] {
    if (this.isValidationError()) {
      return (this.errors as ValidationError[]).map(e => `${e.field}: ${e.message}`);
    }
    return this.errors as string[] || [this.message];
  }
}
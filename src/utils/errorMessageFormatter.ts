import { ERROR_MESSAGES } from '../constants/errorMessages';
import type { ApiError } from '../types/api';

interface FormattedError {
  userMessage: string;
  technicalMessage: string;
  code?: string;
  field?: string;
}

export class ErrorMessageFormatter {
  /**
   * Format API errors consistently
   */
  static formatApiError(error: any): FormattedError {
    // Handle ApiError instances
    if (error instanceof Error && 'code' in error) {
      const apiError = error as ApiError;
      return this.getErrorMessage(apiError.code, apiError.message);
    }

    // Handle axios errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      // Check for specific error codes in response
      if (data?.code) {
        return this.getErrorMessage(data.code, data.message);
      }
      
      // Map HTTP status codes
      return this.getErrorMessage(status.toString(), data?.message);
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return this.getErrorMessage('NETWORK_ERROR');
    }

    // Fallback for unknown errors
    return this.getErrorMessage('UNKNOWN_ERROR', error.message);
  }

  /**
   * Format validation errors specially
   */
  static formatValidationErrors(errors: Record<string, string[]>): FormattedError[] {
    const formattedErrors: FormattedError[] = [];
    
    Object.entries(errors).forEach(([field, messages]) => {
      messages.forEach(message => {
        formattedErrors.push({
          userMessage: message,
          technicalMessage: `Validation failed for field: ${field}`,
          field,
          code: 'VALIDATION_ERROR'
        });
      });
    });

    return formattedErrors;
  }

  /**
   * Get error message from constants
   */
  private static getErrorMessage(code: string, fallbackMessage?: string): FormattedError {
    // Try to find exact code match
    const errorMessage = this.findErrorByCode(code);
    
    if (errorMessage) {
      return {
        userMessage: errorMessage.user,
        technicalMessage: errorMessage.technical,
        code
      };
    }

    // Fallback to generic error
    const generic = ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR;
    return {
      userMessage: fallbackMessage || generic.user,
      technicalMessage: fallbackMessage || generic.technical,
      code
    };
  }

  /**
   * Find error message by code in constants
   */
  private static findErrorByCode(code: string): { user: string; technical: string } | null {
    // Search through all error categories
    for (const category of Object.values(ERROR_MESSAGES)) {
      for (const [key, value] of Object.entries(category)) {
        if (key === code || key === code.replace(/^\d+$/, '')) {
          return value;
        }
      }
    }

    // Check HTTP status codes
    const statusCode = parseInt(code);
    if (!isNaN(statusCode)) {
      switch (statusCode) {
        case 400:
          return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
        case 401:
          return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
        case 403:
          return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
        case 404:
          return ERROR_MESSAGES.NETWORK.NOT_FOUND;
        case 408:
          return ERROR_MESSAGES.NETWORK.TIMEOUT;
        case 429:
          return ERROR_MESSAGES.NETWORK.RATE_LIMITED;
        case 500:
        case 502:
        case 503:
        case 504:
          return ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        default:
          return null;
      }
    }

    return null;
  }

  /**
   * Extract user-friendly message
   */
  static getUserMessage(error: any): string {
    const formatted = this.formatApiError(error);
    return formatted.userMessage;
  }

  /**
   * Extract technical message for logging
   */
  static getTechnicalMessage(error: any): string {
    const formatted = this.formatApiError(error);
    return formatted.technicalMessage;
  }
}
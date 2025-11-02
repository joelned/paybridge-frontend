import { AxiosError } from 'axios';
import { ApiError, ApiErrorResponse, ValidationError } from '../types/api';

export function handleApiError(error: AxiosError): ApiError {
  const response = error.response;
  
  if (response?.data) {
    const errorData = response.data as ApiErrorResponse;
    
    return new ApiError(
      errorData.message || 'An error occurred',
      errorData.errors,
      errorData.timestamp,
      response.status
    );
  }

  // Network or other errors
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return new ApiError('Network error. Please check your connection.');
  }

  return new ApiError(error.message || 'An unexpected error occurred');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function getValidationErrors(error: unknown): ValidationError[] {
  if (error instanceof ApiError && error.isValidationError()) {
    return error.getValidationErrors();
  }
  
  return [];
}

export function getAllErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) {
    return error.getErrorMessages();
  }
  
  if (error instanceof Error) {
    return [error.message];
  }
  
  return ['An unexpected error occurred'];
}
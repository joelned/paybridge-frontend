import { AxiosError } from 'axios';
import { ApiError, ValidationError } from '../types/api';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function pickFirstMessage(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = pickFirstMessage(item);
      if (message) return message;
    }
    return null;
  }

  if (isRecord(value)) {
    return (
      readString(value.message) ||
      readString(value.error) ||
      readString(value.details) ||
      readString(value.description) ||
      null
    );
  }

  return readString(value);
}

export function extractErrorMessage(payload: unknown): string {
  if (!isRecord(payload)) {
    return pickFirstMessage(payload) || 'An error occurred';
  }

  const nestedError = payload.error;
  const directMessage =
    readString(payload.message) ||
    readString(payload.msg) ||
    pickFirstMessage(nestedError) ||
    pickFirstMessage(payload.errors);

  return directMessage || 'An error occurred';
}

export function extractTimestamp(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;
  return readString(payload.timestamp) || undefined;
}

export function extractErrors(payload: unknown): string[] | ValidationError[] | undefined {
  if (!isRecord(payload)) return undefined;

  const errors = payload.errors;
  if (!Array.isArray(errors) || errors.length === 0) return undefined;

  const maybeValidation = errors.every(
    (item) => isRecord(item) && typeof item.field === 'string' && typeof item.message === 'string'
  );

  if (maybeValidation) {
    return errors as ValidationError[];
  }

  const messages = errors
    .map((item) => pickFirstMessage(item))
    .filter((item): item is string => Boolean(item));

  return messages.length > 0 ? messages : undefined;
}

export function handleApiError(error: AxiosError): ApiError {
  const response = error.response;

  if (response?.data !== undefined) {
    const errorData = response.data;

    return new ApiError(
      extractErrorMessage(errorData),
      extractErrors(errorData),
      extractTimestamp(errorData),
      response.status,
      errorData
    );
  }

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

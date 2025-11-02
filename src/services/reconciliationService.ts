import { axiosInstance } from './api/axiosConfig';
import { ApiError } from '../types/api';

export interface ReconciliationRecord {
  id: string;
  paymentId: string;
  providerId: string;
  externalTransactionId: string;
  internalAmount: number;
  externalAmount: number;
  currency: string;
  status: 'MATCHED' | 'UNMATCHED' | 'DISPUTED' | 'RESOLVED';
  discrepancy?: {
    type: 'AMOUNT' | 'STATUS' | 'MISSING' | 'DUPLICATE';
    description: string;
    amount?: number;
  };
  reconciliationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationSummary {
  totalRecords: number;
  matchedRecords: number;
  unmatchedRecords: number;
  disputedRecords: number;
  totalAmount: number;
  matchedAmount: number;
  unmatchedAmount: number;
  lastReconciliationDate: string;
}

export interface ReconciliationFilters {
  status?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

export interface ReconciliationListResponse {
  records: ReconciliationRecord[];
  summary: ReconciliationSummary;
  totalCount: number;
  page: number;
  size: number;
}

export interface StartReconciliationRequest {
  providerId: string;
  dateFrom: string;
  dateTo: string;
  forceRefresh?: boolean;
}

export interface ReconciliationJob {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  providerId: string;
  dateFrom: string;
  dateTo: string;
  progress: number;
  recordsProcessed: number;
  recordsTotal: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

class ReconciliationService {
  /**
   * Get reconciliation records with filters
   */
  async getReconciliationRecords(filters: ReconciliationFilters = {}): Promise<ReconciliationListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<ReconciliationListResponse>(`/reconciliation?${params}`);
    return response.data;
  }

  /**
   * Get reconciliation record by ID
   */
  async getReconciliationRecord(recordId: string): Promise<ReconciliationRecord> {
    const response = await axiosInstance.get<ReconciliationRecord>(`/reconciliation/${recordId}`);
    return response.data;
  }

  /**
   * Get reconciliation summary
   */
  async getReconciliationSummary(dateFrom?: string, dateTo?: string): Promise<ReconciliationSummary> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axiosInstance.get<ReconciliationSummary>(`/reconciliation/summary?${params}`);
    return response.data;
  }

  /**
   * Start reconciliation process
   */
  async startReconciliation(request: StartReconciliationRequest): Promise<ReconciliationJob> {
    try {
      const response = await axiosInstance.post<ReconciliationJob>('/reconciliation/start', request);
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to start reconciliation');
    }
  }

  /**
   * Get reconciliation job status
   */
  async getReconciliationJob(jobId: string): Promise<ReconciliationJob> {
    const response = await axiosInstance.get<ReconciliationJob>(`/reconciliation/jobs/${jobId}`);
    return response.data;
  }

  /**
   * Get all reconciliation jobs
   */
  async getReconciliationJobs(): Promise<ReconciliationJob[]> {
    const response = await axiosInstance.get<ReconciliationJob[]>('/reconciliation/jobs');
    return response.data;
  }

  /**
   * Cancel reconciliation job
   */
  async cancelReconciliationJob(jobId: string): Promise<void> {
    await axiosInstance.post(`/reconciliation/jobs/${jobId}/cancel`);
  }

  /**
   * Mark discrepancy as resolved
   */
  async resolveDiscrepancy(recordId: string, resolution: string): Promise<ReconciliationRecord> {
    const response = await axiosInstance.post<ReconciliationRecord>(`/reconciliation/${recordId}/resolve`, {
      resolution
    });
    return response.data;
  }

  /**
   * Export reconciliation data
   */
  async exportReconciliationData(filters: ReconciliationFilters, format: 'CSV' | 'EXCEL' = 'CSV'): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    params.append('format', format);

    const response = await axiosInstance.get(`/reconciliation/export?${params}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Upload external transaction data for reconciliation
   */
  async uploadTransactionData(providerId: string, file: File): Promise<{ message: string; recordsProcessed: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('providerId', providerId);

    const response = await axiosInstance.post('/reconciliation/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

export const reconciliationService = new ReconciliationService();
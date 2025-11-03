import { useQuery } from '@tanstack/react-query';
import { reconciliationService } from '../../services';
import type { ReconciliationFilters } from '../../services';

export const useReconciliationRecords = (filters: ReconciliationFilters = {}) => {
  return useQuery({
    queryKey: ['reconciliation-records', filters],
    queryFn: () => reconciliationService.getReconciliationRecords(filters),
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

export const useReconciliationRecord = (recordId: string) => {
  return useQuery({
    queryKey: ['reconciliation-record', recordId],
    queryFn: () => reconciliationService.getReconciliationRecord(recordId),
    enabled: !!recordId
  });
};

export const useReconciliationSummary = (dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['reconciliation-summary', dateFrom, dateTo],
    queryFn: () => reconciliationService.getReconciliationSummary(dateFrom, dateTo),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useReconciliationJobs = () => {
  return useQuery({
    queryKey: ['reconciliation-jobs'],
    queryFn: () => reconciliationService.getReconciliationJobs(),
    staleTime: 30 * 1000, // 30 seconds for job status
    refetchInterval: 30 * 1000 // Auto-refresh every 30 seconds
  });
};

export const useReconciliationJob = (jobId: string) => {
  return useQuery({
    queryKey: ['reconciliation-job', jobId],
    queryFn: () => reconciliationService.getReconciliationJob(jobId),
    enabled: !!jobId,
    staleTime: 10 * 1000, // 10 seconds for individual job
    refetchInterval: (data) => {
      // Stop refetching if job is completed or failed
      return data?.status === 'COMPLETED' || data?.status === 'FAILED' ? false : 10 * 1000;
    }
  });
};
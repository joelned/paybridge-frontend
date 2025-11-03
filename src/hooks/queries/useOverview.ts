import { useQuery } from '@tanstack/react-query';
import { merchantService } from '../../services';

export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: () => merchantService.getOverview(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useRecentTransactions = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-transactions', limit],
    queryFn: () => merchantService.getRecentTransactions(limit),
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};
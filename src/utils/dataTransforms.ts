// Common data transformation utilities

// Transform API response to table data
export const transformToTableData = <T>(
  data: any[],
  columnMap: Record<string, string | ((item: any) => any)>
): T[] => {
  return data.map(item => {
    const transformed: any = {};
    Object.entries(columnMap).forEach(([key, mapping]) => {
      if (typeof mapping === 'function') {
        transformed[key] = mapping(item);
      } else {
        transformed[key] = item[mapping];
      }
    });
    return transformed;
  });
};

// Group data by key
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Sort data by multiple criteria
export const sortBy = <T>(
  array: T[],
  criteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const { key, direction } of criteria) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Filter data by multiple conditions
export const filterBy = <T>(
  array: T[],
  filters: Record<string, any>
): T[] => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      
      const itemValue = (item as any)[key];
      
      if (typeof value === 'string') {
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
      
      return itemValue === value;
    });
  });
};

// Calculate statistics from data
export const calculateStats = (data: number[]) => {
  if (data.length === 0) return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
  
  const sum = data.reduce((acc, val) => acc + val, 0);
  const avg = sum / data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  return { sum, avg, min, max, count: data.length };
};

// Transform payment data for charts
export const transformPaymentData = (payments: any[]) => {
  const grouped = groupBy(payments, 'date');
  
  return Object.entries(grouped).map(([date, dayPayments]) => ({
    date,
    amount: dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    count: dayPayments.length,
    success: dayPayments.filter(p => p.status === 'SUCCEEDED').length,
    failed: dayPayments.filter(p => p.status === 'FAILED').length
  }));
};

// Transform provider data for display
export const transformProviderData = (providers: any[]) => {
  return providers.map(provider => ({
    ...provider,
    successRate: provider.totalTransactions > 0 
      ? ((provider.successfulTransactions / provider.totalTransactions) * 100).toFixed(1)
      : '0.0',
    avgAmount: provider.totalTransactions > 0
      ? (provider.totalAmount / provider.totalTransactions).toFixed(2)
      : '0.00',
    status: provider.enabled ? 'ACTIVE' : 'INACTIVE'
  }));
};

// Normalize API response format
export const normalizeApiResponse = <T>(response: any): T[] => {
  // Handle different API response formats
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.items && Array.isArray(response.items)) return response.items;
  if (response?.results && Array.isArray(response.results)) return response.results;
  
  return [];
};

// Create pagination metadata
export const createPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
  startIndex: (page - 1) * limit,
  endIndex: Math.min(page * limit, total)
});
// src/components/ui/OptimizedTable.tsx
import { memo, useMemo, useState } from 'react';
import { VirtualList } from './VirtualList';
import { useDebounce } from '../../hooks';

interface Column<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  height?: number;
  rowHeight?: number;
  searchable?: boolean;
  sortable?: boolean;
  className?: string;
}

export const OptimizedTable = memo(<T extends Record<string, any>>({
  data,
  columns,
  height = 400,
  rowHeight = 48,
  searchable = false,
  sortable = false,
  className = ''
}: OptimizedTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (debouncedSearchTerm && searchable) {
      result = result.filter(item =>
        columns.some(column =>
          String(item[column.key])
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig && sortable) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, debouncedSearchTerm, sortConfig, columns, searchable, sortable]);

  const handleSort = (key: keyof T) => {
    if (!sortable) return;
    
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderRow = (item: T, index: number) => (
    <div className="flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {columns.map((column, colIndex) => (
        <div
          key={String(column.key)}
          className="px-4 py-3 text-sm text-gray-900 truncate"
          style={{ width: column.width || `${100 / columns.length}%` }}
        >
          {column.render
            ? column.render(item[column.key], item, index)
            : String(item[column.key])
          }
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200">
        {columns.map((column) => (
          <div
            key={String(column.key)}
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            style={{ width: column.width || `${100 / columns.length}%` }}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.header}</span>
              {column.sortable && sortable && sortConfig?.key === column.key && (
                <span className="text-blue-500">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual List */}
      <VirtualList
        items={filteredAndSortedData}
        itemHeight={rowHeight}
        containerHeight={height - (searchable ? 120 : 60)} // Account for header and search
        renderItem={renderRow}
        className="overflow-auto"
      />
      
      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
        Showing {filteredAndSortedData.length} of {data.length} items
      </div>
    </div>
  );
}) as <T extends Record<string, any>>(props: OptimizedTableProps<T>) => JSX.Element;
import React, { useMemo } from 'react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { ChevronRight } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  mobileLabel?: string; // Custom label for mobile card view
  hideOnMobile?: boolean;
}

interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (item: T) => string;
}

// Mobile Card View Component
const MobileCard = React.memo(<T,>({ 
  item, 
  columns, 
  onRowClick 
}: { 
  item: T; 
  columns: Column<T>[]; 
  onRowClick?: (item: T) => void;
}) => {
  const visibleColumns = columns.filter(col => !col.hideOnMobile);

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200 ${
        onRowClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98] min-h-[44px]' : ''
      }`}
      onClick={() => onRowClick?.(item)}
      role={onRowClick ? "button" : undefined}
      tabIndex={onRowClick ? 0 : undefined}
    >
      {visibleColumns.map((column) => (
        <div key={String(column.key)} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
          <div className="text-sm font-medium text-gray-600 min-w-0 flex-1">
            {column.mobileLabel || column.header}
          </div>
          <div className="text-sm text-gray-900 font-medium text-right ml-4">
            {column.render 
              ? column.render(item[column.key], item)
              : String(item[column.key] || '')
            }
          </div>
        </div>
      ))}
      {onRowClick && (
        <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      )}
    </div>
  );
});

MobileCard.displayName = 'MobileCard';

// Desktop Table Component
const DesktopTable = React.memo(<T,>({ 
  data, 
  columns, 
  onRowClick,
  keyExtractor 
}: { 
  data: T[]; 
  columns: Column<T>[]; 
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T) => string;
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item, index) => (
          <tr
            key={keyExtractor ? keyExtractor(item) : index}
            className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column) => (
              <td
                key={String(column.key)}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {column.render 
                  ? column.render(item[column.key], item)
                  : String(item[column.key] || '')
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

DesktopTable.displayName = 'DesktopTable';

export const ResponsiveDataTable = React.memo(<T,>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  keyExtractor,
}: ResponsiveDataTableProps<T>) => {
  const isMobile = useIsMobile();

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="animate-pulse">
          {isMobile ? (
            // Mobile loading skeleton
            <div className="space-y-4 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop loading skeleton
            <div>
              <div className="h-12 bg-gray-200" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 border-b border-gray-200" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (memoizedData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3 px-1">
        {memoizedData.map((item, index) => (
          <MobileCard
            key={keyExtractor ? keyExtractor(item) : index}
            item={item}
            columns={memoizedColumns}
            onRowClick={onRowClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <DesktopTable
        data={memoizedData}
        columns={memoizedColumns}
        onRowClick={onRowClick}
        keyExtractor={keyExtractor}
      />
    </div>
  );
});

ResponsiveDataTable.displayName = 'ResponsiveDataTable';
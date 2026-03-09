import React, { useMemo } from 'react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { AlertCircle, ChevronRight, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

const handleActionKeyDown = (
  event: React.KeyboardEvent<HTMLElement>,
  onActivate?: () => void
) => {
  if (!onActivate) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onActivate();
  }
};

export interface Column<T extends object> {
  key: keyof T;
  header: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  mobileLabel?: string; // Custom label for mobile card view
  hideOnMobile?: boolean;
}

interface ResponsiveDataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  keyExtractor?: (item: T) => string;
}

// Mobile Card View Component
const MobileCard = React.memo(<T extends object,>({
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
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200 ${onRowClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98] min-h-[44px]' : ''
        }`}
      onClick={() => onRowClick?.(item)}
      onKeyDown={(event) => handleActionKeyDown(event, onRowClick ? () => onRowClick(item) : undefined)}
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
const DesktopTable = React.memo(<T extends object,>({
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
            onKeyDown={(event) => handleActionKeyDown(event, onRowClick ? () => onRowClick(item) : undefined)}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
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

const ResponsiveDataTableComponent = <T extends object,>({
  data,
  columns,
  onRowClick,
  loading = false,
  error,
  onRetry,
  emptyMessage = 'No data available',
  keyExtractor,
}: ResponsiveDataTableProps<T>) => {
  const isMobile = useIsMobile();

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  if (loading) {
    return (
      <div className="ui-card ui-card-default rounded-xl">
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

  if (error) {
    return (
      <div className="ui-card ui-card-default rounded-xl p-8 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={22} className="text-red-600" />
        </div>
        <p className="text-sm font-semibold text-slate-900">Unable to load data</p>
        <p className="text-sm text-slate-600 mt-1">{error}</p>
        {onRetry && (
          <div className="mt-4">
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (memoizedData.length === 0) {
    return (
      <div className="ui-card ui-card-default rounded-xl p-8 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Inbox size={20} className="text-slate-500" />
        </div>
        <p className="text-sm font-semibold text-slate-900">No records yet</p>
        <p className="text-sm text-slate-600 mt-1">{emptyMessage}</p>
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
            columns={memoizedColumns as unknown as Column<object>[]}
            onRowClick={onRowClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="ui-card ui-card-default rounded-xl overflow-hidden">
      <DesktopTable
        data={memoizedData}
        columns={memoizedColumns as unknown as Column<object>[]}
        onRowClick={onRowClick}
        keyExtractor={keyExtractor}
      />
    </div>
  );
};

const MemoizedResponsiveDataTable = React.memo(ResponsiveDataTableComponent);
MemoizedResponsiveDataTable.displayName = 'ResponsiveDataTable';
export const ResponsiveDataTable = MemoizedResponsiveDataTable as typeof ResponsiveDataTableComponent;

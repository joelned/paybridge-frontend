import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  keyExtractor: (row: T, index: number) => React.Key;
}

export const DataTable = <T extends object>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  keyExtractor
}: Props<T>) => {
  if (loading) {
    return <LoadingSkeleton variant="table" rows={5} className={className} />;
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 p-8 text-center ${className}`}>
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((row, index) => (
              <tr key={keyExtractor(row, index)} className="hover:bg-slate-50 transition-colors">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4 text-sm text-slate-900">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
import React from 'react';

interface Props {
  variant?: 'card' | 'table' | 'text' | 'stat' | 'chart';
  rows?: number;
  className?: string;
}

const SkeletonLine: React.FC<{ width?: string; height?: string }> = ({ 
  width = 'w-full', 
  height = 'h-4' 
}) => (
  <div className={`${width} ${height} bg-slate-200 rounded animate-pulse`} />
);

export const LoadingSkeleton: React.FC<Props> = ({ 
  variant = 'card', 
  rows = 3,
  className = '' 
}) => {
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
        <div className="space-y-4">
          <SkeletonLine width="w-1/3" height="h-6" />
          <SkeletonLine width="w-full" height="h-4" />
          <SkeletonLine width="w-2/3" height="h-4" />
        </div>
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
        <div className="space-y-3">
          <SkeletonLine width="w-1/2" height="h-4" />
          <SkeletonLine width="w-1/3" height="h-8" />
          <SkeletonLine width="w-1/4" height="h-3" />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
        <div className="p-4 border-b border-slate-200">
          <SkeletonLine width="w-1/4" height="h-5" />
        </div>
        <div className="divide-y divide-slate-200">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4 flex items-center space-x-4">
              <SkeletonLine width="w-8" height="h-8" />
              <div className="flex-1 space-y-2">
                <SkeletonLine width="w-1/3" height="h-4" />
                <SkeletonLine width="w-1/2" height="h-3" />
              </div>
              <SkeletonLine width="w-20" height="h-6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
        <div className="space-y-4">
          <SkeletonLine width="w-1/3" height="h-6" />
          <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} />
      ))}
    </div>
  );
};
// src/components/ui/Skeleton.tsx
import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton = memo<SkeletonProps>(({ 
  className = '', 
  width = '100%', 
  height = '1rem' 
}) => (
  <div 
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{ width, height }}
  />
));

export const SkeletonCard = memo(() => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <Skeleton height="1.5rem" width="60%" className="mb-4" />
    <Skeleton height="1rem" width="100%" className="mb-2" />
    <Skeleton height="1rem" width="80%" className="mb-4" />
    <Skeleton height="2rem" width="30%" />
  </div>
));

export const SkeletonTable = memo(() => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-4 border-b">
      <Skeleton height="2.5rem" width="100%" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center p-4 border-b last:border-b-0">
        <Skeleton height="1rem" width="20%" className="mr-4" />
        <Skeleton height="1rem" width="30%" className="mr-4" />
        <Skeleton height="1rem" width="25%" className="mr-4" />
        <Skeleton height="1rem" width="15%" />
      </div>
    ))}
  </div>
));
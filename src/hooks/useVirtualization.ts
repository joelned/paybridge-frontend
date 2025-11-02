import { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualization = <T>(
  items: T[],
  config: VirtualizationConfig
) => {
  const { itemHeight, containerHeight, overscan = 5 } = config;

  const virtualizedProps = useMemo(() => ({
    height: containerHeight,
    itemCount: items.length,
    itemSize: itemHeight,
    overscanCount: overscan,
    itemData: items,
  }), [items, containerHeight, itemHeight, overscan]);

  const getItemKey = useMemo(() => 
    (index: number) => `item-${index}`,
    []
  );

  return {
    List,
    virtualizedProps,
    getItemKey,
    itemCount: items.length,
  };
};
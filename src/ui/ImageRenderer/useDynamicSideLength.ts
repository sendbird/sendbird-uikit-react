import { useMemo } from 'react';
import { getDynamicMinLengthInPx } from './utils';

interface DynamicSideLengthProps {
  width: string | number;
  height: string | number;
  maxSideLength: string | null;
  defaultMinLength: string
}

export function useDynamicSideLength({
  width,
  height,
  maxSideLength,
  defaultMinLength,
}: DynamicSideLengthProps): string[] {

  const dynamicMinWidth = useMemo(() => {
    return getDynamicMinLengthInPx(width, maxSideLength, defaultMinLength);
  }, [width]);

  const dynamicMinHeight = useMemo(() => {
    return getDynamicMinLengthInPx(height, maxSideLength, defaultMinLength);
  }, [height]);

  return [dynamicMinWidth, dynamicMinHeight];
}

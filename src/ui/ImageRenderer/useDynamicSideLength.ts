import { useEffect, useState } from 'react';
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

  const [dynamicMinWidth, setDynamicMinWidth] = useState<string>('');
  const [dynamicMinHeight, setDynamicMinHeight] = useState<string>('');

  useEffect(() => {
    setDynamicMinWidth(getDynamicMinLengthInPx(width, maxSideLength, defaultMinLength));
  }, [width]);

  useEffect(() => {
    setDynamicMinHeight(getDynamicMinLengthInPx(height, maxSideLength, defaultMinLength));
  }, [height]);

  return [dynamicMinWidth, dynamicMinHeight];
}

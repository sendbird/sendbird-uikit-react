import React, { useMemo } from 'react';
import './index.scss';

export interface ProgressBarProps {
  className?: string;
  maxSize: number;
  currentSize: number;
}

export const ProgressBar = ({
  className ='',
  maxSize,
  currentSize,
}: ProgressBarProps): React.ReactElement => {
  const width = useMemo(() => {
    console.log('progress bar comp', currentSize, maxSize)
    return `${currentSize / maxSize * 100}%`;
  }, [currentSize, maxSize]);
  return (
    <div className={`sendbird-progress-bar ${className}`}>
      <div className="sendbird-progress-bar__fill" style={{ width }} />
    </div>
  );
};

export default ProgressBar;

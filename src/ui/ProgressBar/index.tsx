import React, { useMemo } from 'react';
import './index.scss';

export interface ProgressBarProps {
  maxSize: number;
  currentSize: number;
}

export const ProgressBar = ({
  maxSize,
  currentSize,
}: ProgressBarProps): React.ReactElement => {
  const width = useMemo(() => {
    console.log('use memo', currentSize / maxSize)
    return `${currentSize / maxSize}%`;
  }, [currentSize, maxSize]);
  return (
    <div className="sendbird-progress-bar">
      <div className="sendbird-progress-bar__fill" style={{ width }} />
    </div>
  );
};

export default ProgressBar;

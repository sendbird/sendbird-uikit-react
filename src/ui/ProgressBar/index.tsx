import React, { useMemo } from 'react';
import './index.scss';

export enum ProgressBarColorTypes {
  PRIMARY = 'progress-bar-color--primary',
  GRAY = 'progress-bar-color--gray',
}

export interface ProgressBarProps {
  className?: string;
  maxSize: number;
  currentSize: number;
  colorType?: ProgressBarColorTypes;
}

export const ProgressBar = ({
  className ='',
  maxSize,
  currentSize,
  colorType = ProgressBarColorTypes.PRIMARY,
}: ProgressBarProps): React.ReactElement => {
  const width = useMemo(() => {
    console.log('progress bar comp', currentSize, maxSize, `${currentSize / maxSize * 100}%`)
    return `${currentSize / maxSize * 100}%`;
  }, [currentSize, maxSize]);
  return (
    <div className={`sendbird-progress-bar ${className} ${colorType}`}>
      <div className="sendbird-progress-bar__fill" style={{ width }} />
    </div>
  );
};

export default ProgressBar;

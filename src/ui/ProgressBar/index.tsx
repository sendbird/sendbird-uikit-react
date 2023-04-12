import React, { useMemo } from 'react';
import './index.scss';

export const ProgressBarColorTypes = {
  PRIMARY: 'progress-bar-color--primary',
  GRAY: 'progress-bar-color--gray',
} as const;
export type ProgressBarColorTypes = typeof ProgressBarColorTypes[keyof typeof ProgressBarColorTypes];

export interface ProgressBarProps {
  className?: string;
  disabled?: boolean;
  maxSize: number;
  currentSize: number;
  colorType?: ProgressBarColorTypes;
}

export const ProgressBar = ({
  className = '',
  disabled = false,
  maxSize,
  currentSize = 0,
  colorType = ProgressBarColorTypes.PRIMARY,
}: ProgressBarProps): React.ReactElement => {
  const width = useMemo(() => {
    return `${currentSize / maxSize * 100}%`;
  }, [currentSize, maxSize]);
  return (
    <div className={`sendbird-progress-bar ${className} ${colorType} ${disabled ? 'progress-bar--disabled' : ''}`}>
      <div className="sendbird-progress-bar__fill" style={{ width }} />
    </div>
  );
};

export default ProgressBar;

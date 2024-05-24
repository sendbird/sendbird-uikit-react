import React, { ReactElement } from 'react';
import './index.scss';
import { getClassName } from '../../utils';
import { MultipleFilesMessage } from '@sendbird/chat/message';

interface ImageGridProps {
  children: ReactElement[];
  className?: string;
  message: MultipleFilesMessage;
  isReactionEnabled?: boolean;
}

export default function ImageGrid({
  children,
  className,
  message,
  isReactionEnabled,
}: ImageGridProps): ReactElement {
  return (
    <div className='sendbird-image-grid-wrap'>
      <div className={getClassName([
        className ?? '',
        'sendbird-image-grid',
        (isReactionEnabled && message?.reactions?.length > 0) ? 'reactions' : '',
      ])}>
        { children }
      </div>
    </div>
  );
}

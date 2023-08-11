import React, { ReactElement } from 'react';
import './index.scss';

interface ImageGridProps {
  children: ReactElement[];
}

export default function ImageGrid({
  children,
}: ImageGridProps): ReactElement {
  return (
    <div className='sendbird-image-grid-wrap'>
      <div className='sendbird-image-grid'>
        { children }
      </div>
    </div>
  );
}

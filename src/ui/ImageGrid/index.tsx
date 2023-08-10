import React, { ReactElement } from 'react';
import './index.scss';
import numberToPx from "../../utils/numberToPx";

interface ImageGridProps {
  items: ReactElement[];
  size?: string | number;
  gap?: string | number;
  borderRadius?: string | number;
}

const DEFAULT_GAP = 4;
const DEFAULT_BORDER_RADIUS = 12;

export default function ImageGrid({
  items,
  gap = DEFAULT_GAP,
  borderRadius = DEFAULT_BORDER_RADIUS,
}: ImageGridProps): ReactElement {

  gap = numberToPx(gap);
  borderRadius = numberToPx(borderRadius);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      <div
        className='sendbird-image-grid'
        style={{
          gap,
          padding: gap,
          borderRadius,
        }}
      >
        { items }
      </div>
    </div>
  );
}

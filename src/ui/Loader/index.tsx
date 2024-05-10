import React, { ReactElement } from 'react';

import './index.scss';

import Icon, { IconTypes } from '../Icon';

export interface LoaderProps {
  className?: string | Array<string>;
  width?: string | number;
  height?: string | number;
  children?: ReactElement;
  testID?: string;
}

export default function Loader({
  className = '',
  width = '26px',
  height = '26px',
  children,
  testID = '',
}: LoaderProps): ReactElement {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-loader',
      ].join(' ')}
      data-testid={testID}
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: typeof height === 'string' ? height : `${height}px`,
      }}
    >
      {
        children
        || (
          <Icon
            type={IconTypes.SPINNER}
            width="26px"
            height="26px"
          />
        )
      }
    </div>
  );
}

import React, {
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  TouchEvent,
} from 'react';

import './index.scss';
import useLongPress from '../../hooks/useLongPress';
import { noop } from '../../utils/utils';

export interface ReactionButtonProps {
  children: ReactElement;
  className?: string | Array<string>;
  width?: string | number;
  height?: string | number;
  selected?: boolean;
  onClick?: (
    e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => void;
}

const ReactionButton = React.forwardRef((props: ReactionButtonProps, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    width,
    height,
    selected,
    onClick,
    children,
  } = props;

  const onClickHandler = useLongPress({
    onLongPress: noop,
    onClick,
  }, {
    shouldPreventDefault: true,
    shouldStopPropagation: true,
  });

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        `sendbird-reaction-button${selected ? '--selected' : ''}`,
      ].join(' ')}
      ref={ref}
      role="button"
      style={{ width, height }}
      {...onClickHandler}
      tabIndex={0}
    >
      <div className="sendbird-reaction-button__inner">
        {children}
      </div>
    </div>
  );
});

export default ReactionButton;

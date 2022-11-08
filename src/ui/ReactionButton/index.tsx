import React, {
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  RefObject,
  TouchEvent,
} from 'react';

import './index.scss';

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
const ReactionButton = React.forwardRef((props: ReactionButtonProps, ref: RefObject<HTMLDivElement>): ReactElement => {
  const {
    className,
    width,
    height,
    selected,
    onClick,
    children,
  } = props;

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        `sendbird-reaction-button${selected ? '--selected' : ''}`,
      ].join(' ')}
      ref={ref}
      role="button"
      style={{ width, height }}
      onClick={(e) => onClick(e)}
      onKeyDown={(e) => onClick(e)}
      onTouchEnd={(e) => {
        onClick(e);
        // to stop longpress
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      tabIndex={0}
    >
      <div className="sendbird-reaction-button__inner">
        {children}
      </div>
    </div>
  );
});

export default ReactionButton;

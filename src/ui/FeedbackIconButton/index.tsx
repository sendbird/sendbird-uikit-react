import React, {
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import './index.scss';

export interface FeedbackIconButtonProps {
  children: ReactNode;
  isSelected: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const FeedbackIconButton = React.forwardRef((
  props: FeedbackIconButtonProps,
  ref: RefObject<HTMLButtonElement>,
): ReactElement => {
  const {
    children,
    isSelected,
    onClick = () => { /* noop */ },
  } = props;
  return (
    <button
      className={[
        'sendbird-iconbutton__feedback',
        isSelected ? 'sendbird-iconbutton__feedback__pressed' : '',
      ].join(' ')}
      ref={ref}
      type='button'
      onClick={(e) => {
        onClick?.(e);
      }}
    >
      <span
        className={[
          'sendbird-iconbutton__feedback__inner',
          isSelected ? 'sendbird-iconbutton__feedback__inner__pressed' : '',
        ].join(' ')}
      >
        {children}
      </span>
    </button>
  );
});

export default FeedbackIconButton;

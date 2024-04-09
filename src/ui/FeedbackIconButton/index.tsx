import React, {
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import './index.scss';
import { deleteNullish } from '../../utils/utils';

export interface FeedbackIconButtonProps {
  children: ReactNode;
  isSelected: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const FeedbackIconButton = React.forwardRef((
  props: FeedbackIconButtonProps,
  ref: RefObject<HTMLButtonElement>,
): ReactElement => {
  const {
    children,
    isSelected,
    onClick = () => { /* noop */ },
    disabled = false,
  } = deleteNullish(props);
  return (
    <button
      className={[
        'sendbird-iconbutton__feedback',
        isSelected ? 'sendbird-iconbutton__feedback__pressed' : '',
        disabled ? 'sendbird-iconbutton__feedback__disabled' : '',
      ].join(' ')}
      ref={ref}
      type='button'
      onClick={(e) => {
        onClick?.(e);
      }}
      disabled={disabled}
    >
      <span
        className={[
          'sendbird-iconbutton__feedback__inner',
          isSelected ? 'sendbird-iconbutton__feedback__inner__pressed' : '',
          disabled ? 'sendbird-iconbutton__feedback__inner__disabled' : '',
        ].join(' ')}
      >
        {children}
      </span>
    </button>
  );
});

export default FeedbackIconButton;

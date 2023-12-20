import React, {
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useState,
} from 'react';

import './index.scss';

export interface FeedbackIconButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const FeedbackIconButton = React.forwardRef((
  props: FeedbackIconButtonProps,
  ref: RefObject<HTMLButtonElement>,
): ReactElement => {
  const {
    children,
    onClick = () => { /* noop */ },
  } = props;
  const [toggle, setToggle] = useState(false);
  return (
    <button
      className={[
        'sendbird-iconbutton__feedback',
        toggle ? 'sendbird-iconbutton__feedback__pressed' : '',
      ].join(' ')}
      ref={ref}
      type='button'
      onClick={(e) => {
        setToggle(!toggle);
        onClick?.(e);
      }}
    >
      <span
        className={[
          'sendbird-iconbutton__feedback__inner',
          toggle ? 'sendbird-iconbutton__feedback__inner__pressed' : '',
        ].join(' ')}
      >
        {children}
      </span>
    </button>
  );
});

export default FeedbackIconButton;

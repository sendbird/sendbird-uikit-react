import React from 'react';
import './index.scss';

interface MentionUserLabelProps {
  className?: string
  children?: string;
  isReverse?: boolean;
  color?: string;
}

export default function MentionUserLabel({
  className = '',
  children,
  isReverse = false,
  color,
}: MentionUserLabelProps): JSX.Element {
  return (
    <span
      className={`sendbird-mention-user-label ${className} ${isReverse ? 'reverse' : ''} ${color}`}
    >
      {children}
    </span>
  );
}

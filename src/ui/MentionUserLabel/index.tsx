import React from 'react';
import './index.scss';

interface MentionUserLabelProps {
  className?: string
  children?: string;
  isReverse?: boolean;
  color?: string;
  userId?: string;
}

export default function MentionUserLabel({
  className = '',
  children,
  isReverse = false,
  color,
  userId,
}: MentionUserLabelProps): JSX.Element {
  return (
    <span
      className={`sendbird-mention-user-label ${className} ${isReverse ? 'reverse' : ''} ${color}`}
      contentEditable={false}
      data-userid={userId}
    >
      {children}
    </span>
  );
}

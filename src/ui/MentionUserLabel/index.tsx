import './index.scss';

import React from 'react';
import { MENTION_USER_LABEL_CLASSNAME } from './consts';

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
      className={`${MENTION_USER_LABEL_CLASSNAME} ${className} ${isReverse ? 'reverse' : ''} ${color}`}
      contentEditable={false}
      data-userid={userId}
      data-sb-mention={true}
    >
      {children}
    </span>
  );
}

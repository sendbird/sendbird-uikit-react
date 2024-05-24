import React, { ReactElement } from 'react';
import { AdminMessage as AdminMessageType } from '@sendbird/chat/message';

import './index.scss';
import Label, { LabelColors, LabelTypography } from '../Label';

interface AdminMessageProps {
  className?: string | Array<string>;
  message: AdminMessageType;
}

export default function AdminMessage({
  className = '',
  message,
}: AdminMessageProps): ReactElement | null {
  if (!(message?.isAdminMessage || message?.messageType) || !message?.isAdminMessage?.() || message?.messageType !== 'admin') {
    return null;
  }
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-admin-message',
      ].join(' ')}
    >
      <Label
        className="sendbird-admin-message__text"
        type={LabelTypography.CAPTION_2}
        color={LabelColors.ONBACKGROUND_2}
      >
        {message?.message}
      </Label>
    </div>
  );
}

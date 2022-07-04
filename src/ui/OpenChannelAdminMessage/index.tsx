import React, { ReactElement } from 'react';
import { AdminMessage } from '@sendbird/chat/message';
import './index.scss';

import Label, { LabelColors, LabelTypography } from '../Label';

interface Props {
  className?: string | Array<string>;
  message: AdminMessage;
}

export default function OpenChannelAdminMessage({
  className,
  message,
}: Props): ReactElement {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-openchannel-admin-message',
      ].join(' ')}
    >
      <Label
        className="sendbird-openchannel-admin-message__text"
        type={LabelTypography.CAPTION_2}
        color={LabelColors.ONBACKGROUND_2}
      >
        {message.message || ''}
      </Label>
    </div>
  );
}

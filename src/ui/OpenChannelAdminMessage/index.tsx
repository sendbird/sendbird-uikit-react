import React, { ReactElement } from 'react';
import { ClientAdminMessage } from '../../index';
import './index.scss';

import Label, { LabelColors, LabelTypography } from '../Label';

interface Props {
  className?: string | Array<string>;
  message: ClientAdminMessage;
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

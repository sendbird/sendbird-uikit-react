import React, { ReactElement } from 'react';
import { OpenChannel } from 'sendbird';
import './index.scss';

interface Props {
  channel: OpenChannel;
}

export default function OpenChannelMessageContent({}: Props): ReactElement {
  return (
    <div>
    </div>
  );
}

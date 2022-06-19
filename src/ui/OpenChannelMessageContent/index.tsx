import './index.scss';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import React, { ReactElement } from 'react';

interface Props {
  channel: OpenChannel;
}

export default function OpenChannelMessageContent({}: Props): ReactElement {
  return (
    <div>
    </div>
  );
}

import './muted-avatar-overlay.scss';

import React, { ReactElement } from 'react'
import Icon, { IconTypes, IconColors } from '../Icon';

interface Props {
  height?: number;
  width?: number;
}

export default function MutedAvatarOverlay(props: Props): ReactElement {
  const { height = 24, width = 24 } = props;
  return (
    <div
      className="sendbird-muted-avatar"
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div className="sendbird-muted-avatar__icon">
        <div
          className="sendbird-muted-avatar__bg"
          style={{
            height: `${height}px`,
            width: `${width}px`,
          }}
        />
        <Icon
          type={IconTypes.MUTE}
          fillColor={IconColors.WHITE}
          width={`${height - 8}px`}
          height={`${width - 8}px`}
        />
      </div>
    </div>
  );
}

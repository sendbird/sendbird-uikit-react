import React from 'react';

import Label, { LabelTypography, LabelColors } from '../Label';

export interface PlaybackTimeProps {
  className?: string;
  time: number;// millisec
  labelType?: string;
}

export const PlaybackTime = ({
  className,
  time = 0,
  labelType = LabelTypography.CAPTION_2,
}: PlaybackTimeProps): React.ReactElement => {
  const hour = parseInt((time / 3600000).toFixed());
  const min = parseInt((time / 60000).toFixed());
  const sec = Math.floor((time % 60000) / 1000);
  return (
    <div className={`sendbird-ui-play-time ${className}`}>
      <Label
        type={labelType}
        color={LabelColors.ONCONTENT_1}
      >
        {`${hour ? hour + ':' : ''}${min < 10 ? '0' : ''}${min ? min : '0'}:${sec < 10 ? '0' : ''}${sec}`}
      </Label>
    </div>
  );
};

export default PlaybackTime;

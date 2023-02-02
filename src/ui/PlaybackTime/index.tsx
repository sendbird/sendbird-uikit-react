import React from 'react';

import Label, { LabelTypography, LabelColors } from '../Label';

export interface PlaybackTimeProps {
  className?: string;
  time: number;// millisec
  labelType?: string;
  labelColor?: string;
}

export const PlaybackTime = ({
  className,
  time = 0,
  labelType = LabelTypography.CAPTION_2,
  labelColor = LabelColors.ONCONTENT_1,
}: PlaybackTimeProps): React.ReactElement => {
  const hour = parseInt((time / 3600000).toFixed());
  const min = parseInt((time % 3600000 / 60000).toFixed());
  const sec = Math.floor((time % 3600000 % 60000) / 1000);
  return (
    <div className={`sendbird-ui-play-time ${className}`}>
      <Label
        type={labelType}
        color={labelColor}
      >
        {`${hour ? hour + ':' : ''}${min < 10 ? '0' : ''}${min ? min : '0'}:${sec < 10 ? '0' : ''}${sec}`}
      </Label>
    </div>
  );
};

export default PlaybackTime;

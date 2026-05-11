import React from 'react';

import Label, { LabelTypography, LabelColors } from '../Label';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';

export interface PlaybackTimeProps {
  className?: string;
  time: number;// millisec
  labelType?: ObjectValues<typeof LabelTypography>;
  labelColor?: ObjectValues<typeof LabelColors>;
}

export const PlaybackTime = ({
  className,
  time = 0,
  labelType = LabelTypography.CAPTION_2,
  labelColor = LabelColors.ONCONTENT_1,
}: PlaybackTimeProps): React.ReactElement => {
  const safeTime = Number.isFinite(time) ? time : 0;
  const naturalTime = safeTime < 0 ? 0 : safeTime;

  const hour = Math.floor(naturalTime / 3600000);
  const min = Math.floor(naturalTime % 3600000 / 60000);
  const sec = Math.floor((naturalTime % 3600000 % 60000) / 1000);
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

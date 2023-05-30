import React, { useContext } from 'react';

import './unread-count.scss';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

export interface UnreadCountProps {
  className?: string;
  count: number | undefined;
  time: string;
  onClick(): void;
}

const UnreadCount: React.FC<UnreadCountProps> = ({
  className = '',
  count = 0,
  time = '',
  onClick,
}: UnreadCountProps) => {
  const { stringSet } = useContext(LocalizationContext);
  const timeArray = time?.toString?.()?.split(' ') || [];
  timeArray?.splice(-2, 0, stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON);

  return (
    <div
      className={`sendbird-notification${count < 1 ? '--hide' : ''} ${className}`}
      onClick={onClick}
    >
      <Label className="sendbird-notification__text" color={LabelColors.ONCONTENT_1} type={LabelTypography.CAPTION_2}>
        {`${count} `}
        {stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE}
        {` ${timeArray.join(' ')}`}
      </Label>
      <Icon
        width="24px"
        height="24px"
        type={IconTypes.CHEVRON_DOWN}
        fillColor={IconColors.CONTENT}
      />
    </div>
  );
};

export default UnreadCount;

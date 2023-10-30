import React, { useContext, useMemo } from 'react';

import './unread-count.scss';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import format from 'date-fns/format';

export interface UnreadCountProps {
  className?: string;
  count: number | undefined;
  onClick(): void;
  unreadSinceDate?: Date | null;
  /** @deprecated Please use `unreadSinceDate` instead * */
  time?: string;
}

const UnreadCount: React.FC<UnreadCountProps> = ({
  className = '',
  count = 0,
  time = '',
  onClick,
  unreadSinceDate,
}: UnreadCountProps) => {
  const { stringSet } = useContext(LocalizationContext);

  const unreadSince = useMemo(() => {
    if (unreadSinceDate) {
      return format(unreadSinceDate, stringSet.DATE_FORMAT__MESSAGE_LIST__NOTIFICATION__UNREAD_SINCE);
    } else {
      const timeArray = time?.toString?.()?.split(' ') || [];
      timeArray?.splice(-2, 0, stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON);
      return timeArray.join(' ');
    }
  }, [time, unreadSinceDate]);

  return (
    <div
      className={`sendbird-notification${count < 1 ? '--hide' : ''} ${className}`}
      onClick={onClick}
    >
      <Label className="sendbird-notification__text" color={LabelColors.ONCONTENT_1} type={LabelTypography.CAPTION_2}>
        {`${count} `}
        {stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE}
        {` ${unreadSince}`}
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

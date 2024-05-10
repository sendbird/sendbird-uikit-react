import './index.scss';
import React, { useContext, useMemo } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import format from 'date-fns/format';
import { classnames } from '../../../../utils/utils';

export interface UnreadCountProps {
  className?: string;
  count: number | undefined;
  onClick(): void;
  lastReadAt?: Date | null;
  /** @deprecated Please use `lastReadAt` instead * */
  time?: string;
}

export const UnreadCount: React.FC<UnreadCountProps> = ({
  className = '',
  count = 0,
  time = '',
  onClick,
  lastReadAt,
}: UnreadCountProps) => {
  const { stringSet, dateLocale } = useContext(LocalizationContext);

  const unreadSince = useMemo(() => {
    // TODO: Remove this on v4
    if (stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON !== 'on') {
      const timeArray = time?.toString?.()?.split(' ') || [];
      timeArray?.splice(-2, 0, stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON);
      return timeArray.join(' ');
    } else if (lastReadAt) {
      return format(lastReadAt, stringSet.DATE_FORMAT__MESSAGE_LIST__NOTIFICATION__UNREAD_SINCE, { locale: dateLocale });
    }
  }, [time, lastReadAt]);

  return (
    <div
      className={classnames(count < 1 ? 'sendbird-notification--hide' : 'sendbird-notification', className)}
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

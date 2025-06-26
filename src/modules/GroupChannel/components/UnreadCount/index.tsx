import './index.scss';
import React, { useContext, useMemo } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import { classnames } from '../../../../utils/utils';

export interface UnreadCountProps {
  className?: string;
  count: number | undefined;
  onClick(): void;
  lastReadAt?: Date | null;
  /** @deprecated Please use `lastReadAt` instead * */
  time?: string;
  isFrozenChannel?: boolean;
}

export const UnreadCount: React.FC<UnreadCountProps> = ({
  className = '',
  count = 0,
  onClick,
  isFrozenChannel = false,
}: UnreadCountProps) => {
  const { stringSet } = useContext(LocalizationContext);

  const unreadMessageCountText = useMemo(() => {
    if (count === 1) {
      return stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__UNREAD_MESSAGE;
    } else if (count > 1) {
      return stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__UNREAD_MESSAGE_S;
    }
  }, [count]);

  return (
    <div
      className={classnames(
        count < 1 ? 'sendbird-unread-floating-button--hide' : 'sendbird-unread-floating-button',
        isFrozenChannel && 'sendbird-unread-floating-button--below-frozen',
        className,
      )}
      data-testid="sendbird-notification"
      onClick={onClick}
    >
      <Label
        className="sendbird-unread-floating-button__text"
        testID="sendbird-notification__text"
        color={LabelColors.ONCONTENT_1}
        type={LabelTypography.CAPTION_2}
      >
        {`${count} `}
        {unreadMessageCountText}
      </Label>
      <Icon
        width="24px"
        height="24px"
        type={IconTypes.FLOATING_BUTTON_CLOSE}
        fillColor={IconColors.CONTENT}
      />
    </div>
  );
};

export default UnreadCount;

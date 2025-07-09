import './index.scss';
import React, { useContext, useMemo } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import { classnames } from '../../../../utils/utils';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';

export interface NewMessageCountProps {
  className?: string;
  count: number | undefined;
  onClick(): void;
}

export const NewMessageCount: React.FC<NewMessageCountProps> = ({
  className = '',
  count = 0,
  onClick,
}: NewMessageCountProps) => {
  const { stringSet } = useContext(LocalizationContext);
  const { isMobile } = useMediaQueryContext();
  

  const newMessageCountText = useMemo(() => {
    if (count === 1) {
      return stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE;
    } else if (count > 1) {
      return stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE_S;
    }
  }, [count]);

  return (
    <div
      className={classnames(
        count < 1 ? 'sendbird-new-message-floating-button--hide' : 'sendbird-new-message-floating-button',
        className,
      )}
      data-testid="sendbird-new-message-notification"
      onClick={onClick}
    >
      <Label
        className="sendbird-new-message-floating-button__text"
        testID="sendbird-new-message-notification__text"
        color={LabelColors.ONCONTENT_1}
        type={LabelTypography.CAPTION_2}
      >
        {`${count > 99 ? '99+' : count} `}
        {newMessageCountText}
      </Label>
      {
        !isMobile && (
          <Icon
            width="24px"
            height="24px"
            type={IconTypes.CHEVRON_DOWN}
            fillColor={IconColors.PRIMARY}
          />
        )
      }
    </div>
  );
};

export default NewMessageCount;

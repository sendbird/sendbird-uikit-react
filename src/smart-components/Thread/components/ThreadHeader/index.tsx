import React, { useMemo } from 'react';

import './index.scss';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import TextButton from '../../../../ui/TextButton';

import { useLocalization } from '../../../../lib/LocalizationContext';

type EventType = React.MouseEvent<HTMLDivElement | HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>;

export interface ThreadHeaderProps {
  className?: string;
  channelName: string;
  renderActionIcon?: (props: { onActionIconClick: (e: EventType) => void }) => React.ReactElement;
  onActionIconClick?: (e: EventType) => void;
  onChannelNameClick?: (e: EventType) => void;
}

export default function ThreadHeader({
  className,
  channelName,
  renderActionIcon,
  onActionIconClick,
  onChannelNameClick,
}: ThreadHeaderProps): React.ReactElement {
  const { stringSet } = useLocalization();

  const MemoizedActionIcon = useMemo(() => {
    if (typeof renderActionIcon === 'function') {
      return renderActionIcon({ onActionIconClick });
    }
    return null;
  }, [renderActionIcon]);
  return (
    <div className={`sendbird-thread-header ${className}`}>
      <Label
        className="sendbird-thread-header__title"
        type={LabelTypography.H_2}
        color={LabelColors.ONBACKGROUND_1}
      >
        {stringSet.THREAD_HEADER_TITLE}
      </Label>
      <TextButton
        className="sendbird-thread-header__channel-name"
        onClick={(e) => onChannelNameClick(e)}
      >
        <Label
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {`#${channelName}`}
        </Label>
      </TextButton>
      {
        MemoizedActionIcon || (
          <div className="sendbird-thread-header__action">
            <IconButton
              width="32px"
              height="32px"
              onClick={(e) => onActionIconClick(e)}
            >
              <Icon
                type={IconTypes.CLOSE}
                fillColor={IconColors.ON_BACKGROUND_1}
                width="22px"
                height="22px"
              />
            </IconButton>
          </div>
        )
      }
    </div>
  );
}



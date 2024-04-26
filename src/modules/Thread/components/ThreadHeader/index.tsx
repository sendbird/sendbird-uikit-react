import React, { useMemo } from 'react';
import type { MouseEvent, KeyboardEvent, TouchEvent } from 'react';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

import { useLocalization } from '../../../../lib/LocalizationContext';
import Header from '../../../../ui/Header';

type EventType = MouseEvent | KeyboardEvent | TouchEvent;

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
    <Header
      className={`sendbird-thread-header ${className}`}
      title={stringSet.THREAD__HEADER_TITLE}
      subtitle={channelName}
      onClickSubtitle={onChannelNameClick}
      renderRight={() => (
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
      )}
    />
  );
}

import React, { useMemo } from 'react';
import type { MouseEvent, KeyboardEvent, TouchEvent } from 'react';

import { IconTypes, IconColors } from '../../../../ui/Icon';

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
    if (typeof renderActionIcon === 'function' && onActionIconClick) {
      return renderActionIcon({ onActionIconClick });
    }
    return null;
  }, [renderActionIcon]);

  return (
    <Header
      className={`sendbird-thread-header ${className}`}
      renderMiddle={() => (
        <Header.Title
          title={stringSet.THREAD__HEADER_TITLE}
          subtitle={channelName}
          onClickSubtitle={onChannelNameClick}
        />
      )}
      renderRight={() => (
        MemoizedActionIcon || (
          <div className="sendbird-thread-header__action">
            <Header.IconButton
              onClick={(e) => onActionIconClick(e)}
              type={IconTypes.CLOSE}
              color={IconColors.ON_BACKGROUND_1}
            />
          </div>
        )
      )}
    />
  );
}

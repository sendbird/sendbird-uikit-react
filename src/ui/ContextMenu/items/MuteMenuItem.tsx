
import React, { ReactElement, ReactNode, useCallback, useState } from 'react';
import { BaseChannel, User } from '@sendbird/chat';
import { MenuItem } from '..';

export interface MuteMenuItemProps {
  channel: BaseChannel;
  user: User & { isMuted: boolean };
  className?: string | Array<string>;
  children: ReactElement | ReactElement[] | ReactNode;
  disable?: boolean;
  dataSbId?: string;
  onChange?: (channel: BaseChannel, user: User, isMuted: boolean) => void;
}

export const MuteMenuItem = ({
  channel,
  user,
  className = '',
  children,
  disable = false,
  dataSbId = '',
  onChange = () => {},
}: MuteMenuItemProps): ReactElement => {
  const [isMuted, setIsMuted] = useState(user.isMuted);
  const [isProcessing, setIsProcessing] = useState(false);

  const onClickHandler = useCallback(() => {
    if (!isProcessing) {
      setIsProcessing(true);
      if (isMuted) {
        channel.unmuteUser(user)
          .then(() => {
            setIsMuted(prev => !prev);
            onChange(channel, user, false);
            setIsProcessing(false);
          });
      } else {
        channel.muteUser(user)
          .then(() => {
            setIsMuted(prev => !prev);
            onChange(channel, user, true);
            setIsProcessing(false);
          });
      }
    }
  }, [isProcessing]);

  return <MenuItem
    className={className}
    disable={disable}
    dataSbId={dataSbId}
    onClick={onClickHandler}
  >{children}</MenuItem>;
}
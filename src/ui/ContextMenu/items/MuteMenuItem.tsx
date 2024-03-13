import React, { ReactElement, ReactNode, useCallback, useRef, useState } from 'react';
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
  onError?: (reason: any) => void;
}

export const MuteMenuItem = ({
  channel,
  user,
  className = '',
  children,
  disable = false,
  dataSbId = '',
  onChange = () => {},
  onError = () => {},
}: MuteMenuItemProps): ReactElement => {
  const [isMuted, setIsMuted] = useState(user.isMuted);
  const isProcessing = useRef(false);

  const onClickHandler = useCallback(() => {
    if (!isProcessing.current) {
      isProcessing.current = true;
      if (isMuted) {
        channel.unmuteUser(user)
          .then(() => {
            setIsMuted(false);
            onChange(channel, user, false);
            isProcessing.current = false;
          })
          .catch(err => {
            onError(err);
            isProcessing.current = false;
          });
      } else {
        channel.muteUser(user)
          .then(() => {
            setIsMuted(true);
            onChange(channel, user, true);
            isProcessing.current = false;
          })
          .catch(err => {
            onError(err);
            isProcessing.current = false;
          });
      }
    }
  }, [isProcessing, isMuted]);

   return (
    <MenuItem
      className={className}
      disable={disable}
      dataSbId={dataSbId}
      onClick={onClickHandler}
    >
      {children}
    </MenuItem>
  );
};

import React, { ReactElement, ReactNode, useCallback, useRef, useState } from 'react';
import { BaseChannel, Role, User } from '@sendbird/chat';
import { MenuItem } from '..';
import { Member } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';

export interface OperatorMenuItemProps {
  channel: BaseChannel;
  user: User & { isMuted: boolean };
  className?: string | Array<string>;
  children: ReactElement | ReactElement[] | ReactNode;
  disable?: boolean;
  dataSbId?: string;
  onChange?: (channel: BaseChannel, user: User, isOperator: boolean) => void;
  onError?: (reason: any) => void;
}

export const OperatorMenuItem = ({
  channel,
  user,
  className = '',
  children,
  disable = false,
  dataSbId = '',
  onChange = () => {},
  onError = () => {},
}: OperatorMenuItemProps): ReactElement => {
  const [isOperator, setIsOperator] = useState(channel instanceof OpenChannel
    ? channel.isOperator(user)
    : (user as Member).role === Role.OPERATOR);
  const isProcessing = useRef(false);

  const onClickHandler = useCallback(() => {
    if (!isProcessing.current) {
      isProcessing.current = true;
      if (isOperator) {
        channel.removeOperators([user.userId])
          .then(() => {
            setIsOperator(false);
            onChange(channel, user, false);
            isProcessing.current = false;
          })
          .catch(err => {
            onError(err);
            isProcessing.current = false;
          });
      } else {
        channel.addOperators([user.userId])
          .then(() => {
            setIsOperator(true);
            onChange(channel, user, true);
            isProcessing.current = false;
          })
          .catch(err => {
            onError(err);
            isProcessing.current = false;
          });
      }
    }
  }, [isProcessing, isOperator]);

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

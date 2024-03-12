
import React, { ReactElement, ReactNode, useCallback, useState } from 'react';
import { BaseChannel, Role, User } from '@sendbird/chat';
import { MenuItem } from '..';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
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
  const [isOperator, setIsOperator] = useState(channel instanceof OpenChannel ?
    channel.isOperator(user) :
    (user as Member).role === Role.OPERATOR);
  const [isProcessing, setIsProcessing] = useState(false);

  const onClickHandler = useCallback(() => {
    if (!isProcessing) {
      setIsProcessing(true);
      if (isOperator) {
        channel.removeOperators([user.userId])
          .then(() => {
            setIsOperator(false);
            onChange(channel, user, false);
            setIsProcessing(false);
          })
          .catch(err => {
            onError(err);
            setIsProcessing(false);
          });
      } else {
        channel.addOperators([user.userId])
          .then(() => {
            setIsOperator(true);
            onChange(channel, user, true);
            setIsProcessing(false);
          })
          .catch(err => {
            onError(err);
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
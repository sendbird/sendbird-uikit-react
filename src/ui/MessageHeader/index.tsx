import React, {ReactElement} from 'react';
import './index.scss';
import Label, {LabelColors, LabelTypography} from '../Label';
import {CoreMessageType, getSenderName, SendableMessageType} from '../../utils';
import {Nullable} from '../../types';
import {GroupChannel, Member} from '@sendbird/chat/groupChannel';

export interface MessageHeaderPublicProps {
  text: string;
}

export interface MessageHeaderInternalProps {
  channel: Nullable<GroupChannel>;
  message: CoreMessageType;
}

export type MessageHeaderProps = MessageHeaderPublicProps | MessageHeaderInternalProps;

export default function MessageHeader(props: MessageHeaderProps): ReactElement {
  const {
    channel,
    message,
  } = props as MessageHeaderInternalProps;

  return (
    <Label
      className="sendbird-message-content__middle__sender-name"
      type={LabelTypography.CAPTION_2}
      color={LabelColors.ONBACKGROUND_2}
    >
      {
        'text' in props
          ? props.text
          : (
          channel?.members?.find((member: Member) => {
            // @ts-ignore
            return member?.userId === message?.sender?.userId;
          })?.nickname || getSenderName(message as SendableMessageType)
        )
        // TODO: Divide getting profileUrl logic to utils
      }
    </Label>
  );
}

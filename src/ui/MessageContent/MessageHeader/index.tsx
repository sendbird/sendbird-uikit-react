import React, { ReactElement } from 'react';
import '../index.scss';
import Label, { LabelColors, LabelTypography } from '../../Label';
import { CoreMessageType, getClassName, getSenderName, SendableMessageType, UI_CONTAINER_TYPES } from '../../../utils';
import { Nullable } from '../../../types';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { format } from 'date-fns';
import { useLocalization } from '../../../lib/LocalizationContext';

export interface MessageHeaderProps {
  channel: Nullable<GroupChannel>;
  message: CoreMessageType;
}

export default function MessageHeader(props: MessageHeaderProps): ReactElement {
  const { dateLocale } = useLocalization();
  const { channel, message } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Label className="sendbird-message-content__middle__sender-name" type={LabelTypography.CAPTION_2}>
        {
          /**
           * To use the latest member profile information, message.sender might be outdated
           */
          channel?.members?.find((member: Member) => {
            // @ts-ignore
            return member?.userId === message?.sender?.userId;
          })?.nickname || getSenderName(message as SendableMessageType)
          // TODO: Divide getting profileUrl logic to utils
        }
      </Label>
      {/* message timestamp when sent by others */}
      <div style={{ color: '#00000080', fontSize: 10, whiteSpace: 'nowrap', marginBottom: 4 }}>
        {format(message?.createdAt || 0, 'p', {
          locale: dateLocale,
        })}
      </div>
    </div>
  );
}

import { ReactElement } from 'react';
import '../index.scss';
import { CoreMessageType } from '../../../utils';
import { Nullable } from '../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface MessageHeaderProps {
    channel: Nullable<GroupChannel>;
    message: CoreMessageType;
}
export default function MessageHeader(props: MessageHeaderProps): ReactElement;

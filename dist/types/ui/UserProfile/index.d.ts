import './index.scss';
import { ReactElement } from 'react';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';
interface Logger {
    info?(message: string, channel: GroupChannel): void;
}
interface Props {
    user: User;
    currentUserId?: string;
    logger?: Logger;
    disableMessaging?: boolean;
    createChannel?(params: GroupChannelCreateParams): Promise<GroupChannel>;
    onSuccess?: () => void;
}
declare function UserProfile({ user, currentUserId, disableMessaging, onSuccess, }: Props): ReactElement;
export default UserProfile;

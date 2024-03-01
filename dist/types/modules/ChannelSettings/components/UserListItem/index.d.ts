import React, { ReactElement } from 'react';
import { User } from '@sendbird/chat';
import './user-list-item.scss';
interface ActionProps {
    actionRef: React.RefObject<HTMLInputElement>;
    parentRef: React.RefObject<HTMLInputElement>;
}
type CustomUser = User & {
    isMuted: boolean;
    role: string;
};
interface Props {
    user: CustomUser;
    currentUser?: string;
    className?: string;
    action?(props: ActionProps): ReactElement;
}
declare const UserListItem: ({ user, className, currentUser, action, }: Props) => ReactElement;
export default UserListItem;

import { ChangeEvent, MutableRefObject, ReactElement } from 'react';
import { User } from '@sendbird/chat';
import './index.scss';
export interface UserListItemProps {
    user: User;
    className?: string;
    checked?: boolean;
    checkBox?: boolean;
    isOperator?: boolean;
    disabled?: boolean;
    disableMessaging?: boolean;
    currentUser?: string;
    action?({ actionRef, parentRef }: {
        actionRef: MutableRefObject<any>;
        parentRef?: MutableRefObject<any>;
    }): ReactElement;
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
    avatarSize?: string;
    onClick?(): void;
}
export default function UserListItem({ user, className, checked, checkBox, isOperator, disabled, disableMessaging, currentUser, action, onChange, avatarSize, onClick, }: UserListItemProps): ReactElement;

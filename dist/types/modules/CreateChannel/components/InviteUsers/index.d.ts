import React from 'react';
import './invite-users.scss';
import { UserListQuery } from '../../../../types';
export interface InviteUsersProps {
    onCancel?: () => void;
    userListQuery?(): UserListQuery;
}
declare const InviteUsers: React.FC<InviteUsersProps>;
export default InviteUsers;

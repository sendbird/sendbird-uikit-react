import React, { ReactElement } from 'react';
import type { Participant } from '@sendbird/chat';
interface ActionProps {
    actionRef: React.RefObject<HTMLInputElement>;
}
interface UserListItemProps {
    user: Participant;
    currentUser?: string;
    isOperator?: boolean;
    action?(props: ActionProps): ReactElement;
}
export declare const UserListItem: React.FC<UserListItemProps>;
export interface ParticipantsAccordionProps {
    maxMembers?: number;
}
export default function ParticipantsAccordion(props: ParticipantsAccordionProps): ReactElement;
export {};

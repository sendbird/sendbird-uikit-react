import React from 'react';
type UserId = string;
interface Props {
    onCancel(): void;
    onSubmit(userIds: UserId[]): void;
}
export default function InviteUsers({ onCancel, onSubmit }: Props): React.JSX.Element;
export {};

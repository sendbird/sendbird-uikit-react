import './index.scss';
import React, { ReactElement } from 'react';
import type { User } from '@sendbird/chat';
interface Props {
    user: User;
    theme?: string;
    onCancel(): void;
    onSubmit(newFile: File, newNickname: string): void;
    changeTheme?(theme: string): void;
    onThemeChange?(theme: string): void;
}
export declare function EditUserProfile({ user, theme, onCancel, onSubmit, changeTheme, onThemeChange, }: Props): ReactElement;
interface ConnectedEditUserProfileProps {
    user: User;
    onCancel(): void;
    onSubmit(newFile: File, newNickname: string): void;
    onThemeChange?(theme: string): void;
}
declare const ConnectedEditUserProfile: (props: ConnectedEditUserProfileProps) => React.ReactElement;
export default ConnectedEditUserProfile;

import React from 'react';
import { User } from '@sendbird/chat';
import './edit-user-profile.scss';
import { EditUserProfileUIView } from './EditUserProfileUIView';
export interface UseEditUserProfileUIStateParams {
    onEditProfile: (user: User) => void;
}
export declare const useEditUserProfileUISates: ({ onEditProfile, }: UseEditUserProfileUIStateParams) => {
    formRef: React.MutableRefObject<any>;
    inputRef: React.MutableRefObject<any>;
    updateUserInfo: () => void;
    profileImage: File;
    setProfileImage: React.Dispatch<React.SetStateAction<File>>;
};
export declare const EditUserProfileUI: () => React.JSX.Element;
export { EditUserProfileUIView };
export default EditUserProfileUI;

import React, {
  type MutableRefObject,
  useRef,
  useState,
  useContext,
} from 'react';

import { User } from '@sendbird/chat';
import './edit-user-profile.scss';

import { useEditUserProfileContext } from '../../context/EditUserProfileProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

import Modal from '../../../../ui/Modal';
import { ButtonTypes } from '../../../../ui/Button';
import { EditUserProfileUIView } from './EditUserProfileUIView';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { SendbirdState } from '../../../../lib/Sendbird/types';

interface HandleUpdateUserInfoParams {
  globalContext: SendbirdState;
  formRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
  profileImage: File | null;
  onEditProfile?: (user: User) => void;
  updateUserInfo: (user: User) => void;
}
const handleUpdateUserInfo = ({
  globalContext,
  formRef,
  inputRef,
  profileImage,
  onEditProfile,
  updateUserInfo,
}: HandleUpdateUserInfoParams) => {
  const { stores } = globalContext;
  const sdk = stores.sdkStore.sdk;
  const user = stores.userStore.user;

  if (user?.nickname !== '' && !inputRef.current.value) {
    formRef.current.reportValidity?.(); // might not work in explorer
    return;
  }
  sdk?.updateCurrentUserInfo({
    nickname: inputRef?.current?.value,
    profileImage: profileImage ?? undefined,
  }).then((updatedUser) => {
    updateUserInfo(updatedUser);
    onEditProfile?.(updatedUser);
  });
};

export interface UseEditUserProfileUIStateParams {
  onEditProfile?: (user: User) => void;
}
export const useEditUserProfileUISates = ({
  onEditProfile,
}: UseEditUserProfileUIStateParams) => {
  const { state, actions } = useSendbird();
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const updateUserInfo = () => {
    handleUpdateUserInfo({
      globalContext: state,
      formRef,
      inputRef,
      profileImage,
      onEditProfile,
      updateUserInfo: actions.updateUserInfo,
    });
  };

  return {
    formRef,
    inputRef,
    updateUserInfo,
    profileImage,
    setProfileImage,
  };
};

export const EditUserProfileUI = () => {
  const editProfileContext = useEditUserProfileContext();
  const {
    onEditProfile,
    onCancel,
    onThemeChange,
  } = editProfileContext;

  const { stringSet } = useContext(LocalizationContext);

  const {
    formRef,
    inputRef,
    updateUserInfo,
    setProfileImage,
  } = useEditUserProfileUISates({ onEditProfile });
  return (
    <Modal
      titleText={stringSet.EDIT_PROFILE__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      type={ButtonTypes.PRIMARY}
      onCancel={onCancel}
      isFullScreenOnMobile
      onSubmit={updateUserInfo}
    >
      <EditUserProfileUIView
        formRef={formRef}
        inputRef={inputRef}
        setProfileImage={setProfileImage}
        onThemeChange={onThemeChange}
      />
    </Modal>
  );
};

export { EditUserProfileUIView };
export default EditUserProfileUI;

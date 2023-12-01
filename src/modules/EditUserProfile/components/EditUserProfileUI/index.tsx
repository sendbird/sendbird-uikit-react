import React, {
  type MutableRefObject,
  useRef,
  useState,
  useContext,
} from 'react';

import { User } from '@sendbird/chat';
import './edit-user-profile.scss';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useEditUserProfileContext } from '../../context/EditUserProfileProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { SendBirdState } from '../../../../lib/types';
import { USER_ACTIONS } from '../../../../lib/dux/user/actionTypes';

import Modal from '../../../../ui/Modal';
import { ButtonTypes } from '../../../../ui/Button';
import { EditUserProfileUIView } from './EditUserProfileUIView';

export interface HandleUpdateUserInfoParams {
  globalContext: SendBirdState;
  formRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
  profileImage: File;
  onEditProfile?: (user: User) => void;
}
export const handleUpdateUserInfo = ({
  globalContext,
  formRef,
  inputRef,
  profileImage,
  onEditProfile,
}: HandleUpdateUserInfoParams) => {
  const { stores, dispatchers } = globalContext;
  const sdk = stores.sdkStore.sdk;
  const user = stores.userStore.user;
  const { userDispatcher } = dispatchers;

  if (user?.nickname !== '' && !inputRef.current.value) {
    formRef.current.reportValidity?.(); // might not work in explorer
    return;
  }
  sdk?.updateCurrentUserInfo({
    nickname: inputRef?.current?.value,
    profileImage: profileImage,
  }).then((updatedUser) => {
    userDispatcher({ type: USER_ACTIONS.UPDATE_USER_INFO, payload: updatedUser });
    onEditProfile?.(updatedUser);
  });
};

export const EditUserProfileUI = () => {
  const editProfileContext = useEditUserProfileContext();
  const globalContext = useSendbirdStateContext();
  const { stringSet } = useContext(LocalizationContext);

  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    onEditProfile,
    onCancel,
    onThemeChange,
  } = editProfileContext;

  return (
    <Modal
      titleText={stringSet.EDIT_PROFILE__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      type={ButtonTypes.PRIMARY}
      onCancel={onCancel}
      isFullScreenOnMobile
      onSubmit={() => {
        handleUpdateUserInfo({
          globalContext,
          formRef,
          inputRef,
          profileImage,
          onEditProfile,
        });
      }}
    >
      <EditUserProfileUIView
        formRef={formRef}
        inputRef={inputRef}
        setProfileImage={setProfileImage}
        onThemeChange={onThemeChange}
      />
    </Modal>
  );
}

export { EditUserProfileUIView };
export default EditUserProfileUI;

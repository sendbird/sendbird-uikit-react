import './edit-user-profile.scss';

import React, {
  ReactElement,
  useRef,
  useState,
  useContext,
} from 'react';
import { useEditUserProfileContext } from '../../context/EditUserProfIleProvider';

import Modal from '../../../../ui/Modal';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import Input, { InputLabel } from '../../../../ui/Input';
import Avatar from '../../../../ui/Avatar';
import Icon, { IconTypes } from '../../../../ui/Icon';
import { Type as ButtonType } from '../../../../ui/Button/type';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import TextButton from '../../../../ui/TextButton';
import { noop } from '../../../../utils/utils';
import * as userActions from '../../../../lib/dux/user/actionTypes';

export default function EditUserProfile(): ReactElement {
  const editProfileProps = useEditUserProfileContext();
  const store = useSendbirdStateContext();
  const hiddenInputRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const { stringSet } = useContext(LocalizationContext);
  const [currentImg, setCurrentImg] = useState(null);
  const [newFile, setNewFile] = useState(null);

  const {
    onEditProfile,
    onCancel,
    onThemeChange,
  } = editProfileProps;

  const theme = store?.config?.theme || 'light';
  const changeTheme = store?.config?.setCurrenttheme || noop;
  const user = store?.stores?.userStore?.user;
  const sdk = store?.stores?.sdkStore?.sdk;
  const userDispatcher = store?.dispatchers?.userDispatcher;

  return (
    <Modal
      titleText={stringSet.EDIT_PROFILE__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      type={ButtonType.PRIMARY}
      onCancel={onCancel}
      onSubmit={() => {
        if (user?.nickname !== '' && !inputRef.current.value) {
          if (formRef.current.reportValidity) { // might not work in explorer
            formRef.current.reportValidity();
          }
          return;
        }
        sdk?.updateCurrentUserInfo({
          nickname: inputRef?.current?.value,
          profileImage: newFile,
        }).then((updatedUser) => {
          userDispatcher({ type: userActions.UPDATE_USER_INFO, payload: updatedUser });
          if (onEditProfile && typeof onEditProfile === 'function') {
            onEditProfile(updatedUser);
          }
        });
      }}
    >
      <form
        className="sendbird-edit-user-profile"
        ref={formRef}
        onSubmit={(e) => { e.preventDefault(); }}
      >
        <section className="sendbird-edit-user-profile__img">
          <InputLabel>
            {stringSet.EDIT_PROFILE__IMAGE_LABEL}
          </InputLabel>
          <div className="sendbird-edit-user-profile__img__avatar">
            <Avatar
              width="80px"
              height="80px"
              src={currentImg || user?.profileUrl}
            />
          </div>
          <input
            ref={hiddenInputRef}
            type="file"
            accept="image/gif, image/jpeg, image/png"
            style={{ display: 'none' }}
            onChange={(e) => {
              setCurrentImg(URL.createObjectURL(e.target.files[0]));
              setNewFile(e.target.files[0]);
              hiddenInputRef.current.value = '';
            }}
          />
          <TextButton
            className="sendbird-edit-user-profile__img__avatar-button"
            disableUnderline
            onClick={() => hiddenInputRef.current.click()}
          >
            <Label type={LabelTypography.BUTTON_1} color={LabelColors.PRIMARY}>
              {stringSet.EDIT_PROFILE__IMAGE_UPLOAD}
            </Label>
          </TextButton>
        </section>
        <section className="sendbird-edit-user-profile__name">
          <InputLabel>
            {stringSet.EDIT_PROFILE__NICKNAME_LABEL}
          </InputLabel>
          <Input
            required={user?.nickname !== ''}
            name="sendbird-edit-user-profile__name__input"
            ref={inputRef}
            value={user?.nickname}
            placeHolder={stringSet.EDIT_PROFILE__NICKNAME_PLACEHOLDER}
          />
        </section>
        <section className="sendbird-edit-user-profile__userid">
          <InputLabel>
            {/*  userID */}
            {stringSet.EDIT_PROFILE__USERID_LABEL}
          </InputLabel>
          <Input
            disabled
            name="sendbird-edit-user-profile__userid__input"
            value={user?.userId}
          />
        </section>
        <section className="sendbird-edit-user-profile__theme">
          <InputLabel>
            {stringSet.EDIT_PROFILE__THEME_LABEL}
          </InputLabel>
          <div className="sendbird-edit-user-profile__theme__theme-icon">
            {
              theme === 'dark'
                ? (
                  <Icon
                    onClick={() => {
                      changeTheme('light');
                      onThemeChange?.('light');
                      // if (onThemeChange && typeof onThemeChange === 'function') {
                      //   onThemeChange('light');
                      // }
                    }}
                    type={IconTypes.TOGGLE_ON}
                    width={44}
                    height={24}
                  />
                )
                : (
                  <Icon
                    onClick={() => {
                      changeTheme('dark');
                      onThemeChange?.('dark');
                      // if (onThemeChange && typeof onThemeChange === 'function') {
                      //   onThemeChange('dark');
                      // }
                    }}
                    type={IconTypes.TOGGLE_OFF}
                    width={44}
                    height={24}
                  />
                )
            }
          </div>
        </section>
      </form>
    </Modal>
  );
}


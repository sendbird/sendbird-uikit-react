import React, {
  ReactElement,
  useRef,
  useState,
  useContext,
} from 'react';
import './index.scss';

import Modal from '../Modal';
import withSendbirdContext from '../../lib/SendbirdSdkContext';
import { LocalizationContext } from '../../lib/LocalizationContext';

import Input, { InputLabel } from '../Input';
import Avatar from '../Avatar';
import Icon, { IconTypes } from '../Icon';
import { Type as ButtonType } from '../Button/type';
import Label, { LabelColors, LabelTypography } from '../Label';
import TextButton from '../TextButton';
import { SendbirdTypes } from '../../types';
import { noop } from '../../utils/utils';

interface Props {
  user: SendbirdTypes['User'];
  theme?: string;
  onCancel(): void;
  onSubmit(newFile: File, newNickname: string): void;
  changeTheme?(theme: string): void;
  onThemeChange?(theme: string): void;
}

export function EditUserProfile({
  user,
  theme = 'light',
  onCancel,
  onSubmit,
  changeTheme = noop,
  onThemeChange = null,
}: Props): ReactElement {
  const hiddenInputRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const { stringSet } = useContext(LocalizationContext);
  const [currentImg, setCurrentImg] = useState(null);
  const [newFile, setNewFile] = useState(null);

  return (
    <Modal
      titleText={stringSet.EDIT_PROFILE__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      type={ButtonType.PRIMARY}
      onCancel={onCancel}
      onSubmit={() => {
        if (user.nickname !== '' && !inputRef.current.value) {
          if (formRef.current.reportValidity) { // might not work in explorer
            formRef.current.reportValidity();
          }
          return;
        }
        onSubmit(inputRef.current.value, newFile);
        onCancel();
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
              src={currentImg || user.profileUrl}
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
            notUnderline
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
            required={user.nickname !== ''}
            name="sendbird-edit-user-profile__name__input"
            ref={inputRef}
            value={user.nickname}
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
            value={user.userId}
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
                      if (onThemeChange && typeof onThemeChange === 'function') {
                        onThemeChange('light');
                      }
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
                      if (onThemeChange && typeof onThemeChange === 'function') {
                        onThemeChange('dark');
                      }
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

const mapStoreToProps = (store) => {
  return {
    theme: store.config.theme,
    changeTheme: store.config.setCurrenttheme,
  };
};

interface ConnectedEditUserProfileProps {
  user: SendbirdTypes['User'];
  onCancel(): void;
  onSubmit(newFile: File, newNickname: string): void;
  onThemeChange?(theme: string): void;
}

const ConnectedEditUserProfile: (
  props: ConnectedEditUserProfileProps
) => React.Component = withSendbirdContext(EditUserProfile, mapStoreToProps);

export default ConnectedEditUserProfile;

import './index.scss';
import React, {
  ReactElement,
  useRef,
  useState,
  useContext,
} from 'react';
import type { User } from '@sendbird/chat';

import Modal from '../Modal';
import withSendbirdContext from '../../lib/SendbirdSdkContext';
import { LocalizationContext } from '../../lib/LocalizationContext';

import Input, { InputLabel } from '../Input';
import Avatar from '../Avatar';
import Icon, { IconTypes } from '../Icon';
import { ButtonTypes } from '../Button';
import Label, { LabelColors, LabelTypography } from '../Label';
import TextButton from '../TextButton';
import { noop } from '../../utils/utils';

interface Props {
  user: User;
  theme?: string;
  onCancel(): void;
  onSubmit(newFile: File | null, newNickname: string): void;
  changeTheme?(theme: string): void;
  onThemeChange?(theme: string): void;
}

export function EditUserProfile({
  user,
  theme = 'light',
  onCancel,
  onSubmit,
  changeTheme = noop,
  onThemeChange,
}: Props): ReactElement {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { stringSet } = useContext(LocalizationContext);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  return (
    <Modal
      titleText={stringSet.EDIT_PROFILE__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      type={ButtonTypes.PRIMARY}
      onCancel={onCancel}
      onSubmit={() => {
        if (user.nickname !== '' && inputRef.current && !inputRef.current.value) {
          if (formRef.current?.reportValidity) { // might not work in explorer
            formRef.current.reportValidity();
          }
          return;
        }
        onSubmit(newFile, inputRef.current?.value || '');
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
              if (e.target.files && 0 < e.target.files?.length) {
                setCurrentImg(URL.createObjectURL(e.target.files[0]));
                setNewFile(e.target.files[0]);
                if (hiddenInputRef.current) { hiddenInputRef.current.value = ''; }
              }
            }}
          />
          <TextButton
            className="sendbird-edit-user-profile__img__avatar-button"
            disableUnderline
            onClick={() => hiddenInputRef.current?.click()}
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

const mapStoreToProps = (store: any) => {
  return {
    theme: store.config.theme,
    changeTheme: store.config.setCurrentTheme,
  };
};

interface ConnectedEditUserProfileProps {
  user: User;
  onCancel(): void;
  onSubmit(newFile: File, newNickname: string): void;
  onThemeChange?(theme: string): void;
}

const ConnectedEditUserProfile: (
  props: ConnectedEditUserProfileProps
) => React.ReactElement = withSendbirdContext(EditUserProfile, mapStoreToProps);

export default ConnectedEditUserProfile;

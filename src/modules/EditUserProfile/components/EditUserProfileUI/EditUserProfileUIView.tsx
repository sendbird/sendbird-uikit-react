import React, { useState, useRef, type MutableRefObject, type Dispatch } from 'react';

import Input, { InputLabel } from '../../../../ui/Input';
import { useLocalization } from '../../../../lib/LocalizationContext';
import Avatar from '../../../../ui/Avatar';
import TextButton from '../../../../ui/TextButton';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import Icon, { IconTypes } from '../../../../ui/Icon';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export interface EditUserProfileUIViewProps {
  formRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
  onThemeChange: (theme: string) => void;
  setProfileImage: Dispatch<File | null>;
}
export const EditUserProfileUIView = ({
  formRef,
  inputRef,
  onThemeChange,
  setProfileImage,
}: EditUserProfileUIViewProps) => {
  const { stores, config } = useSendbirdStateContext();
  const { theme, setCurrentTheme } = config;
  const user = stores.userStore?.user;
  const { stringSet } = useLocalization();

  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  return (
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
            if (e.target.files) {
              setCurrentImg(URL.createObjectURL(e.target.files[0]));
              setProfileImage(e.target.files[0]);
            }

            if (hiddenInputRef.current) {
              hiddenInputRef.current.value = '';
            }
          }}
        />
        <TextButton
          className="sendbird-edit-user-profile__img__avatar-button"
          disableUnderline
          onClick={() => hiddenInputRef.current?.click()}
        >
          <Label
            type={LabelTypography.BUTTON_1}
            color={LabelColors.PRIMARY}
          >
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
                    setCurrentTheme('light');
                    onThemeChange?.('light');
                  }}
                  type={IconTypes.TOGGLE_ON}
                  width={44}
                  height={24}
                />
              )
              : (
                <Icon
                  onClick={() => {
                    setCurrentTheme('dark');
                    onThemeChange?.('dark');
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
  );
};

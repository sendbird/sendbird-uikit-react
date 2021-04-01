import React, {
  useState,
  useRef,
  useContext,
  ReactElement,
} from 'react';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import Modal from '../../../ui/Modal';
import Input, { InputLabel } from '../../../ui/Input';
import Avatar from '../../../ui/Avatar/index';
import { Type as ButtonType } from '../../../ui/Button/type';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import TextButton from '../../../ui/TextButton';
import OpenChannelAvatar from '../../../ui/ChannelAvatar/OpenChannelAvatar';

interface Props {
  onSubmit(newFile: File, newTitle: string): void;
  onCancel(): void;
  channel: SendBird.OpenChannel;
  theme: string;
}

const EditDetails = (props: Props): ReactElement => {
  const {
    onSubmit,
    onCancel,
    channel,
    theme,
  } = props;
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const { stringSet } = useContext(LocalizationContext);
  const title = channel.name;
  return (
    <Modal
      titleText={stringSet.MODAL__CHANNEL_INFORMATION__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      onCancel={onCancel}
      onSubmit={() => {
        if (title !== '' && !inputRef.current.value) {
          if (formRef.current.reportValidity) { // might not work in explorer
            formRef.current.reportValidity();
          }
          return;
        }
        onSubmit(newFile, inputRef.current.value);
        onCancel();
      }}
      type={ButtonType.PRIMARY}
    >
      <form
        className="channel-profile-form"
        ref={formRef}
        onSubmit={(e) => { e.preventDefault(); }}
      >
        <div className="channel-profile-form__img-section">
          <InputLabel>
            {stringSet.MODAL__CHANNEL_INFORMATION__CHANNEL_IMAGE}
          </InputLabel>
          <div className="channel-profile-form__avatar">
            {
              currentImg
                ? (
                  <Avatar
                    height="80px"
                    width="80px"
                    src={currentImg}
                  />
                ) : (
                  <OpenChannelAvatar
                    height={80}
                    width={80}
                    channel={channel}
                    theme={theme}
                  />
                )
              }
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
            className="channel-profile-form__avatar-button"
            onClick={() => hiddenInputRef.current.click()}
            notUnderline
          >
            <Label type={LabelTypography.BUTTON_1} color={LabelColors.PRIMARY}>
              {stringSet.MODAL__CHANNEL_INFORMATION__UPLOAD}
            </Label>
          </TextButton>
        </div>
        <div className="channel-profile-form__name-section">
          <InputLabel>
            {stringSet.MODAL__CHANNEL_INFORMATION__CHANNEL_NAME}
          </InputLabel>
          <Input
            required={title !== ''}
            name="channel-profile-form__name"
            ref={inputRef}
            value={title}
            placeHolder={stringSet.MODAL__CHANNEL_INFORMATION__INPUT__PLACE_HOLDER}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditDetails;

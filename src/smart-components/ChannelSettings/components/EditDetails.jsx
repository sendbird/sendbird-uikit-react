import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import Modal from '../../../ui/Modal';
import Input, { InputLabel } from '../../../ui/Input';
import Avatar from '../../../ui/Avatar/index';
import { Type as ButtonType } from '../../../ui/Button/type';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import TextButton from '../../../ui/TextButton';
import ChannelAvatar from '../../../ui/ChannelAvatar/index';

const EditDetails = (props) => {
  const {
    onSubmit,
    onCancel,
    channel,
    userId,
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
                  <ChannelAvatar
                    height={80}
                    width={80}
                    channel={channel}
                    userId={userId}
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

EditDetails.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  channel: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
};

export default EditDetails;

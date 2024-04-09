import React, { useState, useRef, useContext } from 'react';
import './index.scss';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Avatar from '../../../../ui/Avatar';
import { ButtonTypes } from '../../../../ui/Button';
import Modal from '../../../../ui/Modal';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Input, { InputLabel } from '../../../../ui/Input';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import TextButton from '../../../../ui/TextButton';
import { useCreateOpenChannelContext } from '../../context/CreateOpenChannelProvider';

export interface CreateOpenChannelUIProps {
  closeModal?: () => void;
  renderHeader?: () => React.ReactElement;
  renderProfileInput?: () => React.ReactElement;
}

function CreateOpenChannelUI({
  closeModal,
  renderHeader,
  renderProfileInput,
}: CreateOpenChannelUIProps): React.ReactElement {
  const [newFile, setNewFile] = useState(null);
  const [currentImage, setCurrentImg] = useState<string | null>(null);
  const inputFormRef = useRef(null);
  const inputFileRef = useRef<string | null>(null);
  const inputTextRef = useRef<HTMLInputElement>(null);
  const { stringSet } = useContext(LocalizationContext);
  const {
    logger,
    createNewOpenChannel,
  } = useCreateOpenChannelContext();
  return (
    <div className="sendbird-create-open-channel-ui">
      <Modal
        isFullScreenOnMobile
        titleText={stringSet.CREATE_OPEN_CHANNEL_LIST__TITLE}
        submitText={stringSet.CREATE_OPEN_CHANNEL_LIST__SUBMIT}
        type={ButtonTypes.PRIMARY}
        onCancel={closeModal}
        renderHeader={renderHeader}
        onSubmit={() => {
          const channelName = inputTextRef?.current?.value;
          if (!channelName) {
            logger.warning('CreateOpenChannelUI: You should fill the channel name');
            return;
          }
          createNewOpenChannel({
            name: channelName,
            coverUrlOrImage: newFile ?? undefined,
          });
          closeModal?.();
        }}
      >
        <>
          {renderProfileInput?.() || (
            <form
              className="sendbird-create-open-channel-ui__profile-input"
              ref={inputFormRef}
              onSubmit={(e) => { e.preventDefault(); }}
            >
              <InputLabel>
                {stringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_SECTION}
              </InputLabel>
              <div className="sendbird-create-open-channel-ui__profile-input__img-section">
                <div className="sendbird-create-open-channel-ui__profile-input__img-section__avatar">
                  {currentImage
                    ? (
                      <Avatar
                        width="80px"
                        height="80px"
                        src={currentImage}
                      />
                    ) : (
                      <div className="sendbird-create-open-channel-ui__profile-input__img-section__avatar--default">
                        <Icon
                          type={IconTypes.CHANNELS}
                          fillColor={IconColors.CONTENT}
                          width="46px"
                          height="46px"
                        />
                      </div>
                    )}
                </div>
                <input
                  className="sendbird-create-open-channel-ui__profile-input__img-section__input"
                  ref={inputFileRef}
                  type="file"
                  accept="image/gif, image/jpeg, image/png"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files) {
                      setCurrentImg(URL.createObjectURL(e.target.files[0]));
                      setNewFile(e.target.files[0]);
                    }

                    if (inputFileRef.current) {
                      inputFileRef.current.value = '';
                    }
                  }}
                />
                <TextButton
                  className="sendbird-create-open-channel-ui__profile-input__img-section__button"
                  onClick={() => inputFileRef.current?.click()}
                  disableUnderline
                >
                  <Label
                    type={LabelTypography.BUTTON_1}
                    color={LabelColors.PRIMARY}
                  >
                    {stringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_UPLOAD}
                  </Label>
                </TextButton>
              </div>
              <div style={{ marginTop: '20px' }}>
                <InputLabel>
                  {stringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_SECTION}
                </InputLabel>
              </div>
              <div className="sendbird-create-open-channel-ui__profile-input__name-section">
                <Input
                  name="sendbird-create-open-channel-ui__profile-input__name-section__input"
                  ref={inputTextRef}
                  placeHolder={stringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_PLACE_HOLDER}
                />
              </div>
            </form>
          )}
        </>
      </Modal>
    </div>
  );
}

export default CreateOpenChannelUI;

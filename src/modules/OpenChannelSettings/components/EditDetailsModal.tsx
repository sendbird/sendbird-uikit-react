import React, {
  useState,
  useRef,
  useContext,
  ReactElement,
} from 'react';
import { OpenChannelUpdateParams } from '@sendbird/chat/openChannel';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import pubSubTopics from '../../../lib/pubSub/topics';
import Modal from '../../../ui/Modal';
import Input, { InputLabel } from '../../../ui/Input';
import Avatar from '../../../ui/Avatar/index';
import { ButtonTypes } from '../../../ui/Button';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import TextButton from '../../../ui/TextButton';
import OpenChannelAvatar from '../../../ui/ChannelAvatar/OpenChannelAvatar';
import { useOpenChannelSettingsContext } from '../context/OpenChannelSettingsProvider';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';

interface Props {
  onCancel(): void;
}

const EditDetails = (props: Props): ReactElement => {
  const {
    onCancel,
  } = props;
  const globalState = useSendbirdStateContext();
  const { logger, theme, pubSub } = globalState.config;
  const {
    channel,
    onBeforeUpdateChannel,
    onChannelModified,
    setChannel,
  } = useOpenChannelSettingsContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const { stringSet } = useContext(LocalizationContext);
  const title = channel?.name;
  return (
    <Modal
      isFullScreenOnMobile
      titleText={stringSet.MODAL__CHANNEL_INFORMATION__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      onCancel={onCancel}
      onSubmit={() => {
        if (title !== '' && !inputRef.current?.value) {
          if (formRef.current?.reportValidity) { // might not work in explorer
            formRef.current.reportValidity();
          }
          return;
        }
        const currentTitle = inputRef.current?.value ?? '';
        const currentImg = newFile;
        logger.info('ChannelSettings: Channel information being updated');
        const params: OpenChannelUpdateParams = onBeforeUpdateChannel
          ? onBeforeUpdateChannel(currentTitle, currentImg, channel?.data)
          : {
            name: currentTitle,
            coverUrlOrImage: currentImg,
            data: channel?.data,
          };
        logger.info('ChannelSettings: Updating channel information', params);
        channel?.updateChannel(params)
          .then((updatedChannel) => {
            logger.info('ChannelSettings: Channel information update succeeded', updatedChannel);
            onChannelModified?.(updatedChannel);
            setChannel(updatedChannel);
            pubSub?.publish(pubSubTopics.UPDATE_OPEN_CHANNEL, updatedChannel);
          })
          .catch((error) => {
            logger.error('ChannelSettings: Channel infomation update failed', error);
            setChannel(null);
          });
        onCancel();
      }}
      type={ButtonTypes.PRIMARY}
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
              if (hiddenInputRef.current)
                hiddenInputRef.current.value = '';
            }}
          />
          <TextButton
            className="channel-profile-form__avatar-button"
            onClick={() => hiddenInputRef.current?.click()}
            disableUnderline
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

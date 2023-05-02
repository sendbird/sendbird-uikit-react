import React, {
  ReactElement,
  useState,
  useContext,
} from 'react';

import Modal from '../../../../ui/Modal';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';

export default function DeleteChannel(): ReactElement {
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);
  const globalState = useSendbirdStateContext();
  const isOnline = globalState?.config?.isOnline;
  const logger = globalState?.config?.logger;

  const { channel, onDeleteChannel } = useOpenChannelSettingsContext();

  const deleteChannel = () => {
    channel?.delete().then((response) => {
      logger.info('OpenChannelSettings: Delete channel success', response);
      if (onDeleteChannel) {
        onDeleteChannel(channel);
      }
    }).catch((error) => {
      logger.warning('OpenChannelSettings: Delete channel failed', error);
    });
  }
  return (
    <>
      <div
        className={
          `sendbird-openchannel-settings__panel-item
          sendbird-openchannel-settings__delete-channel
            ${!isOnline ? 'sendbird-openchannel-settings__panel-item__disabled' : ''}`
        }
        role="button"
        tabIndex={0}
        onKeyDown={() => {
          if (!isOnline) { return; }
          setShowDeleteChannelModal(true);
        }}
        onClick={() => {
          if (!isOnline) { return; }
          setShowDeleteChannelModal(true);
        }}
      >
        <Icon
          type={IconTypes.DELETE}
          fillColor={IconColors.ERROR}
          className={[
            'sendbird-openchannel-settings__panel-icon-left',
            'sendbird-openchannel-settings__panel-icon__delete',
          ].join(' ')}
          height="24px"
          width="24px"
        />
        <Label
          type={LabelTypography.SUBTITLE_1}
          color={LabelColors.ONBACKGROUND_1}
        >
          {stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_PANEL}
        </Label>
      </div>
      {
        showDeleteChannelModal && (
          <Modal
            isFullScreenOnMobile
            onCancel={() => {
              setShowDeleteChannelModal(false);
            }}
            onSubmit={() => {
              deleteChannel();
            }}
            titleText={stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_TITLE}
            submitText={stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_SUBMIT}
          >
            {stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_CONTEXT}
          </Modal>
        )
      }
    </>
  )
}

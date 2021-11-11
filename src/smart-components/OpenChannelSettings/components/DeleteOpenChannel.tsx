import React, {
  ReactElement,
  useState,
  useContext,
} from 'react';

import Modal from '../../../ui/Modal';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import Icon, { IconTypes } from '../../../ui/Icon';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { useOpenChannelSettings } from '../context/OpenChannelSettingsProvider';

export default function DeleteChannel(): ReactElement {
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);
  const globalState = useSendbirdStateContext();
  const isOnline = globalState?.config?.isOnline;
  const logger = globalState?.config?.logger;

  const { channel, onDeleteChannel } = useOpenChannelSettings();

  const deleteChannel = () => {
    channel?.delete((response, error) => {
      if (error) {
        logger.warning('OpenChannelSettings: Delete channel failed', error);
        return;
      }
      logger.info('OpenChannelSettings: Delete channel success', response);
      if (onDeleteChannel) {
        onDeleteChannel(channel);
      }
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
            onCancel={() => {
              setShowDeleteChannelModal(false);
            }}
            onSubmit={() => {
              deleteChannel();
            }}
            submitText={stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_SUBMIT}
            titleText={stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_TITLE}
          />
        )
      }
    </>
  )
}

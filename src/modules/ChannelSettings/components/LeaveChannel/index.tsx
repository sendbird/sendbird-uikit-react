import './leave-channel.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { noop } from '../../../../utils/utils';

import Modal from '../../../../ui/Modal';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import TextButton from '../../../../ui/TextButton';
import Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';

export type LeaveChannelProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

const LeaveChannel: React.FC<LeaveChannelProps> = (props: LeaveChannelProps) => {
  const {
    onSubmit = noop,
    onCancel = noop,
  } = props;

  const { channel, onLeaveChannel } = useChannelSettingsContext();
  const { stringSet } = useLocalization();
  const state = useSendbirdStateContext();
  const logger = state?.config?.logger;
  const isOnline = state?.config?.isOnline;
  const { isMobile } = useMediaQueryContext();
  const getChannelName = (channel: GroupChannel) => {
    if (channel?.name && channel?.name !== 'Group Channel') {
      return channel.name;
    }
    if (channel?.name === 'Group Channel' || !channel?.name) {
      return (channel?.members || []).map((member) => member.nickname || stringSet.NO_NAME).join(', ');
    }

    return stringSet.NO_TITLE;
  };
  if (isMobile) {
    return (
      <Modal
        className="sendbird-channel-settings__leave--mobile"
        titleText={getChannelName(channel)}
        hideFooter
        isCloseOnClickOutside
        onCancel={onCancel}
      >
        <TextButton
          onClick={() => {
            logger.info('ChannelSettings: Leaving channel', channel);
            channel?.leave()
              .then(() => {
                logger.info('ChannelSettings: Leaving channel successful!', channel);
                onLeaveChannel();
              });
          }}
          className="sendbird-channel-settings__leave-label--mobile"
        >
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={LabelColors.ONBACKGROUND_1}
          >
            {stringSet.CHANNEL_PREVIEW_MOBILE_LEAVE}
          </Label>
        </TextButton>
      </Modal>
    );
  }
  return (
    <Modal
      isFullScreenOnMobile
      disabled={!isOnline}
      onCancel={onCancel}
      onSubmit={() => {
        logger.info('ChannelSettings: Leaving channel', channel);
        channel?.leave()
          .then(() => {
            logger.info('ChannelSettings: Leaving channel successful!', channel);
            // is for backward compactability
            if (onLeaveChannel) {
              onLeaveChannel();
            } else {
              onSubmit();
            }
          });
      }}
      submitText={stringSet.MODAL__LEAVE_CHANNEL__FOOTER}
      titleText={stringSet.MODAL__LEAVE_CHANNEL__TITLE}
    />
  );
};

export default LeaveChannel;

import './leave-channel.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import { noop } from '../../../../utils/utils';

import Modal from '../../../../ui/Modal';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import TextButton from '../../../../ui/TextButton';
import Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import { isDefaultChannelName } from '../../../../utils';
import useChannelSettings from '../../context/useChannelSettings';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

export type LeaveChannelProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

const LeaveChannel: React.FC<LeaveChannelProps> = (props: LeaveChannelProps) => {
  const {
    onSubmit = noop,
    onCancel = noop,
  } = props;

  const { state: { channel, onLeaveChannel } } = useChannelSettings();
  const { stringSet } = useLocalization();
  const { state } = useSendbird();
  const logger = state?.config?.logger;
  const isOnline = state?.config?.isOnline;
  const { isMobile } = useMediaQueryContext();
  const getChannelName = (channel: GroupChannel | null) => {
    if (!channel?.name && !channel?.members) return stringSet.NO_TITLE;

    if (isDefaultChannelName(channel)) return (channel?.members || []).map((member) => member.nickname || stringSet.NO_NAME).join(', ');

    return channel.name;
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
                onLeaveChannel?.();
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

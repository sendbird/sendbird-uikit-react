import React from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { noop } from '../../../../utils/utils';

import Modal from '../../../../ui/Modal';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { GroupChannel } from '@sendbird/chat/groupChannel';

export type LeaveChannelProps = {
  channel?: GroupChannel;
  onSubmit: () => void;
  onCancel: () => void;
};

const LeaveChannel: React.FC<LeaveChannelProps> = (props: LeaveChannelProps) => {
  const {
    channel = null,
    onSubmit = noop,
    onCancel = noop,
  } = props;

  const state = useSendbirdStateContext();
  const { stringSet } = useLocalization();

  const logger = state?.config?.logger;
  const isOnline = state?.config?.isOnline;
  if (channel) {
    return (
      <Modal
        disabled={!isOnline}
        onCancel={onCancel}
        onSubmit={() => {
          logger.info('ChannelSettings: Leaving channel', channel);
          channel.leave()
            .then(() => {
              logger.info('ChannelSettings: Leaving channel successful!', channel);
              onSubmit();
            });
        }}
        submitText={stringSet.MODAL__LEAVE_CHANNEL__FOOTER}
        titleText={stringSet.MODAL__LEAVE_CHANNEL__TITLE}
      />
    );
  }
};

export default LeaveChannel;

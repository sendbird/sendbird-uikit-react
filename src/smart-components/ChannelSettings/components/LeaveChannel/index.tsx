import React from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettings } from '../../context/ChannelSettingsProvider';

import Modal from '../../../../ui/Modal';

export type LeaveChannelProps = {
  onSubmit: () => void;
  onCancel: () => void;
}

const LeaveChannel: React.FC<LeaveChannelProps> = (props: LeaveChannelProps) => {
  const {
    onSubmit,
    onCancel,
  } = props;
  const { channel } = useChannelSettings();
  const state = useSendbirdStateContext();
  const logger = state?.config?.logger;
  const isOnline = state?.config?.isOnline;
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
      submitText="Leave"
      titleText="Leave this channel?"
    />
  );
};

export default LeaveChannel;

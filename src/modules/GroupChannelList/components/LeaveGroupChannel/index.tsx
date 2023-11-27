import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import Modal from '../../../../ui/Modal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';

export type LeaveGroupChannelProps = {
  channel?: GroupChannel;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export const LeaveGroupChannel = ({
  channel,
  onSubmit,
  onCancel,
}: LeaveGroupChannelProps) => {
  const { config } = useSendbirdStateContext();
  const { logger, isOnline } = config;
  const { stringSet } = useLocalization();
  if (channel) {
    return (
      <Modal
        disabled={!isOnline}
        onCancel={onCancel}
        onSubmit={() => {
          logger.info('LeaveGroupChannel: Leaving channel', channel);
          channel.leave().then(() => {
            logger.info(
              'LeaveGroupChannel: Leaving channel successful!',
              channel,
            );
            onSubmit();
          });
        }}
        submitText={stringSet.MODAL__LEAVE_CHANNEL__FOOTER}
        titleText={stringSet.MODAL__LEAVE_CHANNEL__TITLE}
      />
    );
  }
};

export default LeaveGroupChannel;

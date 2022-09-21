import React from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { noop } from '../../../../utils/utils';

import Modal from '../../../../ui/Modal';
import { useChannelListContext } from '../../context/ChannelListProvider';
import { useLocalization } from '../../../../lib/LocalizationContext';

export type LeaveChannelProps = {
  onSubmit: () => void;
  onCancel: () => void;
}

const LeaveChannel: React.FC<LeaveChannelProps> = (props: LeaveChannelProps) => {
  const {
    onSubmit = noop,
    onCancel = noop,
  } = props;

  const channel = useChannelListContext()?.currentChannel;
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
          channel?.leave()
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

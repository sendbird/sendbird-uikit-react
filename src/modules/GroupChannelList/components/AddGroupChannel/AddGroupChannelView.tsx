import React from 'react';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';

import CreateChannel from '../../../CreateChannel';
import { CreateChannelProviderProps } from '../../../CreateChannel/context/CreateChannelProvider';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';

type Props = {
  createChannelVisible: boolean;
  onChangeCreateChannelVisible: (value: boolean) => void;
  onBeforeCreateChannel: CreateChannelProviderProps['onBeforeCreateChannel'];
  onCreateChannelClick: CreateChannelProviderProps['onCreateChannelClick'];
  onChannelCreated: CreateChannelProviderProps['onChannelCreated'];
};

export const AddGroupChannelView = ({
  createChannelVisible,
  onChangeCreateChannelVisible,
  onBeforeCreateChannel,
  onCreateChannelClick,
  onChannelCreated,
}: Props) => {
  const { state: { config } } = useSendbird();

  return (
    <>
      <IconButton
        height={'32px'}
        width={'32px'}
        disabled={!config.isOnline}
        onClick={() => onChangeCreateChannelVisible(true)}
      >
        <Icon
          type={IconTypes.CREATE}
          fillColor={IconColors.PRIMARY}
          width={'24px'}
          height={'24px'}
        />
      </IconButton>
      {createChannelVisible && (
        <CreateChannel
          onCancel={() => onChangeCreateChannelVisible(false)}
          onChannelCreated={(channel) => {
            onChannelCreated?.(channel);
            onChangeCreateChannelVisible(false);
          }}
          onBeforeCreateChannel={onBeforeCreateChannel}
          onCreateChannelClick={onCreateChannelClick}
        />
      )}
    </>
  );
};

export default AddGroupChannelView;

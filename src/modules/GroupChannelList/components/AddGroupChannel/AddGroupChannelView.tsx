import React from 'react';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';

import CreateChannel from '../../../CreateChannel';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { CreateChannelProviderProps } from '../../../CreateChannel/context/CreateChannelProvider';

type Props = {
  createChannelVisible: boolean;
  onChangeCreateChannelVisible: (value: boolean) => void;
  onBeforeCreateChannel?: CreateChannelProviderProps['onBeforeCreateChannel'];
  onClickCreateChannel?: CreateChannelProviderProps['onClickCreateChannel'];
  onCreateChannel?: CreateChannelProviderProps['onCreateChannel'];
};

export const AddGroupChannelView = ({
  createChannelVisible,
  onChangeCreateChannelVisible,
  onBeforeCreateChannel,
  onClickCreateChannel,
  onCreateChannel,
}: Props) => {
  const { config } = useSendbirdStateContext();

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
          onCreateChannel={(channel) => {
            onCreateChannel?.(channel);
            onChangeCreateChannelVisible(false);
          }}
          onBeforeCreateChannel={onBeforeCreateChannel}
          onClickCreateChannel={onClickCreateChannel}
        />
      )}
    </>
  );
};

export default AddGroupChannelView;

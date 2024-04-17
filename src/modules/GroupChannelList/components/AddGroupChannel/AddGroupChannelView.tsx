import React from 'react';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';

import CreateChannel from '../../../CreateChannel';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { CreateChannelProviderProps } from '../../../CreateChannel/context/CreateChannelProvider';
import { UserListQuery } from '../../../../types';

type Props = {
  createChannelVisible: boolean;
  onChangeCreateChannelVisible: (value: boolean) => void;
  onBeforeCreateChannel: CreateChannelProviderProps['onBeforeCreateChannel'];
  onCreateChannelClick: CreateChannelProviderProps['onCreateChannelClick'];
  onChannelCreated: CreateChannelProviderProps['onChannelCreated'];
  userQuery?(): UserListQuery
};

export const AddGroupChannelView = ({
  createChannelVisible,
  onChangeCreateChannelVisible,
  onBeforeCreateChannel,
  onCreateChannelClick,
  onChannelCreated,
  userQuery,
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
          onChannelCreated={(channel) => {
            onChannelCreated?.(channel);
            onChangeCreateChannelVisible(false);
          }}
          onBeforeCreateChannel={onBeforeCreateChannel}
          onCreateChannelClick={onCreateChannelClick}
          userQuery={userQuery}
        />
      )}
    </>
  );
};

export default AddGroupChannelView;

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
  overrideInviteUser?: CreateChannelProviderProps['overrideInviteUser'];
};

export const AddGroupChannelView = ({
  createChannelVisible,
  onChangeCreateChannelVisible,
  onBeforeCreateChannel,
  overrideInviteUser,
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
          onCreateChannel={() => onChangeCreateChannelVisible(false)}
          onBeforeCreateChannel={onBeforeCreateChannel}
          overrideInviteUser={overrideInviteUser}
        />
      )}
    </>
  );
};

export default AddGroupChannelView;

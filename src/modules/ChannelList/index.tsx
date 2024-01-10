import React from 'react';
import {
  ChannelListProvider,
  ChannelListProviderProps,
} from './context/ChannelListProvider';

import ChannelListUI, { ChannelListUIProps } from './components/ChannelListUI';

interface ChannelListProps extends ChannelListProviderProps, ChannelListUIProps {}

const ChannelList: React.FC<ChannelListProps> = (props: ChannelListProps) => {
  return (
    <ChannelListProvider
      className={props?.className}
      disableUserProfile={props?.disableUserProfile}
      allowProfileEdit={props?.allowProfileEdit}
      onBeforeCreateChannel={props?.onBeforeCreateChannel}
      onThemeChange={props?.onThemeChange}
      overrideInviteUser={props?.overrideInviteUser}
      onProfileEditSuccess={props?.onProfileEditSuccess}
      onChannelSelect={props?.onChannelSelect}
      sortChannelList={props?.sortChannelList}
      queries={props?.queries}
      disableAutoSelect={props?.disableAutoSelect}
      activeChannelUrl={props?.activeChannelUrl}
      isTypingIndicatorEnabled={props?.isTypingIndicatorEnabled}
      isMessageReceiptStatusEnabled={props?.isMessageReceiptStatusEnabled}
    >
      <ChannelListUI
        renderChannelPreview={props?.renderChannelPreview}
        renderHeader={props?.renderHeader}
        renderPlaceHolderEmptyList={props?.renderPlaceHolderEmptyList}
        renderPlaceHolderError={props?.renderPlaceHolderError}
        renderPlaceHolderLoading={props?.renderPlaceHolderLoading}
      />
    </ChannelListProvider>
  );
};

export default ChannelList;

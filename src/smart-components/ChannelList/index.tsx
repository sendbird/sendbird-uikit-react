import React from 'react';
import {
  ChannelListProvider,
  ChannelListProviderInterface,
} from './context/ChannelListProvider';

import ChannelListUI, { ChannelListUIProps } from './components/ChannelListUI';

interface ChannelListProps extends ChannelListProviderInterface, ChannelListUIProps {}

const ChannelList: React.FC<ChannelListProps> = (props: ChannelListProps) => {
  return (
    <ChannelListProvider
      className={props?.className}
      disableUserProfile={props?.disableUserProfile}
      allowProfileEdit={props?.allowProfileEdit}
      onBeforeCreateChannel={props?.onBeforeCreateChannel}
      onThemeChange={props?.onThemeChange}
      onProfileEditSuccess={props?.onProfileEditSuccess}
      onChannelSelect={props?.onChannelSelect}
      sortChannelList={props?.sortChannelList}
      queries={props?.queries}
      disableAutoSelect={props?.disableAutoSelect}
    >
      <ChannelListUI
        renderChannelPreview={props?.renderChannelPreview}
        renderUserProfile={props?.renderUserProfile}
        renderHeader={props?.renderHeader}
        renderPlaceHolderEmptyList={props?.renderPlaceHolderEmptyList}
        renderPlaceHolderError={props?.renderPlaceHolderError}
        renderPlaceHolderLoading={props?.renderPlaceHolderLoading}
      />
    </ChannelListProvider>
  );
}

export default ChannelList;

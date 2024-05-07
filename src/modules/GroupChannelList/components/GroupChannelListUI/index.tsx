import './index.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';
import { GroupChannelListUIView } from './GroupChannelListUIView';
import GroupChannelPreviewAction from '../GroupChannelPreviewAction';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { GroupChannelListItem } from '../GroupChannelListItem';
import AddGroupChannel from '../AddGroupChannel';
import { GroupChannelListItemBasicProps } from '../GroupChannelListItem/GroupChannelListItemView';
import { noop } from '../../../../utils/utils';

interface GroupChannelItemProps extends GroupChannelListItemBasicProps {}

export interface GroupChannelListUIProps {
  renderChannelPreview?: (props: GroupChannelItemProps) => React.ReactElement;
  renderHeader?: (props: void) => React.ReactElement;
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}

export const GroupChannelListUI = (props: GroupChannelListUIProps) => {
  const { renderHeader, renderChannelPreview, renderPlaceHolderError, renderPlaceHolderLoading, renderPlaceHolderEmptyList } = props;

  const {
    onChannelSelect,
    onThemeChange,
    allowProfileEdit,
    typingChannelUrls,
    groupChannels,
    initialized,
    selectedChannelUrl,
    loadMore,
    onUserProfileUpdated,
  } = useGroupChannelListContext();

  const { stores, config } = useSendbirdStateContext();
  const { logger, isOnline } = config;
  const sdk = stores.sdkStore.sdk;

  const renderListItem = (renderProps: { item: GroupChannel; index: number }) => {
    const { item: channel, index } = renderProps;

    const itemProps: GroupChannelItemProps = {
      channel,
      tabIndex: index,
      isSelected: channel.url === selectedChannelUrl,
      isTyping: typingChannelUrls.includes(channel.url),
      renderChannelAction: (props) => <GroupChannelPreviewAction {...props} />,
      onClick() {
        if (isOnline || sdk?.isCacheEnabled) {
          logger.info('ChannelList: Clicked on channel:', channel);
          onChannelSelect(channel);
        } else {
          logger.warning('ChannelList: Inactivated clicking channel item during offline.');
        }
      },
      async onLeaveChannel() {
        logger.info('ChannelList: Leaving channel', channel);
        await channel.leave();
        logger.info('ChannelList: Leaving channel success');
      },
    };

    if (renderChannelPreview) {
      return (
        <div key={channel.url} onClick={itemProps.onClick}>
          {renderChannelPreview(itemProps)}
        </div>
      );
    }

    return <GroupChannelListItem key={channel.url} {...itemProps} />;
  };

  return (
    <GroupChannelListUIView
      renderHeader={renderHeader}
      renderChannel={renderListItem}
      renderPlaceHolderError={renderPlaceHolderError}
      renderPlaceHolderLoading={renderPlaceHolderLoading}
      renderPlaceHolderEmptyList={renderPlaceHolderEmptyList}
      onChangeTheme={onThemeChange ?? noop}
      allowProfileEdit={allowProfileEdit}
      onUserProfileUpdated={onUserProfileUpdated ?? noop}
      channels={groupChannels}
      onLoadMore={loadMore}
      initialized={initialized}
      renderAddChannel={() => <AddGroupChannel />}
    />
  );
};

export default GroupChannelListUI;

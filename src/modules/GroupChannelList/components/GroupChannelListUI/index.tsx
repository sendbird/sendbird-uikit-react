import './index.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListUIView } from './GroupChannelListUIView';
import GroupChannelPreviewAction from '../GroupChannelPreviewAction';
import { GroupChannelListItem } from '../GroupChannelListItem';
import AddGroupChannel from '../AddGroupChannel';
import { GroupChannelListItemBasicProps } from '../GroupChannelListItem/GroupChannelListItemView';
import { noop } from '../../../../utils/utils';
import { useGroupChannelList } from '../../context/useGroupChannelList';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

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
    state: {
      onChannelSelect,
      onThemeChange,
      allowProfileEdit,
      typingChannelUrls,
      groupChannels,
      initialized,
      selectedChannelUrl,
      loadMore,
      onUserProfileUpdated,
      scrollRef,
    },
  } = useGroupChannelList();

  const { state: { stores, config: { logger, isOnline } } } = useSendbird();
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
      scrollRef={scrollRef}
    />
  );
};

export default GroupChannelListUI;

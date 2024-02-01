import './index.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';
import { GroupChannelListUIView } from './GroupChannelListUIView';
import GroupChannelPreviewAction from '../GroupChannelPreviewAction';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { GroupChannelListItem } from '../GroupChannelListItem';

interface RenderChannelPreviewProps {
  channel: GroupChannel;
  onLeaveChannel(
    channel: GroupChannel,
    onLeaveChannelCb?: (c: GroupChannel) => void
  ): void;
}

export interface GroupChannelListUIProps {
  renderChannelPreview?: (
    props: RenderChannelPreviewProps
  ) => React.ReactElement;
  renderHeader?: (props: void) => React.ReactElement;
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}

export const GroupChannelListUI = (props: GroupChannelListUIProps) => {
  const {
    renderHeader,
    renderChannelPreview,
    renderPlaceHolderError,
    renderPlaceHolderLoading,
    renderPlaceHolderEmptyList,
  } = props;

  const {
    onChannelSelect,
    onThemeChange,
    allowProfileEdit,
    groupChannels,
    initialized,
    loadMore,
    onUserProfileUpdated,
  } = useGroupChannelListContext();

  const { stores, config } = useSendbirdStateContext();
  const { logger, isOnline } = config;
  const sdk = stores.sdkStore.sdk;

  const renderListItem = (renderProps: { item: GroupChannel; index: number }) => {
    const { item: channel, index } = renderProps;

    const onLeaveChannel: RenderChannelPreviewProps['onLeaveChannel'] = async (
      targetChannel,
      cb,
    ) => {
      logger.info('ChannelList: Leaving channel', targetChannel);
      await targetChannel.leave();

      logger.info('ChannelList: Leaving channel success');
      if (cb && typeof cb === 'function') cb(targetChannel);
    };

    const onClick = () => {
      if (isOnline || sdk?.isCacheEnabled) {
        logger.info('ChannelList: Clicked on channel:', channel);
        onChannelSelect(channel);
      } else {
        logger.warning('ChannelList: Inactivated clicking channel item during offline.');
      }
    };

    if (renderChannelPreview) {
      return (
        <div key={channel.url} onClick={onClick}>
          {renderChannelPreview({ channel, onLeaveChannel })}
        </div>
      );
    }

    return (
      <GroupChannelListItem
        key={channel.url}
        tabIndex={index}
        onClick={onClick}
        channel={channel}
        onLeaveChannel={() => onLeaveChannel(channel, null)}
        renderChannelAction={() => (
          <GroupChannelPreviewAction
            channel={channel}
            disabled={!isOnline}
            onLeaveChannel={() => onLeaveChannel(channel, null)}
          />
        )}
      />
    );
  };

  return (
    <GroupChannelListUIView
      renderHeader={renderHeader}
      renderChannel={renderListItem}
      renderPlaceHolderError={renderPlaceHolderError}
      renderPlaceHolderLoading={renderPlaceHolderLoading}
      renderPlaceHolderEmptyList={renderPlaceHolderEmptyList}
      onChangeTheme={onThemeChange}
      allowProfileEdit={allowProfileEdit}
      onUserProfileUpdated={onUserProfileUpdated}
      channels={groupChannels}
      onLoadMore={loadMore}
      initialized={initialized}
    />
  );
};

export default GroupChannelListUI;

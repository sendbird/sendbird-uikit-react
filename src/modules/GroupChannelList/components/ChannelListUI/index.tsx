import './channel-list-ui.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';
import { ChannelListUIView } from './ChannelListUIView';
import ChannelPreviewAction from '../ChannelPreviewAction';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { GroupChannelListItem } from '../GroupChannelListItem';

interface RenderChannelPreviewProps {
  channel: GroupChannel;
  onLeaveChannel(
    channel: GroupChannel,
    onLeaveChannelCb?: (c: GroupChannel) => void
  ): void;
}

export interface ChannelListUIProps {
  renderChannelPreview?: (
    props: RenderChannelPreviewProps
  ) => React.ReactElement;
  renderHeader?: (props: void) => React.ReactElement;
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}

const ChannelListUI = (props: ChannelListUIProps) => {
  const {
    renderHeader,
    renderChannelPreview,
    renderPlaceHolderError,
    renderPlaceHolderLoading,
    renderPlaceHolderEmptyList,
  } = props;

  const {
    onThemeChange,
    allowProfileEdit,
    groupChannels,
    initialized,
    loadMore,
    onUpdatedUserProfile,
  } = useGroupChannelListContext();

  const { config } = useSendbirdStateContext();
  const { logger, isOnline } = config;

  const renderListItem = (renderProps: { item: GroupChannel; index: number }) => {
    const { item: channel, index } = renderProps;

    // todo: Refactor and move this inside channel - preview
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
      if (isOnline) {
        logger.info('ChannelList: Clicked on channel:', channel);
        // TODO: onChannelSelect(channel);
      }
    };

    if (renderChannelPreview) {
      return (
        <div key={channel?.url} onClick={onClick}>
          {renderChannelPreview({ channel, onLeaveChannel })}
        </div>
      );
    }

    return (
      <GroupChannelListItem
        key={channel?.url}
        tabIndex={index}
        onClick={onClick}
        channel={channel}
        onLeaveChannel={() => onLeaveChannel(channel, null)}
        renderChannelAction={() => (
          <ChannelPreviewAction
            channel={channel}
            disabled={!isOnline}
            onLeaveChannel={() => onLeaveChannel(channel, null)}
          />
        )}
      />
    );
  };

  return (
    <ChannelListUIView
      renderHeader={renderHeader}
      renderChannel={renderListItem}
      renderPlaceHolderError={renderPlaceHolderError}
      renderPlaceHolderLoading={renderPlaceHolderLoading}
      renderPlaceHolderEmptyList={renderPlaceHolderEmptyList}
      onChangeTheme={onThemeChange}
      allowProfileEdit={allowProfileEdit}
      onUpdatedUserProfile={onUpdatedUserProfile}
      channels={groupChannels}
      onLoadMore={loadMore}
      initialized={initialized}
    />
  );
};

export default ChannelListUI;

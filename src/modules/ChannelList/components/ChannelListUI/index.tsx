import './channel-list-ui.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import ChannelPreview from '../ChannelPreview';
import ChannelPreviewAction from '../ChannelPreviewAction';
import { useChannelListContext } from '../../context/ChannelListProvider';
import * as channelListActions from '../../dux/actionTypes';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { GroupChannelListUIView } from '../../../GroupChannelList/components/GroupChannelListUI/GroupChannelListUIView';

interface RenderChannelPreviewProps {
  channel: GroupChannel;
  onLeaveChannel(
    channel: GroupChannel,
    onLeaveChannelCb?: (channel: GroupChannel, error?: null) => void
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

const ChannelListUI: React.FC<ChannelListUIProps> = (
  props: ChannelListUIProps,
) => {
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
    allChannels,
    currentChannel,
    channelListDispatcher,
    typingChannels,
    initialized,
    fetchChannelList,
    onProfileEditSuccess,
  } = useChannelListContext();

  const { config } = useSendbirdStateContext();
  const { logger, isOnline = false } = config;

  const renderListItem = (props: { item: GroupChannel; index: number }) => {
    const { item: channel, index } = props;

    const onLeaveChannel: RenderChannelPreviewProps['onLeaveChannel'] = (channel, cb) => {
      logger.info('ChannelList: Leaving channel', channel);
      channel
        .leave()
        .then((res) => {
          logger.info('ChannelList: Leaving channel success', res);
          if (cb && typeof cb === 'function') cb(channel, null);

          channelListDispatcher({
            type: channelListActions.LEAVE_CHANNEL_SUCCESS,
            payload: channel.url,
          });
        })
        .catch((err) => {
          logger.error('ChannelList: Leaving channel failed', err);
          if (cb && typeof cb === 'function') cb(channel, err);
        });
    };

    const onClickChannel = () => {
      if (!isOnline) {
        return;
      }
      logger.info('ChannelList: Clicked on channel:', channel);
      channelListDispatcher({
        type: channelListActions.SET_CURRENT_CHANNEL,
        payload: channel,
      });
    };

    if (renderChannelPreview) {
      return (
        <div key={channel?.url} onClick={onClickChannel}>
          {renderChannelPreview({ channel, onLeaveChannel })}
        </div>
      );
    }

    return (
      <ChannelPreview
        key={channel?.url}
        tabIndex={index}
        onClick={onClickChannel}
        channel={channel}
        onLeaveChannel={() => onLeaveChannel(channel, null)}
        isActive={channel?.url === currentChannel?.url}
        isTyping={typingChannels?.some(({ url }) => url === channel?.url)}
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
    <GroupChannelListUIView
      renderHeader={renderHeader}
      renderChannel={renderListItem}
      renderPlaceHolderError={renderPlaceHolderError}
      renderPlaceHolderLoading={renderPlaceHolderLoading}
      renderPlaceHolderEmptyList={renderPlaceHolderEmptyList}
      onChangeTheme={onThemeChange}
      allowProfileEdit={allowProfileEdit}
      onUpdatedUserProfile={onProfileEditSuccess}
      channels={allChannels}
      onLoadMore={fetchChannelList}
      initialized={initialized}
    />
  );
};

export default ChannelListUI;

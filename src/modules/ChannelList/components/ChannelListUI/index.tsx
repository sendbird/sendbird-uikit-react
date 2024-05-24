import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import ChannelPreview from '../ChannelPreview';
import ChannelPreviewAction from '../ChannelPreviewAction';
import { useChannelListContext } from '../../context/ChannelListProvider';
import * as channelListActions from '../../dux/actionTypes';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { GroupChannelListUIView } from '../../../GroupChannelList/components/GroupChannelListUI/GroupChannelListUIView';
import AddChannel from '../AddChannel';
import { GroupChannelListItemBasicProps } from '../../../GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView';
import { noop } from '../../../../utils/utils';

interface ChannelPreviewProps extends Omit<GroupChannelListItemBasicProps, 'onLeaveChannel'> {
  onLeaveChannel(channel?: GroupChannel, onLeaveChannelCb?: (channel: GroupChannel, error?: unknown) => void): Promise<void>;
}

export interface ChannelListUIProps {
  renderChannelPreview?: (props: ChannelPreviewProps) => React.ReactElement;
  renderHeader?: (props: void) => React.ReactElement;
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}

const ChannelListUI: React.FC<ChannelListUIProps> = (props: ChannelListUIProps) => {
  const { renderHeader, renderChannelPreview, renderPlaceHolderError, renderPlaceHolderLoading, renderPlaceHolderEmptyList } = props;

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

  const { stores, config } = useSendbirdStateContext();
  const { logger, isOnline = false } = config;
  const sdk = stores.sdkStore.sdk;

  const renderListItem = (props: { item: GroupChannel; index: number }) => {
    const { item: channel, index } = props;

    const previewProps: ChannelPreviewProps = {
      channel,
      tabIndex: index,
      isSelected: channel?.url === currentChannel?.url,
      isTyping: typingChannels?.some(({ url }) => url === channel?.url),
      renderChannelAction: (props) => <ChannelPreviewAction {...props} />,
      onClick() {
        if (!isOnline && !sdk?.isCacheEnabled) {
          logger.warning('ChannelList: Inactivated clicking channel item during offline.');
          return;
        }
        logger.info('ChannelList: Clicked on channel:', channel);
        channelListDispatcher({
          type: channelListActions.SET_CURRENT_CHANNEL,
          payload: channel,
        });
      },
      async onLeaveChannel(channel?: GroupChannel, cb?: (channel: GroupChannel, error?: unknown) => void) {
        logger.info('ChannelList: Leaving channel', channel);
        if (channel) {
          try {
            const response = await channel.leave();

            logger.info('ChannelList: Leaving channel success', response);
            if (cb && typeof cb === 'function') cb(channel, null);

            channelListDispatcher({
              type: channelListActions.LEAVE_CHANNEL_SUCCESS,
              payload: channel.url,
            });
          } catch (err) {
            logger.error('ChannelList: Leaving channel failed', err);
            if (cb && typeof cb === 'function') cb(channel, err);
          }
        }
      },
    };

    if (renderChannelPreview) {
      return (
        <div key={channel?.url} onClick={previewProps.onClick}>
          {renderChannelPreview(previewProps)}
        </div>
      );
    }

    return <ChannelPreview key={channel?.url} {...previewProps} />;
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
      onUserProfileUpdated={onProfileEditSuccess ?? noop}
      channels={allChannels}
      onLoadMore={fetchChannelList}
      initialized={initialized}
      renderAddChannel={() => <AddChannel />}
    />
  );
};

export default ChannelListUI;

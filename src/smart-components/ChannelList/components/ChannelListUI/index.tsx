import './channel-list-ui.scss';

import React, { useState } from 'react';
import type { GroupChannel, Member, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';

import ChannelListHeader from '../ChannelListHeader';
import AddChannel from '../AddChannel';
import ChannelPreview from '../ChannelPreview';
import ChannelPreviewAction from '../ChannelPreviewAction';
import { useChannelListContext } from '../../context/ChannelListProvider';
import * as channelListActions from '../../dux/actionTypes';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import EditUserProfile from '../../../EditUserProfile';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';

const DELIVERY_RECIPT = 'delivery_receipt';

interface RenderChannelPreviewProps {
  channel: GroupChannel;
  onLeaveChannel(
    channel: GroupChannel,
    onLeaveChannelCb?: (c: GroupChannel) => void,
  );
}

interface RenderUserProfileProps {
  user: Member | User;
  currentUserId: string;
  close(): void;
}

export interface ChannelListUIProps {
  renderChannelPreview?: (props: RenderChannelPreviewProps) => React.ReactNode;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  renderHeader?: (props: void) => React.ReactNode;
  renderPlaceHolderError?: (props: void) => React.ReactNode;
  renderPlaceHolderLoading?: (props: void) => React.ReactNode;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactNode;
}

const ChannelListUI: React.FC<ChannelListUIProps> = (props: ChannelListUIProps) => {
  const {
    renderHeader,
    renderChannelPreview,
    renderPlaceHolderError,
    renderPlaceHolderLoading,
    renderPlaceHolderEmptyList,
  } = props;

  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const {
    onThemeChange,
    allowProfileEdit,
    allChannels,
    loading,
    currentChannel,
    channelListDispatcher,
    channelSource,
    typingChannels,
  } = useChannelListContext();

  const state = useSendbirdStateContext();

  const sdkStore = state?.stores?.sdkStore;
  const config = state?.config;

  const isOnline = state?.config?.isOnline;
  const logger = config?.logger;

  const sdk = sdkStore?.sdk as SendbirdGroupChat;
  const sdkError = sdkStore?.error;
  const sdkIntialized = sdkStore?.initialized || false;

  return (
    <>
      <div className="sendbird-channel-list__header">
        <ChannelListHeader
          renderHeader={renderHeader}
          onEdit={() => {
            if (allowProfileEdit) {
              setShowProfileEdit(true);
            }
          }}
          allowProfileEdit={allowProfileEdit}
          renderIconButton={() => (
            <AddChannel />
          )}
        />
      </div>
      {
        showProfileEdit && (
          <EditUserProfile
            onThemeChange={onThemeChange}
            onCancel={() => { setShowProfileEdit(false); }}
            onEditProfile={() => {
              setShowProfileEdit(false);
            }}
          />
        )
      }
      <div
        className="sendbird-channel-list__body"
        onScroll={(e) => {
          const target = e?.target as HTMLDivElement;
          const fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;
          if (fetchMore && channelSource?.hasNext) {
            logger.info('ChannelList: Fetching more channels');
            channelListDispatcher({
              type: channelListActions.FETCH_CHANNELS_START,
              payload: null,
            });
            channelSource.next().then((channelList) => {
              logger.info('ChannelList: Fetching channels successful', channelList);
              channelListDispatcher({
                type: channelListActions.FETCH_CHANNELS_SUCCESS,
                payload: channelList,
              });
              const canSetMarkAsDelivered = sdk?.appInfo?.premiumFeatureList
                ?.find((feature) => (feature === DELIVERY_RECIPT));

              if (canSetMarkAsDelivered) {
                logger.info('ChannelList: Marking all channels as read');
                // eslint-disable-next-line no-unused-expressions
                channelList?.forEach((c, idx) => {
                  // Plan-based rate limits - minimum limit is 5 requests per second
                  setTimeout(() => {
                    // sdk?.markAsDelivered(c?.url);
                  }, 300 * idx);
                });
              }
            }).catch((err) => {
              logger.info('ChannelList: Fetching channels failed', err);
              channelListDispatcher({
                type: channelListActions.FETCH_CHANNELS_FAILURE,
                payload: err,
              });
            });
          }
        }}
      >
        {
          (sdkError) && (
            (renderPlaceHolderError && typeof renderPlaceHolderError === 'function') ? (
              renderPlaceHolderError?.()
            ): (
              <PlaceHolder type={PlaceHolderTypes.WRONG} />
            )
          )
        }
        {/*
          To do: Implement windowing
          Implement windowing if you are dealing with large number of messages/channels
          https://github.com/bvaughn/react-window -> recommendation
          We hesitate to bring one more dependency to our library,
          we are planning to implement it inside the library
        */}
        <div>
          {
            allChannels && allChannels.map((channel, idx) => {
              const onLeaveChannel = (c, cb) => {
                logger.info('ChannelList: Leaving channel', c);
                c.leave()
                  .then((res) => {
                    logger.info('ChannelList: Leaving channel success', res);
                    if (cb && typeof cb === 'function') {
                      cb(res, null);
                    }
                    channelListDispatcher({
                      type: channelListActions.LEAVE_CHANNEL_SUCCESS,
                      payload: channel.url,
                    });
                  })
                  .catch((err) => {
                    logger.error('ChannelList: Leaving channel failed', err);
                    if (cb && typeof cb === 'function') {
                      cb(null, err);
                    }
                  });
              };

              const onClick = () => {
                if (!isOnline) { return; }
                logger.info('ChannelList: Clicked on channel:', channel);
                channelListDispatcher({
                  type: channelListActions.SET_CURRENT_CHANNEL,
                  payload: channel,
                });
              };

              return (
                (renderChannelPreview)
                  ? (
                    // eslint-disable-next-line
                    <div key={channel.url} onClick={onClick}>
                      {renderChannelPreview({ channel, onLeaveChannel })}
                    </div>
                  )
                  : (
                    <ChannelPreview
                      key={channel.url}
                      tabIndex={idx}
                      onClick={onClick}
                      channel={channel}
                      isActive={channel.url === currentChannel?.url}
                      isTyping={typingChannels?.some(({ url }) => url === channel.url)}
                      renderChannelAction={(() => (
                        <ChannelPreviewAction
                          disabled={!isOnline}
                          onLeaveChannel={() => onLeaveChannel(channel, null)}
                        />
                      ))}
                    />
                  )
              );
            })
          }
        </div>
        {
          (!sdkIntialized || loading) && (
            (renderPlaceHolderLoading && typeof renderPlaceHolderLoading === 'function') ? (
              renderPlaceHolderLoading?.()
            ): (
              <PlaceHolder type={PlaceHolderTypes.LOADING} />
            )
          )
        }
        {
          (!allChannels || allChannels.length === 0) && (
            (renderPlaceHolderEmptyList && typeof renderPlaceHolderEmptyList === 'function') ? (
              renderPlaceHolderEmptyList?.()
            ): (
              <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />
            )
          )
        }
      </div>
    </>
  );
}

export default ChannelListUI;

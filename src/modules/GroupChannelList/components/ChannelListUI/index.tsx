import './channel-list-ui.scss';

import React, { useState } from 'react';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
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
import { isAboutSame } from '../../../../utils/utils';

interface RenderChannelPreviewProps {
  channel: GroupChannel;
  onLeaveChannel(
    channel: GroupChannel,
    onLeaveChannelCb?: (c: GroupChannel) => void,
  ): void;
}

interface RenderUserProfileProps {
  user: Member | User;
  currentUserId: string;
  close(): void;
}

export interface ChannelListUIProps {
  renderChannelPreview?: (props: RenderChannelPreviewProps) => React.ReactElement;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  renderHeader?: (props: void) => React.ReactElement;
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
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
    typingChannels,
    initialized,
    loadMore,
  } = useChannelListContext();

  const state = useSendbirdStateContext();
  const sdkStore = state?.stores?.sdkStore;
  const config = state?.config;
  const {
    logger,
    isOnline = false,
  } = config;
  const sdkError = sdkStore?.error;

  return (
    <>
      <div className="sendbird-channel-list__header">
        {
          renderHeader?.() || (
            <ChannelListHeader
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
          )
        }
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
          if (isAboutSame(target.clientHeight + target.scrollTop, target.scrollHeight, 10)) {
            loadMore();
          }
        }}
      >
        {
          (sdkError && !loading) && (
            (renderPlaceHolderError && typeof renderPlaceHolderError === 'function') ? (
              renderPlaceHolderError?.()
            ) : (
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
              // todo: Refactor and move this inside channel - preview
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
                      payload: channel?.url,
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
                    <div key={channel?.url} onClick={onClick}>
                      {renderChannelPreview({ channel, onLeaveChannel })}
                    </div>
                  )
                  : (
                    <ChannelPreview
                      key={channel?.url}
                      tabIndex={idx}
                      onClick={onClick}
                      channel={channel}
                      onLeaveChannel={() => onLeaveChannel(channel, null)}
                      isActive={channel?.url === currentChannel?.url}
                      isTyping={typingChannels?.some(({ url }) => url === channel?.url)}
                      renderChannelAction={(() => (
                        <ChannelPreviewAction
                          channel={channel}
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
          (!initialized && loading) && (
            (renderPlaceHolderLoading && typeof renderPlaceHolderLoading === 'function') ? (
              renderPlaceHolderLoading?.()
            ) : (
              <PlaceHolder type={PlaceHolderTypes.LOADING} />
            )
          )
        }
        {
          (initialized && allChannels?.length === 0) && (
            (renderPlaceHolderEmptyList && typeof renderPlaceHolderEmptyList === 'function') ? (
              renderPlaceHolderEmptyList?.()
            ) : (
              <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />
            )
          )
        }
      </div>
    </>
  );
};

export default ChannelListUI;

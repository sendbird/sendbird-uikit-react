import React, { useContext, useMemo, useRef, useState } from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';

import './index.scss';

import OpenChannelPreview from '../OpenChannelPreview';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { OnOpenChannelSelected, OpenChannelListFetchingStatus } from '../../context/OpenChannelListInterfaces';
import { useOpenChannelListContext } from '../../context/OpenChannelListProvider';
import OpenChannelListActionTypes from '../../context/dux/actionTypes';
import CreateOpenChannel from '../../../CreateOpenChannel';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

interface RenderChannelPreviewProps {
  channel: OpenChannel;
  isSelected: boolean;
  onChannelSelected: OnOpenChannelSelected;
}

export interface OpenChannelListUIProps {
  renderHeader?: () => React.ReactElement;
  renderChannelPreview?: (props: RenderChannelPreviewProps) => React.ReactElement;
  renderPlaceHolderEmpty?: () => React.ReactElement;
  renderPlaceHolderError?: () => React.ReactElement;
  renderPlaceHolderLoading?: () => React.ReactElement;
}

function OpenChannelListUI({
  renderHeader,
  renderChannelPreview,
  renderPlaceHolderEmpty,
  renderPlaceHolderError,
  renderPlaceHolderLoading,
}: OpenChannelListUIProps): React.ReactElement {
  const [showCreateChannelModal, setShowCreateChannel] = useState(false);
  const scrollRef = useRef(null);
  const {
    logger,
    currentChannel,
    allChannels,
    fetchingStatus,
    onChannelSelected,
    fetchNextChannels,
    refreshOpenChannelList,
    openChannelListDispatcher,
  } = useOpenChannelListContext();
  const { stringSet } = useContext(LocalizationContext);

  const handleScroll = (e) => {
    const element = e.target;
    const {
      scrollTop,
      clientHeight,
      scrollHeight,
    } = element;
    const isAboutSame = (a, b, px) => (Math.abs(a - b) <= px);
    if (isAboutSame(clientHeight + scrollTop, scrollHeight, 10)) {
      fetchNextChannels((messages) => {
        if (messages) {
          try {
            element.scrollTop = scrollHeight - clientHeight;
          } catch (error) {
            //
          }
        }
      });
    }
  };
  const handleOnClickCreateChannel = () => {
    setShowCreateChannel(true);
  };

  const MemoizedHeader: React.ReactElement = useMemo(() => {
    return renderHeader?.() || null;
  }, [renderHeader]);
  const MemoizedPlaceHolder: React.ReactElement = useMemo(() => {
    if (fetchingStatus === OpenChannelListFetchingStatus.EMPTY) {
      return renderPlaceHolderEmpty?.() || (
        <PlaceHolder
          className="sendbird-open-channel-list-ui__channel-list--place-holder--empty"
          type={PlaceHolderTypes.NO_CHANNELS}
        />
      );
    }
    if (fetchingStatus === OpenChannelListFetchingStatus.FETCHING) {
      return renderPlaceHolderLoading?.() || (
        <div className="sendbird-open-channel-list-ui__channel-list--place-holder--loading">
          <PlaceHolder
            iconSize="24px"
            type={PlaceHolderTypes.LOADING}
          />
        </div>
      );
    }
    if (fetchingStatus === OpenChannelListFetchingStatus.ERROR) {
      return renderPlaceHolderError?.() || (
        <PlaceHolder
          className="sendbird-open-channel-list-ui__channel-list--place-holder--error"
          type={PlaceHolderTypes.WRONG}
        />
      );
    }
    return null;
  }, [fetchingStatus, renderPlaceHolderEmpty, renderPlaceHolderLoading, renderPlaceHolderError]);
  const MemoizedAllChannels = useMemo(() => {
    if (fetchingStatus === OpenChannelListFetchingStatus.DONE) {
      return allChannels.map((channel) => {
        const isSelected = channel?.url === currentChannel?.url;
        const handleClick = (e) => {
          onChannelSelected?.(channel, e);
          logger.info('OpenChannelList|ChannelPreview: A channel is selected', channel);
          openChannelListDispatcher({
            type: OpenChannelListActionTypes.SET_CURRENT_OPEN_CHANNEL,
            payload: channel,
          });
        };
        return renderChannelPreview
          ? (
            <div
              className="sendbird-open-channel-list-ui__channel-list__item"
              onClick={handleClick}
            >
              {renderChannelPreview({ channel, isSelected, onChannelSelected })}
            </div>
          )
          : (
            <OpenChannelPreview
              className="sendbird-open-channel-list-ui__channel-list__item"
              channel={channel}
              isSelected={isSelected}
              onClick={handleClick}
            />
          );
      })
    }
    return null;
  }, [allChannels, allChannels.length, currentChannel]);

  return (
    <div className="sendbird-open-channel-list-ui">
      {
        showCreateChannelModal && (
          <CreateOpenChannel
            closeModal={() => setShowCreateChannel(false)}
            onCreateChannel={(openChannel) => {
              onChannelSelected?.(openChannel);
              openChannelListDispatcher({
                type: OpenChannelListActionTypes.CREATE_OPEN_CHANNEL,
                payload: openChannel,
              });
            }}
          />
        )
      }
      {
        MemoizedHeader || (
          <div className="sendbird-open-channel-list-ui__header">
            <Label
              className="sendbird-open-channel-list-ui__header__title"
              type={LabelTypography.H_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.OPEN_CHANNEL_LIST__TITLE}
            </Label>
            <IconButton
              className="sendbird-open-channel-list-ui__header__button-refresh"
              width="32px"
              height="32px"
              type="button"
              onClick={() => refreshOpenChannelList()}
            >
              <Icon
                type={IconTypes.REFRESH}
                fillColor={IconColors.PRIMARY}
                width="22px"
                height="22px"
              />
            </IconButton>
            <IconButton
              className="sendbird-open-channel-list-ui__header__button-create-channel"
              width="32px"
              height="32px"
              type="button"
              onClick={handleOnClickCreateChannel}
            >
              <Icon
                type={IconTypes.CREATE}
                fillColor={IconColors.PRIMARY}
                width="22px"
                height="22px"
              />
            </IconButton>
          </div>
        )
      }
      <div
        className="sendbird-open-channel-list-ui__channel-list"
        ref={scrollRef}
        onScroll={handleScroll}
        >
        {MemoizedPlaceHolder}
        {MemoizedAllChannels}
      </div>
    </div>
  );
}

export default OpenChannelListUI;

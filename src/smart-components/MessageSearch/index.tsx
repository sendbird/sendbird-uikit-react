import React, { useReducer, useRef, useContext, useState } from 'react';
import './index.scss';

import widthSendbirdContext from '../../lib/SendbirdSdkContext';
import messageSearchReducer from './dux/reducers';
import messageSearchInitialState from './dux/initialState';

import useSetChannel from './hooks/useSetChannel';
import useGetSearchMessages from './hooks/useGetSearchedMessages';
import useScrollCallback from './hooks/useScrollCallback';

import MessageSearchItem from '../../ui/MessageSearchItem';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder';
import { LocalizationContext } from '../../lib/LocalizationContext';
import MessageSearchFileItem from '../../ui/MessageSearchFileItem';

import SendbirdUIKit from '../../index';
import useSearchStringEffect from './hooks/useSearchStringEffect';

const COMPONENT_CLASS_NAME = 'sendbird-message-search';

interface Props extends SendbirdUIKit.MessageSearchProps {
  // sendbird internal props
  stores: {
    sdkStore?: SendbirdUIKit.SdkStore,
    userStore?: SendbirdUIKit.UserStore,
  };
  config: {
    userId: string,
    isOnline: boolean,
    logger?: SendbirdUIKit.Logger,
    theme?: string,
    /* eslint-disable @typescript-eslint/no-explicit-any*/
    pubSub: any,
    disableUserProfile?: boolean,
    renderUserProfile?(): JSX.Element,
    imageCompression?: {
      compressionRate?: number,
      resizingWidth?: number | string,
      resizingHeight?: number | string,
    },
  };
}

function MessageSearch(props: Props): JSX.Element {
  const {
    // sendbird internal props
    stores,
    config,
    // message search props
    channelUrl,
    searchString,
    messageSearchQuery,
    renderSearchItem,
    onResultLoaded,
    onResultClick,
  } = props;

  // hook variables
  const { stringSet } = useContext(LocalizationContext);
  const [retryCount, setRetryCount] = useState(0); // this is a trigger flag for activating useGetSearchMessages
  const [selectedMessageId, setSelectedMessageId] = useState(0);
  const [requestString, setRequestString] = useState('');
  const [messageSearchStore, messageSearchDispathcer] = useReducer(messageSearchReducer, messageSearchInitialState);
  const {
    allMessages,
    loading,
    isInvalid,
    currentChannel,
    currentMessageSearchQuery,
    hasMoreResult,
  } = messageSearchStore;

  const getChannelName = () => {
    if (currentChannel && currentChannel.name && currentChannel.name !== 'Group Channel') {
      return currentChannel.name;
    }
    if (currentChannel && (currentChannel.name === 'Group Channel' || !currentChannel.name)) {
      return currentChannel.members.map((member) => member.nickname || stringSet.NO_NAME).join(', ');
    }
    return stringSet.NO_TITLE;
  };

  // const
  const { sdkStore } = stores;
  const { logger } = config;
  const { sdk } = sdkStore;
  const sdkInit = sdkStore.initialized;
  const scrollRef = useRef(null);
  const handleOnScroll = (e) => {
    const scrollElement = e.target;
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = scrollElement;

    if (!hasMoreResult) {
      return;
    }
    if (scrollTop + clientHeight >= scrollHeight) {
      onScroll(() => {
        // after load more searched messages
      });
    }
  };

  useSetChannel(
    { channelUrl, sdkInit },
    { sdk, logger, messageSearchDispathcer },
  );

  useSearchStringEffect({ searchString }, { setRequestString });

  useGetSearchMessages(
    { currentChannel, channelUrl, requestString, messageSearchQuery, onResultLoaded, retryCount },
    { sdk, logger, messageSearchDispathcer },
  );

  const onScroll = useScrollCallback(
    { currentMessageSearchQuery, hasMoreResult, onResultLoaded },
    { logger, messageSearchDispathcer },
  );

  const handleRetryToConnect = () => {
    setRetryCount(retryCount + 1);
  };

  if (isInvalid && searchString && requestString) {
    return (
      <div className={COMPONENT_CLASS_NAME}>
        <PlaceHolder
          type={PlaceHolderTypes.WRONG}
          retryToConnect={handleRetryToConnect}
        />
      </div>
    );
  }

  if (loading && searchString && requestString) {
    return (
      <div className={COMPONENT_CLASS_NAME}>
        <PlaceHolder type={PlaceHolderTypes.SEARCHING} />
      </div>
    );
  }

  if (!searchString) {
    return (
      <div className={COMPONENT_CLASS_NAME}>
        <PlaceHolder
          type={PlaceHolderTypes.SEARCH_IN}
          searchInString={getChannelName()}
        />
      </div>
    );
  }

  return (
    <div
      className={COMPONENT_CLASS_NAME}
      onScroll={handleOnScroll}
      ref={scrollRef}
    >
      {
        (allMessages.length > 0)
          ? (
            allMessages.map((message) => {
              if (renderSearchItem) {
                return renderSearchItem({ message, onResultClick });
              }
              if (message.messageType === 'file') {
                return (
                  <MessageSearchFileItem
                    className={`${COMPONENT_CLASS_NAME}__message-search-item`}
                    message={message}
                    key={message.messageId}
                    selected={(selectedMessageId === message.messageId)}
                    onClick={() => {
                      onResultClick(message);
                      setSelectedMessageId(message.messageId);
                    }}
                  />
                );
              }
              return (
                <MessageSearchItem
                  className={`${COMPONENT_CLASS_NAME}__message-search-item`}
                  message={message}
                  key={message.messageId}
                  selected={(selectedMessageId === message.messageId)}
                  onClick={() => {
                    onResultClick(message);
                    setSelectedMessageId(message.messageId);
                  }}
                />
              );
            })
          )
          : (
            <PlaceHolder type={PlaceHolderTypes.NO_RESULTS} />
          )
      }
    </div>
  );
}

export default widthSendbirdContext(MessageSearch);

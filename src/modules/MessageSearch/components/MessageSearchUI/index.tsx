import React, { useContext } from 'react';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';
import './index.scss';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useMessageSearchStore } from '../../context/_MessageSearchProvider';
import useMessageSearchActions from '../../context/hooks/useMessageSearchActions';

import MessageSearchItem from '../../../../ui/MessageSearchItem';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import MessageSearchFileItem from '../../../../ui/MessageSearchFileItem';
import { ClientSentMessages } from '../../../../types';

export interface MessageSearchUIProps {
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderNoString?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
  renderSearchItem?(
    {
      message,
      onResultClick,
    }: {
      message: ClientSentMessages,
      onResultClick?: (message: ClientSentMessages) => void,
    }
  ): JSX.Element;
}

export const MessageSearchUI: React.FC<MessageSearchUIProps> = ({
  renderPlaceHolderError,
  renderPlaceHolderLoading,
  renderPlaceHolderNoString,
  renderPlaceHolderEmptyList,
  renderSearchItem,
}: MessageSearchUIProps) => {
  const { state: {
    isInvalid,
    searchString,
    requestString,
    currentChannel,
    loading,
    scrollRef,
    hasMoreResult,
    onScroll,
    allMessages,
    onResultClick,
    selectedMessageId,
  } } = useMessageSearchStore();

  const {
    setSelectedMessageId,
    handleRetryToConnect,
  } = useMessageSearchActions();

  const { stringSet } = useContext(LocalizationContext);

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
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      onScroll(() => {
        // after load more searched messages
      });
    }
  };

  const getChannelName = () => {
    if (currentChannel && currentChannel?.name && currentChannel?.name !== 'Group Channel') {
      return currentChannel?.name;
    }
    if (currentChannel && (currentChannel?.name === 'Group Channel' || !currentChannel?.name)) {
      return currentChannel.members.map((member) => member.nickname || stringSet.NO_NAME).join(', ');
    }
    return stringSet.NO_TITLE;
  };

  if (isInvalid && searchString && requestString) {
    return renderPlaceHolderError?.() || (
      <div className="sendbird-message-search">
        <PlaceHolder
          type={PlaceHolderTypes.WRONG}
          retryToConnect={handleRetryToConnect}
        />
      </div>
    );
  }

  if (loading && searchString && requestString) {
    return renderPlaceHolderLoading?.() || (
      <div className="sendbird-message-search">
        <PlaceHolder type={PlaceHolderTypes.SEARCHING} />
      </div>
    );
  }

  if (!searchString) {
    return renderPlaceHolderNoString?.() || (
      <div className="sendbird-message-search">
        <PlaceHolder
          type={PlaceHolderTypes.SEARCH_IN}
          searchInString={getChannelName()}
        />
      </div>
    );
  }

  return (
    <div
      className="sendbird-message-search"
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
                    className="sendbird-message-search__message-search-item"
                    message={message as FileMessage}
                    key={message.messageId}
                    selected={(selectedMessageId === message.messageId)}
                    onClick={() => {
                      onResultClick?.(message);
                      setSelectedMessageId(message.messageId);
                    }}
                  />
                );
              }
              return (
                <MessageSearchItem
                  className="sendbird-message-search__message-search-item"
                  message={message as UserMessage}
                  key={message.messageId}
                  selected={(selectedMessageId === message.messageId)}
                  onClick={() => {
                    onResultClick?.(message);
                    setSelectedMessageId(message.messageId);
                  }}
                />
              );
            })
          )
          : renderPlaceHolderEmptyList?.() || (
            <PlaceHolder type={PlaceHolderTypes.NO_RESULTS} />
          )
      }
    </div>
  );
};

export default MessageSearchUI;

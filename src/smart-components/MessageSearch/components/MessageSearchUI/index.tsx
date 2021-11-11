import React, { useContext } from 'react';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useMessageSearch } from '../../context/MessageSearchProvider';

import MessageSearchItem from '../../../../ui/MessageSearchItem';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import MessageSearchFileItem from '../../../../ui/MessageSearchFileItem';
import { ClientSentMessages } from '../../../../types';


const COMPONENT_CLASS_NAME = 'sendbird-message-search';

export interface MessageSearchUIProps {
  renderPlaceHolderError?: (props: void) => React.ReactNode;
  renderPlaceHolderLoading?: (props: void) => React.ReactNode;
  renderPlaceHolderNoString?: (props: void) => React.ReactNode;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactNode;
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
  const {
    isInvalid,
    searchString,
    requestString,
    currentChannel,
    retryCount,
    setRetryCount,
    loading,
    scrollRef,
    hasMoreResult,
    onScroll,
    allMessages,
    onResultClick,
    selectedMessageId,
    setSelectedMessageId,
  } = useMessageSearch();

  const { stringSet } = useContext(LocalizationContext);

  const handleRetryToConnect = () => {
    setRetryCount(retryCount + 1);
  };

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
      <div className={COMPONENT_CLASS_NAME}>
        <PlaceHolder
          type={PlaceHolderTypes.WRONG}
          retryToConnect={handleRetryToConnect}
        />
      </div>
    );
  }

  if (loading && searchString && requestString) {
    return renderPlaceHolderLoading?.() || (
      <div className={COMPONENT_CLASS_NAME}>
        <PlaceHolder type={PlaceHolderTypes.SEARCHING} />
      </div>
    );
  }

  if (!searchString) {
    return renderPlaceHolderNoString?.() || (
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
          : renderPlaceHolderEmptyList?.() || (
            <PlaceHolder type={PlaceHolderTypes.NO_RESULTS} />
          )
      }
    </div>
  );
};

export default MessageSearchUI;

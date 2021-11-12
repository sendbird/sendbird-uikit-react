import React, {
  useEffect,
  useRef,
  useReducer,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import * as utils from './utils';

import { UserProfileProvider } from '../../lib/UserProfileContext';
import withSendbirdContext from '../../lib/SendbirdSdkContext';
import * as messageActionTypes from './dux/actionTypes';
import messagesInitialState from './dux/initialState';
import messagesReducer from './dux/reducers';

import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useGetChannel from './hooks/useGetChannel';
import useInitialMessagesFetch from './hooks/useInitialMessagesFetch';
import useHandleReconnect from './hooks/useHandleReconnect';
import useScrollCallback from './hooks/useScrollCallback';
import useScrollDownCallback from './hooks/useScrollDownCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useSendMessageCallback from './hooks/useSendMessageCallback';
import useSendFileMessageCallback from './hooks/useSendFileMessageCallback';
import useMemoizedEmojiListItems from './hooks/useMemoizedEmojiListItems';
import useToggleReactionCallback from './hooks/useToggleReactionCallback';
import useScrollToMessage from './hooks/useScrollToMessage';

import ConversationScroll from './components/ConversationScroll';
import Notification from './components/Notification';
import FrozenNotification from './components/FrozenNotification';
import TypingIndicator from './components/TypingIndicator';
import MessageInputWrapper from './components/MessageInputWrapper';
import ConnectionStatus from '../../ui/ConnectionStatus';
import ChatHeader from '../../ui/ChatHeader';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder';

const noop = () => { };

export const ConversationPanel = (props) => {
  const {
    channelUrl,
    stores: { sdkStore, userStore },
    config: {
      userId,
      logger,
      pubSub,
      isOnline,
      theme,
      imageCompression,
    },
    dispatchers: {
      reconnect,
    },
    queries = {},
    startingPoint,
    highlightedMessage,
    useReaction,
    // replyType,
    showSearchIcon,
    onSearchClick,
    renderChatItem,
    renderChatHeader,
    renderCustomMessage,
    renderUserProfile,
    disableUserProfile,
    renderMessageInput,
    useMessageGrouping,
    onChatHeaderActionClick,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeUpdateUserMessage,
  } = props;
  const replyType = 'NONE'; // TODO: Get back replyType for message threading
  const { sdk } = sdkStore;
  const { config } = props;
  const sdkError = sdkStore.error;
  const sdkInit = sdkStore.initialized;
  const { user } = userStore;
  if (queries.messageListQuery) {
    // eslint-disable-next-line no-console
    console.warn('messageListQuery has been deprecated, please use messageListParams instead');
  }

  useEffect(() => {
    if (renderCustomMessage) {
      // eslint-disable-next-line no-console
      console.info('The parameter type of renderCustomMessage will be changed to the object in the next minor update.');
    }
  }, []);

  const [intialTimeStamp, setIntialTimeStamp] = useState(startingPoint);
  useEffect(() => {
    setIntialTimeStamp(startingPoint);
  }, [startingPoint, channelUrl]);
  const [animatedMessageId, setAnimatedMessageId] = useState('');
  const [highLightedMessageId, setHighLightedMessageId] = useState(highlightedMessage);
  useEffect(() => {
    setHighLightedMessageId(highlightedMessage);
  }, [highlightedMessage]);
  const userFilledMessageListQuery = queries.messageListParams;
  const [quoteMessage, setQuoteMessage] = useState(null);

  const [messagesStore, messagesDispatcher] = useReducer(messagesReducer, messagesInitialState);
  const scrollRef = useRef(null);

  const {
    allMessages,
    loading,
    initialized,
    unreadCount,
    unreadSince,
    isInvalid,
    currentGroupChannel = {},
    hasMore,
    lastMessageTimeStamp,
    hasMoreToBottom,
    latestFetchedMessageTimeStamp,
    emojiContainer,
    readStatus,
  } = messagesStore;
  const { isFrozen, isBroadcast, isSuper } = currentGroupChannel;
  const { appInfo = {} } = sdk;
  const usingReaction = (
    appInfo.isUsingReaction && !isBroadcast && !isSuper && useReaction
    // TODO: Make useReaction independent from appInfo.isUsingReaction
  );

  const userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  const userDefinedRenderProfile = renderUserProfile || config.renderUserProfile;
  const showScrollBot = hasMoreToBottom;

  // TODO: emojiAllMap, emoijAllList, nicknamesMap => should be moved to messagesStore
  const emojiAllMap = useMemo(() => (
    usingReaction
      ? utils.getAllEmojisMapFromEmojiContainer(emojiContainer)
      : new Map()
  ), [emojiContainer]);
  const emojiAllList = useMemo(() => (
    usingReaction
      ? utils.getAllEmojisFromEmojiContainer(emojiContainer)
      : []
  ), [emojiContainer]);
  const nicknamesMap = useMemo(() => (
    usingReaction
      ? utils.getNicknamesMapFromMembers(currentGroupChannel.members)
      : new Map()
  ), [currentGroupChannel.members]);

  // Scrollup is default scroll for channel
  const onScrollCallback = useScrollCallback({
    currentGroupChannel, lastMessageTimeStamp, userFilledMessageListQuery, replyType,
  }, {
    hasMore,
    logger,
    messagesDispatcher,
    sdk,
  });

  const scrollToMessage = useScrollToMessage({
    setIntialTimeStamp,
    setAnimatedMessageId,
    allMessages,
  }, { logger });

  // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMoreToBottom, onScrollDownCallback -> scroll down
  // hasMore, onScrollCallback -> scroll up(default behavior)
  const onScrollDownCallback = useScrollDownCallback({
    currentGroupChannel,
    latestFetchedMessageTimeStamp,
    userFilledMessageListQuery,
    hasMoreToBottom,
    replyType,
  }, {
    logger,
    messagesDispatcher,
    sdk,
  });

  const toggleReaction = useToggleReactionCallback({ currentGroupChannel }, { logger });

  const memoizedEmojiListItems = useMemoizedEmojiListItems({
    emojiContainer, toggleReaction,
  }, {
    useReaction: usingReaction,
    logger,
    userId,
    emojiAllList,
  });

  // to create message-datasource
  // this hook sets currentGroupChannel asynchronously
  useGetChannel(
    { channelUrl, sdkInit },
    { messagesDispatcher, sdk, logger },
  );

  // Hook to handle ChannelEvents and send values to useReducer using messagesDispatcher
  useHandleChannelEvents(
    { currentGroupChannel, sdkInit, hasMoreToBottom },
    {
      messagesDispatcher,
      sdk,
      logger,
      scrollRef,
    },
  );

  // hook that fetches messages when channel changes
  // to be clear here useGetChannel sets currentGroupChannel
  // and useInitialMessagesFetch executes when currentGroupChannel changes
  // p.s This one executes on intialTimeStamp change too
  useInitialMessagesFetch({
    currentGroupChannel,
    userFilledMessageListQuery,
    intialTimeStamp,
    replyType,
  }, {
    sdk,
    logger,
    messagesDispatcher,
  });

  // handles API calls from withSendbird
  useEffect(() => {
    const subScriber = utils.pubSubHandler(channelUrl, pubSub, messagesDispatcher);
    return () => {
      utils.pubSubHandleRemover(subScriber);
    };
  }, [channelUrl, sdkInit]);

  // handling connection breaks
  useHandleReconnect({ isOnline, replyType }, {
    logger,
    sdk,
    currentGroupChannel,
    messagesDispatcher,
    userFilledMessageListQuery,
  });

  // callbacks for Message CURD actions
  const deleteMessage = useDeleteMessageCallback({ currentGroupChannel, messagesDispatcher },
    { logger });
  const updateMessage = useUpdateMessageCallback(
    { currentGroupChannel, messagesDispatcher, onBeforeUpdateUserMessage },
    { logger, sdk, pubSub },
  );
  const resendMessage = useResendMessageCallback(
    { currentGroupChannel, messagesDispatcher },
    { logger },
  );
  const [messageInputRef, onSendMessage] = useSendMessageCallback(
    { currentGroupChannel, onBeforeSendUserMessage },
    {
      sdk,
      logger,
      pubSub,
      messagesDispatcher,
    },
  );
  const [onSendFileMessage] = useSendFileMessageCallback(
    { currentGroupChannel, onBeforeSendFileMessage, imageCompression },
    {
      sdk,
      logger,
      pubSub,
      messagesDispatcher,
    },
  );

  if (!channelUrl) {
    return (<div className="sendbird-conversation"><PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} /></div>);
  }
  if (isInvalid) {
    return (<div className="sendbird-conversation"><PlaceHolder type={PlaceHolderTypes.WRONG} /></div>);
  }
  if (sdkError) {
    return (
      <div className="sendbird-conversation">
        <PlaceHolder
          type={PlaceHolderTypes.WRONG}
          retryToConnect={() => {
            logger.info('Channel: reconnecting');
            reconnect();
          }}
        />
      </div>
    );
  }
  return (
    <UserProfileProvider
      className="sendbird-conversation"
      disableUserProfile={userDefinedDisableUserProfile}
      renderUserProfile={userDefinedRenderProfile}
    >
      {
        renderChatHeader
          ? renderChatHeader({ channel: currentGroupChannel, user })
          : (
            <ChatHeader
              theme={theme}
              currentGroupChannel={currentGroupChannel}
              currentUser={user}
              showSearchIcon={showSearchIcon}
              onSearchClick={onSearchClick}
              onActionClick={onChatHeaderActionClick}
              subTitle={currentGroupChannel.members && currentGroupChannel.members.length !== 2}
              isMuted={false}
            />
          )
      }
      {
        isFrozen && (
          <FrozenNotification />
        )
      }
      {
        unreadCount > 0 && (
          <Notification
            count={unreadCount}
            onClick={() => {
              if (intialTimeStamp) {
                setIntialTimeStamp(null);
                setAnimatedMessageId(null);
                setHighLightedMessageId(null);
              } else {
                utils.scrollIntoLast();
                // there is no scroll
                if (scrollRef.current.scrollTop === 0) {
                  currentGroupChannel.markAsRead();
                  messagesDispatcher({
                    type: messageActionTypes.MARK_AS_READ,
                  });
                }
              }
            }}
            time={unreadSince}
          />
        )
      }
      {
        loading
          ? (
            <div className="sendbird-conversation">
              <PlaceHolder type={PlaceHolderTypes.LOADING} />
            </div>
          ) : (
            <ConversationScroll
              swapParams={
                sdk && sdk.getErrorFirstCallback && sdk.getErrorFirstCallback()
              }
              animatedMessageId={animatedMessageId}
              highLightedMessageId={highLightedMessageId}
              userId={userId}
              hasMore={hasMore}
              disabled={!isOnline}
              onScroll={onScrollCallback}
              onScrollDown={onScrollDownCallback}
              scrollRef={scrollRef}
              readStatus={readStatus}
              useReaction={usingReaction}
              replyType={replyType}
              allMessages={allMessages}
              scrollToMessage={scrollToMessage}
              emojiAllMap={emojiAllMap}
              membersMap={nicknamesMap}
              editDisabled={utils.isDisabledBecauseFrozen(currentGroupChannel)}
              deleteMessage={deleteMessage}
              updateMessage={updateMessage}
              resendMessage={resendMessage}
              toggleReaction={toggleReaction}
              emojiContainer={emojiContainer}
              renderChatItem={renderChatItem}
              setQuoteMessage={setQuoteMessage}
              showScrollBot={showScrollBot}
              onClickScrollBot={() => {
                setIntialTimeStamp(null);
                setAnimatedMessageId(null);
                setHighLightedMessageId(null);
              }}
              renderCustomMessage={renderCustomMessage}
              useMessageGrouping={useMessageGrouping}
              messagesDispatcher={messagesDispatcher}
              currentGroupChannel={currentGroupChannel}
              memoizedEmojiListItems={memoizedEmojiListItems}
            />
          )
      }
      <div className="sendbird-conversation__footer">
        <MessageInputWrapper
          channel={currentGroupChannel}
          user={user}
          ref={messageInputRef}
          isOnline={isOnline}
          initialized={initialized}
          quoteMessage={quoteMessage}
          onSendMessage={onSendMessage}
          onFileUpload={onSendFileMessage}
          setQuoteMessage={setQuoteMessage}
          renderMessageInput={renderMessageInput}
        />
        <div className="sendbird-conversation__footer__typing-indicator">
          <TypingIndicator className="sendbird-conversation__footer__typing-indicator__text" channelUrl={channelUrl} sb={sdk} logger={logger} />
          {
            !isOnline && (
              <ConnectionStatus sdkInit={sdkInit} sb={sdk} logger={logger} />
            )
          }
        </div>
      </div>
    </UserProfileProvider>
  );
};

ConversationPanel.propTypes = {
  channelUrl: PropTypes.string,
  stores: PropTypes.shape({
    sdkStore: PropTypes.shape({
      initialized: PropTypes.bool,
      sdk: PropTypes.shape({
        getErrorFirstCallback: PropTypes.func,
        removeChannelHandler: PropTypes.func,
        GroupChannel: PropTypes.any,
        ChannelHandler: PropTypes.any,
        addChannelHandler: PropTypes.func,
        UserMessageParams: PropTypes.any,
        FileMessageParams: PropTypes.any,
        getAllEmoji: PropTypes.func,
        appInfo: PropTypes.shape({}),
      }),
      error: PropTypes.bool,
    }),
    userStore: PropTypes.shape({
      user: PropTypes.shape({}),
    }),
  }).isRequired,
  dispatchers: PropTypes.shape({
    reconnect: PropTypes.func,
  }).isRequired,
  config: PropTypes.shape({
    disableUserProfile: PropTypes.bool,
    renderUserProfile: PropTypes.func,
    userId: PropTypes.string.isRequired,
    isOnline: PropTypes.bool.isRequired,
    theme: PropTypes.string,
    logger: PropTypes.shape({
      info: PropTypes.func,
      error: PropTypes.func,
      warning: PropTypes.func,
    }),
    pubSub: PropTypes.shape({
      subscribe: PropTypes.func,
      publish: PropTypes.func,
    }),
    imageCompression: PropTypes.shape({
      compressionRate: PropTypes.number,
      resizingWidth: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      resizingHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }),
  }).isRequired,
  queries: PropTypes.shape({
    messageListParams: PropTypes.shape({
      includeMetaArray: PropTypes.bool,
      includeParentMessageText: PropTypes.bool,
      includeReaction: PropTypes.bool,
      includeReplies: PropTypes.bool,
      includeThreadInfo: PropTypes.bool,
      limit: PropTypes.number,
      reverse: PropTypes.bool,
      senderUserIdsFilter: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  startingPoint: PropTypes.number,
  highlightedMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onBeforeSendUserMessage: PropTypes.func, // onBeforeSendUserMessage(text)
  onBeforeSendFileMessage: PropTypes.func, // onBeforeSendFileMessage(File)
  onBeforeUpdateUserMessage: PropTypes.func,
  renderChatItem: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  renderCustomMessage: PropTypes.func,
  renderMessageInput: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  renderChatHeader: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  showSearchIcon: PropTypes.bool,
  onSearchClick: PropTypes.func,
  onChatHeaderActionClick: PropTypes.func,
  useReaction: PropTypes.bool,
  // replyType: PropTypes.oneOf(['NONE', 'QUOTE_REPLY', 'THREAD']),
  disableUserProfile: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  useMessageGrouping: PropTypes.bool,
};

ConversationPanel.defaultProps = {
  channelUrl: null,
  queries: {},
  onBeforeSendUserMessage: null,
  onBeforeSendFileMessage: null,
  onBeforeUpdateUserMessage: null,
  startingPoint: null,
  highlightedMessage: null,
  renderChatItem: null,
  renderCustomMessage: null,
  renderMessageInput: null,
  renderChatHeader: null,
  useReaction: true,
  // replyType: 'NONE',
  showSearchIcon: false,
  onSearchClick: noop,
  disableUserProfile: false,
  renderUserProfile: null,
  useMessageGrouping: true,
  onChatHeaderActionClick: noop,
};

export const {
  getEmojiCategoriesFromEmojiContainer,
  getAllEmojisFromEmojiContainer,
  getEmojisFromEmojiContainer,
} = utils;

export default withSendbirdContext(ConversationPanel);

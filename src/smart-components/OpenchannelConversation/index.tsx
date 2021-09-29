import React, {
  useRef,
  useEffect,
  useReducer,
  useContext,
  useMemo,
} from 'react';
import * as utils from './utils';
import './index.scss';

import MessageInputWrapper from './components/MessageInpuetWrapper';
import FrozenChannelNotification from './components/FrozenNotification';
import OpenchannelConversationHeader from '../../ui/OpenchannelConversationHeader';
import OpenchannelConversationScroll from './components/OpenchannelConversationScroll';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder';
import { UserProfileProvider } from '../../lib/UserProfileContext';

import { OpenChannelProps } from '../../index';
import messagesReducer from './dux/reducers';
import messagesInitialState from './dux/initialState';
import * as messageActionTypes from './dux/actionTypes';
import withSendbirdContext from '../../lib/SendbirdSdkContext.jsx';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { scrollIntoLast } from './utils';
import * as topics from '../../lib/pubSub/topics';

// hooks
import useSetChannel from './hooks/useSetChannel';
import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useInitialMessagesFetch from './hooks/useInitialMessagesFetch';
import useScrollCallback from './hooks/useScrollCallback';
import useCheckScrollBottom from './hooks/useCheckScrollBottom';
import useSendMessageCallback from './hooks/useSendMessageCallback';
import useFileUploadCallback from './hooks/useFileUploadCallback';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import useResendMessageCallback from './hooks/useResendMessageCallback';

const COMPONENT_CLASS_NAME = 'sendbird-openchannel-conversation';

interface Props extends OpenChannelProps {
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

export const OpenchannelConversation = (props: Props): JSX.Element => {
  const {
    // internal props
    stores,
    config,
    // normal props
    useMessageGrouping,
    channelUrl,
    queries = {},
    disableUserProfile,
    fetchingParticipants = false, // We didn't decide to support fetching participant list
    renderCustomMessage,
    renderUserProfile,
    renderChannelTitle,
    renderMessageInput,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onChatHeaderActionClick
  } = props;

  const {
    sdkStore,
    userStore,
  } = stores;
  const {
    userId,
    isOnline,
    logger,
    pubSub,
    imageCompression,
  } = config;

  const {
    sdk
  } = sdkStore;
  const {
    user
  } = userStore;

  // hook variables
  const [messagesStore, messagesDispatcher] = useReducer(messagesReducer, messagesInitialState);
  const {
    allMessages,
    loading,
    initialized,
    currentOpenChannel,
    isInvalid,
    hasMore,
    lastMessageTimestamp,
    operators,
    bannedParticipantIds,
    mutedParticipantIds,
  } = messagesStore;
  // ref
  const messageInputRef = useRef(null); // useSendMessageCallback
  const conversationScrollRef = useRef(null); // useScrollAfterSendMessageCallback
  const { stringSet } = useContext(LocalizationContext);

  // const
  const sdkInit = sdkStore.initialized;
  const userFilledMessageListParams = queries ? queries.messageListParams: null;
  const disabled = !initialized
    || !isOnline
    || utils.isDisabledBecauseFrozen(currentOpenChannel, userId);
  // || utils.isDisabledBecauseMuted(mutedParticipantIds, userId)
  const userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  const userDefinedRenderProfile = renderUserProfile || config.renderUserProfile;

  // useMemo
  const amIBanned = useMemo(() => {
    return bannedParticipantIds.indexOf(user.userId) >= 0;
  }, [channelUrl, bannedParticipantIds, user]);
  const amIMuted = useMemo(() => {
    return mutedParticipantIds.indexOf(user.userId) >= 0;
  }, [channelUrl, mutedParticipantIds, user]);
  const amIOperator = useMemo(() => {
    return operators.map(operator => operator.userId).indexOf(user.userId) >= 0;
  }, [channelUrl, operators, user]);

  // use hooks
  useSetChannel(
    { channelUrl, sdkInit, fetchingParticipants },
    { sdk, logger, messagesDispatcher },
  );
  const checkScrollBottom = useCheckScrollBottom(
    { conversationScrollRef },
    { logger },
  );
  useHandleChannelEvents(
    { currentOpenChannel, checkScrollBottom },
    { sdk, logger, messagesDispatcher },
  );
  useInitialMessagesFetch(
    { currentOpenChannel, userFilledMessageListParams },
    { sdk, logger, messagesDispatcher },
  );
  const onScroll = useScrollCallback(
    { currentOpenChannel, lastMessageTimestamp },
    { sdk, logger, messagesDispatcher, hasMore, userFilledMessageListParams },
  );
  const handleSendMessage = useSendMessageCallback(
    { currentOpenChannel, onBeforeSendUserMessage, checkScrollBottom, messageInputRef },
    { sdk, logger, messagesDispatcher },
  );
  const handleFileUpload = useFileUploadCallback(
    { currentOpenChannel, onBeforeSendFileMessage, checkScrollBottom, imageCompression },
    { sdk, logger, messagesDispatcher },
  );
  const updateMessage = useUpdateMessageCallback(
    { currentOpenChannel, onBeforeSendUserMessage },
    { sdk, logger, messagesDispatcher },
  );
  const deleteMessage = useDeleteMessageCallback(
    { currentOpenChannel },
    { logger, messagesDispatcher },
  );
  const resendMessage = useResendMessageCallback(
    { currentOpenChannel },
    { logger, messagesDispatcher },
  );

  // handle API calls from withSendbird
  useEffect(() => {
    const subscriber = new Map();
    if (!pubSub || !pubSub.subscribe) {
      return;
    }
    subscriber.set(topics.SEND_USER_MESSAGE, pubSub.subscribe(topics.SEND_USER_MESSAGE, (msg) => {
      const { channel, message } = msg;
      scrollIntoLast();
      if (channel && (channelUrl === channel.url)) {
        messagesDispatcher({
          type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
          payload: message,
        });
      }
    }));
    subscriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (msg) => {
      const { channel, message } = msg;
      if (channel && (channelUrl === channel.url)) {
        messagesDispatcher({
          type: messageActionTypes.SENDING_MESSAGE_START,
          payload: { message, channel },
        });
      }
    }));
    subscriber.set(topics.SEND_FILE_MESSAGE, pubSub.subscribe(topics.SEND_FILE_MESSAGE, (msg) => {
      const { channel, message } = msg;
      scrollIntoLast();
      if (channel && (channelUrl === channel.url)) {
        messagesDispatcher({
          type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
          payload: { message, channel },
        });
      }
    }));
    subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
      const { channel, message, fromSelector } = msg;
      if (fromSelector && channel && (channelUrl === channel.url)) {
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_UPDATED,
          payload: { channel, message },
        });
      }
    }));
    subscriber.set(topics.DELETE_MESSAGE, pubSub.subscribe(topics.DELETE_MESSAGE, (msg) => {
      const { channel, messageId } = msg;
      if (channel && (channelUrl === channel.url)) {
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED,
          payload: messageId,
        });
      }
    }));

    return () => {
      if (subscriber) {
        subscriber.forEach((s) => {
          try {
            s.remove();
          } catch {
            //
          }
        });
      }
    };
  }, [channelUrl, sdkInit]);

  if (
    !currentOpenChannel
    || !currentOpenChannel.url
    || amIBanned
  ) {
    return (<div className={COMPONENT_CLASS_NAME}><PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} /></div>);
  }
  if (loading) {
    return (<div className={COMPONENT_CLASS_NAME}><PlaceHolder type={PlaceHolderTypes.LOADING} /></div>);
  }
  if (isInvalid) {
    return (<div className={COMPONENT_CLASS_NAME}><PlaceHolder type={PlaceHolderTypes.WRONG} /></div>);
  }

  return (
    <UserProfileProvider
      className={COMPONENT_CLASS_NAME}
      disableUserProfile={userDefinedDisableUserProfile}
      renderUserProfile={userDefinedRenderProfile}
    >
      {
        renderChannelTitle
          ? renderChannelTitle({
            channel: currentOpenChannel,
            user: user,
          })
          : (
            <OpenchannelConversationHeader
              title={currentOpenChannel.name}
              subTitle={`${utils.kFormatter(currentOpenChannel.participantCount)} ${stringSet.OPEN_CHANNEL_CONVERSATION__TITLE_PARTICIPANTS}`}
              coverImage={currentOpenChannel.coverUrl}
              onActionClick={onChatHeaderActionClick}
              amIOperator={amIOperator}
            />
          )
      }
      {
        currentOpenChannel.isFrozen && (
          <FrozenChannelNotification />
        )
      }
      <OpenchannelConversationScroll
        ref={conversationScrollRef}
        renderCustomMessage={renderCustomMessage}
        openchannel={currentOpenChannel}
        user={user}
        useMessageGrouping={useMessageGrouping}
        isOnline={isOnline}
        allMessages={allMessages}
        onScroll={onScroll}
        hasMore={hasMore}
        updateMessage={updateMessage}
        deleteMessage={deleteMessage}
        resendMessage={resendMessage}
      />
      {
        renderMessageInput
          ? (
            <div className="sendbird-openchannel-footer">
              {
                renderMessageInput({
                  channel: currentOpenChannel,
                  user: user,
                  disabled: disabled,
                })
              }
            </div>
          )
          : (
            <MessageInputWrapper
              channel={currentOpenChannel}
              user={user}
              ref={messageInputRef}
              disabled={disabled || amIMuted}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              renderMessageInput={renderMessageInput}
            />
          )
      }
    </UserProfileProvider>
  );
};

export default withSendbirdContext(OpenchannelConversation);

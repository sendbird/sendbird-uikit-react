import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback, useContext, useMemo } from 'react';
import { ThreadContext, ThreadState } from './ThreadProvider';
import { ChannelStateTypes, FileUploadInfoParams, ParentMessageStateTypes, ThreadListStateTypes } from '../types';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { EmojiContainer, User } from '@sendbird/chat';
import { compareIds, scrollIntoLast as scrollIntoLastForThread, scrollIntoLast } from './utils';
import {
  BaseMessage, FileMessage, FileMessageCreateParams, MessageMetaArray, MessageType,
  MultipleFilesMessage, type MultipleFilesMessageCreateParams,
  ReactionEvent, SendingStatus, ThreadedMessageListParams, type UploadableFileInfo,
  UserMessage,
  UserMessageCreateParams, UserMessageUpdateParams,
} from '@sendbird/chat/message';
import { NEXT_THREADS_FETCH_SIZE, PREV_THREADS_FETCH_SIZE } from '../consts';
import useToggleReactionCallback from './hooks/useToggleReactionsCallback';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { SendMessageParams } from './hooks/useSendUserMessageCallback';
import topics, { PUBSUB_TOPICS, PublishingModuleType } from '../../../lib/pubSub/topics';
import {
  META_ARRAY_MESSAGE_TYPE_KEY, META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  SCROLL_BOTTOM_DELAY_FOR_SEND,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../utils/consts';
import { shouldPubSubPublishToThread } from '../../internalInterfaces';

function hasReqId<T extends object>(
  message: T,
): message is T & { reqId: string } {
  return 'reqId' in message;
}

interface LocalFileMessage extends FileMessage {
  localUrl: string;
  file: File;
}

function getThreadMessageListParams(params?: Partial<ThreadedMessageListParams>): ThreadedMessageListParams {
  return {
    prevResultSize: PREV_THREADS_FETCH_SIZE,
    nextResultSize: NEXT_THREADS_FETCH_SIZE,
    includeMetaArray: true,
    ...params,
  };
}

const useThread = () => {
  const store = useContext(ThreadContext);
  if (!store) throw new Error('useCreateChannel must be used within a CreateChannelProvider');

  // SendbirdStateContext config
  const { stores, config } = useSendbirdStateContext();
  const { logger, pubSub } = config;
  const isMentionEnabled = config.groupChannel.enableMention;
  const isReactionEnabled = config.groupChannel.enableReactions;

  const state: ThreadState = useSyncExternalStore(store.subscribe, store.getState);
  const {
    message,
    parentMessage,
    currentChannel,
    threadListState,
    allThreadMessages,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
  } = state;

  const toggleReaction = useToggleReactionCallback({ currentChannel }, { logger });

  const sendMessage = useCallback((props: SendMessageParams) => {
    const {
      message,
      quoteMessage,
      mentionTemplate,
      mentionedUsers,
    } = props;

    const createDefaultParams = () => {
      const params = {} as UserMessageCreateParams;
      params.message = message;
      const mentionedUsersLength = mentionedUsers?.length || 0;
      if (isMentionEnabled && mentionedUsersLength) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate && mentionedUsersLength) {
        params.mentionedMessageTemplate = mentionTemplate;
      }
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };

    const params = onBeforeSendUserMessage?.(message, quoteMessage) ?? createDefaultParams();
    logger.info('Thread | useSendUserMessageCallback: Sending user message start.', params);

    if (currentChannel?.sendUserMessage) {
      currentChannel?.sendUserMessage(params)
        .onPending((pendingMessage) => {
          actions.sendMessageStart(pendingMessage as SendableMessageType);
        })
        .onFailed((error, message) => {
          logger.info('Thread | useSendUserMessageCallback: Sending user message failed.', { message, error });
          actions.sendMessageFailure(message as SendableMessageType);
        })
        .onSucceeded((message) => {
          logger.info('Thread | useSendUserMessageCallback: Sending user message succeeded.', message);
          // because Thread doesn't subscribe SEND_USER_MESSAGE
          pubSub.publish(topics.SEND_USER_MESSAGE, {
            channel: currentChannel,
            message: message as UserMessage,
            publishingModules: [PublishingModuleType.THREAD],
          });
        });
    }
  }, [isMentionEnabled, currentChannel]);

  const sendFileMessage = useCallback((file, quoteMessage): Promise<FileMessage> => {
    return new Promise((resolve, reject) => {
      const createParamsDefault = () => {
        const params = {} as FileMessageCreateParams;
        params.file = file;
        if (quoteMessage) {
          params.isReplyToChannel = true;
          params.parentMessageId = quoteMessage.messageId;
        }
        return params;
      };
      const params = onBeforeSendFileMessage?.(file, quoteMessage) ?? createParamsDefault();
      logger.info('Thread | useSendFileMessageCallback: Sending file message start.', params);

      currentChannel?.sendFileMessage(params)
        .onPending((pendingMessage) => {
          actions.sendMessageStart({
            ...pendingMessage,
            url: URL.createObjectURL(file),
            // pending thumbnail message seems to be failed
            // @ts-ignore
            requestState: 'pending',
            isUserMessage: pendingMessage.isUserMessage,
            isFileMessage: pendingMessage.isFileMessage,
            isAdminMessage: pendingMessage.isAdminMessage,
            isMultipleFilesMessage: pendingMessage.isMultipleFilesMessage,
          });
          setTimeout(() => scrollIntoLast(), SCROLL_BOTTOM_DELAY_FOR_SEND);
        })
        .onFailed((error, message) => {
          (message as LocalFileMessage).localUrl = URL.createObjectURL(file);
          (message as LocalFileMessage).file = file;
          logger.info('Thread | useSendFileMessageCallback: Sending file message failed.', { message, error });
          actions.sendMessageFailure(message as SendableMessageType);
          reject(error);
        })
        .onSucceeded((message) => {
          logger.info('Thread | useSendFileMessageCallback: Sending file message succeeded.', message);
          pubSub.publish(topics.SEND_FILE_MESSAGE, {
            channel: currentChannel,
            message: message as FileMessage,
            publishingModules: [PublishingModuleType.THREAD],
          });
          resolve(message as FileMessage);
        });
    });
  }, [currentChannel]);

  const sendVoiceMessage = useCallback((file: File, duration: number, quoteMessage: SendableMessageType) => {
    const messageParams: FileMessageCreateParams = (
      onBeforeSendVoiceMessage
      && typeof onBeforeSendVoiceMessage === 'function'
    )
      ? onBeforeSendVoiceMessage(file, quoteMessage)
      : {
        file,
        fileName: VOICE_MESSAGE_FILE_NAME,
        mimeType: VOICE_MESSAGE_MIME_TYPE,
        metaArrays: [
          new MessageMetaArray({
            key: META_ARRAY_VOICE_DURATION_KEY,
            value: [`${duration}`],
          }),
          new MessageMetaArray({
            key: META_ARRAY_MESSAGE_TYPE_KEY,
            value: [META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
          }),
        ],
      };
    if (quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }
    logger.info('Thread | useSendVoiceMessageCallback:  Start sending voice message', messageParams);
    currentChannel?.sendFileMessage(messageParams)
      .onPending((pendingMessage) => {
        actions.sendMessageStart({
          /* pubSub is used instead of messagesDispatcher
            to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
          // TODO: remove data pollution
          ...pendingMessage,
          url: URL.createObjectURL(file),
          // pending thumbnail message seems to be failed
          // @ts-ignore
          requestState: 'pending',
          isUserMessage: pendingMessage.isUserMessage,
          isFileMessage: pendingMessage.isFileMessage,
          isAdminMessage: pendingMessage.isAdminMessage,
          isMultipleFilesMessage: pendingMessage.isMultipleFilesMessage,
        });
        setTimeout(() => scrollIntoLast(), SCROLL_BOTTOM_DELAY_FOR_SEND);
      })
      .onFailed((error, message) => {
        (message as LocalFileMessage).localUrl = URL.createObjectURL(file);
        (message as LocalFileMessage).file = file;
        logger.info('Thread | useSendVoiceMessageCallback: Sending voice message failed.', { message, error });
        actions.sendMessageFailure(message as SendableMessageType);
      })
      .onSucceeded((message) => {
        logger.info('Thread | useSendVoiceMessageCallback: Sending voice message succeeded.', message);
        pubSub.publish(topics.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message: message as FileMessage,
          publishingModules: [PublishingModuleType.THREAD],
        });
      });
  }, [
    currentChannel,
    onBeforeSendVoiceMessage,
  ]);

  const sendMultipleFilesMessage = useCallback((
    files: Array<File>,
    quoteMessage?: SendableMessageType,
  ): Promise<MultipleFilesMessage> => {
    return new Promise((resolve, reject) => {
      if (!currentChannel) {
        logger.warning('Channel: Sending MFm failed, because currentChannel is null.', { currentChannel });
        reject();
      }
      if (files.length <= 1) {
        logger.warning('Channel: Sending MFM failed, because there are no multiple files.', { files });
        reject();
      }
      let messageParams: MultipleFilesMessageCreateParams = {
        fileInfoList: files.map((file: File): UploadableFileInfo => ({
          file,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        })),
      };
      if (quoteMessage) {
        messageParams.isReplyToChannel = true;
        messageParams.parentMessageId = quoteMessage.messageId;
      }
      if (typeof onBeforeSendMultipleFilesMessage === 'function') {
        messageParams = onBeforeSendMultipleFilesMessage(files, quoteMessage);
      }
      logger.info('Channel: Start sending MFM', { messageParams });
      try {
        currentChannel?.sendMultipleFilesMessage(messageParams)
          .onFileUploaded((requestId, index, uploadableFileInfo: UploadableFileInfo, error) => {
            logger.info('Channel: onFileUploaded during sending MFM', {
              requestId,
              index,
              error,
              uploadableFileInfo,
            });
            pubSub.publish(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, {
              response: {
                channelUrl: currentChannel.url,
                requestId,
                index,
                uploadableFileInfo,
                error,
              },
              publishingModules: [PublishingModuleType.THREAD],
            });
          })
          .onPending((pendingMessage: MultipleFilesMessage) => {
            logger.info('Channel: in progress of sending MFM', { pendingMessage, fileInfoList: messageParams.fileInfoList });
            pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_START, {
              message: pendingMessage,
              channel: currentChannel,
              publishingModules: [PublishingModuleType.THREAD],
            });
            setTimeout(() => {
              if (shouldPubSubPublishToThread([PublishingModuleType.THREAD])) {
                scrollIntoLastForThread(0);
              }
            }, SCROLL_BOTTOM_DELAY_FOR_SEND);
          })
          .onFailed((error, failedMessage: MultipleFilesMessage) => {
            logger.error('Channel: Sending MFM failed.', { error, failedMessage });
            pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, {
              channel: currentChannel,
              message: failedMessage,
              publishingModules: [PublishingModuleType.THREAD],
              error,
            });
            reject(error);
          })
          .onSucceeded((succeededMessage: MultipleFilesMessage) => {
            logger.info('Channel: Sending voice message success!', { succeededMessage });
            pubSub.publish(PUBSUB_TOPICS.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message: succeededMessage,
              publishingModules: [PublishingModuleType.THREAD],
            });
            resolve(succeededMessage);
          });
      } catch (error) {
        logger.error('Channel: Sending MFM failed.', { error });
        reject(error);
      }
    });
  }, [
    currentChannel,
    onBeforeSendMultipleFilesMessage,
  ]);

  const resendMessage = useCallback((failedMessage: SendableMessageType) => {
    if ((failedMessage as SendableMessageType)?.isResendable) {
      logger.info('Thread | useResendMessageCallback: Resending failedMessage start.', failedMessage);
      if (failedMessage?.isUserMessage?.() || failedMessage?.messageType === MessageType.USER) {
        try {
          currentChannel?.resendMessage(failedMessage as UserMessage)
            .onPending((message) => {
              logger.info('Thread | useResendMessageCallback: Resending user message started.', message);
              actions.resendMessageStart(message);
            })
            .onSucceeded((message) => {
              logger.info('Thread | useResendMessageCallback: Resending user message succeeded.', message);
              actions.sendMessageSuccess(message);
              pubSub.publish(topics.SEND_USER_MESSAGE, {
                channel: currentChannel,
                message: message,
                publishingModules: [PublishingModuleType.THREAD],
              });
            })
            .onFailed((error) => {
              logger.warning('Thread | useResendMessageCallback: Resending user message failed.', error);
              failedMessage.sendingStatus = SendingStatus.FAILED;
              actions.sendMessageFailure(failedMessage);
            });
        } catch (err) {
          logger.warning('Thread | useResendMessageCallback: Resending user message failed.', err);
          failedMessage.sendingStatus = SendingStatus.FAILED;
          actions.sendMessageFailure(failedMessage);
        }
      } else if (failedMessage?.isFileMessage?.()) {
        try {
          currentChannel?.resendMessage?.(failedMessage as FileMessage)
            .onPending((message) => {
              logger.info('Thread | useResendMessageCallback: Resending file message started.', message);
              actions.resendMessageStart(message);
            })
            .onSucceeded((message) => {
              logger.info('Thread | useResendMessageCallback: Resending file message succeeded.', message);
              actions.sendMessageSuccess(message);
              pubSub.publish(topics.SEND_FILE_MESSAGE, {
                channel: currentChannel,
                message: failedMessage,
                publishingModules: [PublishingModuleType.THREAD],
              });
            })
            .onFailed((error) => {
              logger.warning('Thread | useResendMessageCallback: Resending file message failed.', error);
              failedMessage.sendingStatus = SendingStatus.FAILED;
              actions.sendMessageFailure(failedMessage);
            });
        } catch (err) {
          logger.warning('Thread | useResendMessageCallback: Resending file message failed.', err);
          failedMessage.sendingStatus = SendingStatus.FAILED;
          actions.sendMessageFailure(failedMessage);
        }
      } else if (failedMessage?.isMultipleFilesMessage?.()) {
        try {
          currentChannel?.resendMessage?.(failedMessage as MultipleFilesMessage)
            .onPending((message) => {
              logger.info('Thread | useResendMessageCallback: Resending multiple files message started.', message);
              actions.resendMessageStart(message);
            })
            .onFileUploaded((requestId, index, uploadableFileInfo: UploadableFileInfo, error) => {
              logger.info('Thread | useResendMessageCallback: onFileUploaded during resending multiple files message.', {
                requestId,
                index,
                error,
                uploadableFileInfo,
              });
              pubSub.publish(topics.ON_FILE_INFO_UPLOADED, {
                response: {
                  channelUrl: currentChannel.url,
                  requestId,
                  index,
                  uploadableFileInfo,
                  error,
                },
                publishingModules: [PublishingModuleType.THREAD],
              });
            })
            .onSucceeded((message: MultipleFilesMessage) => {
              logger.info('Thread | useResendMessageCallback: Resending MFM succeeded.', message);
              actions.sendMessageSuccess(message);
              pubSub.publish(topics.SEND_FILE_MESSAGE, {
                channel: currentChannel,
                message,
                publishingModules: [PublishingModuleType.THREAD],
              });
            })
            .onFailed((error, message) => {
              logger.warning('Thread | useResendMessageCallback: Resending MFM failed.', error);
              actions.sendMessageFailure(message);
            });
        } catch (err) {
          logger.warning('Thread | useResendMessageCallback: Resending MFM failed.', err);
          actions.sendMessageFailure(failedMessage);
        }
      } else {
        logger.warning('Thread | useResendMessageCallback: Message is not resendable.', failedMessage);
        failedMessage.sendingStatus = SendingStatus.FAILED;
        actions.sendMessageFailure(failedMessage);
      }
    }
  }, [currentChannel]);

  const anchorMessage = message?.messageId !== parentMessage?.messageId ? message || undefined : undefined;
  const timestamp = anchorMessage?.createdAt || 0;
  const oldestMessageTimeStamp = allThreadMessages[0]?.createdAt || 0;
  const latestMessageTimeStamp = allThreadMessages[allThreadMessages.length - 1]?.createdAt || 0;

  const initializeThreadFetcher = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      const staleParentMessage = parentMessage;

      if (!stores.sdkStore.initialized || !staleParentMessage) return;

      actions.initializeThreadListStart();

      try {
        const params = getThreadMessageListParams({ includeReactions: isReactionEnabled });
        logger.info('Thread | useGetThreadList: Initialize thread list start.', { timestamp, params });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(timestamp, params);
        logger.info('Thread | useGetThreadList: Initialize thread list succeeded.', { staleParentMessage, threadedMessages });
        actions.initializeThreadListSuccess(parentMessage, anchorMessage, threadedMessages);
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetThreadList: Initialize thread list failed.', error);
        actions.initializeThreadListFailure();
      }
    },
    [stores.sdkStore.initialized, parentMessage, anchorMessage, isReactionEnabled],
  );

  const fetchPrevThreads = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      const staleParentMessage = parentMessage;

      if (threadListState !== ThreadListStateTypes.INITIALIZED || oldestMessageTimeStamp === 0 || !staleParentMessage) return;

      actions.getPrevMessagesStart();

      try {
        const params = getThreadMessageListParams({ nextResultSize: 0, includeReactions: isReactionEnabled });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(oldestMessageTimeStamp, params);

        logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads succeeded.', { parentMessage, threadedMessages });
        actions.getPrevMessagesSuccess(threadedMessages as CoreMessageType[]);
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads failed.', error);
        actions.getPrevMessagesFailure();
      }
    },
    [threadListState, oldestMessageTimeStamp, isReactionEnabled, parentMessage],
  );

  const fetchNextThreads = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      const staleParentMessage = parentMessage;

      if (threadListState !== ThreadListStateTypes.INITIALIZED || latestMessageTimeStamp === 0 || !staleParentMessage) return;

      actions.getNextMessagesStart();

      try {
        const params = getThreadMessageListParams({ prevResultSize: 0, includeReactions: isReactionEnabled });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(latestMessageTimeStamp, params);
        logger.info('Thread | useGetNextThreadsCallback: Fetch next threads succeeded.', { parentMessage, threadedMessages });
        actions.getNextMessagesSuccess(threadedMessages as CoreMessageType[]);
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetNextThreadsCallback: Fetch next threads failed.', error);
        actions.getNextMessagesFailure();
      }
    },
    [threadListState, latestMessageTimeStamp, isReactionEnabled, parentMessage],
  );

  const updateMessage = useCallback((props: {
    messageId: number;
    message: string;
    mentionedUsers?: User[];
    mentionTemplate?: string;
  }) => {
    const {
      messageId,
      message,
      mentionedUsers,
      mentionTemplate,
    } = props;

    const createParamsDefault = () => {
      const params = {} as UserMessageUpdateParams;
      params.message = message;
      if (isMentionEnabled && mentionedUsers && mentionedUsers?.length > 0) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate) {
        params.mentionedMessageTemplate = mentionTemplate;
      } else {
        params.mentionedMessageTemplate = message;
      }
      return params;
    };

    const params = createParamsDefault();
    logger.info('Thread | useUpdateMessageCallback: Message update start.', params);

    currentChannel?.updateUserMessage?.(messageId, params)
      .then((message: UserMessage) => {
        logger.info('Thread | useUpdateMessageCallback: Message update succeeded.', message);
        actions.onMessageUpdated(currentChannel, message);
        pubSub.publish(
          topics.UPDATE_USER_MESSAGE,
          {
            fromSelector: true,
            channel: currentChannel,
            message: message,
            publishingModules: [PublishingModuleType.THREAD],
          },
        );
      });
  }, [currentChannel, isMentionEnabled]);

  const deleteMessage = useCallback((message: SendableMessageType): Promise<void> => {
    logger.info('Thread | useDeleteMessageCallback: Deleting message.', message);
    const { sendingStatus } = message;
    return new Promise((resolve, reject) => {
      logger.info('Thread | useDeleteMessageCallback: Deleting message requestState:', sendingStatus);
      // Message is only on local
      if (sendingStatus === 'failed' || sendingStatus === 'pending') {
        logger.info('Thread | useDeleteMessageCallback: Deleted message from local:', message);
        actions.onMessageDeletedByReqId(message.reqId);
        resolve();
      }

      logger.info('Thread | useDeleteMessageCallback: Deleting message from remote:', sendingStatus);
      currentChannel?.deleteMessage?.(message)
        .then(() => {
          logger.info('Thread | useDeleteMessageCallback: Deleting message success!', message);
          actions.onMessageDeleted(currentChannel, message.messageId);
          resolve();
        })
        .catch((err) => {
          logger.warning('Thread | useDeleteMessageCallback: Deleting message failed!', err);
          reject(err);
        });
    });
  }, [currentChannel]);

  const actions = useMemo(() => ({
    setCurrentUserId: (currentUserId: string) => store.setState(state => ({
      ...state,
      currentUserId: currentUserId,
    })),

    getChannelStart: () => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.LOADING,
      currentChannel: null,
    })),

    getChannelSuccess: (groupChannel: GroupChannel) => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.INITIALIZED,
      currentChannel: groupChannel,
      // only support in normal group channel
      isMuted: groupChannel?.members?.find((member) => member?.userId === state.currentUserId)?.isMuted || false,
      isChannelFrozen: groupChannel?.isFrozen || false,
    })),

    getChannelFailure: () => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.INVALID,
      currentChannel: null,
    })),

    getParentMessageStart: () => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.LOADING,
      parentMessage: null,
    })),

    getParentMessageSuccess: (parentMessage: SendableMessageType) => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.INITIALIZED,
      parentMessage: parentMessage,
    })),

    getParentMessageFailure: () => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.INVALID,
      parentMessage: null,
    })),

    setEmojiContainer: (emojiContainer: EmojiContainer) => store.setState(state => ({
      ...state,
      emojiContainer: emojiContainer,
    })),

    onMessageReceived: (channel: GroupChannel, message: SendableMessageType) => store.setState(state => {
      if (
        state.currentChannel?.url !== channel?.url
        || state.hasMoreNext
        || message?.parentMessage?.messageId !== state?.parentMessage?.messageId
      ) {
        return state;
      }

      const isAlreadyReceived = state.allThreadMessages.findIndex((m) => (
        m.messageId === message.messageId
      )) > -1;

      return {
        ...state,
        parentMessage: state.parentMessage?.messageId === message?.messageId ? message : state.parentMessage,
        allThreadMessages: isAlreadyReceived
          ? state.allThreadMessages.map((m) => (
            m.messageId === message.messageId ? message : m
          ))
          : [
            ...state.allThreadMessages.filter((m) => (m as SendableMessageType)?.reqId !== message?.reqId),
            message,
          ],
      };
    }),

    onMessageUpdated: (channel: GroupChannel, message: SendableMessageType) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url) {
        return state;
      }

      return {
        ...state,
        parentMessage: state.parentMessage?.messageId === message?.messageId
          ? message
          : state.parentMessage,
        allThreadMessages: state.allThreadMessages?.map((msg) => (
          (msg?.messageId === message?.messageId) ? message : msg
        )),
      };
    }),

    onMessageDeleted: (channel: GroupChannel, messageId: number) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url) {
        return state;
      }
      if (state?.parentMessage?.messageId === messageId) {
        return {
          ...state,
          parentMessage: null,
          parentMessageState: ParentMessageStateTypes.NIL,
          allThreadMessages: [],
        };
      }
      return {
        ...state,
        allThreadMessages: state.allThreadMessages?.filter((msg) => (
          msg?.messageId !== messageId
        )),
        localThreadMessages: state.localThreadMessages?.filter((msg) => (
          msg?.messageId !== messageId
        )),
      };
    }),

    onMessageDeletedByReqId: (reqId: string | number) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: state.localThreadMessages.filter((m) => (
          !compareIds((m as SendableMessageType).reqId, reqId)
        )),
      };
    }),

    onReactionUpdated: (reactionEvent: ReactionEvent) => store.setState(state => {
      if (state?.parentMessage?.messageId === reactionEvent?.messageId) {
        state.parentMessage?.applyReactionEvent?.(reactionEvent);
      }
      return {
        ...state,
        allThreadMessages: state.allThreadMessages.map((m) => {
          if (reactionEvent?.messageId === m?.messageId) {
            m?.applyReactionEvent?.(reactionEvent);
            return m;
          }
          return m;
        }),
      };
    }),

    onUserMuted: (channel: GroupChannel, user: User) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      return {
        ...state,
        isMuted: true,
      };
    }),

    onUserUnmuted: (channel: GroupChannel, user: User) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      return {
        ...state,
        isMuted: false,
      };
    }),

    onUserBanned: () => store.setState(state => {
      return {
        ...state,
        channelState: ChannelStateTypes.NIL,
        threadListState: ThreadListStateTypes.NIL,
        parentMessageState: ParentMessageStateTypes.NIL,
        currentChannel: null,
        parentMessage: null,
        allThreadMessages: [],
        hasMorePrev: false,
        hasMoreNext: false,
      };
    }),

    onUserUnbanned: () => store.setState(state => {
      return {
        ...state,
      };
    }),

    onUserLeft: () => store.setState(state => {
      return {
        ...state,
        channelState: ChannelStateTypes.NIL,
        threadListState: ThreadListStateTypes.NIL,
        parentMessageState: ParentMessageStateTypes.NIL,
        currentChannel: null,
        parentMessage: null,
        allThreadMessages: [],
        hasMorePrev: false,
        hasMoreNext: false,
      };
    }),

    onChannelFrozen: () => store.setState(state => {
      return {
        ...state,
        isChannelFrozen: true,
      };
    }),

    onChannelUnfrozen: () => store.setState(state => {
      return {
        ...state,
        isChannelFrozen: false,
      };
    }),

    onOperatorUpdated: (channel: GroupChannel) => store.setState(state => {
      if (channel?.url === state.currentChannel?.url) {
        return {
          ...state,
          currentChannel: channel,
        };
      }
      return state;
    }),

    onTypingStatusUpdated: (channel: GroupChannel, typingMembers: Member[]) => store.setState(state => {
      if (!compareIds(channel.url, state.currentChannel?.url)) {
        return state;
      }
      return {
        ...state,
        typingMembers,
      };
    }),

    sendMessageStart: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: [
          ...state.localThreadMessages,
          message,
        ],
      };
    }),

    sendMessageSuccess: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        allThreadMessages: [
          ...state.allThreadMessages.filter((m) => (
            !compareIds((m as UserMessage)?.reqId, message?.reqId)
          )),
          message,
        ],
        localThreadMessages: state.localThreadMessages.filter((m) => (
          !compareIds((m as UserMessage)?.reqId, message?.reqId)
        )),
      };
    }),

    sendMessageFailure: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: state.localThreadMessages.map((m) => (
          compareIds((m as UserMessage)?.reqId, message?.reqId)
            ? message
            : m
        )),
      };
    }),

    resendMessageStart: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: state.localThreadMessages.map((m) => (
          compareIds((m as UserMessage)?.reqId, message?.reqId)
            ? message
            : m
        )),
      };
    }),

    onFileInfoUpdated: ({
      channelUrl,
      requestId,
      index,
      uploadableFileInfo,
      error,
    }: FileUploadInfoParams) => store.setState(state => {
      if (!compareIds(channelUrl, state.currentChannel?.url)) {
        return state;
      }
      /**
       * We don't have to do anything here because
       * onFailed() will be called so handle error there instead.
       */
      if (error) return state;
      const { localThreadMessages } = state;
      const messageToUpdate = localThreadMessages.find((message) => compareIds(hasReqId(message) && message.reqId, requestId),
      );
      const fileInfoList = (messageToUpdate as MultipleFilesMessage)
        .messageParams?.fileInfoList;
      if (Array.isArray(fileInfoList)) {
        fileInfoList[index] = uploadableFileInfo;
      }
      return {
        ...state,
        localThreadMessages,
      };
    }),

    initializeThreadListStart: () => store.setState(state => {
      return {
        ...state,
        threadListState: ThreadListStateTypes.LOADING,
        allThreadMessages: [],
      };
    }),

    initializeThreadListSuccess: (parentMessage: BaseMessage, anchorMessage: SendableMessageType, threadedMessages: BaseMessage[]) => store.setState(state => {
      const anchorMessageCreatedAt = (!anchorMessage?.messageId) ? parentMessage?.createdAt : anchorMessage?.createdAt;
      const anchorIndex = threadedMessages.findIndex((message) => message?.createdAt > anchorMessageCreatedAt);
      const prevThreadMessages = anchorIndex > -1 ? threadedMessages.slice(0, anchorIndex) : threadedMessages;
      const anchorThreadMessage = anchorMessage?.messageId ? [anchorMessage] : [];
      const nextThreadMessages = anchorIndex > -1 ? threadedMessages.slice(anchorIndex) : [];
      return {
        ...state,
        threadListState: ThreadListStateTypes.INITIALIZED,
        hasMorePrev: anchorIndex === -1 || anchorIndex === PREV_THREADS_FETCH_SIZE,
        hasMoreNext: threadedMessages.length - anchorIndex === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [prevThreadMessages, anchorThreadMessage, nextThreadMessages].flat() as CoreMessageType[],
      };
    }),

    initializeThreadListFailure: () => store.setState(state => {
      return {
        ...state,
        threadListState: ThreadListStateTypes.LOADING,
        allThreadMessages: [],
      };
    }),

    getPrevMessagesStart: () => store.setState(state => {
      return {
        ...state,
      };
    }),

    getPrevMessagesSuccess: (threadedMessages: CoreMessageType[]) => store.setState(state => {
      return {
        ...state,
        hasMorePrev: threadedMessages.length === PREV_THREADS_FETCH_SIZE,
        allThreadMessages: [...threadedMessages, ...state.allThreadMessages],
      };
    }),

    getPrevMessagesFailure: () => store.setState(state => {
      return {
        ...state,
        hasMorePrev: false,
      };
    }),

    getNextMessagesStart: () => store.setState(state => {
      return {
        ...state,
      };
    }),

    getNextMessagesSuccess: (threadedMessages: CoreMessageType[]) => store.setState(state => {
      return {
        ...state,
        hasMoreNext: threadedMessages.length === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [...state.allThreadMessages, ...threadedMessages],
      };
    }),

    getNextMessagesFailure: () => store.setState(state => {
      return {
        ...state,
        hasMoreNext: false,
      };
    }),

    toggleReaction,
    sendMessage,
    sendFileMessage,
    sendVoiceMessage,
    sendMultipleFilesMessage,
    resendMessage,
    updateMessage,
    deleteMessage,
    initializeThreadFetcher,
    fetchPrevThreads,
    fetchNextThreads,

  }), [store]);

  return { state, actions };
};

export default useThread;

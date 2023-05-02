import {
  mockMessage1,
  generateMockMessage,
  generateMockChannel,
} from '../data.mock';
import * as actionTypes from '../actionTypes';
import reducers from '../reducers';
import initialState from '../initialState';
import uuid from '../../../../../utils/uuid';

const randomBoolean = () => Math.random() >= 0.5;
describe('Messages-Reducers', () => {
  const stateWithCurrentChannel = {
    ...initialState,
    currentGroupChannel: { url: generateMockChannel().currentGroupChannel.url },
  };
  it('should setloading true FETCH_INITIAL_MESSAGES_START', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.FETCH_INITIAL_MESSAGES_START,
    });
    expect(nextState.loading).toEqual(true);
  });

  // https://sendbird.atlassian.net/browse/UIKIT-2158
  it('should check if ITNITAL_LOADING state is true', () => {
    expect(initialState.loading).toEqual(true);
  });

  it('should initialize messages FETCH_INITIAL_MESSAGES_SUCCESS', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(stateWithCurrentChannel, {
      type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: mockData.allMessages,
      },
    });
    expect(nextState.loading).toEqual(false);
    expect(nextState.initialized).toEqual(true);
    expect(nextState.hasMorePrev).toEqual(true);
    expect(nextState.hasMoreNext).toEqual(true);
    expect(nextState.oldestMessageTimeStamp).toEqual(mockData.allMessages[0].createdAt);
    expect(nextState.latestMessageTimeStamp).toEqual(mockData.allMessages[mockData.allMessages.length - 1].createdAt);
    expect(nextState.allMessages).toEqual(mockData.allMessages);
  });

  it('should append previous messages FETCH_PREV_MESSAGES_SUCCESS', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: [mockMessage1],
      }
    });
    expect(nextState.loading).toEqual(false);
    expect(nextState.initialized).toEqual(true);
    expect(nextState.hasMorePrev).toEqual(false); // Because messages.length doesn't match to the query size
    expect(nextState.hasMoreNext).toEqual(mockData.hasMoreNext);
    expect(nextState.oldestMessageTimeStamp).toEqual(mockMessage1.createdAt);
    expect(nextState.oldestMessageTimeStamp).not.toEqual(mockData.allMessages[0].createdAt);
    expect(nextState.latestMessageTimeStamp).toEqual(mockData.allMessages[mockData.allMessages.length - 1].createdAt);
  });

  it('should append next messages FETCH_NEXT_MESSAGES_SUCCESS', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: [mockMessage1],
      }
    });
    expect(nextState.loading).toEqual(false);
    expect(nextState.initialized).toEqual(true);
    expect(nextState.hasMorePrev).toEqual(mockData.hasMorePrev);
    expect(nextState.hasMoreNext).toEqual(false);
    expect(nextState.oldestMessageTimeStamp).toEqual(mockData.allMessages[0].createdAt);
    expect(nextState.latestMessageTimeStamp).toEqual(mockMessage1.createdAt);
    expect(nextState.latestMessageTimeStamp).not.toEqual(mockData.allMessages[mockData.allMessages.length - 1].createdAt);
  });

  it('should set pending message on SEND_MESSAGEGE_START', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.SEND_MESSAGEGE_START,
      payload: mockMessage1,
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length + 1);
    expect(nextState.allMessages[nextState.allMessages.length - 1]).toEqual(mockMessage1);
  });

  it('should handle SEND_MESSAGEGE_SUCESS', () => {
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    currentState.allMessages[2].status = 'failed';
    expect(currentState.allMessages[2].status).toEqual('failed');
    const succededMessage = {
      ...currentState.allMessages[2],
      status: 'success',
    };
    const nextState = reducers(currentState, {
      type: actionTypes.SEND_MESSAGEGE_SUCESS,
      payload: succededMessage,
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
    expect(nextState.allMessages[nextState.allMessages.length - 1].status).toEqual('success');
  });

  it('should append message to end of list ON_MESSAGE_RECEIVED', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { message: mockMessage1, channel: { url: mockMessage1.channelUrl } },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length + 1);
    expect(nextState.allMessages[nextState.allMessages.length - 1]).toEqual(mockMessage1);
  });

  it('should not add message when get overlap message ON_MESSAGE_RECEIVED', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { message: mockData.allMessages[0], channel: { url: mockMessage1.channelUrl } },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
  });

  it('should update message if present on list ON_MESSAGE_UPDATED', () => {
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    currentState.allMessages[2].status = 'failed';

    const updatedMessage = {
      ...currentState.allMessages[2],
      status: 'updated',
    };

    const nextState = reducers(currentState, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: currentState.currentGroupChannel,
        message: updatedMessage,
      },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
    expect(nextState.allMessages[nextState.allMessages.length - 1].status).toEqual('updated');
  });

  it('should not update message if the message is not on the list ON_MESSAGE_UPDATED', () => {
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updatedMessage = {
      ...mockMessage1,
      status: 'updated',
    };

    const nextState = reducers(mockData, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: currentState.currentGroupChannel,
        message: updatedMessage,
      },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
    expect(nextState.allMessages.find(m => m.messageId === updatedMessage.messageId)).toBeUndefined();
  });

  it('should update threadInfo of message on ON_MESSAGE_THREAD_INFO_UPDATED', () => {
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updateEvent = {
      channelUrl: currentState.currentGroupChannel.url,
      targetMessageId: currentState.allMessages[0].messageId,
      threadInfo: { replyCount: 1, updatedAt: 1, mostRepliedUsers: [{ userId: 111 }], lastRepliedAt: 1 },
    };
    expect(currentState.allMessages.find(m => m.messageId === updateEvent.targetMessageId).threadInfo).toBeUndefined();

    const nextState = reducers(mockData, {
      type: actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED,
      payload: {
        channel: currentState.currentGroupChannel,
        event: updateEvent,
      },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
    expect(nextState.allMessages.find(m => m.messageId === updateEvent.targetMessageId)).toBeDefined();
    expect(nextState.allMessages.find(m => m.messageId === updateEvent.targetMessageId).threadInfo).toBeDefined();
    expect(
      nextState.allMessages.find(m => m.messageId === updateEvent.targetMessageId).threadInfo.replyCount
    ).toEqual(updateEvent.threadInfo.replyCount);

    const updateEvent2 = {
      channelUrl: currentState.currentGroupChannel.url,
      targetMessageId: currentState.allMessages[0].messageId,
      threadInfo: { replyCount: 2, updatedAt: 2, mostRepliedUsers: [{ userId: 111 }, { userId: 222 }], lastRepliedAt: 2 },
    };
    const nextState2 = reducers(nextState, {
      type: actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED,
      payload: {
        channel: currentState.currentGroupChannel,
        event: updateEvent2,
      },
    });
    expect(nextState2.allMessages.length).toEqual(nextState.allMessages.length);
    expect(
      nextState2.allMessages.find(m => m.messageId === updateEvent2.targetMessageId).threadInfo.replyCount
    ).toEqual(updateEvent2.threadInfo.replyCount);
    expect(updateEvent.threadInfo.replyCount).not.toEqual(updateEvent2.threadInfo.replyCount);
  });

  it('should not update threadInfo of message if channel does not match on ON_MESSAGE_THREAD_INFO_UPDATED', () => {
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updateEvent = {
      channelUrl: 'channel-url-001',
      targetMessageId: currentState.allMessages[0].messageId,
      threadInfo: { replyCount: 1, updatedAt: 1, mostRepliedUsers: [{ userId: 111 }], lastRepliedAt: 1 },
    };
    expect(currentState.allMessages.find(m => m.messageId === updateEvent.targetMessageId).threadInfo).toBeUndefined();

    const nextState = reducers(currentState, {
      type: actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED,
      payload: {
        channel: { url: updateEvent.channelUrl },
        event: updateEvent,
      },
    });
    expect(nextState.allMessages.length).toEqual(currentState.allMessages.length);
    expect(nextState.allMessages.find(m => m.messageId === updateEvent.targetMessageId)).toBeDefined();
    expect(nextState.allMessages.find(m => m.messageId === updateEvent.targetMessageId).threadInfo).toBeUndefined();
  });

  it('should not update threadInfo of message if there is no matching message on ON_MESSAGE_THREAD_INFO_UPDATED', () => {
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updateEvent = {
      channelUrl: currentState.currentGroupChannel.url,
      targetMessageId: 'target-message-id-001',
      threadInfo: { replyCount: 1, updatedAt: 1, mostRepliedUsers: [{ userId: 111 }], lastRepliedAt: 1 },
    };
    expect(currentState.allMessages.find(m => m.messageId === updateEvent.targetMessageId)).toBeUndefined();

    const nextState = reducers(currentState, {
      type: actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED,
      payload: {
        channel: currentState.currentGroupChannel,
        event: updateEvent,
      },
    });
    expect(nextState.allMessages.length).toEqual(currentState.allMessages.length);
    expect(nextState.allMessages.find(m => m.messageId === updateEvent.targetMessageId)).toBeUndefined();
  });

  it('should delete message on ON_MESSAGE_DELETED', () => {
    const mockData = generateMockChannel();
    const deletedMessage = mockData.allMessages[1].messageId;

    const nextState = reducers(mockData, {
      type: actionTypes.ON_MESSAGE_DELETED,
      payload: deletedMessage,
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length - 1);
    expect(nextState.allMessages.find(m => m.messageId === deletedMessage)).toBeUndefined();
  });

  it('should reset all messages on RESET_MESSAGES', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.RESET_MESSAGES,
    });
    expect(nextState).toEqual({
      ...mockData,
      hasMorePrev: false,
      hasMoreNext: false,
      allMessages: [],
    });
  });

  it('should apply reactions on ON_REACTION_UPDATED', () => {
    const mockData = generateMockChannel();
    const id = "12345678";
    const reactions = [{ key: '123', value: '123' }, { key: '1234', value: '1234' }];
    const nextState = reducers({
      ...mockData,
      allMessages: [generateMockMessage(id)],
    }, {
      type: actionTypes.ON_REACTION_UPDATED,
      payload: {
        messageId: id,
        reactions: reactions,
      },
    });
    expect(nextState.allMessages[0].reactions).toEqual(reactions);
  });

  it('should handle SET_CURRENT_CHANNEL', () => {
    const mockData = generateMockChannel();
    const channel = { url: mockMessage1.channelUrl };
    const nextState = reducers(mockData, {
      type: actionTypes.SET_CURRENT_CHANNEL,
      payload: channel,
    });
    expect(nextState.currentGroupChannel).toEqual(channel);
    expect(nextState.isInvalid).toEqual(false);
  });

  it('should handle SET_CHANNEL_INVALID', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.SET_CHANNEL_INVALID,
    });
    expect(nextState.isInvalid).toEqual(true);
  });

  it('should handle SET_EMOJI_CONTAINER', () => {
    const mockData = generateMockChannel();
    const emojiContainer = { key: 'value' };
    const nextState = reducers(mockData, {
      type: actionTypes.SET_EMOJI_CONTAINER,
      payload: emojiContainer,
    });
    expect(nextState.emojiContainer).toEqual(emojiContainer);
  });

  describe('filter by messageType of messageListParams when message received', () => {
    const mockData = generateMockChannel();
    const messageTypes = { ADMIN: 'admin', USER: 'user', FILE: 'file' };
    test('messageType filter is ADMIN', () => {
      const appliedParamsState = reducers(mockData, {
        type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED,
        payload: { messageTypeFilter: messageTypes.ADMIN },
      });
      expect(appliedParamsState.messageListParams.messageTypeFilter).toEqual(messageTypes.ADMIN);
      ['admin', 'user', 'file'].forEach((messageType) => {
        const receivedMessage = generateMockMessage(1010);
        receivedMessage.messageType = messageType;
        const receivedMessageState = reducers(appliedParamsState, {
          type: actionTypes.ON_MESSAGE_RECEIVED,
          payload: { message: receivedMessage, channel: { url: mockMessage1.channelUrl } },
        });
        if (messageTypes.ADMIN === messageType) {
          expect(
            receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
          ).toEqual(receivedMessage.messageId);
        } else {
          expect(
            receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
          ).not.toEqual(receivedMessage.messageId);
        }
      });
    });
    test('messageType filter is USER', () => {
      const appliedParamsState = reducers(mockData, {
        type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED,
        payload: { messageTypeFilter: messageTypes.USER },
      });
      expect(appliedParamsState.messageListParams.messageTypeFilter).toEqual(messageTypes.USER);
      ['admin', 'user', 'file'].forEach((messageType) => {
        const receivedMessage = generateMockMessage(1010);
        receivedMessage.messageType = messageType;
        const receivedMessageState = reducers(appliedParamsState, {
          type: actionTypes.ON_MESSAGE_RECEIVED,
          payload: { message: receivedMessage, channel: { url: mockMessage1.channelUrl } },
        });
        if (messageTypes.USER === messageType) {
          expect(
            receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
          ).toEqual(receivedMessage.messageId);
        } else {
          expect(
            receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
          ).not.toEqual(receivedMessage.messageId);
        }
      });
    });
    test('messageType filter is FILE', () => {
      const appliedParamsState = reducers(mockData, {
        type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED,
        payload: { messageTypeFilter: messageTypes.FILE },
      });
      expect(appliedParamsState.messageListParams.messageTypeFilter).toEqual(messageTypes.FILE);
      ['admin', 'user', 'file'].forEach((messageType) => {
        const receivedMessage = generateMockMessage(1010);
        receivedMessage.messageType = messageType;
        const receivedMessageState = reducers(appliedParamsState, {
          type: actionTypes.ON_MESSAGE_RECEIVED,
          payload: { message: receivedMessage, channel: { url: mockMessage1.channelUrl } },
        });
        if (messageTypes.FILE === messageType) {
          expect(
            receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
          ).toEqual(receivedMessage.messageId);
        } else {
          expect(
            receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
          ).not.toEqual(receivedMessage.messageId);
        }
      });
    });
  });

  it('should filter by customType of messageListParams when message received', () => {
    const mockData = generateMockChannel();
    const paramsCustomTypes = ['a', 'b', 'c'];
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED,
      payload: { customTypesFilter: paramsCustomTypes },
    });
    expect(appliedParamsState.messageListParams.customTypesFilter).toEqual(paramsCustomTypes);
    ['a', 'd'].forEach((customType) => {
      const receivedMessage = generateMockMessage(1010);
      receivedMessage.customType = customType;
      const receivedMessageState = reducers(appliedParamsState, {
        type: actionTypes.ON_MESSAGE_RECEIVED,
        payload: { message: receivedMessage, channel: { url: mockMessage1.channelUrl } },
      });
      if (paramsCustomTypes.some((paramsCustomType) => paramsCustomType === customType)) {
        expect(
          receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
        ).toEqual(receivedMessage.messageId);
      } else {
        expect(
          receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
        ).not.toEqual(receivedMessage.messageId);
      }
    });
  });

  it('should filter by senderUserIds of messageListParams when message received', () => {
    const mockData = generateMockChannel();
    const paramsSenderUserIds = ['mark-1', 'mark-2', 'mark-3'];
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED,
      payload: { senderUserIdsFilter: paramsSenderUserIds },
    });
    expect(appliedParamsState.messageListParams.senderUserIdsFilter).toEqual(paramsSenderUserIds);
    ['mark-1', 'mark-4'].forEach((messageSenderId) => {
      const receivedMessage = generateMockMessage(1010);
      receivedMessage.sender = { userId: messageSenderId };
      const receivedMessageState = reducers(appliedParamsState, {
        type: actionTypes.ON_MESSAGE_RECEIVED,
        payload: { message: receivedMessage, channel: { url: mockMessage1.channelUrl } },
      });
      if (paramsSenderUserIds.some((paramsSenderUserId) => paramsSenderUserId === messageSenderId)) {
        expect(
          receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
        ).toEqual(receivedMessage.messageId);
      } else {
        expect(
          receivedMessageState.allMessages[receivedMessageState.allMessages.length - 1].messageId
        ).not.toEqual(receivedMessage.messageId);
      }
    });
  });

  it('should filter by MESSAGE_LIST_PARAMS_CHANGED when ON_MESSAGE_UPDATED', () => {
    const mockData = generateMockChannel();
    const changingMessage = uuid();
    const updatingMessage = {
      ...mockData.allMessages[0],
      messageId: 1010,
      messageType: 'user',
      customType: 'apple',
      sender: { userId: 'John' },
      isUserMessage: () => true,
    };
    mockData.allMessages.unshift(updatingMessage);

    const appliedParamsState = reducers(mockData, {
      type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED,
      payload: {
        messageTypeFilter: 'user',
        customTypesFilter: ['apple', 'banana'],
        senderUserIdsFilter: ['John', 'Mark'],
      },
    });
    expect(appliedParamsState.messageListParams.messageTypeFilter).toEqual('user');
    expect(appliedParamsState.messageListParams.customTypesFilter).toEqual(['apple', 'banana']);
    expect(appliedParamsState.messageListParams.senderUserIdsFilter).toEqual(['John', 'Mark']);

    const updatedMessageState = reducers(appliedParamsState, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: appliedParamsState.currentGroupChannel,
        message: { ...updatingMessage, message: changingMessage },
      },
    });
    expect(updatedMessageState.allMessages[0].messageId).toEqual(updatingMessage.messageId);
    expect(updatedMessageState.allMessages[0].message).toEqual(changingMessage);
    expect(updatedMessageState.allMessages[0].message).not.toEqual(appliedParamsState.allMessages[0].message);

    const updatedWrongWithMessageTypeState = reducers(appliedParamsState, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: appliedParamsState.currentGroupChannel,
        message: { ...updatingMessage, messageType: 'file', message: changingMessage },
      },
    });
    expect(updatedWrongWithMessageTypeState.allMessages.map((message) => message.messageId)).not.toContain(updatingMessage.messageId);
    expect(updatedWrongWithMessageTypeState.allMessages[0].messageId).toEqual(appliedParamsState.allMessages[1].messageId);

    const updatedWrongWithCustomTypeState = reducers(appliedParamsState, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: appliedParamsState.currentGroupChannel,
        message: { ...updatingMessage, customType: 'cherry', message: changingMessage },
      },
    });
    expect(updatedWrongWithCustomTypeState.allMessages.map((message) => message.messageId)).not.toContain(updatingMessage.messageId);
    expect(updatedWrongWithCustomTypeState.allMessages[0].messageId).toEqual(appliedParamsState.allMessages[1].messageId)

    const updatedWrongWithSenderIdState = reducers(appliedParamsState, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: appliedParamsState.currentGroupChannel,
        message: { ...updatingMessage, sender: { userId: 'hoon' }, message: changingMessage },
      },
    });
    expect(updatedWrongWithSenderIdState.allMessages.map((message) => message.messageId)).not.toContain(updatingMessage.messageId);
    expect(updatedWrongWithSenderIdState.allMessages[0].messageId).toEqual(appliedParamsState.allMessages[1].messageId);
  });

  it('should not update with coming message when received message already exsits', () => {
    const mockData = generateMockChannel();
    const changingMessage = uuid();
    const updatingMessage = {
      ...mockData.allMessages[0],
      messageId: 1010,
      messageType: 'user',
      customType: 'apple',
      sender: { userId: 'John' },
      isUserMessage: () => true,
    };
    const onMessageUpdatedState = reducers(
      {
        ...mockData,
        allMessages: [updatingMessage, ...mockData.allMessages],
      },
      {
        type: actionTypes.ON_MESSAGE_RECEIVED,
        payload: {
          channel: { url: mockMessage1.channelUrl },
          message: { ...updatingMessage, message: changingMessage },
        },
      }
    );
    expect(onMessageUpdatedState.allMessages[0].messageId).toEqual(updatingMessage.messageId);
    expect(onMessageUpdatedState.allMessages[0].message).toEqual(updatingMessage.message);
    expect(onMessageUpdatedState.allMessages[0].message).not.toEqual(changingMessage);
  });
});

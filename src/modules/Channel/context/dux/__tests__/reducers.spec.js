import {
  mockMessage1,
  generateMockMessage,
  generateMockChannel,
} from '../data.mock';
import * as actionTypes from '../actionTypes';
import reducers from '../reducers';
import initialState from '../initialState';
import { uuidv4 } from '../../../../../utils/uuid';
import { useLocalization } from '../../../../../lib/LocalizationContext';

jest.mock('../../../../../lib/LocalizationContext', () => ({
  ...jest.requireActual('../../../../../lib/LocalizationContext'),
  useLocalization: jest.fn(),
}));

const getLastMessageOf = (messageList) => messageList[messageList.length - 1];

describe('Messages-Reducers', () => {
  const stateWithCurrentChannel = {
    ...initialState,
    currentGroupChannel: { url: generateMockChannel().currentGroupChannel.url },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLocalization.mockReturnValue({
      stringSet: {
        DATE_FORMAT__UNREAD_SINCE: 'p MMM dd',
      },
    });
  });

  it('should setloading true FETCH_INITIAL_MESSAGES_START', () => {
    const { stringSet } = useLocalization();
    const nextState = reducers({ ...initialState, stringSet }, {
      type: actionTypes.FETCH_INITIAL_MESSAGES_START,
    });
    expect(nextState.loading).toEqual(true);
  });

  // https://sendbird.atlassian.net/browse/UIKIT-2158
  it('should check if ITNITAL_LOADING state is true', () => {
    expect(initialState.loading).toEqual(true);
  });

  it('should initialize messages FETCH_INITIAL_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...stateWithCurrentChannel, stringSet }, {
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
    expect(nextState.latestMessageTimeStamp).toEqual(getLastMessageOf(mockData.allMessages).createdAt);
    expect(nextState.allMessages).toEqual(mockData.allMessages);
  });

  it('should append previous messages FETCH_PREV_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
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
    expect(nextState.latestMessageTimeStamp).toEqual(getLastMessageOf(mockData.allMessages).createdAt);
  });

  it('should append next messages FETCH_NEXT_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
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
    expect(nextState.latestMessageTimeStamp).not.toEqual(getLastMessageOf(mockData.allMessages).createdAt);
  });

  it('should get prev message list considering messageListParams FETCH_PREV_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    const MESSAGE_LIST_SIZE = 20;
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
      ...mockData,
      stringSet,
      hasMorePrev: true,
      hasMoreNext: true,
      messageListParams: {
        prevResultSize: MESSAGE_LIST_SIZE,
        nextResultSize: MESSAGE_LIST_SIZE,
      }
    }, {
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: new Array(MESSAGE_LIST_SIZE + 1).fill({}),
        // MESSAGE_LIST_SIZE + 1: because server gives the response including a current message
      }
    });
    expect(nextState.hasMorePrev).toEqual(true);
    expect(nextState.hasMoreNext).toEqual(true);
  });

  it('should verify there is no more messages FETCH_PREV_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    // request size > response size
    const MESSAGE_LIST_SIZE = 20;
    const mockData = generateMockChannel();
    const nextState = reducers({
      ...mockData,
      stringSet,
      hasMorePrev: true,
      hasMoreNext: true,
      messageListParams: {
        prevResultSize: 30,
        nextResultSize: 30,
      }
    }, {
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: new Array(MESSAGE_LIST_SIZE + 1).fill({}),
      }
    });
    expect(nextState.hasMorePrev).toEqual(false);
    expect(nextState.hasMoreNext).toEqual(true);
  });

  it('should not set `hasMorePrev: false` when additional messages are fetched in FETCH_PREV_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    // request size < response size
    const MESSAGE_LIST_SIZE = 20;
    const mockData = generateMockChannel();
    const nextState = reducers({
      ...mockData,
      stringSet,
      hasMorePrev: true,
      hasMoreNext: true,
      messageListParams: {
        prevResultSize: 10,
        nextResultSize: 10,
      }
    }, {
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: new Array(MESSAGE_LIST_SIZE + 1).fill({}),
      }
    });
    expect(nextState.hasMorePrev).toEqual(true);
    expect(nextState.hasMoreNext).toEqual(true);
  });

  it('should get next message list considering messageListParams FETCH_NEXT_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    const MESSAGE_LIST_SIZE = 20;
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
      ...mockData,
      stringSet,
      hasMorePrev: true,
      hasMoreNext: true,
      messageListParams: {
        prevResultSize: MESSAGE_LIST_SIZE,
        nextResultSize: MESSAGE_LIST_SIZE,
      }
    }, {
      type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: new Array(MESSAGE_LIST_SIZE + 1).fill({}),
        // MESSAGE_LIST_SIZE + 1: because server gives the response including a current message
      }
    });
    expect(nextState.hasMorePrev).toEqual(true);
    expect(nextState.hasMoreNext).toEqual(true);
  });

  it('should verify there is no more messages FETCH_NEXT_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    // request size > response size
    const MESSAGE_LIST_SIZE = 20;
    const mockData = generateMockChannel();
    const nextState = reducers({
      ...mockData,
      stringSet,
      hasMorePrev: true,
      hasMoreNext: true,
      messageListParams: {
        prevResultSize: 30,
        nextResultSize: 30,
      }
    }, {
      type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: new Array(MESSAGE_LIST_SIZE + 1).fill({}),
      }
    });
    expect(nextState.hasMorePrev).toEqual(true);
    expect(nextState.hasMoreNext).toEqual(false);
  });

  it('should validate unexpected additional messages are fetched FETCH_NEXT_MESSAGES_SUCCESS', () => {
    const { stringSet } = useLocalization();
    // request size < response size
    const MESSAGE_LIST_SIZE = 20;
    const mockData = generateMockChannel();
    const nextState = reducers({
      ...mockData,
      stringSet,
      hasMorePrev: true,
      hasMoreNext: true,
      messageListParams: {
        prevResultSize: 10,
        nextResultSize: 10,
      }
    }, {
      type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: new Array(MESSAGE_LIST_SIZE + 1).fill({}),
      }
    });
    expect(nextState.hasMorePrev).toEqual(true);
    expect(nextState.hasMoreNext).toEqual(false);
  });

  it('should set pending message on SEND_MESSAGE_START', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.SEND_MESSAGE_START,
      payload: mockMessage1,
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
    expect(nextState.localMessages.length).toEqual(mockData.localMessages.length + 1);
    expect(getLastMessageOf(nextState.localMessages)).toEqual(mockMessage1);
  });

  it('should handle SEND_MESSAGE_SUCCESS', () => {
    const mockData = generateMockChannel();

    const succeededMessageId = uuidv4();
    const succededMessage = generateMockMessage(succeededMessageId);
    succededMessage.sendingStatus = 'succeeded';

    const { stringSet } = useLocalization();
    const currentState = {
      ...mockData,
      stringSet,
      localMessages: [
        {
          ...succededMessage,
          sendingStatus: 'pending',
        },
      ],
    };
    const nextState = reducers(currentState, {
      type: actionTypes.SEND_MESSAGE_SUCCESS,
      payload: succededMessage,
    });
    expect(nextState.allMessages.length).toEqual(currentState.allMessages.length + 1);
    expect(nextState.localMessages.length).toEqual(currentState.localMessages.length - 1);
    expect(getLastMessageOf(currentState.localMessages).sendingStatus).toEqual('pending');
    expect(getLastMessageOf(nextState.allMessages).sendingStatus).toEqual('succeeded');
    expect(getLastMessageOf(nextState.allMessages).messageId)
      .toEqual(getLastMessageOf(currentState.localMessages).messageId);
  });

  it('should append message to end of list ON_MESSAGE_RECEIVED', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { message: mockMessage1, channel: { url: mockMessage1.channelUrl } },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length + 1);
    expect(getLastMessageOf(nextState.allMessages)).toEqual(mockMessage1);
  });

  it('should not add message when get overlap message ON_MESSAGE_RECEIVED', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { message: mockData.allMessages[0], channel: { url: mockMessage1.channelUrl } },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
  });

  it('should update message if present on list ON_MESSAGE_UPDATED', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    currentState.allMessages[2].status = 'failed';

    const updatedMessage = {
      ...currentState.allMessages[2],
      status: 'updated',
    };

    const nextState = reducers({ ...currentState, stringSet }, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: currentState.currentGroupChannel,
        message: updatedMessage,
      },
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
    expect(getLastMessageOf(nextState.allMessages).status).toEqual('updated');
  });

  it('should not update message if the message is not on the list ON_MESSAGE_UPDATED', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updatedMessage = {
      ...mockMessage1,
      status: 'updated',
    };

    const nextState = reducers({ ...mockData, stringSet }, {
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
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updateEvent = {
      channelUrl: currentState.currentGroupChannel.url,
      targetMessageId: currentState.allMessages[0].messageId,
      threadInfo: { replyCount: 1, updatedAt: 1, mostRepliedUsers: [{ userId: 111 }], lastRepliedAt: 1 },
    };
    expect(currentState.allMessages.find(m => m.messageId === updateEvent.targetMessageId).threadInfo).toBeUndefined();

    const nextState = reducers({ ...mockData, stringSet }, {
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
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updateEvent = {
      channelUrl: 'channel-url-001',
      targetMessageId: currentState.allMessages[0].messageId,
      threadInfo: { replyCount: 1, updatedAt: 1, mostRepliedUsers: [{ userId: 111 }], lastRepliedAt: 1 },
    };
    expect(currentState.allMessages.find(m => m.messageId === updateEvent.targetMessageId).threadInfo).toBeUndefined();

    const nextState = reducers({ ...currentState, stringSet }, {
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
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const currentState = { ...mockData };
    const updateEvent = {
      channelUrl: currentState.currentGroupChannel.url,
      targetMessageId: 'target-message-id-001',
      threadInfo: { replyCount: 1, updatedAt: 1, mostRepliedUsers: [{ userId: 111 }], lastRepliedAt: 1 },
    };
    expect(currentState.allMessages.find(m => m.messageId === updateEvent.targetMessageId)).toBeUndefined();

    const nextState = reducers({ ...currentState, stringSet }, {
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
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const deletedMessage = mockData.allMessages[1].messageId;

    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_MESSAGE_DELETED,
      payload: deletedMessage,
    });
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length - 1);
    expect(nextState.allMessages.find(m => m.messageId === deletedMessage)).toBeUndefined();
  });

  it('should reset all messages on RESET_MESSAGES', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.RESET_MESSAGES,
    });
    expect(nextState).toEqual({
      ...mockData,
      stringSet,
      hasMorePrev: false,
      hasMoreNext: false,
      allMessages: [],
    });
  });

  it('should apply reactions on ON_REACTION_UPDATED', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const id = "12345678";
    const reactions = [{ key: '123', value: '123' }, { key: '1234', value: '1234' }];
    const nextState = reducers({
      ...mockData,
      stringSet,
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
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const channel = { url: mockMessage1.channelUrl };
    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.SET_CURRENT_CHANNEL,
      payload: channel,
    });
    expect(nextState.currentGroupChannel).toEqual(channel);
    expect(nextState.isInvalid).toEqual(false);
  });

  it('should handle SET_CHANNEL_INVALID', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.SET_CHANNEL_INVALID,
    });
    expect(nextState.isInvalid).toEqual(true);
  });

  it('should handle SET_EMOJI_CONTAINER', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const emojiContainer = { key: 'value' };
    const nextState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.SET_EMOJI_CONTAINER,
      payload: emojiContainer,
    });
    expect(nextState.emojiContainer).toEqual(emojiContainer);
  });

  describe('filter by messageType of messageListParams when message received', () => {
    const mockData = generateMockChannel();
    const messageTypes = { ADMIN: 'admin', USER: 'user', FILE: 'file' };
    test('messageType filter is ADMIN', () => {
      const { stringSet } = useLocalization();
      const appliedParamsState = reducers({ ...mockData, stringSet }, {
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
            getLastMessageOf(receivedMessageState.allMessages).messageId
          ).toEqual(receivedMessage.messageId);
        } else {
          expect(
            getLastMessageOf(receivedMessageState.allMessages).messageId
          ).not.toEqual(receivedMessage.messageId);
        }
      });
    });
    test('messageType filter is USER', () => {
      const { stringSet } = useLocalization();
      const appliedParamsState = reducers({ ...mockData, stringSet }, {
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
            getLastMessageOf(receivedMessageState.allMessages).messageId
          ).toEqual(receivedMessage.messageId);
        } else {
          expect(
            getLastMessageOf(receivedMessageState.allMessages).messageId
          ).not.toEqual(receivedMessage.messageId);
        }
      });
    });
    test('messageType filter is FILE', () => {
      const { stringSet } = useLocalization();
      const appliedParamsState = reducers({ ...mockData, stringSet }, {
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
            getLastMessageOf(receivedMessageState.allMessages).messageId
          ).toEqual(receivedMessage.messageId);
        } else {
          expect(
            getLastMessageOf(receivedMessageState.allMessages).messageId
          ).not.toEqual(receivedMessage.messageId);
        }
      });
    });
  });

  it('should filter by customType of messageListParams when message received', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const paramsCustomTypes = ['a', 'b', 'c'];
    const appliedParamsState = reducers({ ...mockData, stringSet }, {
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
          getLastMessageOf(receivedMessageState.allMessages).messageId
        ).toEqual(receivedMessage.messageId);
      } else {
        expect(
          getLastMessageOf(receivedMessageState.allMessages).messageId
        ).not.toEqual(receivedMessage.messageId);
      }
    });
  });

  it('should filter by senderUserIds of messageListParams when message received', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const paramsSenderUserIds = ['mark-1', 'mark-2', 'mark-3'];
    const appliedParamsState = reducers({ ...mockData, stringSet }, {
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
          getLastMessageOf(receivedMessageState.allMessages).messageId
        ).toEqual(receivedMessage.messageId);
      } else {
        expect(
          getLastMessageOf(receivedMessageState.allMessages).messageId
        ).not.toEqual(receivedMessage.messageId);
      }
    });
  });

  it('should filter by MESSAGE_LIST_PARAMS_CHANGED when ON_MESSAGE_UPDATED', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const changingMessage = uuidv4();
    const updatingMessage = {
      ...mockData.allMessages[0],
      messageId: 1010,
      messageType: 'user',
      customType: 'apple',
      sender: { userId: 'John' },
      isUserMessage: () => true,
    };
    mockData.allMessages.unshift(updatingMessage);

    const appliedParamsState = reducers({ ...mockData, stringSet }, {
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
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const changingMessage = uuidv4();
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
        stringSet,
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

  it('filters succeeded sendable messages when initial fetch starts', () => {
    const { stringSet } = useLocalization();
    const nextState = reducers({
      ...initialState,
      stringSet,
      allMessages: [
        { messageId: 1, sender: {}, sendingStatus: 'succeeded' },
        { messageId: 2, sender: {}, sendingStatus: 'failed' },
        { messageId: 3, messageType: 'admin' },
      ],
      localMessages: [{ messageId: 4 }],
    }, {
      type: actionTypes.FETCH_INITIAL_MESSAGES_START,
    });

    expect(nextState.loading).toBe(true);
    expect(nextState.localMessages).toEqual([]);
    expect(nextState.allMessages.map((message) => message.messageId)).toEqual([2, 3]);
  });

  it('ignores message fetch success actions for another channel', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const wrongChannel = { url: 'another-channel' };

    expect(reducers({ ...mockData, stringSet }, {
      type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: wrongChannel, messages: [mockMessage1] },
    })).toEqual({ ...mockData, stringSet });
    expect(reducers({ ...mockData, stringSet }, {
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: wrongChannel, messages: [mockMessage1] },
    })).toEqual({ ...mockData, stringSet });
    expect(reducers({ ...mockData, stringSet }, {
      type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: wrongChannel, messages: [mockMessage1] },
    })).toEqual({ ...mockData, stringSet });
  });

  it('deduplicates previous messages and keeps the newest version', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const existing = {
      ...mockData.allMessages[0],
      messageId: 'duplicate-message',
      updatedAt: 10,
      message: 'old',
    };
    const incomingDuplicate = {
      ...existing,
      updatedAt: 20,
      message: 'new',
    };
    const incomingNew = {
      ...mockMessage1,
      messageId: 'new-previous-message',
    };

    const nextState = reducers({
      ...mockData,
      stringSet,
      allMessages: [existing, ...mockData.allMessages.slice(1)],
    }, {
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: {
        currentGroupChannel: mockData.currentGroupChannel,
        messages: [incomingNew, incomingDuplicate],
      },
    });

    expect(nextState.allMessages[0]).toEqual(incomingNew);
    expect(nextState.allMessages.find((message) => message.messageId === 'duplicate-message').message).toBe('new');
    expect(nextState.allMessages.filter((message) => message.messageId === 'duplicate-message')).toHaveLength(1);
  });

  it('handles fetch failures for matching and mismatching channels', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const wrongChannel = { url: 'wrong-channel' };

    const initialFailure = reducers({ ...mockData, stringSet, loading: true }, {
      type: actionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
      payload: { currentGroupChannel: mockData.currentGroupChannel },
    });
    expect(initialFailure.loading).toBe(false);
    expect(initialFailure.isInvalid).toBe(true);
    expect(initialFailure.initialized).toBe(false);
    expect(initialFailure.allMessages).toEqual([]);
    expect(initialFailure.oldestMessageTimeStamp).toBeNull();

    const nextFailure = reducers({ ...mockData, stringSet, loading: true }, {
      type: actionTypes.FETCH_NEXT_MESSAGES_FAILURE,
      payload: { currentGroupChannel: mockData.currentGroupChannel },
    });
    expect(nextFailure.isInvalid).toBe(false);
    expect(nextFailure.allMessages).toEqual([]);

    const mismatchFailure = reducers({ ...mockData, stringSet }, {
      type: actionTypes.FETCH_PREV_MESSAGES_FAILURE,
      payload: { currentGroupChannel: wrongChannel },
    });
    expect(mismatchFailure).toEqual({ ...mockData, stringSet });
  });

  it('marks failed local messages and replaces resending messages by reqId', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const pending = { ...generateMockMessage('pending'), reqId: 'req-1', sendingStatus: 'pending' };
    const failed = { ...pending, sendingStatus: 'failed' };
    const resending = { ...pending, sendingStatus: 'pending-resend' };

    const failedState = reducers({
      ...mockData,
      stringSet,
      localMessages: [pending, { ...generateMockMessage('other'), reqId: 'req-2' }],
    }, {
      type: actionTypes.SEND_MESSAGE_FAILURE,
      payload: failed,
    });

    expect(failedState.localMessages[0]).toEqual({ ...failed, failed: true });
    expect(failed.failed).toBe(true);
    expect(failedState.localMessages[1].reqId).toBe('req-2');

    const resendState = reducers(failedState, {
      type: actionTypes.RESEND_MESSAGE_START,
      payload: resending,
    });
    expect(resendState.localMessages[0]).toEqual(resending);
  });

  it('clears channel and messages when channel becomes invalid', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const nextState = reducers({
      ...mockData,
      stringSet,
      localMessages: [mockMessage1],
    }, {
      type: actionTypes.SET_CHANNEL_INVALID,
    });

    expect(nextState.currentGroupChannel).toBeNull();
    expect(nextState.allMessages).toEqual([]);
    expect(nextState.localMessages).toEqual([]);
    expect(nextState.isInvalid).toBe(true);
  });

  it('handles received admin messages and sender profile changes', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const adminMessage = {
      ...generateMockMessage('admin-message'),
      isAdminMessage: () => true,
    };
    const adminState = reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: {
        channel: mockData.currentGroupChannel,
        message: adminMessage,
      },
    });
    expect(getLastMessageOf(adminState.allMessages)).toEqual(adminMessage);

    const sender = {
      userId: 'profile-user',
      nickname: 'new nickname',
      friendName: 'new friend',
      profileUrl: 'new-profile',
    };
    const channel = {
      ...mockData.currentGroupChannel,
      members: [{
        userId: 'profile-user',
        nickname: 'old nickname',
        friendName: 'old friend',
        profileUrl: 'old-profile',
      }],
    };
    const message = {
      ...generateMockMessage('profile-message'),
      sender,
      isAdminMessage: () => false,
    };
    const profileState = reducers({
      ...mockData,
      stringSet,
      allMessages: [],
      unreadSince: null,
      unreadSinceDate: null,
    }, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { channel, message },
    });

    expect(profileState.currentGroupChannel.members[0]).toEqual(sender);
    expect(profileState.unreadSince).toBeTruthy();
    expect(profileState.unreadSinceDate).toBeInstanceOf(Date);
    expect(profileState.allMessages).toEqual([message]);
  });

  it('ignores received and updated messages from other channels', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const wrongChannel = { url: 'wrong-channel' };

    expect(reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { channel: wrongChannel, message: generateMockMessage('received') },
    })).toEqual({ ...mockData, stringSet });

    expect(reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: { channel: wrongChannel, message: generateMockMessage('updated') },
    })).toEqual({ ...mockData, stringSet });
  });

  it('updates child parentMessage when the parent message is updated', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const parent = { ...generateMockMessage('parent'), message: 'old parent' };
    const child = { ...generateMockMessage('child'), parentMessageId: 'parent', parentMessage: null };
    const updatedParent = { ...parent, message: 'updated parent' };

    const nextState = reducers({
      ...mockData,
      stringSet,
      allMessages: [parent, child],
    }, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: mockData.currentGroupChannel,
        message: updatedParent,
      },
    });

    expect(nextState.allMessages[0]).toEqual(updatedParent);
    expect(nextState.allMessages[1].parentMessage).toEqual(updatedParent);
  });

  it('handles read state, local deletion, reactions, typing, and unknown actions', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const readState = {
      ...mockData,
      stringSet,
      unreadSince: '10:00',
      unreadSinceDate: new Date(2020, 1, 1),
    };

    expect(reducers(readState, {
      type: actionTypes.MARK_AS_READ,
      payload: { channel: { url: 'wrong-channel' } },
    })).toEqual(readState);

    const markedRead = reducers(readState, {
      type: actionTypes.MARK_AS_READ,
      payload: { channel: mockData.currentGroupChannel },
    });
    expect(markedRead.unreadSince).toBeNull();
    expect(markedRead.unreadSinceDate).toBeNull();

    const localMessages = [
      { ...generateMockMessage('local-1'), reqId: 'req-1' },
      { ...generateMockMessage('local-2'), reqId: 'req-2' },
    ];
    const deletedLocal = reducers({ ...mockData, stringSet, localMessages }, {
      type: actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
      payload: 'req-1',
    });
    expect(deletedLocal.localMessages.map((message) => message.reqId)).toEqual(['req-2']);

    const reactionState = reducers({
      ...mockData,
      stringSet,
      allMessages: [generateMockMessage('reaction-target'), generateMockMessage('reaction-other')],
    }, {
      type: actionTypes.ON_REACTION_UPDATED,
      payload: { messageId: 'reaction-other', reactions: [{ key: 'smile' }] },
    });
    expect(reactionState.allMessages[0].reactions).toEqual([]);
    expect(reactionState.allMessages[1].reactions).toEqual([{ key: 'smile' }]);

    const typingMembers = [{ userId: 'typing-user' }];
    expect(reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_TYPING_STATUS_UPDATED,
      payload: { channel: { url: 'wrong-channel' }, typingMembers },
    })).toEqual({ ...mockData, stringSet });
    expect(reducers({ ...mockData, stringSet }, {
      type: actionTypes.ON_TYPING_STATUS_UPDATED,
      payload: { channel: mockData.currentGroupChannel, typingMembers },
    }).typingMembers).toEqual(typingMembers);

    expect(reducers({ ...mockData, stringSet }, { type: 'UNKNOWN_ACTION' })).toEqual({ ...mockData, stringSet });
  });

  it('updates uploaded file info only for matching channel without errors', () => {
    const { stringSet } = useLocalization();
    const mockData = generateMockChannel();
    const uploadableFileInfo = { fileName: 'image.png', fileSize: 100 };
    const localMessage = {
      ...generateMockMessage('multi-file-message'),
      reqId: 'request-1',
      messageParams: {
        fileInfoList: [null, null],
      },
    };
    const state = {
      ...mockData,
      stringSet,
      localMessages: [localMessage],
    };

    expect(reducers(state, {
      type: actionTypes.ON_FILE_INFO_UPLOADED,
      payload: {
        channelUrl: 'wrong-channel',
        requestId: 'request-1',
        index: 1,
        uploadableFileInfo,
      },
    })).toBe(state);

    expect(reducers(state, {
      type: actionTypes.ON_FILE_INFO_UPLOADED,
      payload: {
        channelUrl: mockData.currentGroupChannel.url,
        requestId: 'request-1',
        index: 1,
        uploadableFileInfo,
        error: new Error('failed'),
      },
    })).toBe(state);

    const nextState = reducers(state, {
      type: actionTypes.ON_FILE_INFO_UPLOADED,
      payload: {
        channelUrl: mockData.currentGroupChannel.url,
        requestId: 'request-1',
        index: 1,
        uploadableFileInfo,
      },
    });

    expect(nextState.localMessages[0].messageParams.fileInfoList[1]).toEqual(uploadableFileInfo);
  });
});

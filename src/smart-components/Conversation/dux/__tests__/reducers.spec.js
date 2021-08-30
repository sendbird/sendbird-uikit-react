import { mockMessage1, generateMockMessage, generateMockChannel } from '../data.mock';
import * as actionTypes from '../actionTypes';
import reducers from '../reducers';
import initialState from '../initialState';

const randomBoolean = () => Math.random() >= 0.5;
describe('Messages-Reducers', () => {
  it('should setloading true GET_PREV_MESSAGES_START', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.GET_PREV_MESSAGES_START,
    });
    expect(nextState.loading).toEqual(true);
  });


  it('should set messages GET_PREV_MESSAGES_SUCESS', () => {
    const mockData = generateMockChannel();
    const hasMore = randomBoolean();
    const lastMessageTimeStamp = 123;
    const nextState = reducers(initialState, {
      type: actionTypes.GET_PREV_MESSAGES_SUCESS,
      payload: {
        hasMore,
        messages: mockData.allMessages,
        lastMessageTimeStamp,
      }
    });
    expect(nextState.loading).toEqual(false);
    expect(nextState.hasMore).toEqual(hasMore);
    expect(nextState.allMessages).toEqual(mockData.allMessages);
    expect(nextState.lastMessageTimeStamp).toEqual(lastMessageTimeStamp);
  });

  it('should append to head of all messages on GET_PREV_MESSAGES_SUCESS', () => {
    const mockData = generateMockChannel();
    const hasMore = randomBoolean();
    const nextState = reducers(mockData, {
      type: actionTypes.GET_PREV_MESSAGES_SUCESS,
      payload: {
        hasMore,
        messages: [mockMessage1],
        currentGroupChannel: mockData.currentGroupChannel,
      }
    });
    expect(nextState.loading).toEqual(false);
    expect(nextState.hasMore).toEqual(hasMore);
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length + 1);
    expect(nextState.allMessages[0]).toEqual(mockMessage1);
  });

  it('should not append duplicate messages on GET_PREV_MESSAGES_SUCESS', () => {
    const mockData = generateMockChannel();
    const hasMore = randomBoolean();
    const nextState = reducers(mockData, {
      type: actionTypes.GET_PREV_MESSAGES_SUCESS,
      payload: {
        hasMore,
        messages: [mockData.allMessages[0]],
        currentGroupChannel: mockData.currentGroupChannel,
      }
    });
    expect(nextState.loading).toEqual(false);
    expect(nextState.hasMore).toEqual(hasMore);
    expect(nextState.allMessages.length).toEqual(mockData.allMessages.length);
  });

  it('should not handle append messages on GET_PREV_MESSAGES_SUCESS when payload.messages is []', () => {
    const mockData = generateMockChannel();
    const hasMore = randomBoolean();
    const nextState = reducers(mockData, {
      type: actionTypes.GET_PREV_MESSAGES_SUCESS,
      payload: {
        hasMore,
        messages: [],
        currentGroupChannel: mockData.currentGroupChannel,
      }
    });
    expect(nextState.loading).toEqual(false);
    expect(nextState.hasMore).toEqual(hasMore);
    expect(nextState.allMessages).toEqual(mockData.allMessages);
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

  it('should reset state on RESET_STATE', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.RESET_STATE,
    });
    expect(nextState).toEqual(initialState);
  });

  it('should reset all messages on RESET_MESSAGES', () => {
    const mockData = generateMockChannel();
    const nextState = reducers(mockData, {
      type: actionTypes.RESET_MESSAGES,
    });
    expect(nextState).toEqual({
      ...mockData,
      hasMore: false,
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

  it('should remove all successful messages on CLEAR_SENT_MESSAGES', () => {
    const mockData = generateMockChannel();
    const id1 = "12345678";
    const id2 = "1234567890";
    const m1 = generateMockMessage(id1);
    const m2 = generateMockMessage(id2);
    m1.sendingStatus = 'succeeded';
    const nextState = reducers({
      ...mockData,
      allMessages: [m1, m2],
    }, {
      type: actionTypes.CLEAR_SENT_MESSAGES,
    });

    expect(nextState.allMessages.length).toEqual(1);
    expect(nextState.allMessages[0].messageId).toEqual(id2);
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
});

import reducer from '../reducers';
import initialState from '../initialState';
import * as actionTypes from '../actionTypes';

const createChannel = (url = 'open-channel-url', operators = []) => ({
  url,
  operators,
});

const createMessage = (messageId: number, reqId?: string) => ({
  messageId,
  reqId,
  createdAt: messageId,
  isIdentical: (message) => message?.messageId === messageId,
});

describe('OpenChannel reducer', () => {
  it('sets the current channel and resets channel-scoped moderation state', () => {
    const operator = { userId: 'operator-1' };
    const channel = createChannel('open-channel-url', [operator]);

    const nextState = reducer(
      {
        ...initialState,
        isInvalid: true,
        bannedParticipantIds: ['banned-user'],
        mutedParticipantIds: ['muted-user'],
      },
      {
        type: actionTypes.SET_CURRENT_CHANNEL,
        payload: channel,
      },
    );

    expect(nextState.currentOpenChannel).toBe(channel);
    expect(nextState.isInvalid).toBe(false);
    expect(nextState.operators).toEqual([operator]);
    expect(nextState.participants).toEqual([operator]);
    expect(nextState.bannedParticipantIds).toEqual([]);
    expect(nextState.mutedParticipantIds).toEqual([]);
  });

  it('ignores channel-scoped actions for stale channels', () => {
    const state = {
      ...initialState,
      currentOpenChannel: createChannel('current-channel') as any,
      allMessages: [createMessage(1) as any],
    };

    const nextState = reducer(state, {
      type: actionTypes.GET_PREV_MESSAGES_SUCESS,
      payload: {
        currentOpenChannel: createChannel('stale-channel'),
        messages: [createMessage(2)],
        hasMore: true,
        lastMessageTimestamp: 200,
      },
    });

    expect(nextState).toBe(state);
  });

  it('prepends previous messages and de-duplicates by messageId', () => {
    const channel = createChannel();
    const existingMessage = createMessage(1, 'old-req');
    const newerMessage = createMessage(2);
    const refreshedMessage = createMessage(1, 'new-req');

    const nextState = reducer(
      {
        ...initialState,
        currentOpenChannel: channel as any,
        allMessages: [existingMessage, newerMessage] as any,
        loading: true,
      },
      {
        type: actionTypes.GET_PREV_MESSAGES_SUCESS,
        payload: {
          currentOpenChannel: channel,
          messages: [refreshedMessage],
          hasMore: true,
          lastMessageTimestamp: 100,
        },
      },
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.initialized).toBe(true);
    expect(nextState.hasMore).toBe(true);
    expect(nextState.lastMessageTimestamp).toBe(100);
    expect(nextState.allMessages).toEqual([refreshedMessage, newerMessage]);
  });

  it('tracks pending, sent, and failed messages by reqId', () => {
    const channel = createChannel();
    const pendingMessage = createMessage(1, 'req-1');
    const sentMessage = createMessage(10, 'req-1');

    const pendingState = reducer(
      {
        ...initialState,
        currentOpenChannel: channel as any,
      },
      {
        type: actionTypes.SENDING_MESSAGE_START,
        payload: {
          channel,
          message: pendingMessage,
        },
      },
    );

    expect(pendingState.allMessages).toEqual([pendingMessage]);

    const sentState = reducer(pendingState, {
      type: actionTypes.SENDING_MESSAGE_SUCCEEDED,
      payload: sentMessage,
    });

    expect(sentState.allMessages).toEqual([sentMessage]);

    const failedMessage = createMessage(11, 'req-2');
    const failedState = reducer(sentState, {
      type: actionTypes.SENDING_MESSAGE_FAILED,
      payload: failedMessage,
    });

    expect((failedState.allMessages[1] as any).sendingStatus).toBe('failed');
    expect(failedState.allMessages[1]).toBe(failedMessage);
  });

  it('updates participant moderation and channel lifecycle events', () => {
    const currentUser = { userId: 'current-user' };
    const mutedUser = { userId: 'muted-user' };
    const channel = createChannel();
    const state = {
      ...initialState,
      currentOpenChannel: channel as any,
      participants: [mutedUser] as any,
    };

    const mutedState = reducer(state, {
      type: actionTypes.ON_USER_MUTED,
      payload: { channel, user: mutedUser },
    });
    expect(mutedState.mutedParticipantIds).toEqual(['muted-user']);

    const unmutedState = reducer(mutedState, {
      type: actionTypes.ON_USER_UNMUTED,
      payload: { channel, user: mutedUser },
    });
    expect(unmutedState.mutedParticipantIds).toEqual([]);

    const frozenState = reducer(unmutedState, {
      type: actionTypes.ON_CHANNEL_FROZEN,
      payload: channel,
    });
    expect(frozenState.frozen).toBe(true);

    const bannedState = reducer(frozenState, {
      type: actionTypes.ON_USER_BANNED,
      payload: { channel, user: currentUser, currentUser },
    });
    expect(bannedState.currentOpenChannel).toBeNull();
  });

  it('handles basic channel and loading state transitions', () => {
    const channel = createChannel();
    const state = {
      ...initialState,
      currentOpenChannel: channel as any,
      allMessages: [createMessage(1) as any],
    };

    expect(reducer(state, { type: actionTypes.RESET_MESSAGES }).allMessages).toEqual([]);
    expect(reducer(state, { type: actionTypes.GET_PREV_MESSAGES_START }).loading).toBe(true);
    expect(reducer(state, { type: actionTypes.SET_CHANNEL_INVALID }).isInvalid).toBe(true);
    expect(reducer(state, { type: actionTypes.EXIT_CURRENT_CHANNEL, payload: channel }).currentOpenChannel).toBeNull();
    expect(reducer(state, { type: actionTypes.EXIT_CURRENT_CHANNEL, payload: createChannel('stale') })).toBe(state);
    expect(reducer(state, { type: actionTypes.SET_CURRENT_CHANNEL, payload: channel })).toBe(state);
  });

  it('marks previous message fetch failures as initialized without appending messages', () => {
    const channel = createChannel();
    const state = {
      ...initialState,
      currentOpenChannel: channel as any,
      allMessages: [createMessage(1) as any],
      loading: true,
      hasMore: true,
      lastMessageTimestamp: 500,
    };

    const nextState = reducer(state, {
      type: actionTypes.GET_PREV_MESSAGES_FAIL,
      payload: {
        currentOpenChannel: channel,
        messages: [createMessage(2)],
        hasMore: true,
        lastMessageTimestamp: 200,
      },
    });

    expect(nextState.loading).toBe(false);
    expect(nextState.initialized).toBe(true);
    expect(nextState.hasMore).toBe(false);
    expect(nextState.lastMessageTimestamp).toBe(0);
    expect(nextState.allMessages).toEqual(state.allMessages);
  });

  it('ignores stale or duplicate pending messages and updates existing failed messages', () => {
    const channel = createChannel();
    const pendingMessage = createMessage(1, 'req-1');
    const existingState = {
      ...initialState,
      currentOpenChannel: channel as any,
      allMessages: [pendingMessage] as any,
    };

    expect(reducer(existingState, {
      type: actionTypes.SENDING_MESSAGE_START,
      payload: { channel: createChannel('stale'), message: createMessage(2, 'req-2') },
    })).toBe(existingState);
    expect(reducer(existingState, {
      type: actionTypes.SENDING_MESSAGE_START,
      payload: { channel, message: createMessage(3, 'req-1') },
    })).toBe(existingState);

    const failedMessage = createMessage(4, 'req-1');
    const failedState = reducer(existingState, {
      type: actionTypes.SENDING_MESSAGE_FAILED,
      payload: failedMessage,
    });

    expect(failedState.allMessages).toEqual([failedMessage]);
    expect((failedState.allMessages[0] as any).sendingStatus).toBe('failed');
  });

  it('trims messages only when the limit is valid and smaller than the current list', () => {
    const secondMessage = createMessage(2);
    const thirdMessage = createMessage(3);
    const state = {
      ...initialState,
      allMessages: [createMessage(1), secondMessage, thirdMessage] as any,
    };

    expect(reducer(state, { type: actionTypes.TRIM_MESSAGE_LIST, payload: { messageLimit: 2 } }).allMessages)
      .toEqual([secondMessage, thirdMessage]);
    expect(reducer(state, { type: actionTypes.TRIM_MESSAGE_LIST, payload: { messageLimit: 0 } })).toBe(state);
    expect(reducer(state, { type: actionTypes.TRIM_MESSAGE_LIST, payload: { messageLimit: 5 } })).toBe(state);
  });

  it('updates resent messages and fetched participant lists for the current channel', () => {
    const channel = createChannel();
    const resentMessage = createMessage(10, 'req-1');
    const state = {
      ...initialState,
      currentOpenChannel: channel as any,
      allMessages: [createMessage(1, 'req-1')] as any,
      participants: [{ userId: 'participant-1' }] as any,
    };

    const resentState = reducer(state, {
      type: actionTypes.RESENDING_MESSAGE_START,
      payload: { channel, message: resentMessage },
    });
    expect(resentState.allMessages).toEqual([resentMessage]);
    expect(reducer(state, {
      type: actionTypes.RESENDING_MESSAGE_START,
      payload: { channel: createChannel('stale'), message: resentMessage },
    })).toBe(state);

    const participantState = reducer(state, {
      type: actionTypes.FETCH_PARTICIPANT_LIST,
      payload: { channel, users: [{ userId: 'participant-2' }] },
    });
    expect(participantState.participants).toEqual([{ userId: 'participant-1' }, { userId: 'participant-2' }]);
    expect(reducer(state, {
      type: actionTypes.FETCH_PARTICIPANT_LIST,
      payload: { channel: createChannel('stale'), users: [{ userId: 'participant-2' }] },
    })).toBe(state);
  });

  it('adds banned and muted user ids only from valid current-channel payloads', () => {
    const channel = createChannel();
    const state = {
      ...initialState,
      currentOpenChannel: channel as any,
    };

    expect(reducer(state, {
      type: actionTypes.FETCH_BANNED_USER_LIST,
      payload: { channel, users: [{ userId: 'banned-1' }] },
    }).bannedParticipantIds).toEqual(['banned-1']);
    expect(reducer(state, {
      type: actionTypes.FETCH_MUTED_USER_LIST,
      payload: { channel, users: [{ userId: 'muted-1' }] },
    }).mutedParticipantIds).toEqual(['muted-1']);
    expect(reducer(state, {
      type: actionTypes.FETCH_BANNED_USER_LIST,
      payload: { channel, users: [{ nickname: 'missing-user-id' }] },
    })).toBe(state);
    expect(reducer(state, {
      type: actionTypes.FETCH_MUTED_USER_LIST,
      payload: { channel: createChannel('stale'), users: [{ userId: 'muted-1' }] },
    })).toBe(state);
  });

  it('handles message received, updated, deleted, and deleted-by-req-id events', () => {
    const channel = createChannel();
    const message = createMessage(1, 'req-1');
    const receivedMessage = createMessage(2);
    const state = {
      ...initialState,
      currentOpenChannel: channel as any,
      allMessages: [message] as any,
    };

    expect(reducer(state, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { channel, message: receivedMessage },
    }).allMessages).toEqual([message, receivedMessage]);
    expect(reducer(state, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { channel, message },
    })).toBe(state);
    expect(reducer(state, {
      type: actionTypes.ON_MESSAGE_RECEIVED,
      payload: { channel: createChannel('stale'), message: createMessage(3) },
    })).toBe(state);

    const updatedMessage = createMessage(1, 'updated-req');
    expect(reducer(state, {
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: { channel, message: updatedMessage },
    }).allMessages).toEqual([updatedMessage]);
    expect(reducer(state, {
      type: actionTypes.ON_MESSAGE_DELETED,
      payload: { channel, messageId: 1 },
    }).allMessages).toEqual([]);
    expect(reducer(state, {
      type: actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
      payload: 'req-1',
    }).allMessages).toEqual([]);
  });

  it('handles operator, participant, ban, unban, freeze, change, and delete events', () => {
    const channel = createChannel();
    const changedChannel = createChannel('open-channel-url', [{ userId: 'operator-2' }]);
    const participant = { userId: 'participant-1' };
    const bannedUser = { userId: 'banned-user' };
    const state = {
      ...initialState,
      currentOpenChannel: channel as any,
      participants: [participant] as any,
      bannedParticipantIds: ['banned-user'],
      frozen: true,
    };

    expect(reducer(state, {
      type: actionTypes.ON_OPERATOR_UPDATED,
      payload: { channel: changedChannel, operators: changedChannel.operators },
    }).operators).toEqual(changedChannel.operators);
    expect(reducer(state, {
      type: actionTypes.ON_USER_ENTERED,
      payload: { channel, user: { userId: 'participant-2' } },
    }).participants).toEqual([participant, { userId: 'participant-2' }]);
    expect(reducer(state, {
      type: actionTypes.ON_USER_EXITED,
      payload: { channel, user: participant },
    }).participants).toEqual([]);
    expect(reducer(state, {
      type: actionTypes.ON_USER_BANNED,
      payload: { channel, user: { userId: 'other-user' }, currentUser: { userId: 'current-user' } },
    }).bannedParticipantIds).toEqual(['banned-user', 'other-user']);
    expect(reducer(state, {
      type: actionTypes.ON_USER_UNBANNED,
      payload: { channel, user: bannedUser },
    }).bannedParticipantIds).toEqual([]);
    expect(reducer(state, { type: actionTypes.ON_CHANNEL_UNFROZEN, payload: channel }).frozen).toBe(false);
    expect(reducer(state, { type: actionTypes.ON_CHANNEL_CHANGED, payload: changedChannel }).currentOpenChannel).toBe(changedChannel);
    expect(reducer(state, { type: actionTypes.ON_CHANNEL_DELETED, payload: channel.url }).currentOpenChannel).toBeNull();
  });

  it('returns current state for stale events, metadata events, mentions, and unknown actions', () => {
    const state = {
      ...initialState,
      currentOpenChannel: createChannel('current') as any,
      participants: [{ userId: 'participant-1' }] as any,
      mutedParticipantIds: ['muted-user'],
    };
    const stalePayload = { channel: createChannel('stale'), user: { userId: 'user-1' } };

    [
      actionTypes.ON_MESSAGE_UPDATED,
      actionTypes.ON_MESSAGE_DELETED,
      actionTypes.ON_OPERATOR_UPDATED,
      actionTypes.ON_USER_ENTERED,
      actionTypes.ON_USER_EXITED,
      actionTypes.ON_USER_MUTED,
      actionTypes.ON_USER_UNMUTED,
      actionTypes.ON_USER_BANNED,
      actionTypes.ON_USER_UNBANNED,
      actionTypes.ON_META_DATA_CREATED,
      actionTypes.ON_META_DATA_UPDATED,
      actionTypes.ON_META_DATA_DELETED,
      actionTypes.ON_META_COUNTERS_CREATED,
      actionTypes.ON_META_COUNTERS_UPDATED,
      actionTypes.ON_META_COUNTERS_DELETED,
      actionTypes.ON_MENTION_RECEIVED,
      'UNKNOWN_ACTION',
    ].forEach((type) => {
      expect(reducer(state, { type, payload: stalePayload })).toBe(state);
    });
    expect(reducer(state, { type: actionTypes.ON_CHANNEL_FROZEN, payload: createChannel('stale') })).toBe(state);
    expect(reducer(state, { type: actionTypes.ON_CHANNEL_UNFROZEN, payload: createChannel('stale') })).toBe(state);
    expect(reducer(state, { type: actionTypes.ON_CHANNEL_CHANGED, payload: createChannel('stale') })).toBe(state);
    expect(reducer(state, { type: actionTypes.ON_CHANNEL_DELETED, payload: 'stale' })).toBe(state);
  });
});

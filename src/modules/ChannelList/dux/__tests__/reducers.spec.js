import mockData, { channel1, channel0, users, creatingChannel } from '../data.mock';
import * as actionTypes from '../actionTypes';
import reducers from '../reducers';
import initialState from '../initialState';
const [user1, user2, user3] = users;

describe('Channels-Reducers', () => {
  it('should set channels on INIT_CHANNELS_SUCCESS', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.INIT_CHANNELS_SUCCESS,
      payload: { channelList: mockData.allChannels },
    });

    expect(nextState.initialized).toEqual(true);
    expect(nextState.allChannels).toEqual(mockData.allChannels);
    expect(nextState.currentChannel.url).toEqual(mockData.allChannels[0].url);
  });

    // https://sendbird.atlassian.net/browse/UIKIT-2158
    it('should check if ITNITAL_LOADING state is true', () => {
      expect(initialState.loading).toEqual(true);
    });

  it('should handle create new channel using CREATE_CHANNEL', () => {
    const newChannel = mockData.allChannels[1];
    const nextState = reducers(mockData, {
      type: actionTypes.CREATE_CHANNEL,
      payload: newChannel,
    });

    expect(nextState.allChannels[0].url).toEqual(newChannel.url);
    expect(nextState.currentChannel.url).toEqual(newChannel.url);
  });

  it('should not set with new channel when calling USER_INVITED', () => {
    const newChannel = mockData.allChannels[1];
    const nextState = reducers(mockData, {
      type: actionTypes.USER_INVITED,
      payload: newChannel,
    });

    expect(nextState.allChannels[0].url).toEqual(newChannel.url);
    expect(nextState.currentChannel.url).not.toEqual(newChannel.url);
  });

  it('should handle leave channel action LEAVE_CHANNEL_SUCCESS', () => {
    const channelUrl = "sendbird_group_channel_13883929_89ea0faddf24ba6328e95ff56b0b37960f400c83";
    const nextState = reducers(mockData, {
      type: actionTypes.LEAVE_CHANNEL_SUCCESS,
      payload: channelUrl,
    });

    expect(nextState.allChannels.length).toEqual(2);
    expect(nextState.allChannels.find(c => c.url === channelUrl)).toBeUndefined();
  });

  it('should handle push changed channel to the top on ON_CHANNEL_CHANGED', () => {
    const lastMessage = "new last message";
    const payload = {
      ...mockData.allChannels[0],
    };
    payload.lastMessage.message = lastMessage;

    const nextState = reducers(mockData, {
      type: actionTypes.ON_CHANNEL_CHANGED,
      payload,
    });
    expect(nextState.allChannels.length).toEqual(3);
    expect(nextState.allChannels[0].lastMessage.message).toEqual(lastMessage);
  });

  it('should not be changed empty channel on ON_CHANNEL_CHANGED', () => {
    const emptyChannel = { ...channel0, lastMessage: null };
    const nextState = reducers(mockData, {
      type: actionTypes.ON_CHANNEL_CHANGED,
      payload: emptyChannel,
    });
    expect(nextState.allChannels.length).toEqual(3);
    expect(nextState.allChannels[0].lastMessage.message).toEqual(mockData.allChannels[0].lastMessage.message);
  });

  it('should handle push changed channel to the top on ON_CHANNEL_CHANGED even when its not there', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.ON_CHANNEL_CHANGED,
      payload: mockData.allChannels[0],
    });
    expect(nextState.allChannels.length).toEqual(1);
    expect(nextState.allChannels[0].url).toEqual(mockData.allChannels[0].url);
  });

  it('should handle SET_CURRENT_CHANNEL', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.SET_CURRENT_CHANNEL,
      payload: mockData.allChannels[0].url,
    });
    expect(nextState.currentChannel).toEqual(mockData.allChannels[0].url);
  });

  it('should attach more channels on FETCH_CHANNELS_SUCCESS', () => {
    const nextState = reducers(mockData, {
      type: actionTypes.FETCH_CHANNELS_SUCCESS,
      payload: [channel0, channel1],
    });
    expect(nextState.allChannels.length).toEqual(mockData.allChannels.length + 2);
    expect(nextState.allChannels).toEqual([
      ...mockData.allChannels,
      channel0,
      channel1,
    ]);
  });

  it('should ignore already existing channels on attaching more channels on FETCH_CHANNELS_SUCCESS', () => {
    const nextState = reducers(mockData, {
      type: actionTypes.FETCH_CHANNELS_SUCCESS,
      payload: [mockData.allChannels[0], channel1],
    });
    expect(nextState.allChannels.length).toEqual(mockData.allChannels.length + 1);
    expect(nextState.allChannels).toEqual([
      ...mockData.allChannels,
      channel1,
    ]);
  });

  it('should set channelListQuery for filter', () => {
    const channelListQuery = {
      searchFilter: {
        search_fields: ['channel_name', 'member_nicknames'],
        search_query: 'abcd',
      },
      userIdsFilter: {
        userIds: ['hoon001', 'hoon002'],
        includeMode: false,
        queryType: 'AND',
      },
      nicknameContainsFilter: 'honny',
      channelNameContainsFilter: '1010',
      memberStateFilter: 'all',
      customTypesFilter: ['apple', 'banana'],
      channelUrlsFilter: ['channel1010', 'channel1011'],
      superChannelFilter: 'all' || 'super' || 'nonsuper' || 'broadcast_only',
      publicChannelFilter: 'all' || 'public' || 'private',
      customTypeStartsWithFilter: 'app',
      unreadChannelFilter: 'all' || 'unread_message',
      hiddenChannelFilter: 'unhidden_only' || 'hidden_only',
      includeFrozen: true,
    };
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { currentUserId: user1.userId, channelListQuery: channelListQuery },
    });
    const appliedQuery = appliedParamsState.channelListQuery;
    expect(appliedQuery.searchFilter.search_fields).toEqual(channelListQuery.searchFilter.search_fields);
    expect(appliedQuery.searchFilter.search_query).toEqual(channelListQuery.searchFilter.search_query);
    expect(appliedQuery.userIdsFilter.userIds).toEqual(channelListQuery.userIdsFilter.userIds);
    expect(appliedQuery.userIdsFilter.includeMode).toEqual(channelListQuery.userIdsFilter.includeMode);
    expect(appliedQuery.userIdsFilter.queryType).toEqual(channelListQuery.userIdsFilter.queryType);
    expect(appliedQuery.nicknameContainsFilter).toEqual(channelListQuery.nicknameContainsFilter);
    expect(appliedQuery.channelNameContainsFilter).toEqual(channelListQuery.channelNameContainsFilter);
    expect(appliedQuery.memberStateFilter).toEqual(channelListQuery.memberStateFilter);
    expect(appliedQuery.customTypesFilter).toEqual(channelListQuery.customTypesFilter);
    expect(appliedQuery.channelUrlsFilter).toEqual(channelListQuery.channelUrlsFilter);
    expect(appliedQuery.superChannelFilter).toEqual(channelListQuery.superChannelFilter);
    expect(appliedQuery.publicChannelFilter).toEqual(channelListQuery.publicChannelFilter);
    expect(appliedQuery.customTypeStartsWithFilter).toEqual(channelListQuery.customTypeStartsWithFilter);
    expect(appliedQuery.unreadChannelFilter).toEqual(channelListQuery.unreadChannelFilter);
    expect(appliedQuery.hiddenChannelFilter).toEqual(channelListQuery.hiddenChannelFilter);
    expect(appliedQuery.includeFrozen).toEqual(channelListQuery.includeFrozen);
  });

  it('should filter by searchFilter of channelListQuery', () => {
    /**
     * search_field is member_nickname > create channel inviting target member > target member leave
     * > target member join > change search_field to channel_name > another member join > change channel name
     */
    const channelListQuery = {
      searchFilter: { fields: ['member_nickname'], query: user1.nickname },
    };
    const newChannel = { ...creatingChannel };
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { currentUserId: user1.userId, channelListQuery },
    });
    expect(appliedParamsState.channelListQuery.searchFilter.query).toEqual(user1.nickname);
    expect(appliedParamsState.allChannels[0].url).not.toEqual(newChannel.url);
    const createdChannelState = reducers(appliedParamsState, {
      type: actionTypes.CREATE_CHANNEL,
      payload: newChannel,
    });
    expect(createdChannelState.allChannels[0].url).toEqual(newChannel.url);
    expect(createdChannelState.allChannels.length).toEqual(appliedParamsState.allChannels.length + 1);
    const onUserLeftState = reducers(createdChannelState, {
      type: actionTypes.ON_USER_LEFT,
      payload: {
        channel: { ...newChannel, members: [user2] },
        isMe: true,
      },
    });
    expect(onUserLeftState.allChannels[0].url).not.toEqual(newChannel.url);
    expect(onUserLeftState.allChannels.length).toEqual(createdChannelState.allChannels.length - 1);
    const onUserJoinedState = reducers(onUserLeftState, {
      type: actionTypes.ON_USER_JOINED,
      payload: { ...newChannel, members: [user1, user2] },
    });
    expect(onUserJoinedState.allChannels[0].url).toEqual(newChannel.url);
    expect(onUserJoinedState.allChannels.length).toEqual(onUserLeftState.allChannels.length + 1);
    const paramsWithChannelNameState = reducers(onUserJoinedState, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: {
        currentUserId: user1.userId,
        channelListQuery: { searchFilter: { ...channelListQuery.searchFilter, fields: ['channel_name'] } },
      },
    });
    expect(paramsWithChannelNameState.channelListQuery.searchFilter.fields).toEqual(['channel_name']);
    expect(paramsWithChannelNameState.channelListQuery.searchFilter.query).toEqual(user1.nickname);
    const anotherUserJoinedState = reducers(paramsWithChannelNameState, {
      type: actionTypes.ON_USER_JOINED,
      payload: { ...newChannel, members: [user1, user2, user3] },
    });
    expect(anotherUserJoinedState.allChannels[0].url).not.toEqual(newChannel.url);
    expect(anotherUserJoinedState.allChannels.length).toEqual(paramsWithChannelNameState.allChannels.length - 1);
    const onChannelChangedState = reducers(anotherUserJoinedState, {
      type: actionTypes.ON_CHANNEL_CHANGED,
      payload: { ...newChannel, name: `home party for ${user1.nickname}` },
    });
    expect(onChannelChangedState.allChannels[0].url).toEqual(newChannel.url);
    expect(onChannelChangedState.allChannels.length).toEqual(anotherUserJoinedState.allChannels.length + 1);
  });

  describe('filter by userIdsFilter of channelListQuery', () => {
    const newChannel = { ...creatingChannel };
    const exactUserIdsFilterState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: {
        currentUserId: user1.userId,
        channelListQuery: {
          userIdsFilter: { userIds: [user1.userId, user2.userId], includeMode: false },
        },
      }
    });
    expect(exactUserIdsFilterState.allChannels[0].url).not.toEqual(newChannel.url);
    const includeORUserIdsFilterState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: {
        currentUserId: user1.userId,
        channelListQuery: {
          userIdsFilter: {
            userIds: [user1.userId, user2.userId],
            includeMode: true,
            queryType: 'OR',
          },
        },
      }
    });
    expect(includeORUserIdsFilterState.allChannels[0].url).not.toEqual(newChannel.url);
    const includeANDUserIdsFilterState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: {
        currentUserId: user1.userId,
        channelListQuery: {
          userIdsFilter: {
            userIds: [user1.userId, user2.userId],
            includeMode: true,
            queryType: 'AND',
          },
        },
      }
    });
    expect(includeANDUserIdsFilterState.allChannels[0].url).not.toEqual(newChannel.url);

    describe('exact userIdsFilter', () => {
      test('create channel inviting exact members > leave/join member', () => {
        const createChannelState = reducers(exactUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1, user2] },
        });
        expect(createChannelState.allChannels[0].url).toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(exactUserIdsFilterState.allChannels.length + 1);
        const memberLeftState = reducers(createChannelState, {
          type: actionTypes.ON_USER_LEFT,
          payload: {
            channel: { ...newChannel, members: [user1] },
            isMe: false,
          },
        });
        expect(memberLeftState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(memberLeftState.allChannels.length).toEqual(createChannelState.allChannels.length - 1);
        const memberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user2, user3] },
        });
        expect(memberJoinedState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(memberJoinedState.allChannels.length).toEqual(createChannelState.allChannels.length - 1);
      });
      test('create channel inviting more members > leave member', () => {
        const createChannelState = reducers(exactUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1, user2, user3] },
        });
        expect(createChannelState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(exactUserIdsFilterState.allChannels.length);
        const memberLeftState = reducers(createChannelState, {
          type: actionTypes.ON_USER_LEFT,
          payload: {
            channel: { ...newChannel, members: [user1, user2] },
            isMe: false,
          }
        });
        expect(memberLeftState.allChannels[0].url).toEqual(newChannel.url);
        expect(memberLeftState.allChannels.length).toEqual(createChannelState.allChannels.length + 1);
      });
      test('create channel inviting less members > join member / join another member', () => {
        const createChannelState = reducers(exactUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1] },
        });
        expect(createChannelState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(exactUserIdsFilterState.allChannels.length);
        const memberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user2] },
        });
        expect(memberJoinedState.allChannels[0].url).toEqual(newChannel.url);
        expect(memberJoinedState.allChannels.length).toEqual(createChannelState.allChannels.length + 1);
        const anotherMemberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user3] },
        });
        expect(anotherMemberJoinedState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(anotherMemberJoinedState.allChannels.length).toEqual(createChannelState.allChannels.length);
      });
    });
    describe('include OR userIdsFilter', () => {
      test('create channel inviting exact members > leave/join member', () => {
        const createChannelState = reducers(includeORUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1, user2] },
        });
        expect(createChannelState.allChannels[0].url).toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(includeORUserIdsFilterState.allChannels.length + 1);
        const memberLeftState = reducers(createChannelState, {
          type: actionTypes.ON_USER_LEFT,
          payload: {
            channel: { ...newChannel, members: [user1] },
            isMe: false,
          }
        });
        expect(memberLeftState.allChannels[0].url).toEqual(newChannel.url);
        expect(memberLeftState.allChannels.length).toEqual(createChannelState.allChannels.length);
        const memberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user2, user3] },
        });
        expect(memberJoinedState.allChannels[0].url).toEqual(newChannel.url);
        expect(memberJoinedState.allChannels.length).toEqual(createChannelState.allChannels.length);
      });
      test('create channel inviting less members', () => {
        const createChannelState = reducers(includeORUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1] },
        });
        expect(createChannelState.allChannels[0].url).toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(includeORUserIdsFilterState.allChannels.length + 1);
      })
      test('create channel inviting incorrect members > target member joined', () => {
        const createChannelState = reducers(includeORUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user3] },
        });
        expect(createChannelState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(includeORUserIdsFilterState.allChannels.length);
        const targetMemberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user3] },
        });
        expect(targetMemberJoinedState.allChannels[0].url).toEqual(newChannel.url);
        expect(
          targetMemberJoinedState.allChannels.length
        ).toEqual(createChannelState.allChannels.length + 1);
      });
    });

    describe('include AND userIdsFilter', () => {
      test('create channel inviting exact members > leave/join member', () => {
        const createChannelState = reducers(includeANDUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1, user2] },
        });
        expect(createChannelState.allChannels[0].url).toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(includeANDUserIdsFilterState.allChannels.length + 1);
        const memberLeftState = reducers(createChannelState, {
          type: actionTypes.ON_USER_LEFT,
          payload: {
            channel: { ...newChannel, members: [user1] },
            isMe: false,
          }
        });
        expect(memberLeftState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(
          memberLeftState.allChannels.length
        ).toEqual(createChannelState.allChannels.length - 1);
        const memberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user2, user3] },
        });
        expect(memberJoinedState.allChannels[0].url).toEqual(newChannel.url);
        expect(memberJoinedState.allChannels.length).toEqual(createChannelState.allChannels.length);
      });
      test('create channel inviting less members > target member joined', () => {
        const createChannelState = reducers(includeANDUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1] },
        });
        expect(createChannelState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(includeANDUserIdsFilterState.allChannels.length);
        const includeMemberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user2] },
        });
        expect(includeMemberJoinedState.allChannels[0].url).toEqual(newChannel.url);
        expect(
          includeMemberJoinedState.allChannels.length
        ).toEqual(createChannelState.allChannels.length + 1);
      });
      test('create channel inviting incorrect members > target member joined', () => {
        const createChannelState = reducers(includeANDUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user3] },
        });
        expect(createChannelState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(includeANDUserIdsFilterState.allChannels.length);
        const memberJoinedState = reducers(createChannelState, {
          type: actionTypes.ON_USER_JOINED,
          payload: { ...newChannel, members: [user1, user3] },
        });
        expect(memberJoinedState.allChannels[0].url).not.toEqual(newChannel.url);
        expect(
          memberJoinedState.allChannels.length
        ).toEqual(createChannelState.allChannels.length);
      });
      test('create channel inviting over members', () => {
        const createChannelState = reducers(includeANDUserIdsFilterState, {
          type: actionTypes.CREATE_CHANNEL,
          payload: { ...newChannel, members: [user1, user2, user3] },
        });
        expect(createChannelState.allChannels[0].url).toEqual(newChannel.url);
        expect(createChannelState.allChannels.length).toEqual(includeANDUserIdsFilterState.allChannels.length + 1);
      });
    });
  });

  it('should filter by nicknameContainsFilter of channelListQuery', () => {
    /**
     * create channel inviting all members > target member left > target member joined
     */
    const channelListQuery = { nicknameContainsFilter: 'honey' };
    const newChannel = { ...creatingChannel };
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { currentUserId: user1.userId, channelListQuery },
    });
    expect(appliedParamsState.allChannels[0].url).not.toEqual(newChannel.url);

    const onChannelCreateState = reducers(appliedParamsState, {
      type: actionTypes.CREATE_CHANNEL,
      payload: newChannel,
    });
    expect(onChannelCreateState.allChannels[0].url).toEqual(newChannel.url);
    expect(onChannelCreateState.allChannels.length).toEqual(appliedParamsState.allChannels.length + 1);
    const onUserLeftState = reducers(onChannelCreateState, {
      type: actionTypes.ON_USER_LEFT,
      payload: {
        channel: { ...newChannel, members: [user1, user2] },
        isMe: false,
      },
    });
    expect(onUserLeftState.allChannels[0].url).not.toEqual(newChannel.url);
    expect(onUserLeftState.allChannels.length).toEqual(onChannelCreateState.allChannels.length - 1);
    const onUserJoinedState = reducers(onUserLeftState, {
      type: actionTypes.ON_USER_JOINED,
      payload: { ...newChannel, members: [user1, user2, user3] },
    });
    expect(onUserJoinedState.allChannels[0].url).toEqual(newChannel.url);
    expect(onUserJoinedState.allChannels.length).toEqual(onUserLeftState.allChannels.length + 1);
  });

  it('should filter by channelNameContainsFilter of channelListQuery', () => {
    /**
     * create channel > change channel name to not match
     */
    const channelListQuery = { channelNameContainsFilter: 'home' };
    const newChannel = { ...creatingChannel };
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { currentUserId: user1.userId, channelListQuery: channelListQuery },
    });
    expect(appliedParamsState.allChannels[0].url).not.toEqual(newChannel.url);

    const onChannelCreateState = reducers(appliedParamsState, {
      type: actionTypes.CREATE_CHANNEL,
      payload: newChannel,
    });
    expect(onChannelCreateState.allChannels[0].url).toEqual(newChannel.url);
    expect(onChannelCreateState.allChannels.length).toEqual(appliedParamsState.allChannels.length + 1);
    const onChannelChangedState = reducers(onChannelCreateState, {
      type: actionTypes.ON_CHANNEL_CHANGED,
      payload: { ...newChannel, name: 'party party' },
    });
    expect(onChannelChangedState.allChannels[0].url).not.toEqual(newChannel.url);
    expect(onChannelChangedState.allChannels.length).toEqual(onChannelCreateState.allChannels.length - 1);
  });

  describe('filter by customTypesFilter of channelListQuery', () => {
    const channelListQuery = { customTypesFilter: ['apple', 'banana'] };
    const newChannel = { ...creatingChannel };
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { currentUserId: user1.userId, channelListQuery },
    });
    expect(appliedParamsState.allChannels[0].url).not.toEqual(newChannel.url);
    test('create channel without customType > add customType', () => {
      const createChannelState = reducers(appliedParamsState, {
        type: actionTypes.CREATE_CHANNEL,
        payload: newChannel,
      });
      expect(createChannelState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(createChannelState.allChannels.length).toEqual(appliedParamsState.allChannels.length);
      const addCustomTypeState = reducers(createChannelState, {
        type: actionTypes.ON_CHANNEL_CHANGED,
        payload: { ...newChannel, customType: channelListQuery.customTypesFilter[0] },
      });
      expect(addCustomTypeState.allChannels[0].url).toEqual(newChannel.url);
      expect(addCustomTypeState.allChannels.length).toEqual(createChannelState.allChannels.length + 1);
    });
    test('create channel with customType > change customType to not match', () => {
      const createChannelState = reducers(appliedParamsState, {
        type: actionTypes.CREATE_CHANNEL,
        payload: { ...newChannel, customType: channelListQuery.customTypesFilter[0] },
      });
      expect(createChannelState.allChannels[0].url).toEqual(newChannel.url);
      expect(
        createChannelState.allChannels.length
      ).toEqual(appliedParamsState.allChannels.length + 1);
      const onChannelChangedState = reducers(createChannelState, {
        type: actionTypes.ON_CHANNEL_CHANGED,
        payload: { ...newChannel, customType: 'cherry' },
      });
      expect(onChannelChangedState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(onChannelChangedState.allChannels.length).toEqual(createChannelState.allChannels.length - 1);
    });
  });

  describe('filter by customTypeStartsWithFilter of channelListQuery', () => {
    const channelListQuery = { customTypeStartsWithFilter: 'app' };
    const newChannel = { ...creatingChannel };
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { currentUserId: user1.userId, channelListQuery },
    });
    expect(appliedParamsState.allChannels[0].url).not.toEqual(newChannel.url);

    test('create channel without customType', () => {
      const onChannelCreateState = reducers(appliedParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: newChannel,
      });
      expect(onChannelCreateState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(onChannelCreateState.allChannels.length).toEqual(appliedParamsState.allChannels.length);
    });
    test('create channel with customType > change to not match > change to match', () => {
      const onChannelCreateState = reducers(appliedParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, customType: 'apple' }
      });
      expect(onChannelCreateState.allChannels[0].url).toEqual(newChannel.url);
      expect(onChannelCreateState.allChannels.length).toEqual(appliedParamsState.allChannels.length + 1);
      const incorrectCustomTypeState = reducers(onChannelCreateState, {
        type: actionTypes.ON_CHANNEL_CHANGED, payload: { ...newChannel, customType: 'cherry' },
      });
      expect(incorrectCustomTypeState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(incorrectCustomTypeState.allChannels.length).toEqual(onChannelCreateState.allChannels.length - 1);
      const correctCustomTypeState = reducers(incorrectCustomTypeState, {
        type: actionTypes.ON_CHANNEL_CHANGED, payload: { ...newChannel, customType: 'application' },
      });
      expect(correctCustomTypeState.allChannels[0].url).toEqual(newChannel.url);
      expect(
        correctCustomTypeState.allChannels.length
      ).toEqual(incorrectCustomTypeState.allChannels.length + 1);
    });
  });

  it('should filter by channelUrlsFilter of channelListQuery', () => {
    const channelListQuery = { channelUrlsFilter: ['channel1010', 'channel1011'] };
    const newChannel = { ...creatingChannel };
    const appliedParamsState = reducers(mockData, {
      type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { currentUserId: user1.userId, channelListQuery }
    });
    expect(appliedParamsState.allChannels[0].url).not.toEqual(newChannel.url);

    const onChannelCreateState = reducers(appliedParamsState, {
      type: actionTypes.CREATE_CHANNEL,
      payload: { ...newChannel, url: 'channel2020' },
    });
    expect(onChannelCreateState.allChannels[0].url).not.toEqual(newChannel.url);
    expect(onChannelCreateState.allChannels.length).toEqual(appliedParamsState.allChannels.length);
    const onChannelCreateStateWithIncludedUrl = reducers(appliedParamsState, {
      type: actionTypes.CREATE_CHANNEL,
      payload: { ...newChannel, url: 'channel1010' },
    });
    expect(onChannelCreateStateWithIncludedUrl.allChannels[0].url).toEqual(newChannel.url);
    expect(onChannelCreateStateWithIncludedUrl.allChannels.length).toEqual(appliedParamsState.allChannels.length + 1);
  });

  describe('filter by superChannelFilter of channelListQuery', () => {
    const SuperChannelFilters = { All: 'all', SUPER: 'super', NONSUPER: 'nonsuper' };
    const newChannel = { ...creatingChannel };
    test('superChannelFilter is All', () => {
      const allParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { superChannelFilter: SuperChannelFilters.All } },
      });
      expect(allParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnAllState = reducers(allParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isSuper: false },
      });
      expect(createChannelOnAllState.allChannels[0].url).toEqual(newChannel.url);
      expect(createChannelOnAllState.allChannels.length).toEqual(allParamsState.allChannels.length + 1);
      const createSuperChannelOnAllState = reducers(allParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isSuper: true },
      });
      expect(createSuperChannelOnAllState.allChannels[0].url).toEqual(newChannel.url);
      expect(createSuperChannelOnAllState.allChannels.length).toEqual(allParamsState.allChannels.length + 1);
    });
    test('superChannelFilter is SUPER', () => {
      const superParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { superChannelFilter: SuperChannelFilters.SUPER } },
      });
      expect(superParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnSuperState = reducers(superParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isSuper: false },
      });
      expect(createChannelOnSuperState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(createChannelOnSuperState.allChannels.length).toEqual(superParamsState.allChannels.length);
      const createSuperChannelOnSuperState = reducers(superParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isSuper: true },
      });
      expect(createSuperChannelOnSuperState.allChannels[0].url).toEqual(newChannel.url);
      expect(createSuperChannelOnSuperState.allChannels.length).toEqual(superParamsState.allChannels.length + 1);
    });
    test('superChannelFilter is NONSUPER', () => {
      const nonsuperParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { superChannelFilter: SuperChannelFilters.NONSUPER } },
      });
      expect(nonsuperParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnNonsuperState = reducers(nonsuperParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isSuper: false },
      });
      expect(createChannelOnNonsuperState.allChannels[0].url).toEqual(newChannel.url);
      expect(createChannelOnNonsuperState.allChannels.length).toEqual(nonsuperParamsState.allChannels.length + 1);
      const createSuperChannelOnNonsuperState = reducers(nonsuperParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isSuper: true },
      });
      expect(createSuperChannelOnNonsuperState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(createSuperChannelOnNonsuperState.allChannels.length).toEqual(nonsuperParamsState.allChannels.length);
    });
  });

  describe('filter by publicChannelFilter of channelListQuery', () => {
    const PublicChannelFilter = { ALL: 'all', PUBLIC: 'public', PRIVATE: 'private' };
    const newChannel = { ...creatingChannel };
    test('publicChannelFilter is ALL', () => {
      const allParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { publicChannelFilter: PublicChannelFilter.ALL } },
      });
      expect(allParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnAllState = reducers(allParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isPublic: false }
      });
      expect(createChannelOnAllState.allChannels[0].url).toEqual(newChannel.url);
      expect(createChannelOnAllState.allChannels.length).toEqual(allParamsState.allChannels.length + 1);
      const createPublicChannelOnAllState = reducers(allParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isPublic: false }
      });
      expect(createPublicChannelOnAllState.allChannels[0].url).toEqual(newChannel.url);
      expect(createPublicChannelOnAllState.allChannels.length).toEqual(allParamsState.allChannels.length + 1);
    });
    test('publicChannelFilter is PUBLIC', () => {
      const publicParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { publicChannelFilter: PublicChannelFilter.PUBLIC } },
      });
      expect(publicParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnPublicState = reducers(publicParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isPublic: false }
      });
      expect(createChannelOnPublicState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(createChannelOnPublicState.allChannels.length).toEqual(publicParamsState.allChannels.length);
      const createPublicChannelOnPublicState = reducers(publicParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isPublic: true }
      });
      expect(createPublicChannelOnPublicState.allChannels[0].url).toEqual(newChannel.url);
      expect(createPublicChannelOnPublicState.allChannels.length).toEqual(publicParamsState.allChannels.length + 1);
    });
    test('publicChannelFilter is PRIVATE', () => {
      const privateParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { publicChannelFilter: PublicChannelFilter.PRIVATE } },
      });
      expect(privateParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnPrivate = reducers(privateParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isPublic: false }
      });
      expect(createChannelOnPrivate.allChannels[0].url).toEqual(newChannel.url);
      expect(createChannelOnPrivate.allChannels.length).toEqual(privateParamsState.allChannels.length + 1);
      const createPublicChannelOnPrivateState = reducers(privateParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: { ...newChannel, isPublic: true }
      });
      expect(createPublicChannelOnPrivateState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(createPublicChannelOnPrivateState.allChannels.length).toEqual(privateParamsState.allChannels.length);
    });
  });

  describe('filter by unreadChannelFilter of channelListQuery', () => {
    const UnreadChannelFilter = { All: 'all', UNREAD_MESSAGE: 'unread_message' };
    const newChannel = { ...creatingChannel };
    test('unreadChannelFilter is ALL', () => {
      const allParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { unreadChannelFilter: UnreadChannelFilter.All } },
      });
      expect(allParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const channelCreatedOnAllState = reducers(allParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: newChannel,
      });
      expect(channelCreatedOnAllState.allChannels[0].url).toEqual(newChannel.url);
      expect(channelCreatedOnAllState.allChannels.length).toEqual(allParamsState.allChannels.length + 1);
      const readUpdatedOnAllState = reducers(channelCreatedOnAllState, {
        type: actionTypes.ON_READ_RECEIPT_UPDATED,
        payload: { ...newChannel, unreadMessageCount: 0 },
      });
      expect(readUpdatedOnAllState.allChannels[0].url).toEqual(newChannel.url);
      expect(readUpdatedOnAllState.allChannels.length).toEqual(channelCreatedOnAllState.allChannels.length);
      const unreadUpdatedOnAllState = reducers(channelCreatedOnAllState, {
        type: actionTypes.ON_READ_RECEIPT_UPDATED,
        payload: { ...newChannel, unreadParamsState: 1 },
      });
      expect(unreadUpdatedOnAllState.allChannels[0].url).toEqual(newChannel.url);
      expect(unreadUpdatedOnAllState.allChannels.length).toEqual(channelCreatedOnAllState.allChannels.length);
    });
    test('unreadChannelFilter is UNREAD_MESSAGE', () => {
      const unreadParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: {
          currentUserId: user1.userId,
          channelListQuery: { unreadChannelFilter: UnreadChannelFilter.UNREAD_MESSAGE },
        },
      });
      expect(unreadParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const channelCreatedOnUnreadState = reducers(unreadParamsState, {
        type: actionTypes.CREATE_CHANNEL, payload: newChannel,
      });
      expect(channelCreatedOnUnreadState.allChannels[0].url).toEqual(newChannel.url);
      expect(channelCreatedOnUnreadState.allChannels.length).toEqual(unreadParamsState.allChannels.length + 1);
      const readUpdatedOnUnreadState = reducers(channelCreatedOnUnreadState, {
        type: actionTypes.ON_READ_RECEIPT_UPDATED,
        payload: { ...newChannel, unreadMessageCount: 0 },
      });
      expect(readUpdatedOnUnreadState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(readUpdatedOnUnreadState.allChannels.length).toEqual(channelCreatedOnUnreadState.allChannels.length - 1);
      const unreadUpdatedOnUnreadState = reducers(channelCreatedOnUnreadState, {
        type: actionTypes.ON_READ_RECEIPT_UPDATED,
        payload: { ...newChannel, unreadMessageCount: 1 },
      });
      expect(unreadUpdatedOnUnreadState.allChannels[0].url).toEqual(newChannel.url);
      expect(unreadUpdatedOnUnreadState.allChannels.length).toEqual(channelCreatedOnUnreadState.allChannels.length);
    });
  });

  describe('filter by hiddenChannelFilter of channelListQuery', () => {
    const HiddenChannelFilter = {
      HIDDEN: 'hidden_only',
      UNHIDDEN: 'unhidden_only',
      HIDDEN_ALLOW_AUTO_UNHIDE: 'hidden_allow_auto_unhide',
      HIDDEN_PREVENT_AUTO_UNHIDE: 'hidden_prevent_auto_unhide',
    };
    const newChannel = { ...creatingChannel };
    test('hiddenChannelFilter is HIDDEN', () => {
      const hiddenParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { hiddenChannelFilter: HiddenChannelFilter.HIDDEN } },
      });
      expect(hiddenParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnHiddenState = reducers(hiddenParamsState, {
        type: actionTypes.CREATE_CHANNEL,
        payload: { ...newChannel, isHidden: false, hiddenState: 'unhidden' },
      });
      expect(createChannelOnHiddenState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(createChannelOnHiddenState.allChannels.length).toEqual(hiddenParamsState.allChannels.length);
      const hideChannelOnHiddenState = reducers(createChannelOnHiddenState, {
        type: actionTypes.ON_CHANNEL_ARCHIVED,
        payload: { ...newChannel, isHidden: true, hiddenState: 'hidden_only' },
      });
      expect(hideChannelOnHiddenState.allChannels[0].url).toEqual(newChannel.url);
      expect(hideChannelOnHiddenState.allChannels.length).toEqual(createChannelOnHiddenState.allChannels.length + 1);
      const unhideChannelOnHiddenState = reducers(hideChannelOnHiddenState, {
        type: actionTypes.ON_CHANNEL_CHANGED,
        payload: { ...newChannel, isHidden: false, hiddenState: 'unhidden' },
      });
      expect(unhideChannelOnHiddenState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(unhideChannelOnHiddenState.allChannels.length).toEqual(hideChannelOnHiddenState.allChannels.length - 1);
    });
    test('hiddenChannelFilter is UNHIDDEN', () => {
      const unhiddenParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: { currentUserId: user1.userId, channelListQuery: { hiddenChannelFilter: HiddenChannelFilter.UNHIDDEN } },
      });
      expect(unhiddenParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const createChannelOnUnhiddenState = reducers(unhiddenParamsState, {
        type: actionTypes.CREATE_CHANNEL,
        payload: { ...newChannel, isHidden: false, hiddenState: 'unhidden' },
      });
      expect(createChannelOnUnhiddenState.allChannels[0].url).toEqual(newChannel.url);
      expect(createChannelOnUnhiddenState.allChannels.length).toEqual(unhiddenParamsState.allChannels.length + 1);
      const hideChannelOnUnhiddenState = reducers(createChannelOnUnhiddenState, {
        type: actionTypes.ON_CHANNEL_ARCHIVED,
        payload: { ...newChannel, isHidden: true, hiddenState: 'hidden_only' },
      });
      expect(hideChannelOnUnhiddenState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(hideChannelOnUnhiddenState.allChannels.length).toEqual(createChannelOnUnhiddenState.allChannels.length - 1);
      const unhideChannelOnUnhiddenState = reducers(hideChannelOnUnhiddenState, {
        type: actionTypes.ON_CHANNEL_CHANGED,
        payload: { ...newChannel, isHidden: false, hiddenState: 'unhidden' },
      });
      expect(unhideChannelOnUnhiddenState.allChannels[0].url).toEqual(newChannel.url);
      expect(unhideChannelOnUnhiddenState.allChannels.length).toEqual(hideChannelOnUnhiddenState.allChannels.length + 1);
    });
    test('hiddenChannelFilter is HIDDEN_ALLOW_AUTO_UNHIDE', () => {
      const autoUnhideParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: {
          currentUserId: user1.userId,
          channelListQuery: { hiddenChannelFilter: HiddenChannelFilter.HIDDEN_ALLOW_AUTO_UNHIDE },
        },
      });
      expect(autoUnhideParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const hideWithAllowAutoOnAllowAutoState = reducers(
        {
          ...autoUnhideParamsState,
          allChannels: [{ ...newChannel, isHidden: false }, ...autoUnhideParamsState.allChannels],
        },
        {
          type: actionTypes.ON_CHANNEL_ARCHIVED,
          payload: { ...newChannel, isHidden: true, hiddenState: HiddenChannelFilter.HIDDEN_ALLOW_AUTO_UNHIDE },
        }
      );
      expect(hideWithAllowAutoOnAllowAutoState.allChannels[0].url).toEqual(newChannel.url);
      expect(hideWithAllowAutoOnAllowAutoState.allChannels.length).toEqual(autoUnhideParamsState.allChannels.length + 1);
      const hideWithPreventAutoOnAllowAutoState = reducers(
        {
          ...autoUnhideParamsState,
          allChannels: [{ ...newChannel, isHidden: false }, ...autoUnhideParamsState.allChannels],
        },
        {
          type: actionTypes.ON_CHANNEL_ARCHIVED,
          payload: { ...newChannel, isHidden: true, hiddenState: HiddenChannelFilter.HIDDEN_PREVENT_AUTO_UNHIDE },
        }
      );
      expect(hideWithPreventAutoOnAllowAutoState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(hideWithPreventAutoOnAllowAutoState.allChannels.length).toEqual(autoUnhideParamsState.allChannels.length);
    });
    test('hiddenChannelFilter is HIDDEN_PREVENT_AUTO_UNHIDE', () => {
      const preventAutoUnhideParamsState = reducers(mockData, {
        type: actionTypes.CHANNEL_LIST_PARAMS_UPDATED,
        payload: {
          currentUserId: user1.userId,
          channelListQuery: { hiddenChannelFilter: HiddenChannelFilter.HIDDEN_PREVENT_AUTO_UNHIDE },
        },
      });
      expect(preventAutoUnhideParamsState.allChannels[0].url).not.toEqual(newChannel.url);
      const hideWithAllowAutoOnPreventAutoState = reducers(
        {
          ...preventAutoUnhideParamsState,
          allChannels: [{ ...newChannel, isHidden: false }, ...preventAutoUnhideParamsState.allChannels],
        },
        {
          type: actionTypes.ON_CHANNEL_ARCHIVED,
          payload: { ...newChannel, isHidden: true, hiddenState: HiddenChannelFilter.HIDDEN_ALLOW_AUTO_UNHIDE },
        }
      );
      expect(hideWithAllowAutoOnPreventAutoState.allChannels[0].url).not.toEqual(newChannel.url);
      expect(hideWithAllowAutoOnPreventAutoState.allChannels.length).toEqual(preventAutoUnhideParamsState.allChannels.length);
      const hideWithPreventAutoOnPreventAutoState = reducers(
        {
          ...preventAutoUnhideParamsState,
          allChannels: [{ ...newChannel, isHidden: false }, ...preventAutoUnhideParamsState.allChannels],
        },
        {
          type: actionTypes.ON_CHANNEL_ARCHIVED,
          payload: { ...newChannel, isHidden: true, hiddenState: HiddenChannelFilter.HIDDEN_PREVENT_AUTO_UNHIDE },
        }
      );
      expect(hideWithPreventAutoOnPreventAutoState.allChannels[0].url).toEqual(newChannel.url);
      expect(hideWithPreventAutoOnPreventAutoState.allChannels.length).toEqual(preventAutoUnhideParamsState.allChannels.length + 1);
    });
  });
});

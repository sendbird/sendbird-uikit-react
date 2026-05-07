import reducer from '../reducer';
import initialState from '../initialState';
import actionTypes from '../actionTypes';
import { OpenChannelListFetchingStatus } from '../../OpenChannelListInterfaces';

const createChannel = (url: string, name = url) => ({
  url,
  name,
});

describe('OpenChannelList reducer', () => {
  it('tracks initial fetching, success, empty, and failure statuses', () => {
    const fetchingState = reducer(initialState, {
      type: actionTypes.INIT_OPEN_CHANNEL_LIST_START,
      payload: null,
    });
    expect(fetchingState.fetchingStatus).toBe(OpenChannelListFetchingStatus.FETCHING);

    const successState = reducer(fetchingState, {
      type: actionTypes.INIT_OPEN_CHANNEL_LIST_SUCCESS,
      payload: [createChannel('channel-1')],
    });
    expect(successState.fetchingStatus).toBe(OpenChannelListFetchingStatus.DONE);
    expect(successState.allChannels).toEqual([createChannel('channel-1')]);

    const emptyState = reducer(fetchingState, {
      type: actionTypes.INIT_OPEN_CHANNEL_LIST_SUCCESS,
      payload: [],
    });
    expect(emptyState.fetchingStatus).toBe(OpenChannelListFetchingStatus.EMPTY);

    const failureState = reducer(successState, {
      type: actionTypes.INIT_OPEN_CHANNEL_LIST_FAILURE,
      payload: new Error('failed'),
    });
    expect(failureState.fetchingStatus).toBe(OpenChannelListFetchingStatus.ERROR);
    expect(failureState.allChannels).toEqual([]);
  });

  it('appends fetched channels and prepends newly created channels', () => {
    const channelOne = createChannel('channel-1');
    const channelTwo = createChannel('channel-2');

    const fetchedState = reducer(
      {
        ...initialState,
        allChannels: [channelOne] as any,
      },
      {
        type: actionTypes.FETCH_OPEN_CHANNEL_LIST_SUCCESS,
        payload: [channelTwo],
      },
    );

    expect(fetchedState.allChannels).toEqual([channelOne, channelTwo]);

    const createdChannel = createChannel('created-channel');
    const createdState = reducer(fetchedState, {
      type: actionTypes.CREATE_OPEN_CHANNEL,
      payload: createdChannel,
    });

    expect(createdState.currentChannel).toBe(createdChannel);
    expect(createdState.allChannels).toEqual([createdChannel, channelOne, channelTwo]);
  });

  it('sets and updates the selected open channel without changing selection for unrelated updates', () => {
    const selectedChannel = createChannel('channel-1', 'Old name');
    const otherChannel = createChannel('channel-2');

    const selectedState = reducer(
      {
        ...initialState,
        allChannels: [selectedChannel, otherChannel] as any,
      },
      {
        type: actionTypes.SET_CURRENT_OPEN_CHANNEL,
        payload: selectedChannel,
      },
    );

    const updatedSelectedChannel = createChannel('channel-1', 'Updated name');
    const updatedSelectedState = reducer(selectedState, {
      type: actionTypes.UPDATE_OPEN_CHANNEL,
      payload: updatedSelectedChannel,
    });

    expect(updatedSelectedState.allChannels).toEqual([updatedSelectedChannel, otherChannel]);
    expect(updatedSelectedState.currentChannel).toBe(updatedSelectedChannel);

    const updatedOtherChannel = createChannel('channel-2', 'Other updated');
    const updatedOtherState = reducer(updatedSelectedState, {
      type: actionTypes.UPDATE_OPEN_CHANNEL,
      payload: updatedOtherChannel,
    });

    expect(updatedOtherState.allChannels).toEqual([updatedSelectedChannel, updatedOtherChannel]);
    expect(updatedOtherState.currentChannel).toBe(updatedSelectedChannel);
  });

  it('removes deleted channels and clears selection when the selected channel is deleted', () => {
    const selectedChannel = createChannel('channel-1');
    const otherChannel = createChannel('channel-2');
    const state = {
      ...initialState,
      allChannels: [selectedChannel, otherChannel] as any,
      currentChannel: selectedChannel as any,
    };

    const nextState = reducer(state, {
      type: actionTypes.DELETE_OPEN_CHANNEL,
      payload: selectedChannel.url,
    });

    expect(nextState.allChannels).toEqual([otherChannel]);
    expect(nextState.currentChannel).toBeNull();
  });
});

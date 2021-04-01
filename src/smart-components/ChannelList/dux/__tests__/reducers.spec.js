import mockData, { channel1, channel0 } from '../data.mock';
import * as actionTypes from '../actionTypes';
import reducers from '../reducers';
import initialState from '../initialState';

describe('Channels-Reducers', () => {
  it('should set channels on INIT_CHANNELS_SUCCESS', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.INIT_CHANNELS_SUCCESS,
      payload: mockData.allChannels,
    });

    expect(nextState.initialized).toEqual(true);
    expect(nextState.allChannels).toEqual(mockData.allChannels);
    expect(nextState.currentChannel).toEqual(mockData.allChannels[0].url);
  })

  it('should handle create new channel using CREATE_CHANNEL', () => {
    const nextState = reducers(mockData, {
      type: actionTypes.CREATE_CHANNEL,
      payload: mockData.allChannels[1],
    });

    expect(nextState.allChannels[0].url).toEqual(mockData.allChannels[1].url);
    expect(nextState.currentChannel).toEqual(mockData.allChannels[1].url);
  })

  it('should handle leave channel action LEAVE_CHANNEL_SUCCESS', () => {
    const channelUrl = "sendbird_group_channel_13883929_89ea0faddf24ba6328e95ff56b0b37960f400c83";
    const nextState = reducers(mockData, {
      type: actionTypes.LEAVE_CHANNEL_SUCCESS,
      payload: channelUrl,
    });

    expect(nextState.allChannels.length).toEqual(2);
    expect(nextState.allChannels.find(c => c.url === channelUrl)).toBeUndefined();
  })

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
  })

  it('should not be changed empty channel on ON_CHANNEL_CHANGED', () => {
    const emptyChannel = { ...channel0, lastMessage: null };
    const nextState = reducers(mockData, {
      type: actionTypes.ON_CHANNEL_CHANGED,
      payload: emptyChannel,
    });
    expect(nextState.allChannels.length).toEqual(3);
    expect(nextState.allChannels[0].lastMessage.message).toEqual(mockData.allChannels[0].lastMessage.message);
  })

  it('should handle push changed channel to the top on ON_CHANNEL_CHANGED even when its not there', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.ON_CHANNEL_CHANGED,
      payload: mockData.allChannels[0],
    });
    expect(nextState.allChannels.length).toEqual(1);
    expect(nextState.allChannels[0].url).toEqual(mockData.allChannels[0].url);
  })

  it('should handle SET_CURRENT_CHANNEL', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.SET_CURRENT_CHANNEL,
      payload: mockData.allChannels[0].url,
    });
    expect(nextState.currentChannel).toEqual(mockData.allChannels[0].url);
  })

  it('should handle SHOW_CHANNEL_SETTINGS', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.SHOW_CHANNEL_SETTINGS,
    });
    expect(nextState.showSettings).toEqual(true);
  })

  it('should handle HIDE_CHANNEL_SETTINGS', () => {
    const nextState = reducers(initialState, {
      type: actionTypes.HIDE_CHANNEL_SETTINGS,
    });
    expect(nextState.showSettings).toEqual(false);
  })

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
  })

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
  })
})

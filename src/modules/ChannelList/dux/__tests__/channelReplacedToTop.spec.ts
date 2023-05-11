import { channel1, channel0 } from '../data.mock';
import * as actionTypes from '../actionTypes';
import reducers from '../reducers';
import initialState from '../initialState';

const CUSTOM_FILTER = 'GROUP_CHAT';
const channelListQuery = {
  includeEmpty: true,
  customTypesFilter: [CUSTOM_FILTER],
};

describe('Channels-Reducers/CHANNEL_REPLACED_TO_TOP', () => {
  it('should move existing channel to top of the list', () => {
    const state = {
      ...initialState,
      allChannels: [channel0, channel1],
    };
    const action = {
      type: actionTypes.CHANNEL_REPLACED_TO_TOP,
      payload: channel1,
    };
    const expectedState = {
      ...state,
      allChannels: [channel1, channel0],
    };

    const nextState = reducers(state, action);

    expect(nextState).toEqual(expectedState);
  });

  it('should move channel to top of the list if doesnt exist', () => {
    const state = {
      ...initialState,
      allChannels: [channel0],
    };
    const action = {
      type: actionTypes.CHANNEL_REPLACED_TO_TOP,
      payload: channel1,
    };
    const expectedState = {
      ...state,
      allChannels: [channel1, channel0],
    };

    const nextState = reducers(state, action);

    expect(nextState).toEqual(expectedState);
  });

  it('should not prepend channel if channelListQuery doesnt pass', () => {
    const state = {
      ...initialState,
      channelListQuery,
      allChannels: [channel0],
    };
    const action = {
      type: actionTypes.CHANNEL_REPLACED_TO_TOP,
      payload: channel1,
    };
    const expectedState = {
      ...state,
      allChannels: [channel0],
    };

    const nextState = reducers(state, action);

    expect(nextState).toEqual(expectedState);
  });

  it('should prepend channel if channelListQuery pass', () => {
    const state = {
      ...initialState,
      channelListQuery,
      allChannels: [channel0],
    };
    const customChannel = {
      ...channel1,
      customType: CUSTOM_FILTER,
    }
    const action = {
      type: actionTypes.CHANNEL_REPLACED_TO_TOP,
      payload: customChannel,
    };
    const expectedState = {
      ...state,
      allChannels: [customChannel, channel0],
    };

    const nextState = reducers(state, action);

    expect(nextState).toEqual(expectedState);
  });
});

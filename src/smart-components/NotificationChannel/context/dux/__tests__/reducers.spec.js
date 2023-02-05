import { actionTypes } from "../actionTypes";
import { reducer } from '../reducers';
import { initialState } from '../initialState';

describe('NotificationChannel reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  it('should handle FETCH_CHANNEL_START', () => {
    expect(reducer(initialState, {
      type: actionTypes.FETCH_CHANNEL_START,
    })).toEqual({
      ...initialState,
      uiState: 'loading',
    });
  });
});

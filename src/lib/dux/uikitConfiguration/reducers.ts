import { match } from 'ts-pattern';
import { UikitConfigurationActionTypes, UIKIT_CONFIGURATION_ACTIONS } from './actionTypes';
import initialState, { UikitConfigurationStateType } from './initialState';

export default function uikitConfigurationReducer(
  state: UikitConfigurationStateType,
  action: UikitConfigurationActionTypes,
): UikitConfigurationStateType {
  return match(action)
    .with({ type: UIKIT_CONFIGURATION_ACTIONS.INIT_UIKIT_CONFIGURATION }, ({ payload }) => {
      return {
        initialized: true,
        loading: false,
        uikitConfiguration: payload,
      };
    })
    .with({ type: UIKIT_CONFIGURATION_ACTIONS.RESET_UIKIT_CONFIGURATION }, () => {
      return initialState;
    })
    .otherwise(() => state);
}

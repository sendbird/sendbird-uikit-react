import { match } from 'ts-pattern';
import { AppInfoStateType } from './initialState';
import { APP_INFO_ACTIONS, AppInfoActionTypes } from './actionTypes';

export default function reducer(state: AppInfoStateType, action: AppInfoActionTypes): AppInfoStateType {
  return match(action)
    .with(
      { type: APP_INFO_ACTIONS.UPSERT_MESSAGE_TEMPLATES_INFO },
      ({ payload }) => {
        return {
          ...state,
          messageTemplatesInfo: payload,
        };
      })
    .otherwise(() => {
      return state;
    });
}

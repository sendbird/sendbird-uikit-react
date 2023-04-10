import { match } from 'ts-pattern';
import { PocActionTypes, POC_ACTIONS } from "./actionTypes";
import { PocStateType } from "./initialState";

export function pocReducer(
  state: PocStateType,
  action: PocActionTypes,
): PocStateType {
  return match(action)
    .with({ type: POC_ACTIONS.INIT_POC }, ({ payload }) => {
      return {
        ...state,
      };
    })
    .otherwise(() => state);
};

import { SendbirdState } from "../../types";
import useSendbird from "./useSendbird";

export function useSendbirdStateContext(): SendbirdState {
  const { state, actions } = useSendbird();
  return { ...state, ...actions };
}

export default useSendbirdStateContext;

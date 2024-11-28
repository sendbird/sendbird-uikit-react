import { SendbirdState } from "../../types";
import useSendbird from "./useSendbird";

/**
 * This hook is exported to support backward compatibility. Do not use this hook internally.
 */
/**
 * @deprecated This hook has been deprecated, please use `useSendbird` instead.
 */
export function useSendbirdStateContext(): SendbirdState {
  const { state, actions } = useSendbird();
  return { ...state, ...actions };
}

export default useSendbirdStateContext;

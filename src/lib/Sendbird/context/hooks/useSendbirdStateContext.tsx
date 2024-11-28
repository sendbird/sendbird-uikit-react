import { SendbirdState } from "../../types";
import useSendbird from "./useSendbird";

// NOTE: Do not use this hook internally.
// This hook is exported to support backward compatibility.
// Keep this function for backward compatibility.
export function useSendbirdStateContext(): SendbirdState {
  const { state, actions } = useSendbird();
  return { ...state, ...actions };
}

export default useSendbirdStateContext;

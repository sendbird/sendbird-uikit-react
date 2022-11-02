import { ThreadContextActionTypes as actionTypes } from "./actionTypes";
import { ThreadContextInitialState } from "./initialState";

interface ActionInterface {
  type: actionTypes;
  payload?: any;
}

export default function reducer(
  state: ThreadContextInitialState,
  action: ActionInterface,
): ThreadContextInitialState {
  switch (action.type) {
    // initialize
    case actionTypes.GET_CHANNEL_START: {
      return state;
    }
    case actionTypes.GET_CHANNEL_FAILURE: {
      return state;
    }
    case actionTypes.GET_CHANNEL_SUCCESS: {
      return state;
    }
    case actionTypes.GET_PARENT_MESSAGE_START: {
      return state;
    }
    case actionTypes.GET_PARENT_MESSAGE_SUCCESS: {
      return state;
    }
    case actionTypes.GET_PARENT_MESSAGE_FAILURE: {
      return state;
    }
    case actionTypes.RESET_MESSAGES: {
      return state;
    }
    // fetch messages
    case actionTypes.GET_NEXT_MESSAGES_START: {
      return state;
    }
    case actionTypes.GET_NEXT_MESSAGES_SUCESS: {
      return state;
    }
    case actionTypes.GET_NEXT_MESSAGES_FAILURE: {
      return state;
    }
    case actionTypes.GET_PREV_MESSAGES_START: {
      return state;
    }
    case actionTypes.GET_PREV_MESSAGES_SUCESS: {
      return state;
    }
    case actionTypes.GET_PREV_MESSAGES_FAILURE: {
      return state;
    }
    // message
    case actionTypes.SEND_MESSAGE_START: {
      return state;
    }
    case actionTypes.SEND_MESSAGE_SUCESS: {
      return state;
    }
    case actionTypes.SEND_MESSAGE_FAILURE: {
      return state;
    }
    case actionTypes.RESEND_MESSAGE_START: {

    }
    case actionTypes.EDIT_MESSAGE: {
      return state;
    }
    case actionTypes.DELETE_MESSAGE: {
      return state;
    }
    // channel events
    case actionTypes.ON_MESSAGE_RECEIVED: {
      return state;
    }
    case actionTypes.ON_MESSAGE_UPDATED: {
      return state;
    }
    case actionTypes.ON_MESSAGE_DELETED: {
      return state;
    }
    case actionTypes.ON_CHANNEL_FROZEN: {
      return state;
    }
    case actionTypes.ON_USER_MUTED: {
      return state;
    }
    case actionTypes.ON_USER_BANNED: {
      return state;
    }
    default: {
      return state;
    }
  }
}
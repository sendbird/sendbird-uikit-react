import { ThreadContextActionTypes as actionTypes } from './actionTypes';
import { ThreadContextInitialState } from './initialState';
interface ActionInterface {
    type: actionTypes;
    payload?: any;
}
export default function reducer(state: ThreadContextInitialState, action: ActionInterface): ThreadContextInitialState;
export {};

import actionTypes from './actionTypes';
import { OpenChannelListInitialInterface } from './initialState';
export default function reducer(state: OpenChannelListInitialInterface, action: {
    type: actionTypes;
    payload: any;
}): OpenChannelListInitialInterface;

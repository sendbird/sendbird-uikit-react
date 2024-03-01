import { User } from '@sendbird/chat';
import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';
export declare const USER_ACTIONS: {
    readonly INIT_USER: "INIT_USER";
    readonly RESET_USER: "RESET_USER";
    readonly UPDATE_USER_INFO: "UPDATE_USER_INFO";
};
type USER_PAYLOAD_TYPES = {
    [USER_ACTIONS.INIT_USER]: User;
    [USER_ACTIONS.RESET_USER]: null;
    [USER_ACTIONS.UPDATE_USER_INFO]: User;
};
export type UserActionTypes = CreateAction<USER_PAYLOAD_TYPES>;
export {};

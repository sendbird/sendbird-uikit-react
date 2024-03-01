import type { User } from '@sendbird/chat';
import { FailedMessageHandler, MessageHandler, UserMessage, UserMessageCreateParams } from '@sendbird/chat/message';
import { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { OpenChannel, OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { FileMessage, FileMessageCreateParams, SendableMessage, UserMessageUpdateParams } from '@sendbird/chat/lib/__definition';
import { SendBirdState } from './types';
import { SendableMessageType } from '../utils';
import { PublishingModuleType } from '../modules/internalInterfaces';
/**
 * 1. UIKit Instances
 *    a. getSdk
 *    b. getPubSub
 * 2. Chat & Connection
 *    a. getConnect
 *    b. getDisconnect
 *    c. getUpdateUserInfo
 * 3. Channel
 *    a. getCreateGroupChannel
 *    b. getCreateOpenChannel
 *    c. getGetGroupChannel
 *    d. getGetOpenChannel
 *    e. getLeaveGroupChannel
 *    f. getEnterOpenChannel
 *    g. getExitOpenChannel
 *    h. getFreezeChannel
 *    i. getUnfreezeChannel
 * 4. Message
 *    a. getSendUserMessage
 *    b. getSendFileMessage
 *    c. getUpdateUserMessage
 *    d. x - getUpdateFileMessage
 *    e. getDeleteMessage
 *    f. getResendUserMessage
 *    g. getResendFileMessage
 */
/**
 * import useSendbirdStateContext from '@sendbird-uikit/useSendbirdStateContext'
 * import selectors from '@sendbird-uikit/send'
 * const state = useSendbirdStateContext();
 */
/**
 * const sdk = selectors.getSdk(state);
 */
export declare const getSdk: (state: SendBirdState) => import("./types").SendbirdChatType;
/**
 * const pubSub = selectors.getPubSub(state);
 */
export declare const getPubSub: (state: SendBirdState) => import("./pubSub/topics").SBUGlobalPubSub;
/**
 * const connect = selectors.getConnect(state);
 * connect('user-id-sendbirdian', 'access-token-0000')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export declare const getConnect: (state: SendBirdState) => (userId: string, accessToken?: string) => Promise<User>;
/**
 * const disconnect = selectors.getDisconnect(state);
 * disconnect()
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getDisconnect: (state: SendBirdState) => () => Promise<void>;
/**
 * const updateUserInfo = selectors.getUpdateUserInfo(state);
 * updateUserInfo('new-nickname', 'new-profile-url')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export declare const getUpdateUserInfo: (state: SendBirdState) => (nickname: string, profileUrl?: string) => Promise<User>;
/**
 * const createGroupChannel = selectors.getCreateGroupChannel(state);
 * createGroupChannel(channelParams: GroupChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getCreateGroupChannel: (state: SendBirdState) => (params: GroupChannelCreateParams) => Promise<GroupChannel>;
/**
 * const createOpenChannel = selectors.getCreateOpenChannel(state);
 * createOpenChannel(channelParams: OpenChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getCreateOpenChannel: (state: SendBirdState) => (params: OpenChannelCreateParams) => Promise<OpenChannel>;
/**
 * const getGroupChannel = selectors.getGetGroupChannel(state);
 * getGroupChannel('channel-url-1234', isSelected)
 *  .then((channel) => {
 *    // groupChannel = channel;
 *    // or
 *    // setCurrentChannel(channel);
 *  })
 *  .catch((error) => {})
 */
export declare const getGetGroupChannel: (state: SendBirdState) => (channelUrl: string) => Promise<GroupChannel>;
/**
 * const getOpenChannel = selectors.getGetOpenChannel(state);
 * getOpenChannel('channel-url-12345')
 *  .then((channel) => {
 *    // openChannel = channel;
 *    // or
 *    // setCurrentChannel(channel);
 *  })
 *  .catch((error) => {})
 */
export declare const getGetOpenChannel: (state: SendBirdState) => (channelUrl: string) => Promise<OpenChannel>;
/**
 * const leaveChannel = selectors.getLeaveGroupChannel(state);
 * leaveChannel('group-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getLeaveGroupChannel: (state: SendBirdState) => (channelUrl: string) => Promise<void>;
/**
 * const enterChannel = selectors.getEnterOpenChannel(state);
 * enterChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getEnterOpenChannel: (state: SendBirdState) => (channelUrl: string) => Promise<OpenChannel>;
/**
 * const exitChannel = selectors.getExitOpenChannel(state);
 * exitChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getExitOpenChannel: (state: SendBirdState) => (channelUrl: string) => Promise<OpenChannel>;
/**
 * const freezeChannel = selectors.getFreezeChannel(currentChannel);
 * freezeChannel()
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getFreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
/**
 * const unfreezeChannel = selectors.getUnfreezeChannel(currentChannel);
 * unfreezeChannel()
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getUnfreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
export declare class UikitMessageHandler<T extends SendableMessage = SendableMessage> {
    private _onPending;
    private _onFailed;
    private _onSucceeded;
    triggerPending(message: T): void;
    triggerFailed(error: Error, message: T): void;
    triggerSucceeded(message: T): void;
    onPending(handler: MessageHandler<T>): UikitMessageHandler;
    onFailed(handler: FailedMessageHandler<T>): UikitMessageHandler;
    onSucceeded(handler: MessageHandler<T>): UikitMessageHandler;
}
/**
 * const sendUserMessage = selectors.getSendUserMessage(state);
 * sendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  params: UserMessageCreateParams,
 * )
 *  .onPending((message) => {})
 *  .onFailed((error, message) => {})
 *  .onSucceeded((message) => {})
 */
export declare const getSendUserMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: UserMessageCreateParams) => UikitMessageHandler;
/**
 * const sendFileMessage = selectors.getSendFileMessage(state);
 * sendFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  params: FileMessageCreateParams,
 * )
 *  .onPending((message) => {})
 *  .onFailed((error, message) => {})
 *  .onSucceeded((message) => {})
 */
export declare const getSendFileMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: FileMessageCreateParams) => UikitMessageHandler;
/**
 * const updateUserMessage = selectors.getUpdateUserMessage(state);
 * updateUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  messageId: number,
 *  messageParams: UserMessageUpdateParams,
 * )
 *  .then((message) => {})
 *  .catch((error) => {})
 */
export declare const getUpdateUserMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
/**
 * const updateFileMessage = selectors.getUpdateFileMessage(state);
 * updateFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  messageId: number,
 *  params: FileMessageUpdateParams,
 * )
 *  .then((message) => {})
 *  .catch((error) => {})
 */
/**
 * const deleteMessage = selectors.getDeleteMessage(state);
 * deleteMessage(
 *  channel: GroupChannel | OpenChannel,
 *  message: SendableMessage,
 * )
 *  .then((deletedMessage) => {})
 *  .catch((error) => {})
 */
export declare const getDeleteMessage: (state: SendBirdState) => (channel: GroupChannel | OpenChannel, message: SendableMessageType) => Promise<SendableMessageType>;
/**
 * const resendUserMessage = selectors.getResendUserMessage(state);
 * resendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: UserMessage,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getResendUserMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: UserMessage) => Promise<UserMessage>;
/**
 * const resendFileMessage = selectors.getResendFileMessage(state);
 * resendFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: FileMessage,
 *  blob: Blob,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getResendFileMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: FileMessage, blob: Blob) => Promise<FileMessage>;
declare const sendbirdSelectors: {
    getSdk: (state: SendBirdState) => import("./types").SendbirdChatType;
    getPubSub: (state: SendBirdState) => import("./pubSub/topics").SBUGlobalPubSub;
    getConnect: (state: SendBirdState) => (userId: string, accessToken?: string) => Promise<User>;
    getDisconnect: (state: SendBirdState) => () => Promise<void>;
    getUpdateUserInfo: (state: SendBirdState) => (nickname: string, profileUrl?: string) => Promise<User>;
    getCreateGroupChannel: (state: SendBirdState) => (params: GroupChannelCreateParams) => Promise<GroupChannel>;
    getCreateOpenChannel: (state: SendBirdState) => (params: OpenChannelCreateParams) => Promise<OpenChannel>;
    getGetGroupChannel: (state: SendBirdState) => (channelUrl: string) => Promise<GroupChannel>;
    getGetOpenChannel: (state: SendBirdState) => (channelUrl: string) => Promise<OpenChannel>;
    getLeaveGroupChannel: (state: SendBirdState) => (channelUrl: string) => Promise<void>;
    getEnterOpenChannel: (state: SendBirdState) => (channelUrl: string) => Promise<OpenChannel>;
    getExitOpenChannel: (state: SendBirdState) => (channelUrl: string) => Promise<OpenChannel>;
    getFreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
    getUnfreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
    getSendUserMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: UserMessageCreateParams) => UikitMessageHandler;
    getSendFileMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: FileMessageCreateParams) => UikitMessageHandler;
    getUpdateUserMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
    getDeleteMessage: (state: SendBirdState) => (channel: GroupChannel | OpenChannel, message: SendableMessageType) => Promise<SendableMessageType>;
    getResendUserMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: UserMessage) => Promise<UserMessage>;
    getResendFileMessage: (state: SendBirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: FileMessage, blob: Blob) => Promise<FileMessage>;
};
export default sendbirdSelectors;

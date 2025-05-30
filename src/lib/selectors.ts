import topics from './pubSub/topics';
import type {
  User,
  UserUpdateParams,
} from '@sendbird/chat';

import { FailedMessageHandler, MessageHandler, UserMessage, UserMessageCreateParams } from '@sendbird/chat/message';
import { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { OpenChannel, OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { FileMessage, FileMessageCreateParams, SendableMessage, UserMessageUpdateParams } from '@sendbird/chat/lib/__definition';

import {
  SdkStore,
  SendbirdState,
  SendbirdStateConfig,
  SendbirdStateStore,
} from './Sendbird/types';
import { noop } from '../utils/utils';
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

// 1. UIKit Instances

/**
 * const sdk = selectors.getSdk(state);
 */
export const getSdk = (state: SendbirdState) => {
  const { stores = {} } = state;
  const { sdkStore = {} } = stores as SendbirdStateStore;
  const { sdk } = sdkStore as SdkStore;
  return sdk;
};

/**
 * const pubSub = selectors.getPubSub(state);
 */
export const getPubSub = (state: SendbirdState) => {
  const { config = {} } = state;
  const { pubSub } = config as SendbirdStateConfig;
  return pubSub;
};

// 2. Chat & Connection

/**
 * const connect = selectors.getConnect(state);
 * connect('user-id-sendbirdian', 'access-token-0000')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export const getConnect = (state: SendbirdState) => (
  (userId: string, accessToken?: string): Promise<User> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!(sdk?.connect && typeof sdk.connect === 'function')) {
        reject(new Error('Not found the function "connect'));
      }
      if (!accessToken) {
        sdk.connect(userId)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        sdk.connect(userId, accessToken)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    })
  )
);

/**
 * const disconnect = selectors.getDisconnect(state);
 * disconnect()
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const getDisconnect = (state: SendbirdState) => (
  (): Promise<void> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!(sdk.disconnect && typeof sdk.disconnect === 'function')) {
        reject(new Error('Not found the function "disconnect'));
      }
      sdk.disconnect()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
  )
);

/**
 * const updateUserInfo = selectors.getUpdateUserInfo(state);
 * updateUserInfo('new-nickname', 'new-profile-url')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export const getUpdateUserInfo = (state: SendbirdState) => (
  (nickname: string, profileUrl?: string): Promise<User> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!(sdk.updateCurrentUserInfo && typeof sdk.updateCurrentUserInfo === 'function')) {
        reject(new Error('Not found the function "updateCurrentUserInfo"'));
      }
      const userParams: UserUpdateParams = { nickname };
      if (profileUrl) {
        userParams.profileUrl = profileUrl;
      }
      sdk.updateCurrentUserInfo(userParams)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
  )
);

// 3. Channel

/**
 * const createGroupChannel = selectors.getCreateGroupChannel(state);
 * createGroupChannel(channelParams: GroupChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getCreateGroupChannel = (state: SendbirdState) => (
  (params: GroupChannelCreateParams): Promise<GroupChannel> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      const pubSub = getPubSub(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!sdk.groupChannel) {
        reject(new Error('Not found GroupChannelModule'));
      }
      if (!(sdk.groupChannel.createChannel && typeof sdk.groupChannel.createChannel === 'function')) {
        reject(new Error('Not found the function "createChannel"'));
      }
      sdk.groupChannel.createChannel(params)
        .then((channel) => {
          resolve(channel);
          pubSub.publish(
            topics.CREATE_CHANNEL,
            { channel },
          );
        })
        .catch(reject);
    })
  )
);

/**
 * const createOpenChannel = selectors.getCreateOpenChannel(state);
 * createOpenChannel(channelParams: OpenChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getCreateOpenChannel = (state: SendbirdState) => (
  (params: OpenChannelCreateParams): Promise<OpenChannel> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      // const pubSub = getPubSub(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!sdk.openChannel) {
        reject(new Error('Not found OpenChannelModule'));
      }
      if (!(sdk.openChannel.createChannel && typeof sdk.openChannel.createChannel === 'function')) {
        reject(new Error('Not found the function "createChannel"'));
      }
      sdk.openChannel.createChannel(params)
        .then((channel) => {
          resolve(channel);
          // Consider pubSub process
        })
        .catch(reject);
    })
  )
);

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
export const getGetGroupChannel = (state: SendbirdState) => (
  (channelUrl: string): Promise<GroupChannel> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      // const pubSub = getPubSub(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!sdk.groupChannel) {
        reject(new Error('Not found GroupChannelModule'));
      }
      if (!(sdk.groupChannel.getChannel && typeof sdk.groupChannel.getChannel === 'function')) {
        reject(new Error('Not found the function "getChannel"'));
      }
      sdk.groupChannel.getChannel(channelUrl)
        .then((channel) => {
          resolve(channel);
          // Add pubSub with isSelected
        })
        .catch(reject);
    })
  )
);

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
export const getGetOpenChannel = (state: SendbirdState) => (
  (channelUrl: string): Promise<OpenChannel> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      // const pubSub = getPubSub(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!sdk.openChannel) {
        reject(new Error('Not found OpenChannelModule'));
      }
      if (!(sdk.openChannel.getChannel && typeof sdk.openChannel.getChannel === 'function')) {
        reject(new Error('Not found the function "getChannel"'));
      }
      sdk.openChannel.getChannel(channelUrl)
        .then((channel) => {
          resolve(channel);
          // Add pubSub with isSelected
        })
        .catch(reject);
    })
  )
);

/**
 * const leaveChannel = selectors.getLeaveGroupChannel(state);
 * leaveChannel('group-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getLeaveGroupChannel = (state: SendbirdState) => (
  (channelUrl: string): Promise<void> => (
    new Promise((resolve, reject) => {
      getGetGroupChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.leave()
            .then(() => {
              resolve();
              // Add pubSub process
            })
            .catch(reject);
        })
        .catch(reject);
    })
  )
);

/**
 * const enterChannel = selectors.getEnterOpenChannel(state);
 * enterChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getEnterOpenChannel = (state: SendbirdState) => (
  (channelUrl: string): Promise<OpenChannel> => (
    new Promise((resolve, reject) => {
      getGetOpenChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.enter()
            .then(() => {
              resolve(channel);
              // Add pubSub process
            })
            .catch(reject);
        })
        .catch(reject);
    })
  )
);

/**
 * const exitChannel = selectors.getExitOpenChannel(state);
 * exitChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getExitOpenChannel = (state: SendbirdState) => (
  (channelUrl: string): Promise<OpenChannel> => (
    new Promise((resolve, reject) => {
      getGetOpenChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.exit()
            .then(() => {
              resolve(channel);
              // Add pubSub process
            })
            .catch(reject);
        })
        .catch(reject);
    })
  )
);

/**
 * const freezeChannel = selectors.getFreezeChannel(currentChannel);
 * freezeChannel()
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const getFreezeChannel = () => (
  (channel: GroupChannel | OpenChannel): Promise<void> => (
    new Promise((resolve, reject) => {
      if (!(channel.freeze && typeof channel?.freeze === 'function')) {
        reject(new Error('Not found the function "freeze"'));
      }
      channel.freeze()
        .then(() => {
          resolve();
          // Add pubSub process
          /**
           * consider divide the logic to
           * _freezeGroupChannel and _freezeOpenChannel
           */
        })
        .catch(reject);
    })
  )
);

/**
 * const unfreezeChannel = selectors.getUnfreezeChannel(currentChannel);
 * unfreezeChannel()
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getUnfreezeChannel = () => (
  (channel: GroupChannel | OpenChannel): Promise<void> => (
    new Promise((resolve, reject) => {
      if (!(channel.unfreeze && typeof channel?.unfreeze === 'function')) {
        reject(new Error('Not found the function "unfreeze"'));
      }
      channel.unfreeze()
        .then(() => {
          resolve();
          // Add pubSub process
          /**
           * consider divide the logic to
           * _unfreezeGroupChannel and _unfreezeOpenChannel
           */
        })
        .catch(reject);
    })
  )
);

// 4. Message
export class UikitMessageHandler<T extends SendableMessage = SendableMessage> {
  private _onPending: MessageHandler<T> = noop;

  private _onFailed: FailedMessageHandler<T> = noop;

  private _onSucceeded: MessageHandler<T> = noop;

  public triggerPending(message: T): void {
    this._onPending(message);
  }

  public triggerFailed(error: Error, message: T | null): void {
    this._onFailed(error, message?.isResendable ? message : null);
  }

  public triggerSucceeded(message: T): void {
    this._onSucceeded(message);
  }

  public onPending(handler: MessageHandler<T>): UikitMessageHandler<T> {
    if (typeof handler === 'function') {
      this._onPending = handler;
    }
    return this;
  }

  public onFailed(handler: FailedMessageHandler<T>): UikitMessageHandler<T> {
    if (typeof handler === 'function') {
      this._onFailed = handler;
    }
    return this;
  }

  public onSucceeded(handler: MessageHandler<T>): UikitMessageHandler<T> {
    if (typeof handler === 'function') {
      this._onSucceeded = handler;
    }
    return this;
  }
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

export const getSendUserMessage = (state: SendbirdState, publishingModules: PublishingModuleType[] = []) => (
  (channel: GroupChannel | OpenChannel, params: UserMessageCreateParams): UikitMessageHandler => {
    const handler = new UikitMessageHandler();
    const pubSub = getPubSub(state);
    channel.sendUserMessage(params)
      .onFailed((error, message) => {
        pubSub.publish(
          topics.SEND_MESSAGE_FAILED,
          { error, message: message as UserMessage, channel, publishingModules },
        );
        handler.triggerFailed(error, message as SendableMessage);
      })
      .onPending((message) => {
        pubSub.publish(
          topics.SEND_MESSAGE_START,
          { message: message as UserMessage, channel, publishingModules },
        );
        handler.triggerPending(message);
      })
      .onSucceeded((message) => {
        pubSub.publish(
          topics.SEND_USER_MESSAGE,
          { message: message as UserMessage, channel, publishingModules },
        );
        handler.triggerSucceeded(message);
      });
    return handler;
  }
);

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
export const getSendFileMessage = (state: SendbirdState, publishingModules: PublishingModuleType[] = []) => (
  (channel: GroupChannel | OpenChannel, params: FileMessageCreateParams): UikitMessageHandler => {
    const handler = new UikitMessageHandler();
    const pubSub = getPubSub(state);
    channel.sendFileMessage(params)
      .onFailed((error, message) => {
        pubSub.publish(
          topics.SEND_MESSAGE_FAILED,
          { error, message: message as FileMessage, channel, publishingModules },
        );
        handler.triggerFailed(error, message);
      })
      .onPending((message) => {
        pubSub.publish(
          topics.SEND_MESSAGE_START,
          { message: message as FileMessage, channel, publishingModules },
        );
        handler.triggerPending(message);
      })
      .onSucceeded((message) => {
        pubSub.publish(
          topics.SEND_FILE_MESSAGE,
          { message: message as FileMessage, channel, publishingModules },
        );
        handler.triggerSucceeded(message);
      });
    return handler;
  }
);

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
export const getUpdateUserMessage = (state: SendbirdState, publishingModules: PublishingModuleType[] = []) => (
  (channel: GroupChannel | OpenChannel, messageId: number, params: UserMessageUpdateParams): Promise<UserMessage> => (
    new Promise((resolve, reject) => {
      const pubSub = getPubSub(state);
      channel.updateUserMessage(messageId, params)
        .then((message) => {
          pubSub.publish(
            topics.UPDATE_USER_MESSAGE,
            { message, channel, fromSelector: true, publishingModules },
          );
          resolve(message);
        })
        .catch(reject);
    })
  )
);

// TODO: We will provie this function in the future
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
// const getUpdateFileMessage = (state: SendbirdState) => (
//   (channel: GroupChannel | OpenChannel, messageId: number, params: FileMessageUpdateParams) => (
//     new Promise((resolve, reject) => {
//       const pubSub = getPubSub(state);
//       channel.updateFileMessage(messageId, params)
//         .then((message) => {
//           pubSub.publish(
//             topics.UPDATE_USER_MESSAGE,
//             { message, channel, fromSelector: true },
//           );
//           resolve(message);
//         })
//         .catch(reject);
//     })
//   )
// );

/**
 * const deleteMessage = selectors.getDeleteMessage(state);
 * deleteMessage(
 *  channel: GroupChannel | OpenChannel,
 *  message: SendableMessage,
 * )
 *  .then((deletedMessage) => {})
 *  .catch((error) => {})
 */
export const getDeleteMessage = (state: SendbirdState) => (
  (channel: GroupChannel | OpenChannel, message: SendableMessageType): Promise<SendableMessageType> => (
    new Promise((resolve, reject) => {
      const pubSub = getPubSub(state);
      const { messageId } = message;
      channel.deleteMessage(message)
        .then(() => {
          pubSub.publish(
            topics.DELETE_MESSAGE,
            { messageId, channel },
          );
          resolve(message);
        })
        .catch(reject);
    })
  )
);

/**
 * const resendUserMessage = selectors.getResendUserMessage(state);
 * resendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: UserMessage,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const getResendUserMessage = (state: SendbirdState, publishingModules: PublishingModuleType[] = []) => (
  (channel: GroupChannel | OpenChannel, failedMessage: UserMessage): Promise<UserMessage> => (
    new Promise((resolve, reject) => {
      const pubSub = getPubSub(state);
      channel.resendUserMessage(failedMessage)
        .then((message) => {
          pubSub.publish(
            topics.SEND_USER_MESSAGE,
            { message, channel, publishingModules },
          );
          resolve(message);
        })
        .catch(reject);
    })
  )
);

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
export const getResendFileMessage = (state: SendbirdState, publishingModules: PublishingModuleType[] = []) => (
  (channel: GroupChannel | OpenChannel, failedMessage: FileMessage, blob: Blob): Promise<FileMessage> => (
    new Promise((resolve, reject) => {
      const pubSub = getPubSub(state);
      channel.resendFileMessage(failedMessage, blob)
        .then((message) => {
          pubSub.publish(
            topics.SEND_FILE_MESSAGE,
            { message, channel, publishingModules },
          );
          resolve(message);
        })
        .catch(reject);
    })
  )
);

const sendbirdSelectors = {
  getSdk,
  getPubSub,
  getConnect,
  getDisconnect,
  getUpdateUserInfo,
  getCreateGroupChannel,
  getCreateOpenChannel,
  getGetGroupChannel,
  getGetOpenChannel,
  getLeaveGroupChannel,
  getEnterOpenChannel,
  getExitOpenChannel,
  getFreezeChannel,
  getUnfreezeChannel,
  getSendUserMessage,
  getSendFileMessage,
  getUpdateUserMessage,
  getDeleteMessage,
  getResendUserMessage,
  getResendFileMessage,
};

export default sendbirdSelectors;

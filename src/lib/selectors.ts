import * as topics from './pubSub/topics';
import type {
  User,
  UserUpdateParams,
} from '@sendbird/chat';

import {
  SdkStore,
  SendBirdState,
  SendBirdStateConfig,
  SendBirdStateStore,
} from './types';
import { noop } from '../utils/utils';

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
export const getSdk = (state: SendBirdState): SendbirdGroupChat & SendbirdOpenChat => {
  const { stores = {} } = state;
  const { sdkStore = {} } = stores as SendBirdStateStore;
  const { sdk } = sdkStore as SdkStore;
  return sdk;
};

/**
 * const pubSub = selectors.getPubSub(state);
 */
export const getPubSub = (state: SendBirdState): any => {
  const { config = {} } = state;
  const { pubSub } = config as SendBirdStateConfig;
  return pubSub;
};

// 2. Chat & Connection

/**
 * const connect = selectors.getConnect(state);
 * connect('user-id-sendbirdian', 'access-token-0000')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export const getConnect = (state: SendBirdState) => (
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
export const getDisconnect = (state: SendBirdState) => (
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
export const getUpdateUserInfo = (state: SendBirdState) => (
  (nickname: string, profileUrl?: string): Promise<User> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!(sdk.updateCurrentUserInfo && typeof sdk.updateCurrentUserInfo === 'function')) {
        reject(new Error('Not found the function "updateCurrentUserInfo"'))
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
export const getCreateGroupChannel = (state: SendBirdState) => (
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
        reject(new Error('Not found the function "createChannel"'))
      }
      sdk.groupChannel.createChannel(params)
        .then((channel) => {
          resolve(channel);
          pubSub.publish(
            topics.CREATE_CHANNEL,
            { channel },
          );
        })
        .catch(reject)
    })
  )
);

/**
 * const createOpenChannel = selectors.getCreateOpenChannel(state);
 * createOpenChannel(channelParams: OpenChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getCreateOpenChannel = (state: SendBirdState) => (
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
        reject(new Error('Not found the function "createChannel"'))
      }
      sdk.openChannel.createChannel(params)
        .then((channel) => {
          resolve(channel);
          // Consider pubSub process
        })
        .catch(reject)
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
export const getGetGroupChannel = (state: SendBirdState) => (
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
        reject(new Error('Not found the function "getChannel"'))
      }
      sdk.groupChannel.getChannel(channelUrl)
        .then((channel) => {
          resolve(channel);
          // Add pubSub with isSelected
        })
        .catch(reject)
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
export const getGetOpenChannel = (state: SendBirdState) => (
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
        reject(new Error('Not found the function "getChannel"'))
      }
      sdk.openChannel.getChannel(channelUrl)
        .then((channel) => {
          resolve(channel);
          // Add pubSub with isSelected
        })
        .catch(reject)
    })
  )
);

/**
 * const leaveChannel = selectors.getLeaveGroupChannel(state);
 * leaveChannel('group-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getLeaveGroupChannel = (state: SendBirdState) => (
  (channelUrl: string): Promise<void> => (
    new Promise((resolve, reject) => {
      getGetGroupChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.leave()
            .then(() => {
              resolve();
              // Add pubSub process
            })
            .catch(reject)
        })
        .catch(reject)
    })
  )
);

/**
 * const enterChannel = selectors.getEnterOpenChannel(state);
 * enterChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getEnterOpenChannel = (state: SendBirdState) => (
  (channelUrl: string): Promise<OpenChannel> => (
    new Promise((resolve, reject) => {
      getGetOpenChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.enter()
            .then(() => {
              resolve(channel);
              // Add pubSub process
            })
            .catch(reject)
        })
        .catch(reject)
    })
  )
)

/**
 * const exitChannel = selectors.getExitOpenChannel(state);
 * exitChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const getExitOpenChannel = (state: SendBirdState) => (
  (channelUrl: string): Promise<OpenChannel> => (
    new Promise((resolve, reject) => {
      getGetOpenChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.exit()
            .then(() => {
              resolve(channel);
              // Add pubSub process
            })
            .catch(reject)
        })
        .catch(reject)
    })
  )
)

/**
 * const freezeChannel = selectors.getFreezeChannel(currentChannel);
 * freezeChannel()
 *  .then((channel) => {})
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
        .catch(reject)
    })
  )
)

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
        .catch(reject)
    })
  )
)

// 4. Message
export class UikitMessageHandler {
  private _onPending: MessageHandler = noop;
  private _onFailed: FailedMessageHandler = noop;
  private _onSucceeded: MessageHandler = noop;

  public triggerPending(message: SendableMessage): void {
    this._onPending(message);
  }
  public triggerFailed(error: Error, message: SendableMessage): void {
    this._onFailed(error, message.isResendable ? message : null);
  }
  public triggerSucceeded(message: SendableMessage): void {
    this._onSucceeded(message);
  }

  public onPending(handler: MessageHandler): UikitMessageHandler {
    if (typeof handler === 'function') {
      this._onPending = handler;
    }
    return this;
  }
  public onFailed(handler: FailedMessageHandler): UikitMessageHandler {
    if (typeof handler === 'function') {
      this._onFailed = handler;
    }
    return this;
  }
  public onSucceeded(handler: MessageHandler): UikitMessageHandler {
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

export const getSendUserMessage = (state: SendBirdState) => (
  (channel: GroupChannel | OpenChannel, params: UserMessageCreateParams): UikitMessageHandler => {
    const handler = new UikitMessageHandler();
    const pubSub = getPubSub(state);
    channel.sendUserMessage(params)
      .onFailed((error, message) => handler.triggerFailed(error, message))
      .onPending((message) => {
        pubSub.publish(
          topics.SEND_MESSAGE_START,
          { message, channel },
        );
        handler.triggerPending(message);
      })
      .onSucceeded((message) => {
        pubSub.publish(
          topics.SEND_USER_MESSAGE,
          { message, channel },
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
export const getSendFileMessage = (state: SendBirdState) => (
  (channel: GroupChannel | OpenChannel, params: FileMessageCreateParams): UikitMessageHandler => {
    const handler = new UikitMessageHandler();
    const pubSub = getPubSub(state);
    channel.sendFileMessage(params)
      .onFailed((error, message) => handler.triggerFailed(error, message))
      .onPending((message) => {
        pubSub.publish(
          topics.SEND_MESSAGE_START,
          { message, channel },
        );
        handler.triggerPending(message);
      })
      .onSucceeded((message) => {
        pubSub.publish(
          topics.SEND_FILE_MESSAGE,
          { message, channel },
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
export const getUpdateUserMessage = (state: SendBirdState) => (
  (channel: GroupChannel | OpenChannel, messageId: number, params: UserMessageUpdateParams): Promise<UserMessage> => (
    new Promise((resolve, reject) => {
      const pubSub = getPubSub(state);
      channel.updateUserMessage(messageId, params)
        .then((message) => {
          pubSub.publish(
            topics.UPDATE_USER_MESSAGE,
            { message, channel, fromSelector: true },
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
// const getUpdateFileMessage = (state: SendBirdState) => (
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
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const getDeleteMessage = (state: SendBirdState) => (
  (channel: GroupChannel | OpenChannel, message: SendableMessage): Promise<SendableMessage> => (
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
export const getResendUserMessage = (state: SendBirdState) => (
  (channel: GroupChannel | OpenChannel, failedMessage: UserMessage): Promise<UserMessage> => (
    new Promise((resolve, reject) => {
      const pubSub = getPubSub(state);
      channel.resendUserMessage(failedMessage)
        .then((message) => {
          pubSub.publish(
            topics.SEND_USER_MESSAGE,
            { message, channel },
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
export const getResendFileMessage = (state: SendBirdState) => (
  (channel: GroupChannel | OpenChannel, failedMessage: FileMessage, blob: Blob): Promise<FileMessage> => (
    new Promise((resolve, reject) => {
      const pubSub = getPubSub(state);
      channel.resendFileMessage(failedMessage, blob)
        .then((message) => {
          pubSub.publish(
            topics.SEND_FILE_MESSAGE,
            { message, channel },
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

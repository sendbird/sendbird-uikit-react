import * as topics from './pubSub/topics';
import type {
  User,
  UserUpdateParams,
} from '@sendbird/chat';
import { FailedMessageHandler, MessageHandler, UserMessage, UserMessageCreateParams } from '@sendbird/chat/message';
import { GroupChannel, GroupChannelCreateParams, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { OpenChannel, OpenChannelCreateParams, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import { FileMessage, FileMessageCreateParams, FileMessageUpdateParams, SendableMessage, UserMessageUpdateParams } from '@sendbird/chat/lib/__definition';

import {
  SdkStore,
  SendBirdState,
  SendBirdStateConfig,
  SendBirdStateStore,
} from './types';
import { noop } from '../utils/utils';

/**
 * 1. UIKit Instances
 * 2. Chat & Connection
 * 3. Channel
 * 4. Message
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
 * const connect = selectors.connect(state);
 * connect('user-id-sendbirdian', 'access-token-0000')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export const connect = (state: SendBirdState) => (
  (userId: string, accessToken: string): Promise<User> => (
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
 * const disconnect = selectors.disconnect(state);
 * disconnect()
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const disconnect = (state: SendBirdState) => (
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
 * const updateUserInfo = selectors.updateUserInfo(state);
 * updateUserInfo('new-nickname', 'new-profile-url')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export const updateUserInfo = (state: SendBirdState) => (
  (nickname: string, profileUrl: string): Promise<User> => (
    new Promise((resolve, reject) => {
      const sdk = getSdk(state);
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }
      if (!(sdk.updateCurrentUserInfo && typeof sdk.updateCurrentUserInfo === 'function')) {
        reject(new Error('Not found the function "updateCurrentUserInfo"'))
      }
      sdk.updateCurrentUserInfo({ nickname, profileUrl } as UserUpdateParams)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
  )
);

// 3. Channel

/**
 * const createGroupChannel = selectors.createGroupChannel(state);
 * createGroupChannel(channelParams: GroupChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const createGroupChannel = (state: SendBirdState) => (
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
 * const createOpenChannel = selectors.createOpenChannel(state);
 * createOpenChannel(channelParams: OpenChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const createOpenChannel = (state: SendBirdState) => (
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
 * const getGroupChannel = selectors.getGroupChannel(state);
 * getGroupChannel('channel-url-1234', isSelected)
 *  .then((channel) => {
 *    // groupChannel = channel;
 *    // or
 *    // setCurrentChannel(channel);
 *  })
 *  .catch((error) => {})
 */
export const getGroupChannel = (state: SendBirdState) => (
  (channelUrl: string, isSelected?: boolean): Promise<GroupChannel> => (
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
 * const getOpenChannel = selectors.getOpenChannel(state);
 * getOpenChannel('channel-url-12345')
 *  .then((channel) => {
 *    // openChannel = channel;
 *    // or
 *    // setCurrentChannel(channel);
 *  })
 *  .catch((error) => {})
 */
export const getOpenChannel = (state: SendBirdState) => (
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
 * const leaveChannel = selectors.leaveGroupChannel(state);
 * leaveChannel('group-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const leaveGroupChannel = (state: SendBirdState) => (
  (channelUrl: string): Promise<void> => (
    new Promise((resolve, reject) => {
      getGroupChannel(state)?.(channelUrl)
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
 * const enterChannel = selectors.enterOpenChannel(state);
 * enterChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const enterOpenChannel = (state: SendBirdState) => (
  (channelUrl: string): Promise<void> => (
    new Promise((resolve, reject) => {
      getOpenChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.enter()
            .then(() => {
              resolve();
              // Add pubSub process
            })
            .catch(reject)
        })
        .catch(reject)
    })
  )
)

/**
 * const exitChannel = selectors.exitOpenChannel(state);
 * exitChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const exitOpenChannel = (state: SendBirdState) => (
  (channelUrl: string): Promise<void> => (
    new Promise((resolve, reject) => {
      getOpenChannel(state)?.(channelUrl)
        .then((channel) => {
          channel.exit()
            .then(() => {
              resolve();
              // Add pubSub process
            })
            .catch(reject)
        })
        .catch(reject)
    })
  )
)

/**
 * const freezeChannel = selectors.freezeChannel(currentChannel);
 * freezeChannel()
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const freezeChannel = (channel: GroupChannel | OpenChannel) => (
  (): Promise<void> => (
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
 * const unfreezeChannel = selectors.unfreezeChannel(currentChannel);
 * unfreezeChannel()
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export const unfreezeChannel = (channel: GroupChannel | OpenChannel) => (
  (): Promise<void> => (
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
 * const sendUserMessage = selectors.sendUserMessage(state);
 * sendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  params: UserMessageCreateParams,
 * )
 *  .onPending((message) => {})
 *  .onFailed((error, message) => {})
 *  .onSucceeded((message) => {})
 */

export const sendUserMessage = (state: SendBirdState) => (
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
 * const sendFileMessage = selectors.sendFileMessage(state);
 * sendFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  params: FileMessageCreateParams,
 * )
 *  .onPending((message) => {})
 *  .onFailed((error, message) => {})
 *  .onSucceeded((message) => {})
 */
export const sendFileMessage = (state: SendBirdState) => (
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
 * const updateUserMessage = selectors.updateUserMessage(state);
 * updateUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  messageId: number,
 *  messageParams: UserMessageUpdateParams,
 * )
 *  .then((message) => {})
 *  .catch((error) => {})
 */
export const updateUserMessage = (state: SendBirdState) => (
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
 * const updateFileMessage = selectors.updateFileMessage(state);
 * updateFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  messageId: number,
 *  params: FileMessageUpdateParams,
 * )
 *  .then((message) => {})
 *  .catch((error) => {})
 */
// const updateFileMessage = (state: SendBirdState) => (
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
 * const deleteMessage = selectors.deleteMessage(state);
 * deleteMessage(
 *  channel: GroupChannel | OpenChannel,
 *  message: SendableMessage,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const deleteMessage = (state: SendBirdState) => (
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
 * const resendUserMessage = selectors.resendUserMessage(state);
 * resendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: SendableMessage,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const resendUserMessage = (state: SendBirdState) => (
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
 * const resendFileMessage = selectors.resendFileMessage(state);
 * resendFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: FileMessage,
 *  blob: Blob,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export const resendFileMessage = (state: SendBirdState) => (
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

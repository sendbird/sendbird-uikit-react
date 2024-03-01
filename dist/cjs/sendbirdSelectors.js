'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pubSub_topics = require('./chunks/bundle-LutGJd7y.js');
var utils = require('./chunks/bundle-QStqvuCY.js');

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
var getSdk = function (state) {
    var _a = state.stores, stores = _a === void 0 ? {} : _a;
    var _b = stores.sdkStore, sdkStore = _b === void 0 ? {} : _b;
    var sdk = sdkStore.sdk;
    return sdk;
};
/**
 * const pubSub = selectors.getPubSub(state);
 */
var getPubSub = function (state) {
    var _a = state.config, config = _a === void 0 ? {} : _a;
    var pubSub = config.pubSub;
    return pubSub;
};
// 2. Chat & Connection
/**
 * const connect = selectors.getConnect(state);
 * connect('user-id-sendbirdian', 'access-token-0000')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
var getConnect = function (state) { return (function (userId, accessToken) { return (new Promise(function (resolve, reject) {
    var sdk = getSdk(state);
    if (!sdk) {
        reject(new Error('Sdk not found'));
    }
    if (!((sdk === null || sdk === void 0 ? void 0 : sdk.connect) && typeof sdk.connect === 'function')) {
        reject(new Error('Not found the function "connect'));
    }
    if (!accessToken) {
        sdk.connect(userId)
            .then(function (res) { return resolve(res); })
            .catch(function (err) { return reject(err); });
    }
    else {
        sdk.connect(userId, accessToken)
            .then(function (res) { return resolve(res); })
            .catch(function (err) { return reject(err); });
    }
})); }); };
/**
 * const disconnect = selectors.getDisconnect(state);
 * disconnect()
 *  .then(() => {})
 *  .catch((error) => {})
 */
var getDisconnect = function (state) { return (function () { return (new Promise(function (resolve, reject) {
    var sdk = getSdk(state);
    if (!sdk) {
        reject(new Error('Sdk not found'));
    }
    if (!(sdk.disconnect && typeof sdk.disconnect === 'function')) {
        reject(new Error('Not found the function "disconnect'));
    }
    sdk.disconnect()
        .then(function (res) { return resolve(res); })
        .catch(function (err) { return reject(err); });
})); }); };
/**
 * const updateUserInfo = selectors.getUpdateUserInfo(state);
 * updateUserInfo('new-nickname', 'new-profile-url')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
var getUpdateUserInfo = function (state) { return (function (nickname, profileUrl) { return (new Promise(function (resolve, reject) {
    var sdk = getSdk(state);
    if (!sdk) {
        reject(new Error('Sdk not found'));
    }
    if (!(sdk.updateCurrentUserInfo && typeof sdk.updateCurrentUserInfo === 'function')) {
        reject(new Error('Not found the function "updateCurrentUserInfo"'));
    }
    var userParams = { nickname: nickname };
    if (profileUrl) {
        userParams.profileUrl = profileUrl;
    }
    sdk.updateCurrentUserInfo(userParams)
        .then(function (res) { return resolve(res); })
        .catch(function (err) { return reject(err); });
})); }); };
// 3. Channel
/**
 * const createGroupChannel = selectors.getCreateGroupChannel(state);
 * createGroupChannel(channelParams: GroupChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
var getCreateGroupChannel = function (state) { return (function (params) { return (new Promise(function (resolve, reject) {
    var sdk = getSdk(state);
    var pubSub = getPubSub(state);
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
        .then(function (channel) {
        resolve(channel);
        pubSub.publish(pubSub_topics.pubSubTopics.CREATE_CHANNEL, { channel: channel });
    })
        .catch(reject);
})); }); };
/**
 * const createOpenChannel = selectors.getCreateOpenChannel(state);
 * createOpenChannel(channelParams: OpenChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
var getCreateOpenChannel = function (state) { return (function (params) { return (new Promise(function (resolve, reject) {
    var sdk = getSdk(state);
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
        .then(function (channel) {
        resolve(channel);
        // Consider pubSub process
    })
        .catch(reject);
})); }); };
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
var getGetGroupChannel = function (state) { return (function (channelUrl) { return (new Promise(function (resolve, reject) {
    var sdk = getSdk(state);
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
        .then(function (channel) {
        resolve(channel);
        // Add pubSub with isSelected
    })
        .catch(reject);
})); }); };
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
var getGetOpenChannel = function (state) { return (function (channelUrl) { return (new Promise(function (resolve, reject) {
    var sdk = getSdk(state);
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
        .then(function (channel) {
        resolve(channel);
        // Add pubSub with isSelected
    })
        .catch(reject);
})); }); };
/**
 * const leaveChannel = selectors.getLeaveGroupChannel(state);
 * leaveChannel('group-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
var getLeaveGroupChannel = function (state) { return (function (channelUrl) { return (new Promise(function (resolve, reject) {
    var _a;
    (_a = getGetGroupChannel(state)) === null || _a === void 0 ? void 0 : _a(channelUrl).then(function (channel) {
        channel.leave()
            .then(function () {
            resolve();
            // Add pubSub process
        })
            .catch(reject);
    }).catch(reject);
})); }); };
/**
 * const enterChannel = selectors.getEnterOpenChannel(state);
 * enterChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
var getEnterOpenChannel = function (state) { return (function (channelUrl) { return (new Promise(function (resolve, reject) {
    var _a;
    (_a = getGetOpenChannel(state)) === null || _a === void 0 ? void 0 : _a(channelUrl).then(function (channel) {
        channel.enter()
            .then(function () {
            resolve(channel);
            // Add pubSub process
        })
            .catch(reject);
    }).catch(reject);
})); }); };
/**
 * const exitChannel = selectors.getExitOpenChannel(state);
 * exitChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
var getExitOpenChannel = function (state) { return (function (channelUrl) { return (new Promise(function (resolve, reject) {
    var _a;
    (_a = getGetOpenChannel(state)) === null || _a === void 0 ? void 0 : _a(channelUrl).then(function (channel) {
        channel.exit()
            .then(function () {
            resolve(channel);
            // Add pubSub process
        })
            .catch(reject);
    }).catch(reject);
})); }); };
/**
 * const freezeChannel = selectors.getFreezeChannel(currentChannel);
 * freezeChannel()
 *  .then(() => {})
 *  .catch((error) => {})
 */
var getFreezeChannel = function () { return (function (channel) { return (new Promise(function (resolve, reject) {
    if (!(channel.freeze && typeof (channel === null || channel === void 0 ? void 0 : channel.freeze) === 'function')) {
        reject(new Error('Not found the function "freeze"'));
    }
    channel.freeze()
        .then(function () {
        resolve();
        // Add pubSub process
        /**
         * consider divide the logic to
         * _freezeGroupChannel and _freezeOpenChannel
         */
    })
        .catch(reject);
})); }); };
/**
 * const unfreezeChannel = selectors.getUnfreezeChannel(currentChannel);
 * unfreezeChannel()
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
var getUnfreezeChannel = function () { return (function (channel) { return (new Promise(function (resolve, reject) {
    if (!(channel.unfreeze && typeof (channel === null || channel === void 0 ? void 0 : channel.unfreeze) === 'function')) {
        reject(new Error('Not found the function "unfreeze"'));
    }
    channel.unfreeze()
        .then(function () {
        resolve();
        // Add pubSub process
        /**
         * consider divide the logic to
         * _unfreezeGroupChannel and _unfreezeOpenChannel
         */
    })
        .catch(reject);
})); }); };
// 4. Message
var UikitMessageHandler = /** @class */ (function () {
    function UikitMessageHandler() {
        this._onPending = utils.noop;
        this._onFailed = utils.noop;
        this._onSucceeded = utils.noop;
    }
    UikitMessageHandler.prototype.triggerPending = function (message) {
        this._onPending(message);
    };
    UikitMessageHandler.prototype.triggerFailed = function (error, message) {
        this._onFailed(error, message.isResendable ? message : null);
    };
    UikitMessageHandler.prototype.triggerSucceeded = function (message) {
        this._onSucceeded(message);
    };
    UikitMessageHandler.prototype.onPending = function (handler) {
        if (typeof handler === 'function') {
            this._onPending = handler;
        }
        return this;
    };
    UikitMessageHandler.prototype.onFailed = function (handler) {
        if (typeof handler === 'function') {
            this._onFailed = handler;
        }
        return this;
    };
    UikitMessageHandler.prototype.onSucceeded = function (handler) {
        if (typeof handler === 'function') {
            this._onSucceeded = handler;
        }
        return this;
    };
    return UikitMessageHandler;
}());
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
var getSendUserMessage = function (state, publishingModules) {
    if (publishingModules === void 0) { publishingModules = []; }
    return (function (channel, params) {
        var handler = new UikitMessageHandler();
        var pubSub = getPubSub(state);
        channel.sendUserMessage(params)
            .onFailed(function (error, message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_MESSAGE_FAILED, { error: error, message: message, channel: channel, publishingModules: publishingModules });
            handler.triggerFailed(error, message);
        })
            .onPending(function (message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_MESSAGE_START, { message: message, channel: channel, publishingModules: publishingModules });
            handler.triggerPending(message);
        })
            .onSucceeded(function (message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_USER_MESSAGE, { message: message, channel: channel, publishingModules: publishingModules });
            handler.triggerSucceeded(message);
        });
        return handler;
    });
};
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
var getSendFileMessage = function (state, publishingModules) {
    if (publishingModules === void 0) { publishingModules = []; }
    return (function (channel, params) {
        var handler = new UikitMessageHandler();
        var pubSub = getPubSub(state);
        channel.sendFileMessage(params)
            .onFailed(function (error, message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_MESSAGE_FAILED, { error: error, message: message, channel: channel, publishingModules: publishingModules });
            handler.triggerFailed(error, message);
        })
            .onPending(function (message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_MESSAGE_START, { message: message, channel: channel, publishingModules: publishingModules });
            handler.triggerPending(message);
        })
            .onSucceeded(function (message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_FILE_MESSAGE, { message: message, channel: channel, publishingModules: publishingModules });
            handler.triggerSucceeded(message);
        });
        return handler;
    });
};
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
var getUpdateUserMessage = function (state, publishingModules) {
    if (publishingModules === void 0) { publishingModules = []; }
    return (function (channel, messageId, params) { return (new Promise(function (resolve, reject) {
        var pubSub = getPubSub(state);
        channel.updateUserMessage(messageId, params)
            .then(function (message) {
            pubSub.publish(pubSub_topics.pubSubTopics.UPDATE_USER_MESSAGE, { message: message, channel: channel, fromSelector: true, publishingModules: publishingModules });
            resolve(message);
        })
            .catch(reject);
    })); });
};
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
 *  .then((deletedMessage) => {})
 *  .catch((error) => {})
 */
var getDeleteMessage = function (state) { return (function (channel, message) { return (new Promise(function (resolve, reject) {
    var pubSub = getPubSub(state);
    var messageId = message.messageId;
    channel.deleteMessage(message)
        .then(function () {
        pubSub.publish(pubSub_topics.pubSubTopics.DELETE_MESSAGE, { messageId: messageId, channel: channel });
        resolve(message);
    })
        .catch(reject);
})); }); };
/**
 * const resendUserMessage = selectors.getResendUserMessage(state);
 * resendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: UserMessage,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
var getResendUserMessage = function (state, publishingModules) {
    if (publishingModules === void 0) { publishingModules = []; }
    return (function (channel, failedMessage) { return (new Promise(function (resolve, reject) {
        var pubSub = getPubSub(state);
        channel.resendUserMessage(failedMessage)
            .then(function (message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_USER_MESSAGE, { message: message, channel: channel, publishingModules: publishingModules });
            resolve(message);
        })
            .catch(reject);
    })); });
};
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
var getResendFileMessage = function (state, publishingModules) {
    if (publishingModules === void 0) { publishingModules = []; }
    return (function (channel, failedMessage, blob) { return (new Promise(function (resolve, reject) {
        var pubSub = getPubSub(state);
        channel.resendFileMessage(failedMessage, blob)
            .then(function (message) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_FILE_MESSAGE, { message: message, channel: channel, publishingModules: publishingModules });
            resolve(message);
        })
            .catch(reject);
    })); });
};
var sendbirdSelectors = {
    getSdk: getSdk,
    getPubSub: getPubSub,
    getConnect: getConnect,
    getDisconnect: getDisconnect,
    getUpdateUserInfo: getUpdateUserInfo,
    getCreateGroupChannel: getCreateGroupChannel,
    getCreateOpenChannel: getCreateOpenChannel,
    getGetGroupChannel: getGetGroupChannel,
    getGetOpenChannel: getGetOpenChannel,
    getLeaveGroupChannel: getLeaveGroupChannel,
    getEnterOpenChannel: getEnterOpenChannel,
    getExitOpenChannel: getExitOpenChannel,
    getFreezeChannel: getFreezeChannel,
    getUnfreezeChannel: getUnfreezeChannel,
    getSendUserMessage: getSendUserMessage,
    getSendFileMessage: getSendFileMessage,
    getUpdateUserMessage: getUpdateUserMessage,
    getDeleteMessage: getDeleteMessage,
    getResendUserMessage: getResendUserMessage,
    getResendFileMessage: getResendFileMessage,
};

exports.UikitMessageHandler = UikitMessageHandler;
exports.default = sendbirdSelectors;
exports.getConnect = getConnect;
exports.getCreateGroupChannel = getCreateGroupChannel;
exports.getCreateOpenChannel = getCreateOpenChannel;
exports.getDeleteMessage = getDeleteMessage;
exports.getDisconnect = getDisconnect;
exports.getEnterOpenChannel = getEnterOpenChannel;
exports.getExitOpenChannel = getExitOpenChannel;
exports.getFreezeChannel = getFreezeChannel;
exports.getGetGroupChannel = getGetGroupChannel;
exports.getGetOpenChannel = getGetOpenChannel;
exports.getLeaveGroupChannel = getLeaveGroupChannel;
exports.getPubSub = getPubSub;
exports.getResendFileMessage = getResendFileMessage;
exports.getResendUserMessage = getResendUserMessage;
exports.getSdk = getSdk;
exports.getSendFileMessage = getSendFileMessage;
exports.getSendUserMessage = getSendUserMessage;
exports.getUnfreezeChannel = getUnfreezeChannel;
exports.getUpdateUserInfo = getUpdateUserInfo;
exports.getUpdateUserMessage = getUpdateUserMessage;
//# sourceMappingURL=sendbirdSelectors.js.map

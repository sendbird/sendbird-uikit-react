import { useCallback } from 'react';
import { p as pubSubTopics, s as shouldPubSubPublishToChannel, a as shouldPubSubPublishToThread } from './bundle-yarrTY_z.js';
import { s as scrollIntoLast$1 } from './bundle-LgR-0X7v.js';
import '../utils/message/getOutgoingMessageState.js';
import { e as SCROLL_BOTTOM_DELAY_FOR_SEND } from './bundle-UKdN0Ihw.js';

var getNicknamesMapFromMembers = function (members) {
    if (members === void 0) { members = []; }
    var nicknamesMap = new Map();
    for (var memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
        var _a = members[memberIndex], userId = _a.userId, nickname = _a.nickname;
        nicknamesMap.set(userId, nickname);
    }
    return nicknamesMap;
};
var getParentMessageFrom = function (message) {
    if (!message) {
        return null;
    }
    if (isParentMessage(message)) {
        return message;
    }
    if (isThreadMessage(message)) {
        return (message === null || message === void 0 ? void 0 : message.parentMessage) || null;
    }
    return null;
};
var isParentMessage = function (message) {
    return ((message === null || message === void 0 ? void 0 : message.parentMessage) === null
        && typeof (message === null || message === void 0 ? void 0 : message.parentMessageId) === 'number'
        && !(message === null || message === void 0 ? void 0 : message.parentMessageId));
};
var isThreadMessage = function (message) {
    return ((message === null || message === void 0 ? void 0 : message.parentMessage) !== null
        && typeof (message === null || message === void 0 ? void 0 : message.parentMessageId) === 'number'
        && (message === null || message === void 0 ? void 0 : message.parentMessageId) > 0
        && (message === null || message === void 0 ? void 0 : message.threadInfo) === null);
};
var isAboutSame = function (a, b, px) { return (Math.abs(a - b) <= px); };
var isEmpty = function (val) { return (val === null || val === undefined); };
// Some Ids return string and number inconsistently
// only use to comapre IDs
function compareIds(a, b) {
    if (isEmpty(a) || isEmpty(b)) {
        return false;
    }
    var aString = a.toString();
    var bString = b.toString();
    return aString === bString;
}
var scrollIntoLast = function (intialTry) {
    if (intialTry === void 0) { intialTry = 0; }
    var MAX_TRIES = 10;
    var currentTry = intialTry;
    if (currentTry > MAX_TRIES) {
        return;
    }
    try {
        var scrollDOM = document.querySelector('.sendbird-thread-ui--scroll');
        // eslint-disable-next-line no-multi-assign
        scrollDOM.scrollTop = scrollDOM.scrollHeight;
    }
    catch (error) {
        setTimeout(function () {
            scrollIntoLast(currentTry + 1);
        }, 500 * currentTry);
    }
};

/**
 * pubSub is used instead of messagesDispatcher to avoid redundantly calling
 * because this useSendMultipleFilesMessage is used in the Channel and Thread both
 */
var useSendMultipleFilesMessage = function (_a, _b) {
    var currentChannel = _a.currentChannel, onBeforeSendMultipleFilesMessage = _a.onBeforeSendMultipleFilesMessage, publishingModules = _a.publishingModules;
    var logger = _b.logger, pubSub = _b.pubSub, scrollRef = _b.scrollRef;
    var sendMessage = useCallback(function (files, quoteMessage) {
        return new Promise(function (resolve, reject) {
            if (!currentChannel) {
                logger.warning('Channel: Sending MFm failed, because currentChannel is null.', { currentChannel: currentChannel });
                reject();
            }
            if (files.length <= 1) {
                logger.warning('Channel: Sending MFM failed, because there are no multiple files.', { files: files });
                reject();
            }
            var messageParams = {
                fileInfoList: files.map(function (file) { return ({
                    file: file,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                }); }),
            };
            if (quoteMessage) {
                messageParams.isReplyToChannel = true;
                messageParams.parentMessageId = quoteMessage.messageId;
            }
            if (typeof onBeforeSendMultipleFilesMessage === 'function') {
                messageParams = onBeforeSendMultipleFilesMessage(files, quoteMessage);
            }
            logger.info('Channel: Start sending MFM', { messageParams: messageParams });
            try {
                currentChannel.sendMultipleFilesMessage(messageParams)
                    .onFileUploaded(function (requestId, index, uploadableFileInfo, error) {
                    logger.info('Channel: onFileUploaded during sending MFM', {
                        requestId: requestId,
                        index: index,
                        error: error,
                        uploadableFileInfo: uploadableFileInfo,
                    });
                    pubSub.publish(pubSubTopics.ON_FILE_INFO_UPLOADED, {
                        response: {
                            channelUrl: currentChannel.url,
                            requestId: requestId,
                            index: index,
                            uploadableFileInfo: uploadableFileInfo,
                            error: error,
                        },
                        publishingModules: publishingModules,
                    });
                })
                    .onPending(function (pendingMessage) {
                    logger.info('Channel: in progress of sending MFM', { pendingMessage: pendingMessage, fileInfoList: messageParams.fileInfoList });
                    pubSub.publish(pubSubTopics.SEND_MESSAGE_START, {
                        message: pendingMessage,
                        channel: currentChannel,
                        publishingModules: publishingModules,
                    });
                    setTimeout(function () {
                        if (scrollRef && shouldPubSubPublishToChannel(publishingModules)) {
                            scrollIntoLast$1(0, scrollRef);
                        }
                        if (shouldPubSubPublishToThread(publishingModules)) {
                            scrollIntoLast(0);
                        }
                    }, SCROLL_BOTTOM_DELAY_FOR_SEND);
                })
                    .onFailed(function (error, failedMessage) {
                    logger.error('Channel: Sending MFM failed.', { error: error, failedMessage: failedMessage });
                    pubSub.publish(pubSubTopics.SEND_MESSAGE_FAILED, {
                        channel: currentChannel,
                        message: failedMessage,
                        publishingModules: publishingModules,
                    });
                    reject(error);
                })
                    .onSucceeded(function (succeededMessage) {
                    logger.info('Channel: Sending voice message success!', { succeededMessage: succeededMessage });
                    pubSub.publish(pubSubTopics.SEND_FILE_MESSAGE, {
                        channel: currentChannel,
                        message: succeededMessage,
                        publishingModules: publishingModules,
                    });
                    resolve(succeededMessage);
                });
            }
            catch (error) {
                logger.error('Channel: Sending MFM failed.', { error: error });
                reject(error);
            }
        });
    }, [
        currentChannel,
        onBeforeSendMultipleFilesMessage,
        publishingModules,
    ]);
    return [sendMessage];
};

export { getNicknamesMapFromMembers as a, compareIds as c, getParentMessageFrom as g, isAboutSame as i, scrollIntoLast as s, useSendMultipleFilesMessage as u };
//# sourceMappingURL=bundle-sZUcD6H6.js.map

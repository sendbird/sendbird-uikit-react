import { c as __spreadArray } from './bundle-UnAcr6wX.js';
import { SendingStatus } from '@sendbird/chat/message';

var scrollToRenderedMessage = function (scrollRef, initialTimeStamp, setIsScrolled) {
    var _a;
    try {
        var container = scrollRef.current;
        // scroll into the message with initialTimeStamp
        var element = (_a = container.querySelectorAll("[data-sb-created-at=\"".concat(initialTimeStamp, "\"]"))) === null || _a === void 0 ? void 0 : _a[0];
        if (element instanceof HTMLElement) {
            // Set the scroll position of the container to bring the element to the top
            container.scrollTop = element.offsetTop;
        }
    }
    catch (_b) {
        // do nothing
    }
    finally {
        setIsScrolled === null || setIsScrolled === void 0 ? void 0 : setIsScrolled(true);
    }
};
/* eslint-disable default-param-last */
var scrollIntoLast = function (initialTry, scrollRef, setIsScrolled) {
    if (initialTry === void 0) { initialTry = 0; }
    var MAX_TRIES = 10;
    var currentTry = initialTry;
    if (currentTry > MAX_TRIES) {
        setIsScrolled === null || setIsScrolled === void 0 ? void 0 : setIsScrolled(true);
        return;
    }
    try {
        var scrollDOM = (scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) || document.querySelector('.sendbird-conversation__messages-padding');
        scrollDOM.scrollTop = scrollDOM.scrollHeight;
        setIsScrolled === null || setIsScrolled === void 0 ? void 0 : setIsScrolled(true);
    }
    catch (error) {
        setTimeout(function () {
            scrollIntoLast(currentTry + 1, scrollRef, setIsScrolled);
        }, 500 * currentTry);
    }
};
var isOperator = function (groupChannel) {
    var myRole = groupChannel === null || groupChannel === void 0 ? void 0 : groupChannel.myRole;
    return myRole === 'operator';
};
var isDisabledBecauseFrozen = function (groupChannel) {
    var isFrozen = groupChannel === null || groupChannel === void 0 ? void 0 : groupChannel.isFrozen;
    return isFrozen && !isOperator(groupChannel);
};
var isDisabledBecauseMuted = function (groupChannel) {
    var myMutedState = groupChannel === null || groupChannel === void 0 ? void 0 : groupChannel.myMutedState;
    return myMutedState === 'muted';
};
var getAllEmojisMapFromEmojiContainer = function (emojiContainer) {
    var _a = emojiContainer.emojiCategories, emojiCategories = _a === void 0 ? [] : _a;
    var allEmojisMap = new Map();
    for (var categoryIndex = 0; categoryIndex < emojiCategories.length; categoryIndex += 1) {
        var emojis = emojiCategories[categoryIndex].emojis;
        for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex += 1) {
            var _b = emojis[emojiIndex], key = _b.key, url = _b.url;
            allEmojisMap.set(key, url);
        }
    }
    return allEmojisMap;
};
var getNicknamesMapFromMembers = function (members) {
    if (members === void 0) { members = []; }
    var nicknamesMap = new Map();
    for (var memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
        var _a = members[memberIndex], userId = _a.userId, nickname = _a.nickname;
        nicknamesMap.set(userId, nickname);
    }
    return nicknamesMap;
};
var getUniqueListBy = function (arr, key) {
    var entries = arr.map(function (item) { return [item[key], item]; });
    return Array.from(new Map(entries).values());
};
var getUniqueListByMessageId = function (arr) {
    return getUniqueListBy(arr, 'messageId');
};
var sortByCreatedAt = function (messages) {
    return messages.sort(function (a, b) { return a.createdAt - b.createdAt; });
};
var mergeAndSortMessages = function (oldMessages, newMessages) {
    var lastOldMessage = oldMessages[oldMessages.length - 1];
    var firstNewMessage = newMessages[0];
    // If the last message of oldMessages is older than the first message of newMessages,
    // then we can safely append newMessages to oldMessages.
    if ((lastOldMessage === null || lastOldMessage === void 0 ? void 0 : lastOldMessage.createdAt) < (firstNewMessage === null || firstNewMessage === void 0 ? void 0 : firstNewMessage.createdAt)) {
        return __spreadArray(__spreadArray([], oldMessages, true), newMessages, true);
    }
    // todo: optimize this
    // If the last message of oldMessages is newer than the first message of newMessages,
    // then we need to merge the two arrays and sort them by createdAt.
    var mergedMessages = __spreadArray(__spreadArray([], oldMessages, true), newMessages, true);
    var unique = getUniqueListByMessageId(mergedMessages);
    return sortByCreatedAt(unique);
};
var passUnsuccessfullMessages = function (allMessages, newMessage) {
    if ('sendingStatus' in newMessage
        && (newMessage.sendingStatus === SendingStatus.SUCCEEDED || newMessage.sendingStatus === SendingStatus.PENDING)) {
        var lastIndexOfSucceededMessage = allMessages
            .map(function (message) {
            if ('sendingStatus' in message && message.sendingStatus)
                return message.sendingStatus;
            return message.isAdminMessage() ? SendingStatus.SUCCEEDED : null;
        })
            .lastIndexOf(SendingStatus.SUCCEEDED);
        if (lastIndexOfSucceededMessage + 1 < allMessages.length) {
            var messages = __spreadArray([], allMessages, true);
            messages.splice(lastIndexOfSucceededMessage + 1, 0, newMessage);
            return messages;
        }
    }
    return __spreadArray(__spreadArray([], allMessages, true), [newMessage], false);
};
var isAboutSame = function (a, b, px) {
    return Math.abs(a - b) <= px;
};

export { isDisabledBecauseFrozen as a, isDisabledBecauseMuted as b, scrollToRenderedMessage as c, getNicknamesMapFromMembers as d, getAllEmojisMapFromEmojiContainer as g, isAboutSame as i, mergeAndSortMessages as m, passUnsuccessfullMessages as p, scrollIntoLast as s };
//# sourceMappingURL=bundle-H77M-_wK.js.map

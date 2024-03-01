'use strict';

var React = require('react');
var UserProfileContext = require('../chunks/bundle-DKcL-93i.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var _const = require('../chunks/bundle-eBZWCIEU.js');
var utils = require('../chunks/bundle-eDrjbSc-.js');
var getIsReactionEnabled = require('../chunks/bundle-FMwBmvVd.js');
var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var index$2 = require('../chunks/bundle-Ny3NKw-X.js');
var message = require('@sendbird/chat/message');
var index = require('../chunks/bundle-3fb9w4KI.js');
var actionTypes = require('../chunks/bundle-XgxbsHav.js');
var compareIds = require('../chunks/bundle-ZoEtk6Hz.js');
var Channel_hooks_useInitialMessagesFetch = require('../chunks/bundle-Tcz7Ubz9.js');
var index$1 = require('../chunks/bundle-wzulmlgb.js');
var groupChannel = require('@sendbird/chat/groupChannel');
var uuid = require('../chunks/bundle-Gzug-R-w.js');
var useReconnectOnIdle = require('../chunks/bundle-vtSSgUjy.js');
var consts = require('../chunks/bundle-I79mHo_2.js');
var pubSub_topics = require('../chunks/bundle-LutGJd7y.js');
var useToggleReactionCallback = require('../chunks/bundle-U874nqiD.js');
var resolvedReplyType = require('../chunks/bundle-2Ou4ZIu0.js');
var useSendMultipleFilesMessage = require('../chunks/bundle-xgiAxHSr.js');
require('../withSendbird.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../utils/message/getOutgoingMessageState.js');

var initialState = {
    initialized: false,
    loading: true,
    allMessages: [],
    /**
     * localMessages: pending & failed messages
     */
    localMessages: [],
    currentGroupChannel: null,
    // for scrollup
    hasMorePrev: false,
    oldestMessageTimeStamp: 0,
    // for scroll down
    // onScrollDownCallback is added for navigation to different timestamps on messageSearch
    // hasMorePrev, onScrollCallback -> scroll up(default behavior)
    // hasMoreNext, onScrollDownCallback -> scroll down
    hasMoreNext: false,
    latestMessageTimeStamp: 0,
    emojiContainer: { emojiCategories: [], emojiHash: '' },
    /** @deprecated Please use `unreadSinceDate` instead. * */
    unreadSince: null,
    /**
     * unreadSinceDate is a date information about message unread.
     * It's used only for the {unreadSinceDate && <UnreadCount unreadSinceDate={unreadSinceDate} />}
     */
    unreadSinceDate: null,
    isInvalid: false,
    readStatus: null,
    messageListParams: null,
    typingMembers: [],
};

var getOldestMessageTimeStamp = function (messages) {
    if (messages === void 0) { messages = []; }
    var oldestMessage = messages[0];
    return (oldestMessage && oldestMessage.createdAt) || null;
};
var getLatestMessageTimeStamp = function (messages) {
    if (messages === void 0) { messages = []; }
    var latestMessage = messages[messages.length - 1];
    return (latestMessage && latestMessage.createdAt) || null;
};
function hasReqId(message) {
    return 'reqId' in message;
}
function channelReducer(state, action) {
    return index.K(action)
        .with({ type: actionTypes.RESET_MESSAGES }, function () {
        return _tslib.__assign(_tslib.__assign({}, state), { 
            // when user switches channel, if the previous channel `hasMorePrev`
            // the onScroll gets called twice, setting hasMorePrev false prevents this
            hasMorePrev: false, hasMoreNext: false, allMessages: [], localMessages: [] });
    })
        .with({ type: actionTypes.FETCH_INITIAL_MESSAGES_START }, function () {
        return _tslib.__assign(_tslib.__assign({}, state), { loading: true, allMessages: state.allMessages.filter(function (m) { return index$1.isSendableMessage(m)
                ? m.sendingStatus !== message.SendingStatus.SUCCEEDED
                : true; }), localMessages: [] });
    })
        .with({ type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS }, function (action) {
        var _a;
        var _b = action.payload, currentGroupChannel = _b.currentGroupChannel, messages = _b.messages;
        if (!((currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url) === ((_a = state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url))) {
            return state;
        }
        var oldestMessageTimeStamp = getOldestMessageTimeStamp(messages);
        var latestMessageTimeStamp = getLatestMessageTimeStamp(messages);
        return _tslib.__assign(_tslib.__assign({}, state), { loading: false, initialized: true, hasMorePrev: true, hasMoreNext: true, oldestMessageTimeStamp: oldestMessageTimeStamp, latestMessageTimeStamp: latestMessageTimeStamp, allMessages: _tslib.__spreadArray([], messages, true) });
    })
        .with({ type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS }, function (action) {
        var _a, _b, _c, _d;
        var _e = action.payload, currentGroupChannel = _e.currentGroupChannel, messages = _e.messages;
        if (!((currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url) === ((_a = state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url))) {
            return state;
        }
        var hasMorePrev = ((_b = messages === null || messages === void 0 ? void 0 : messages.length) !== null && _b !== void 0 ? _b : 0)
            >= ((_d = (_c = state === null || state === void 0 ? void 0 : state.messageListParams) === null || _c === void 0 ? void 0 : _c.prevResultSize) !== null && _d !== void 0 ? _d : Channel_hooks_useInitialMessagesFetch.PREV_RESULT_SIZE) + 1;
        var oldestMessageTimeStamp = getOldestMessageTimeStamp(messages);
        // Remove duplicated messages
        var duplicatedMessageIds = [];
        var updatedOldMessages = state.allMessages.map(function (msg) {
            var duplicatedMessage = messages.find(function (_a) {
                var messageId = _a.messageId;
                return compareIds.compareIds(messageId, msg.messageId);
            });
            if (!duplicatedMessage) {
                return msg;
            }
            duplicatedMessageIds.push(duplicatedMessage.messageId);
            return duplicatedMessage.updatedAt > msg.updatedAt
                ? duplicatedMessage
                : msg;
        });
        var filteredNewMessages = duplicatedMessageIds.length > 0
            ? messages.filter(function (msg) { return !duplicatedMessageIds.find(function (messageId) { return compareIds.compareIds(messageId, msg.messageId); }); })
            : messages;
        return _tslib.__assign(_tslib.__assign({}, state), { hasMorePrev: hasMorePrev, oldestMessageTimeStamp: oldestMessageTimeStamp, allMessages: _tslib.__spreadArray(_tslib.__spreadArray([], filteredNewMessages, true), updatedOldMessages, true) });
    })
        .with({ type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS }, function (action) {
        var _a, _b, _c, _d;
        var _e = action.payload, currentGroupChannel = _e.currentGroupChannel, messages = _e.messages;
        if (!((currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url) === ((_a = state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url))) {
            return state;
        }
        var hasMoreNext = ((_b = messages === null || messages === void 0 ? void 0 : messages.length) !== null && _b !== void 0 ? _b : 0)
            === ((_d = (_c = state === null || state === void 0 ? void 0 : state.messageListParams) === null || _c === void 0 ? void 0 : _c.nextResultSize) !== null && _d !== void 0 ? _d : Channel_hooks_useInitialMessagesFetch.NEXT_RESULT_SIZE) + 1;
        var latestMessageTimeStamp = getLatestMessageTimeStamp(messages);
        // sort ~
        var sortedMessages = utils.mergeAndSortMessages(state.allMessages, messages);
        return _tslib.__assign(_tslib.__assign({}, state), { hasMoreNext: hasMoreNext, latestMessageTimeStamp: latestMessageTimeStamp, allMessages: sortedMessages });
    })
        .with({
        type: index.S.union(actionTypes.FETCH_INITIAL_MESSAGES_FAILURE, actionTypes.FETCH_PREV_MESSAGES_FAILURE, actionTypes.FETCH_NEXT_MESSAGES_FAILURE),
    }, function (action) {
        var _a;
        var currentGroupChannel = action.payload.currentGroupChannel;
        if ((currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url) !== ((_a = state === null || state === void 0 ? void 0 : state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url))
            return state;
        // It shows something went wrong screen when fetching initial messages failed.
        var shouldInvalid = [actionTypes.FETCH_INITIAL_MESSAGES_FAILURE].includes(action.type);
        return _tslib.__assign(_tslib.__assign({}, state), { loading: false, isInvalid: shouldInvalid, initialized: false, allMessages: [], hasMorePrev: false, hasMoreNext: false, oldestMessageTimeStamp: null, latestMessageTimeStamp: null });
    })
        .with({ type: actionTypes.SEND_MESSAGE_START }, function (action) {
        // Message should not be spread here
        // it will loose some methods like `isUserMessage`
        return _tslib.__assign(_tslib.__assign({}, state), { localMessages: _tslib.__spreadArray(_tslib.__spreadArray([], state.localMessages, true), [action.payload], false) });
    })
        .with({ type: actionTypes.SEND_MESSAGE_SUCCESS }, function (action) {
        var message = action.payload;
        /**
         * Admin messages do not have reqId. We need to include them.
         */
        var filteredMessages = state.allMessages.filter(function (m) { return !hasReqId(m) || (m === null || m === void 0 ? void 0 : m.reqId) !== (message === null || message === void 0 ? void 0 : message.reqId); });
        // [Policy] Pending messages and failed messages
        // must always be at the end of the message list
        return _tslib.__assign(_tslib.__assign({}, state), { allMessages: _tslib.__spreadArray(_tslib.__spreadArray([], filteredMessages, true), [message], false), localMessages: state.localMessages.filter(function (m) { return hasReqId(m) && (m === null || m === void 0 ? void 0 : m.reqId) !== (message === null || message === void 0 ? void 0 : message.reqId); }) });
    })
        .with({ type: actionTypes.SEND_MESSAGE_FAILURE }, function (action) {
        // @ts-ignore
        action.payload.failed = true;
        return _tslib.__assign(_tslib.__assign({}, state), { localMessages: state.localMessages.map(function (m) { return compareIds.compareIds(hasReqId(m) && m.reqId, action.payload.reqId)
                ? action.payload
                : m; }) });
    })
        .with({ type: actionTypes.SET_CURRENT_CHANNEL }, function (action) {
        return _tslib.__assign(_tslib.__assign({}, state), { currentGroupChannel: action.payload, isInvalid: false });
    })
        .with({ type: actionTypes.SET_CHANNEL_INVALID }, function () {
        return _tslib.__assign(_tslib.__assign({}, state), { currentGroupChannel: null, allMessages: [], localMessages: [], isInvalid: true });
    })
        .with({ type: actionTypes.ON_MESSAGE_RECEIVED }, function (action) {
        var _a, _b;
        var _c = action.payload, channel = _c.channel, message = _c.message;
        var members = channel.members;
        var sender = message.sender;
        var currentGroupChannel = state.currentGroupChannel;
        var currentGroupChannelUrl = currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url;
        if (!compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, currentGroupChannelUrl)) {
            return state;
        }
        // Excluded overlapping messages
        if (state.allMessages.some(function (msg) { return msg.messageId === message.messageId; })) {
            return state;
        }
        // Filter by userFilledQuery
        if (state.messageListParams
            && !index$1.filterMessageListParams(state.messageListParams, message)) {
            return state;
        }
        if (message.isAdminMessage && message.isAdminMessage()) {
            return _tslib.__assign(_tslib.__assign({}, state), { allMessages: utils.passUnsuccessfullMessages(state.allMessages, message) });
        }
        // Update members when sender profileUrl, nickname, friendName has been changed
        var senderMember = members === null || members === void 0 ? void 0 : members.find(function (m) { return (m === null || m === void 0 ? void 0 : m.userId) === (sender === null || sender === void 0 ? void 0 : sender.userId); });
        if ((senderMember === null || senderMember === void 0 ? void 0 : senderMember.profileUrl) !== (sender === null || sender === void 0 ? void 0 : sender.profileUrl)
            || (senderMember === null || senderMember === void 0 ? void 0 : senderMember.friendName) !== (sender === null || sender === void 0 ? void 0 : sender.friendName)
            || (senderMember === null || senderMember === void 0 ? void 0 : senderMember.nickname) !== (sender === null || sender === void 0 ? void 0 : sender.nickname)) {
            // @ts-ignore
            channel.members = members.map(function (member) {
                if (member.userId === sender.userId) {
                    return sender;
                }
                return member;
            });
        }
        return _tslib.__assign(_tslib.__assign({}, state), { currentGroupChannel: channel, unreadSince: (_a = state.unreadSince) !== null && _a !== void 0 ? _a : index$2.format(new Date(), 'p MMM dd'), unreadSinceDate: (_b = state.unreadSinceDate) !== null && _b !== void 0 ? _b : new Date(), allMessages: utils.passUnsuccessfullMessages(state.allMessages, message) });
    })
        .with({ type: actionTypes.ON_MESSAGE_UPDATED }, function (action) {
        var _a;
        var _b = action.payload, channel = _b.channel, message = _b.message;
        var currentGroupChannelUrl = ((_a = state === null || state === void 0 ? void 0 : state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url) || '';
        if (!compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, currentGroupChannelUrl)) {
            return state; // Ignore event when it is not for the current channel
        }
        if (state.messageListParams
            && !index$1.filterMessageListParams(state.messageListParams, message)) {
            // Delete the message if it doesn't match to the params anymore
            return _tslib.__assign(_tslib.__assign({}, state), { allMessages: state.allMessages.filter(function (m) { return !compareIds.compareIds(m.messageId, message === null || message === void 0 ? void 0 : message.messageId); }) });
        }
        return _tslib.__assign(_tslib.__assign({}, state), { allMessages: state.allMessages.map(function (m) {
                if (compareIds.compareIds(m.messageId, message.messageId)) {
                    return message;
                }
                if (compareIds.compareIds(m.parentMessageId, message.messageId)) {
                    m.parentMessage = message; // eslint-disable-line no-param-reassign
                }
                return m;
            }) });
    })
        .with({ type: actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED }, function (action) {
        var _a;
        var _b = action.payload, channel = _b.channel, event = _b.event;
        var channelUrl = event.channelUrl, threadInfo = event.threadInfo, targetMessageId = event.targetMessageId;
        var currentGroupChannelUrl = ((_a = state === null || state === void 0 ? void 0 : state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url) || '';
        if (!compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, currentGroupChannelUrl)
            || !compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
            return state; // Ignore event when it is not for the current channel
        }
        return _tslib.__assign(_tslib.__assign({}, state), { allMessages: state.allMessages.map(function (m) {
                if (compareIds.compareIds(m.messageId, targetMessageId)) {
                    // eslint-disable-next-line no-param-reassign
                    m.threadInfo = threadInfo; // Upsert threadInfo to the target message
                }
                return m;
            }) });
    })
        .with({ type: actionTypes.RESEND_MESSAGE_START }, function (action) {
        return _tslib.__assign(_tslib.__assign({}, state), { localMessages: state.localMessages.map(function (m) { return compareIds.compareIds(hasReqId(m) && m.reqId, action.payload.reqId)
                ? action.payload
                : m; }) });
    })
        .with({ type: actionTypes.MARK_AS_READ }, function (action) {
        var _a, _b, _c;
        if (((_a = state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url) !== ((_c = (_b = action.payload) === null || _b === void 0 ? void 0 : _b.channel) === null || _c === void 0 ? void 0 : _c.url)) {
            return state;
        }
        return _tslib.__assign(_tslib.__assign({}, state), { unreadSince: null, unreadSinceDate: null });
    })
        .with({ type: actionTypes.ON_MESSAGE_DELETED }, function (action) {
        return _tslib.__assign(_tslib.__assign({}, state), { allMessages: state.allMessages.filter(function (m) { return !compareIds.compareIds(m.messageId, action.payload); }) });
    })
        .with({ type: actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID }, function (action) {
        return _tslib.__assign(_tslib.__assign({}, state), { localMessages: state.localMessages.filter(function (m) { return !compareIds.compareIds(hasReqId(m) && m.reqId, action.payload); }) });
    })
        .with({ type: actionTypes.SET_EMOJI_CONTAINER }, function (action) {
        return _tslib.__assign(_tslib.__assign({}, state), { emojiContainer: action.payload });
    })
        .with({ type: actionTypes.ON_REACTION_UPDATED }, function (action) {
        return _tslib.__assign(_tslib.__assign({}, state), { allMessages: state.allMessages.map(function (m) {
                if (compareIds.compareIds(m.messageId, action.payload.messageId)) {
                    if (m.applyReactionEvent
                        && typeof m.applyReactionEvent === 'function') {
                        m.applyReactionEvent(action.payload);
                    }
                    return m;
                }
                return m;
            }) });
    })
        .with({ type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED }, function (action) {
        return _tslib.__assign(_tslib.__assign({}, state), { messageListParams: action.payload });
    })
        .with({ type: actionTypes.ON_FILE_INFO_UPLOADED }, function (action) {
        var _a, _b;
        var _c = action.payload, channelUrl = _c.channelUrl, requestId = _c.requestId, index = _c.index, uploadableFileInfo = _c.uploadableFileInfo, error = _c.error;
        if (!compareIds.compareIds(channelUrl, (_a = state === null || state === void 0 ? void 0 : state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url)) {
            return state;
        }
        /**
         * We don't have to do anything here because
         * onFailed() will be called so handle error there instead.
         */
        if (error)
            return state;
        var localMessages = state.localMessages;
        var messageToUpdate = localMessages.find(function (message) { return compareIds.compareIds(hasReqId(message) && message.reqId, requestId); });
        var fileInfoList = (_b = messageToUpdate
            .messageParams) === null || _b === void 0 ? void 0 : _b.fileInfoList;
        if (Array.isArray(fileInfoList)) {
            fileInfoList[index] = uploadableFileInfo;
        }
        return _tslib.__assign(_tslib.__assign({}, state), { localMessages: localMessages });
    })
        .with({ type: actionTypes.ON_TYPING_STATUS_UPDATED }, function (action) {
        var _a;
        var _b = action.payload, channel = _b.channel, typingMembers = _b.typingMembers;
        if (!compareIds.compareIds(channel.url, (_a = state === null || state === void 0 ? void 0 : state.currentGroupChannel) === null || _a === void 0 ? void 0 : _a.url)) {
            return state;
        }
        return _tslib.__assign(_tslib.__assign({}, state), { typingMembers: typingMembers });
    })
        .otherwise(function () { return state; });
}

var DELIVERY_RECEIPT = 'delivery_receipt';
function useHandleChannelEvents(_a, _b) {
    var _c, _d, _e;
    var sdkInit = _a.sdkInit, currentGroupChannel = _a.currentGroupChannel, disableMarkAsRead = _a.disableMarkAsRead;
    var sdk = _b.sdk, logger = _b.logger, scrollRef = _b.scrollRef, setQuoteMessage = _b.setQuoteMessage, messagesDispatcher = _b.messagesDispatcher;
    var store = useSendbirdStateContext.useSendbirdStateContext();
    var _f = store.config, markAsReadScheduler = _f.markAsReadScheduler, markAsDeliveredScheduler = _f.markAsDeliveredScheduler, disableMarkAsDelivered = _f.disableMarkAsDelivered;
    var canSetMarkAsDelivered = (_e = (_d = (_c = store.stores.sdkStore.sdk) === null || _c === void 0 ? void 0 : _c.appInfo) === null || _d === void 0 ? void 0 : _d.premiumFeatureList) === null || _e === void 0 ? void 0 : _e.find(function (feature) { return (feature === DELIVERY_RECEIPT); });
    React.useEffect(function () {
        var _a;
        var channelUrl = currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url;
        var channelHandlerId = uuid.uuidv4();
        if (channelUrl && sdkInit) {
            var channelHandler = {
                onMessageReceived: function (channel, message) {
                    var _a, _b;
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        var scrollToEnd = false;
                        try {
                            var current = scrollRef.current;
                            scrollToEnd = current.offsetHeight + current.scrollTop >= current.scrollHeight - 10;
                            // 10 is a buffer
                        }
                        catch (error) {
                            //
                        }
                        logger.info('Channel | useHandleChannelEvents: onMessageReceived', message);
                        messagesDispatcher({
                            type: actionTypes.ON_MESSAGE_RECEIVED,
                            payload: { channel: channel, message: message },
                        });
                        if (scrollToEnd
                            && ((_a = document.getElementById('sendbird-dropdown-portal')) === null || _a === void 0 ? void 0 : _a.childElementCount) === 0
                            && ((_b = document.getElementById('sendbird-emoji-list-portal')) === null || _b === void 0 ? void 0 : _b.childElementCount) === 0) {
                            // and !openContextMenu
                            try {
                                setTimeout(function () { return utils.scrollIntoLast(0, scrollRef); });
                                if (!disableMarkAsRead) {
                                    markAsReadScheduler.push(currentGroupChannel);
                                }
                                if (canSetMarkAsDelivered && !disableMarkAsDelivered) {
                                    markAsDeliveredScheduler.push(currentGroupChannel);
                                }
                            }
                            catch (error) {
                                logger.warning('Channel | onMessageReceived | scroll to end failed');
                            }
                        }
                    }
                },
                onUnreadMemberStatusUpdated: function (channel) {
                    logger.info('Channel | useHandleChannelEvents: onUnreadMemberStatusUpdated', channel);
                    if (compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                // before(onDeliveryReceiptUpdated)
                onUndeliveredMemberStatusUpdated: function (channel) {
                    if (compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onDeliveryReceiptUpdated', channel);
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                onMessageUpdated: function (channel, message) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onMessageUpdated', message);
                        messagesDispatcher({
                            type: actionTypes.ON_MESSAGE_UPDATED,
                            payload: { channel: channel, message: message },
                        });
                    }
                },
                onThreadInfoUpdated: function (channel, threadInfoUpdateEvent) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onThreadInfoUpdated', { channel: channel, threadInfoUpdateEvent: threadInfoUpdateEvent });
                        messagesDispatcher({
                            type: actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED,
                            payload: { channel: channel, event: threadInfoUpdateEvent },
                        });
                    }
                },
                onMessageDeleted: function (channel, messageId) {
                    logger.info('Channel | useHandleChannelEvents: onMessageDeleted', { channel: channel, messageId: messageId });
                    setQuoteMessage(null);
                    messagesDispatcher({
                        type: actionTypes.ON_MESSAGE_DELETED,
                        payload: messageId,
                    });
                },
                onReactionUpdated: function (channel, reactionEvent) {
                    logger.info('Channel | useHandleChannelEvents: onReactionUpdated', { channel: channel, reactionEvent: reactionEvent });
                    messagesDispatcher({
                        type: actionTypes.ON_REACTION_UPDATED,
                        payload: reactionEvent,
                    });
                },
                onChannelChanged: function (channel) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onChannelChanged', channel);
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                onChannelFrozen: function (channel) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onChannelFrozen', channel);
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                onChannelUnfrozen: function (channel) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onChannelUnFrozen', channel);
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                onUserMuted: function (channel, user) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onUserMuted', { channel: channel, user: user });
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                onUserUnmuted: function (channel, user) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onUserUnmuted', { channel: channel, user: user });
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                onUserBanned: function (channel, user) {
                    var _a;
                    if (compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onUserBanned', { channel: channel, user: user });
                        var isByMe = (user === null || user === void 0 ? void 0 : user.userId) === ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId);
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: isByMe ? null : channel,
                        });
                    }
                },
                onOperatorUpdated: function (channel, users) {
                    if (channel.isGroupChannel() && compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onOperatorUpdated', { channel: channel, users: users });
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: channel,
                        });
                    }
                },
                onUserLeft: function (channel, user) {
                    var _a;
                    if (compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | useHandleChannelEvents: onUserLeft', { channel: channel, user: user });
                        var isByMe = (user === null || user === void 0 ? void 0 : user.userId) === ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId);
                        messagesDispatcher({
                            type: actionTypes.SET_CURRENT_CHANNEL,
                            payload: isByMe ? null : channel,
                        });
                    }
                },
                onTypingStatusUpdated: function (channel) {
                    if (compareIds.compareIds(channel === null || channel === void 0 ? void 0 : channel.url, channelUrl)) {
                        logger.info('Channel | onTypingStatusUpdated', { channel: channel });
                        var typingMembers = channel.getTypingUsers();
                        messagesDispatcher({
                            type: actionTypes.ON_TYPING_STATUS_UPDATED,
                            payload: {
                                channel: channel,
                                typingMembers: typingMembers,
                            },
                        });
                    }
                },
            };
            logger.info('Channel | useHandleChannelEvents: Setup event handler', { channelHandlerId: channelHandlerId, channelHandler: channelHandler });
            // Add this group channel handler to the Sendbird chat instance
            (_a = sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.addGroupChannelHandler(channelHandlerId, new groupChannel.GroupChannelHandler(channelHandler));
        }
        return function () {
            var _a;
            if ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.removeGroupChannelHandler) {
                logger.info('Channel | useHandleChannelEvents: Removing message reciver handler', channelHandlerId);
                sdk.groupChannel.removeGroupChannelHandler(channelHandlerId);
            }
            else if (sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) {
                logger.error('Channel | useHandleChannelEvents: Not found the removeGroupChannelHandler');
            }
        };
    }, [currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url, sdkInit]);
}

function useGetChannel(_a, _b) {
    var channelUrl = _a.channelUrl, sdkInit = _a.sdkInit, disableMarkAsRead = _a.disableMarkAsRead;
    var messagesDispatcher = _b.messagesDispatcher, sdk = _b.sdk, logger = _b.logger, markAsReadScheduler = _b.markAsReadScheduler;
    React.useEffect(function () {
        if (channelUrl && sdkInit && sdk && sdk.groupChannel) {
            logger.info('Channel | useSetChannel fetching channel', channelUrl);
            sdk.groupChannel
                .getChannel(channelUrl)
                .then(function (groupChannel) {
                logger.info('Channel | useSetChannel fetched channel', groupChannel);
                messagesDispatcher({
                    type: actionTypes.SET_CURRENT_CHANNEL,
                    payload: groupChannel,
                });
                logger.info('Channel: Mark as read', groupChannel);
                if (!disableMarkAsRead) {
                    markAsReadScheduler.push(groupChannel);
                }
            })
                .catch(function (e) {
                logger.warning('Channel | useSetChannel fetch channel failed', { channelUrl: channelUrl, e: e });
                messagesDispatcher({
                    type: actionTypes.SET_CHANNEL_INVALID,
                });
            });
            sdk
                .getAllEmoji()
                .then(function (emojiContainer_) {
                logger.info('Channel: Getting emojis success', emojiContainer_);
                messagesDispatcher({
                    type: actionTypes.SET_EMOJI_CONTAINER,
                    payload: emojiContainer_,
                });
            })
                .catch(function (err) {
                logger.error('Channel: Getting emojis failed', err);
            });
        }
    }, [channelUrl, sdkInit]);
}

function useHandleReconnect(_a, _b) {
    var isOnline = _a.isOnline, replyType = _a.replyType, disableMarkAsRead = _a.disableMarkAsRead, reconnectOnIdle = _a.reconnectOnIdle;
    var logger = _b.logger, sdk = _b.sdk, scrollRef = _b.scrollRef, currentGroupChannel = _b.currentGroupChannel, messagesDispatcher = _b.messagesDispatcher, markAsReadScheduler = _b.markAsReadScheduler, userFilledMessageListQuery = _b.userFilledMessageListQuery;
    var shouldReconnect = useReconnectOnIdle.useReconnectOnIdle(isOnline, currentGroupChannel, reconnectOnIdle).shouldReconnect;
    React.useEffect(function () {
        return function () {
            var _a, _b;
            // state changed from offline to online AND tab is visible
            if (shouldReconnect) {
                logger.info('Refreshing conversation state');
                var isReactionEnabled = ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.appInfo) === null || _a === void 0 ? void 0 : _a.useReaction) || false;
                var messageListParams_1 = {
                    prevResultSize: Channel_hooks_useInitialMessagesFetch.PREV_RESULT_SIZE,
                    isInclusive: true,
                    includeReactions: isReactionEnabled,
                    includeMetaArray: true,
                    nextResultSize: Channel_hooks_useInitialMessagesFetch.NEXT_RESULT_SIZE,
                };
                if (replyType && replyType === 'QUOTE_REPLY') {
                    messageListParams_1.includeThreadInfo = true;
                    messageListParams_1.includeParentMessageInfo = true;
                    messageListParams_1.replyType = message.ReplyType.ONLY_REPLY_TO_CHANNEL;
                }
                if (userFilledMessageListQuery) {
                    Object.keys(userFilledMessageListQuery).forEach(function (key) {
                        messageListParams_1[key] = userFilledMessageListQuery[key];
                    });
                }
                logger.info('Channel: Fetching messages', { currentGroupChannel: currentGroupChannel, userFilledMessageListQuery: userFilledMessageListQuery });
                messagesDispatcher({
                    type: actionTypes.FETCH_INITIAL_MESSAGES_START,
                    payload: null,
                });
                (_b = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _b === void 0 ? void 0 : _b.getChannel(currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url).then(function (groupChannel) {
                    var lastMessageTime = new Date().getTime();
                    groupChannel.getMessagesByTimestamp(lastMessageTime, messageListParams_1)
                        .then(function (messages) {
                        messagesDispatcher({
                            type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
                            payload: {
                                currentGroupChannel: currentGroupChannel,
                                messages: messages,
                            },
                        });
                        setTimeout(function () { return utils.scrollIntoLast(0, scrollRef); }, consts.SCROLL_BOTTOM_DELAY_FOR_FETCH);
                    })
                        .catch(function (error) {
                        logger.error('Channel: Fetching messages failed', error);
                        messagesDispatcher({
                            type: actionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
                            payload: { currentGroupChannel: currentGroupChannel },
                        });
                    });
                    if (!disableMarkAsRead) {
                        markAsReadScheduler.push(currentGroupChannel);
                    }
                });
            }
        };
    }, [shouldReconnect, replyType]);
}

function useScrollCallback(_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, oldestMessageTimeStamp = _a.oldestMessageTimeStamp, userFilledMessageListQuery = _a.userFilledMessageListQuery, replyType = _a.replyType;
    var hasMorePrev = _b.hasMorePrev, logger = _b.logger, messagesDispatcher = _b.messagesDispatcher, sdk = _b.sdk;
    return React.useCallback(function (callback) {
        var _a, _b;
        if (!hasMorePrev) {
            return;
        }
        var messageListParams = {
            prevResultSize: Channel_hooks_useInitialMessagesFetch.PREV_RESULT_SIZE,
            isInclusive: true,
            includeMetaArray: true,
            includeReactions: (_b = (_a = sdk === null || sdk === void 0 ? void 0 : sdk.appInfo) === null || _a === void 0 ? void 0 : _a.useReaction) !== null && _b !== void 0 ? _b : false,
        };
        if (replyType === 'QUOTE_REPLY' || replyType === 'THREAD') {
            messageListParams.includeThreadInfo = true;
            messageListParams.includeParentMessageInfo = true;
            messageListParams.replyType = message.ReplyType.ONLY_REPLY_TO_CHANNEL;
        }
        if (userFilledMessageListQuery) {
            Object.keys(userFilledMessageListQuery).forEach(function (key) {
                messageListParams[key] = userFilledMessageListQuery[key];
            });
        }
        logger.info('Channel: Fetching messages', {
            currentGroupChannel: currentGroupChannel,
            userFilledMessageListQuery: userFilledMessageListQuery,
        });
        currentGroupChannel
            .getMessagesByTimestamp(oldestMessageTimeStamp || new Date().getTime(), messageListParams)
            .then(function (messages) {
            messagesDispatcher({
                type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
                payload: { currentGroupChannel: currentGroupChannel, messages: messages },
            });
            if (callback)
                setTimeout(function () { return callback(); });
        })
            .catch(function () {
            messagesDispatcher({
                type: actionTypes.FETCH_PREV_MESSAGES_FAILURE,
                payload: { currentGroupChannel: currentGroupChannel },
            });
        });
    }, [currentGroupChannel, oldestMessageTimeStamp, replyType]);
}

function useScrollDownCallback(_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, latestMessageTimeStamp = _a.latestMessageTimeStamp, userFilledMessageListQuery = _a.userFilledMessageListQuery, hasMoreNext = _a.hasMoreNext, replyType = _a.replyType;
    var logger = _b.logger, messagesDispatcher = _b.messagesDispatcher, sdk = _b.sdk;
    return React.useCallback(function (cb) {
        var _a, _b;
        if (!hasMoreNext) {
            return;
        }
        var isReactionEnabled = (_b = (_a = sdk === null || sdk === void 0 ? void 0 : sdk.appInfo) === null || _a === void 0 ? void 0 : _a.useReaction) !== null && _b !== void 0 ? _b : false;
        var messageListParams = {
            nextResultSize: Channel_hooks_useInitialMessagesFetch.NEXT_RESULT_SIZE,
            isInclusive: true,
            includeReactions: isReactionEnabled,
            includeMetaArray: true,
        };
        if (replyType && (replyType === 'QUOTE_REPLY' || replyType === 'THREAD')) {
            messageListParams.includeThreadInfo = true;
            messageListParams.includeParentMessageInfo = true;
            messageListParams.replyType = message.ReplyType.ONLY_REPLY_TO_CHANNEL;
        }
        if (userFilledMessageListQuery) {
            Object.keys(userFilledMessageListQuery).forEach(function (key) {
                messageListParams[key] = userFilledMessageListQuery[key];
            });
        }
        logger.info('Channel: Fetching later messages', { currentGroupChannel: currentGroupChannel, userFilledMessageListQuery: userFilledMessageListQuery });
        currentGroupChannel
            .getMessagesByTimestamp(latestMessageTimeStamp || new Date().getTime(), messageListParams)
            .then(function (messages) {
            messagesDispatcher({
                type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
                payload: { currentGroupChannel: currentGroupChannel, messages: messages },
            });
            setTimeout(function () { return cb([messages, null]); });
        })
            .catch(function (error) {
            logger.error('Channel: Fetching later messages failed', error);
            messagesDispatcher({
                type: actionTypes.FETCH_NEXT_MESSAGES_FAILURE,
                payload: { currentGroupChannel: currentGroupChannel },
            });
            setTimeout(function () { return cb([null, error]); });
        });
    }, [currentGroupChannel, latestMessageTimeStamp, hasMoreNext, replyType]);
}

function useDeleteMessageCallback(_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, messagesDispatcher = _a.messagesDispatcher;
    var logger = _b.logger;
    return React.useCallback(function (message$1) {
        logger.info('Channel | useDeleteMessageCallback: Deleting message', message$1);
        var sendingStatus = index$1.isSendableMessage(message$1) ? message$1.sendingStatus : undefined;
        return new Promise(function (resolve, reject) {
            logger.info('Channel | useDeleteMessageCallback: Deleting message requestState:', sendingStatus);
            // Message is only on local
            if ((sendingStatus === message.SendingStatus.FAILED || sendingStatus === message.SendingStatus.PENDING) && 'reqId' in message$1) {
                logger.info('Channel | useDeleteMessageCallback: Deleted message from local:', message$1);
                messagesDispatcher({
                    type: actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
                    payload: message$1.reqId,
                });
                resolve();
            }
            else {
                logger.info('Channel | useDeleteMessageCallback: Deleting message from remote:', sendingStatus);
                currentGroupChannel
                    .deleteMessage(message$1)
                    .then(function () {
                    logger.info('Channel | useDeleteMessageCallback: Deleting message success!', message$1);
                    messagesDispatcher({
                        type: actionTypes.ON_MESSAGE_DELETED,
                        payload: message$1.messageId,
                    });
                    resolve();
                })
                    .catch(function (err) {
                    logger.warning('Channel | useDeleteMessageCallback: Deleting message failed!', err);
                    reject(err);
                });
            }
        });
    }, [currentGroupChannel, messagesDispatcher]);
}

function useUpdateMessageCallback(_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, messagesDispatcher = _a.messagesDispatcher, onBeforeUpdateUserMessage = _a.onBeforeUpdateUserMessage, isMentionEnabled = _a.isMentionEnabled;
    var logger = _b.logger, pubSub = _b.pubSub;
    return React.useCallback(function (props, callback) {
        var messageId = props.messageId, message = props.message, mentionedUsers = props.mentionedUsers, mentionTemplate = props.mentionTemplate;
        var createParamsDefault = function (message) {
            var params = {
                message: message,
            };
            if (isMentionEnabled && (mentionedUsers === null || mentionedUsers === void 0 ? void 0 : mentionedUsers.length) > 0) {
                params.mentionedUsers = mentionedUsers;
            }
            if (isMentionEnabled && mentionTemplate) {
                params.mentionedMessageTemplate = mentionTemplate;
            }
            else {
                params.mentionedMessageTemplate = message;
            }
            return params;
        };
        var shouldCreateCustomParams = onBeforeUpdateUserMessage && typeof onBeforeUpdateUserMessage === 'function';
        if (shouldCreateCustomParams) {
            logger.info('Channel: creating params using onBeforeUpdateUserMessage', onBeforeUpdateUserMessage);
        }
        var params = shouldCreateCustomParams ? onBeforeUpdateUserMessage(message) : createParamsDefault(message);
        logger.info('Channel: Updating message!', params);
        currentGroupChannel
            .updateUserMessage(messageId, params)
            .then(function (msg) {
            if (callback) {
                callback(null, msg);
            }
            logger.info('Channel: Updating message success!', msg);
            messagesDispatcher({
                type: actionTypes.ON_MESSAGE_UPDATED,
                payload: {
                    channel: currentGroupChannel,
                    message: msg,
                },
            });
            pubSub.publish(pubSub_topics.pubSubTopics.UPDATE_USER_MESSAGE, {
                message: msg,
                channel: currentGroupChannel,
                publishingModules: [pubSub_topics.PublishingModuleType.CHANNEL],
            });
        })
            .catch(function (err) {
            if (callback) {
                callback(err, null);
            }
        });
    }, [currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url, messagesDispatcher, onBeforeUpdateUserMessage]);
}

function useResendMessageCallback(_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, messagesDispatcher = _a.messagesDispatcher;
    var logger = _b.logger, pubSub = _b.pubSub;
    return React.useCallback(function (failedMessage) {
        logger.info('Channel: Resending message has started', failedMessage);
        if (failedMessage === null || failedMessage === void 0 ? void 0 : failedMessage.isResendable) {
            // userMessage
            if (failedMessage.isUserMessage()) {
                currentGroupChannel
                    .resendMessage(failedMessage)
                    .onPending(function (message) {
                    logger.info('Channel: Resending message start!', message);
                    messagesDispatcher({
                        type: actionTypes.RESEND_MESSAGE_START,
                        payload: message,
                    });
                })
                    .onSucceeded(function (message) {
                    logger.info('Channel: Resending message success!', message);
                    messagesDispatcher({
                        type: actionTypes.SEND_MESSAGE_SUCCESS,
                        payload: message,
                    });
                })
                    .onFailed(function (e, message) {
                    logger.warning('Channel: Resending message failed!', e);
                    messagesDispatcher({
                        type: actionTypes.SEND_MESSAGE_FAILURE,
                        payload: message,
                    });
                });
            }
            else if (failedMessage.isFileMessage()) {
                currentGroupChannel
                    .resendMessage(failedMessage)
                    .onPending(function (message) {
                    logger.info('Channel: Resending file message start!', message);
                    messagesDispatcher({
                        type: actionTypes.RESEND_MESSAGE_START,
                        payload: message,
                    });
                })
                    .onSucceeded(function (message) {
                    logger.info('Channel: Resending file message success!', message);
                    messagesDispatcher({
                        type: actionTypes.SEND_MESSAGE_SUCCESS,
                        payload: message,
                    });
                })
                    .onFailed(function (e, message) {
                    logger.warning('Channel: Resending file message failed!', e);
                    messagesDispatcher({
                        type: actionTypes.SEND_MESSAGE_FAILURE,
                        payload: message,
                    });
                });
            }
            else if (failedMessage.isMultipleFilesMessage()) {
                currentGroupChannel
                    .resendMessage(failedMessage)
                    .onPending(function (message) {
                    logger.info('Channel: Resending multiple files message start!', message);
                    messagesDispatcher({
                        type: actionTypes.RESEND_MESSAGE_START,
                        payload: message,
                    });
                })
                    .onFileUploaded(function (requestId, index, uploadableFileInfo, error) {
                    logger.info('Channel: Resending multiple files message file uploaded!', {
                        requestId: requestId,
                        index: index,
                        error: error,
                        uploadableFileInfo: uploadableFileInfo,
                    });
                    pubSub.publish(pubSub_topics.pubSubTopics.ON_FILE_INFO_UPLOADED, {
                        response: {
                            channelUrl: currentGroupChannel.url,
                            requestId: requestId,
                            index: index,
                            uploadableFileInfo: uploadableFileInfo,
                            error: error,
                        },
                        publishingModules: [pubSub_topics.PublishingModuleType.CHANNEL],
                    });
                })
                    .onSucceeded(function (message) {
                    logger.info('Channel: Resending multiple files message success!', message);
                    messagesDispatcher({
                        type: actionTypes.SEND_MESSAGE_SUCCESS,
                        payload: message,
                    });
                })
                    .onFailed(function (e, message) {
                    logger.warning('Channel: Resending multiple files message failed!', e);
                    messagesDispatcher({
                        type: actionTypes.SEND_MESSAGE_FAILURE,
                        payload: message,
                    });
                });
            }
        }
        else {
            logger.error('Message is not resendable', failedMessage);
        }
    }, [currentGroupChannel, messagesDispatcher]);
}

function useSendMessageCallback(_a, _b) {
    var isMentionEnabled = _a.isMentionEnabled, currentGroupChannel = _a.currentGroupChannel, onBeforeSendUserMessage = _a.onBeforeSendUserMessage;
    var logger = _b.logger, pubSub = _b.pubSub, scrollRef = _b.scrollRef, messagesDispatcher = _b.messagesDispatcher;
    var messageInputRef = React.useRef(null);
    var sendMessage = React.useCallback(function (_a) {
        var quoteMessage = _a.quoteMessage, message = _a.message, mentionTemplate = _a.mentionTemplate, 
        // mentionedUserIds,
        mentionedUsers = _a.mentionedUsers;
        var createParamsDefault = function () {
            var params = {
                message: message,
            };
            // if (isMentionEnabled && mentionedUserIds?.length > 0) {
            if (isMentionEnabled && (mentionedUsers === null || mentionedUsers === void 0 ? void 0 : mentionedUsers.length) > 0) {
                // params.mentionedUserIds = mentionedUserIds;
                params.mentionedUsers = mentionedUsers;
            }
            // if (isMentionEnabled && mentionTemplate && mentionedUserIds?.length > 0) {
            if (isMentionEnabled && mentionTemplate && (mentionedUsers === null || mentionedUsers === void 0 ? void 0 : mentionedUsers.length) > 0) {
                params.mentionedMessageTemplate = mentionTemplate;
            }
            if (quoteMessage) {
                params.isReplyToChannel = true;
                params.parentMessageId = quoteMessage.messageId;
            }
            return params;
        };
        var shouldCreateCustomParams = onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function';
        if (shouldCreateCustomParams) {
            logger.info('Channel: creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
        }
        var params = shouldCreateCustomParams ? onBeforeSendUserMessage(message, quoteMessage) : createParamsDefault();
        logger.info('Channel: Sending message has started', params);
        currentGroupChannel
            .sendUserMessage(params)
            .onPending(function (pendingMsg) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_MESSAGE_START, {
                /* pubSub is used instead of messagesDispatcher
                  to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
                message: pendingMsg,
                channel: currentGroupChannel,
                publishingModules: [pubSub_topics.PublishingModuleType.CHANNEL],
            });
            setTimeout(function () { return utils.scrollIntoLast(0, scrollRef); }, consts.SCROLL_BOTTOM_DELAY_FOR_SEND);
        })
            .onFailed(function (err, msg) {
            logger.warning('Channel: Sending message failed!', { message: msg, error: err });
            messagesDispatcher({
                type: actionTypes.SEND_MESSAGE_FAILURE,
                payload: msg,
            });
        })
            .onSucceeded(function (msg) {
            logger.info('Channel: Sending message success!', msg);
            messagesDispatcher({
                type: actionTypes.SEND_MESSAGE_SUCCESS,
                payload: msg,
            });
        });
    }, [currentGroupChannel, onBeforeSendUserMessage]);
    return [messageInputRef, sendMessage];
}

function useSendFileMessageCallback(_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, onBeforeSendFileMessage = _a.onBeforeSendFileMessage, imageCompression = _a.imageCompression;
    var logger = _b.logger, pubSub = _b.pubSub, scrollRef = _b.scrollRef, messagesDispatcher = _b.messagesDispatcher;
    var sendMessage = React.useCallback(function (compressedFile, quoteMessage) {
        if (quoteMessage === void 0) { quoteMessage = null; }
        return new Promise(function (resolve, reject) {
            // Create FileMessageParams
            var params = onBeforeSendFileMessage === null || onBeforeSendFileMessage === void 0 ? void 0 : onBeforeSendFileMessage(compressedFile, quoteMessage);
            if (!params) {
                params = { file: compressedFile };
                if (quoteMessage) {
                    params.isReplyToChannel = true;
                    params.parentMessageId = quoteMessage.messageId;
                }
            }
            // Send FileMessage
            logger.info('Channel: Uploading file message start!', params);
            currentGroupChannel
                .sendFileMessage(params)
                .onPending(function (pendingMessage) {
                pubSub.publish(pubSub_topics.pubSubTopics.SEND_MESSAGE_START, {
                    /* pubSub is used instead of messagesDispatcher
                      to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
                    message: _tslib.__assign(_tslib.__assign({}, pendingMessage), { url: URL.createObjectURL(compressedFile), 
                        // pending thumbnail message seems to be failed
                        requestState: 'pending' }),
                    channel: currentGroupChannel,
                    publishingModules: [pubSub_topics.PublishingModuleType.CHANNEL],
                });
                setTimeout(function () { return utils.scrollIntoLast(0, scrollRef); }, consts.SCROLL_BOTTOM_DELAY_FOR_SEND);
            })
                .onFailed(function (err, failedMessage) {
                logger.error('Channel: Sending file message failed!', { failedMessage: failedMessage, err: err });
                // TODO: v4 - remove logic that modifies the original object.
                //  It makes the code difficult to track, likely causing unpredictable side effects.
                // @ts-ignore eslint-disable-next-line no-param-reassign
                failedMessage.localUrl = URL.createObjectURL(compressedFile);
                // @ts-ignore eslint-disable-next-line no-param-reassign
                failedMessage.file = compressedFile;
                messagesDispatcher({
                    type: actionTypes.SEND_MESSAGE_FAILURE,
                    payload: failedMessage,
                });
                reject(err);
            })
                .onSucceeded(function (succeededMessage) {
                logger.info('Channel: Sending file message success!', succeededMessage);
                messagesDispatcher({
                    type: actionTypes.SEND_MESSAGE_SUCCESS,
                    payload: succeededMessage,
                });
                resolve(succeededMessage);
            });
        });
    }, [currentGroupChannel, onBeforeSendFileMessage, imageCompression]);
    return [sendMessage];
}

// To prevent multiple clicks on the message in the channel while scrolling
function deactivateClick(scrollRef) {
    var element = scrollRef.current;
    var parentNode = element === null || element === void 0 ? void 0 : element.parentNode;
    if (element && parentNode) {
        element.style.pointerEvents = 'none';
        parentNode.style.cursor = 'wait';
    }
}
function activateClick(scrollRef) {
    var element = scrollRef.current;
    var parentNode = element === null || element === void 0 ? void 0 : element.parentNode;
    if (element && parentNode) {
        element.style.pointerEvents = 'auto';
        parentNode.style.cursor = 'auto';
    }
}
function useScrollToMessage(_a, _b) {
    var setInitialTimeStamp = _a.setInitialTimeStamp, setAnimatedMessageId = _a.setAnimatedMessageId, allMessages = _a.allMessages, scrollRef = _a.scrollRef;
    var logger = _b.logger;
    return React.useCallback(function (createdAt, messageId) {
        var isPresent = allMessages.find(function (m) { return (m.messageId === messageId); });
        setAnimatedMessageId(null);
        setTimeout(function () {
            try {
                logger.info('Channel: scroll to message - disabling mouse events');
                deactivateClick(scrollRef);
                if (isPresent) {
                    logger.info('Channel: scroll to message - message is present');
                    setAnimatedMessageId(messageId);
                    utils.scrollToRenderedMessage(scrollRef, createdAt);
                }
                else {
                    logger.info('Channel: scroll to message - fetching older messages');
                    setInitialTimeStamp(null);
                    setInitialTimeStamp(createdAt);
                    setAnimatedMessageId(messageId);
                }
            }
            finally {
                logger.info('Channel: scroll to message - enabled mouse events');
                activateClick(scrollRef);
            }
        });
    }, [
        setInitialTimeStamp,
        setAnimatedMessageId,
        allMessages,
    ]);
}

var useSendVoiceMessageCallback = function (_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, onBeforeSendVoiceMessage = _a.onBeforeSendVoiceMessage;
    var logger = _b.logger, pubSub = _b.pubSub, scrollRef = _b.scrollRef, messagesDispatcher = _b.messagesDispatcher;
    var sendMessage = React.useCallback(function (file, duration, quoteMessage) { return new Promise(function (resolve, reject) {
        if (!currentGroupChannel) {
            return;
        }
        var messageParams = (onBeforeSendVoiceMessage
            && typeof onBeforeSendVoiceMessage === 'function')
            ? onBeforeSendVoiceMessage(file, quoteMessage)
            : {
                file: file,
                fileName: consts.VOICE_MESSAGE_FILE_NAME,
                mimeType: consts.VOICE_MESSAGE_MIME_TYPE,
                metaArrays: [
                    new message.MessageMetaArray({
                        key: consts.META_ARRAY_VOICE_DURATION_KEY,
                        value: ["".concat(duration)],
                    }),
                    new message.MessageMetaArray({
                        key: consts.META_ARRAY_MESSAGE_TYPE_KEY,
                        value: [consts.META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
                    }),
                ],
            };
        if (quoteMessage) {
            messageParams.isReplyToChannel = true;
            messageParams.parentMessageId = quoteMessage.messageId;
        }
        logger.info('Channel: Start sending voice message', messageParams);
        currentGroupChannel.sendFileMessage(messageParams)
            .onPending(function (pendingMessage) {
            pubSub.publish(pubSub_topics.pubSubTopics.SEND_MESSAGE_START, {
                /* pubSub is used instead of messagesDispatcher
                  to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
                message: pendingMessage,
                channel: currentGroupChannel,
                publishingModules: [pubSub_topics.PublishingModuleType.CHANNEL],
            });
            setTimeout(function () { return utils.scrollIntoLast(0, scrollRef); }, consts.SCROLL_BOTTOM_DELAY_FOR_SEND);
        })
            .onFailed(function (err, failedMessage) {
            logger.error('Channel: Sending voice message failed!', { failedMessage: failedMessage, err: err });
            messagesDispatcher({
                type: actionTypes.SEND_MESSAGE_FAILURE,
                payload: failedMessage,
            });
            reject(err);
        })
            .onSucceeded(function (succeededMessage) {
            logger.info('Channel: Sending voice message success!', succeededMessage);
            messagesDispatcher({
                type: actionTypes.SEND_MESSAGE_SUCCESS,
                payload: succeededMessage,
            });
            resolve(succeededMessage);
        });
    }); }, [
        currentGroupChannel,
        onBeforeSendVoiceMessage,
    ]);
    return [sendMessage];
};

var useHandleChannelPubsubEvents = function (_a) {
    var channelUrl = _a.channelUrl, sdkInit = _a.sdkInit, pubSub = _a.pubSub, dispatcher = _a.dispatcher, scrollRef = _a.scrollRef;
    React.useEffect(function () {
        var subscriber = new Map();
        if (pubSub === null || pubSub === void 0 ? void 0 : pubSub.subscribe) {
            subscriber.set(pubSub_topics.PUBSUB_TOPICS.SEND_USER_MESSAGE, pubSub.subscribe(pubSub_topics.PUBSUB_TOPICS.SEND_USER_MESSAGE, function (props) {
                var channel = props.channel, message = props.message;
                if (channelUrl === (channel === null || channel === void 0 ? void 0 : channel.url)) {
                    dispatcher({
                        type: actionTypes.SEND_MESSAGE_SUCCESS,
                        payload: message,
                    });
                    setTimeout(function () { return utils.scrollIntoLast(0, scrollRef); }, consts.SCROLL_BOTTOM_DELAY_FOR_SEND);
                }
            }));
            subscriber.set(pubSub_topics.PUBSUB_TOPICS.SEND_MESSAGE_START, pubSub.subscribe(pubSub_topics.PUBSUB_TOPICS.SEND_MESSAGE_START, function (props) {
                var channel = props.channel, message = props.message, publishingModules = props.publishingModules;
                if (channelUrl === (channel === null || channel === void 0 ? void 0 : channel.url) && pubSub_topics.shouldPubSubPublishToChannel(publishingModules)) {
                    dispatcher({
                        type: actionTypes.SEND_MESSAGE_START,
                        payload: message,
                    });
                }
            }));
            subscriber.set(pubSub_topics.PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, pubSub.subscribe(pubSub_topics.PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, function (props) {
                var response = props.response, publishingModules = props.publishingModules;
                if (channelUrl === response.channelUrl && pubSub_topics.shouldPubSubPublishToChannel(publishingModules)) {
                    dispatcher({
                        type: actionTypes.ON_FILE_INFO_UPLOADED,
                        payload: response,
                    });
                }
            }));
            subscriber.set(pubSub_topics.PUBSUB_TOPICS.SEND_MESSAGE_FAILED, pubSub.subscribe(pubSub_topics.PUBSUB_TOPICS.SEND_MESSAGE_FAILED, function (props) {
                var channel = props.channel, message = props.message, publishingModules = props.publishingModules;
                if (channelUrl === (channel === null || channel === void 0 ? void 0 : channel.url) && pubSub_topics.shouldPubSubPublishToChannel(publishingModules)) {
                    dispatcher({
                        type: actionTypes.SEND_MESSAGE_FAILURE,
                        payload: message,
                    });
                }
            }));
            subscriber.set(pubSub_topics.PUBSUB_TOPICS.SEND_FILE_MESSAGE, pubSub.subscribe(pubSub_topics.PUBSUB_TOPICS.SEND_FILE_MESSAGE, function (props) {
                var channel = props.channel, message = props.message;
                if (channelUrl === (channel === null || channel === void 0 ? void 0 : channel.url)) {
                    dispatcher({
                        type: actionTypes.SEND_MESSAGE_SUCCESS,
                        payload: message,
                    });
                    setTimeout(function () { return utils.scrollIntoLast(0, scrollRef); }, consts.SCROLL_BOTTOM_DELAY_FOR_SEND);
                }
            }));
            subscriber.set(pubSub_topics.PUBSUB_TOPICS.UPDATE_USER_MESSAGE, pubSub.subscribe(pubSub_topics.PUBSUB_TOPICS.UPDATE_USER_MESSAGE, function (props) {
                var channel = props.channel, message = props.message, fromSelector = props.fromSelector;
                if (fromSelector && (channelUrl === (channel === null || channel === void 0 ? void 0 : channel.url)) && channel.isGroupChannel()) {
                    dispatcher({
                        type: actionTypes.ON_MESSAGE_UPDATED,
                        payload: { channel: channel, message: message },
                    });
                }
            }));
            subscriber.set(pubSub_topics.PUBSUB_TOPICS.DELETE_MESSAGE, pubSub.subscribe(pubSub_topics.PUBSUB_TOPICS.DELETE_MESSAGE, function (props) {
                var channel = props.channel, messageId = props.messageId;
                if (channelUrl === (channel === null || channel === void 0 ? void 0 : channel.url)) {
                    dispatcher({
                        type: actionTypes.ON_MESSAGE_DELETED,
                        payload: messageId,
                    });
                }
            }));
        }
        return function () {
            subscriber.forEach(function (s) {
                try {
                    s.remove();
                }
                catch (_a) {
                    //
                }
            });
        };
    }, [
        channelUrl,
        sdkInit,
    ]);
};

var ChannelContext = React.createContext(undefined);
var ChannelProvider = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var channelUrl = props.channelUrl, children = props.children, isReactionEnabled = props.isReactionEnabled, _g = props.isMessageGroupingEnabled, isMessageGroupingEnabled = _g === void 0 ? true : _g, isMultipleFilesMessageEnabled = props.isMultipleFilesMessageEnabled, showSearchIcon = props.showSearchIcon, animatedMessage = props.animatedMessage, highlightedMessage = props.highlightedMessage, startingPoint = props.startingPoint, onBeforeSendUserMessage = props.onBeforeSendUserMessage, onBeforeSendFileMessage = props.onBeforeSendFileMessage, onBeforeUpdateUserMessage = props.onBeforeUpdateUserMessage, onBeforeSendVoiceMessage = props.onBeforeSendVoiceMessage, onBeforeSendMultipleFilesMessage = props.onBeforeSendMultipleFilesMessage, onChatHeaderActionClick = props.onChatHeaderActionClick, onSearchClick = props.onSearchClick, onBackClick = props.onBackClick, channelReplyType = props.replyType, threadReplySelectType = props.threadReplySelectType, queries = props.queries, filterMessageList = props.filterMessageList, _h = props.disableMarkAsRead, disableMarkAsRead = _h === void 0 ? false : _h, onReplyInThread = props.onReplyInThread, onQuoteMessageClick = props.onQuoteMessageClick, onMessageAnimated = props.onMessageAnimated, onMessageHighlighted = props.onMessageHighlighted, _j = props.scrollBehavior, scrollBehavior = _j === void 0 ? 'auto' : _j, _k = props.reconnectOnIdle, reconnectOnIdle = _k === void 0 ? true : _k;
    var globalStore = useSendbirdStateContext.useSendbirdStateContext();
    var config = globalStore.config;
    var replyType = channelReplyType !== null && channelReplyType !== void 0 ? channelReplyType : config.replyType;
    var pubSub = config.pubSub, logger = config.logger, userId = config.userId, isOnline = config.isOnline, imageCompression = config.imageCompression, isMentionEnabled = config.isMentionEnabled, onUserProfileMessage = config.onUserProfileMessage, markAsReadScheduler = config.markAsReadScheduler, groupChannel = config.groupChannel;
    var sdk = (_b = (_a = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _a === void 0 ? void 0 : _a.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk;
    var sdkInit = (_d = (_c = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _c === void 0 ? void 0 : _c.sdkStore) === null || _d === void 0 ? void 0 : _d.initialized;
    var globalConfigs = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config;
    var _l = React.useState(startingPoint), initialTimeStamp = _l[0], setInitialTimeStamp = _l[1];
    React.useEffect(function () {
        setInitialTimeStamp(startingPoint);
    }, [startingPoint, channelUrl]);
    var _m = React.useState(0), animatedMessageId = _m[0], setAnimatedMessageId = _m[1];
    var _o = React.useState(highlightedMessage), highLightedMessageId = _o[0], setHighLightedMessageId = _o[1];
    React.useEffect(function () {
        setHighLightedMessageId(highlightedMessage);
    }, [highlightedMessage]);
    var userFilledMessageListQuery = queries === null || queries === void 0 ? void 0 : queries.messageListParams;
    var _p = React.useState(null), quoteMessage = _p[0], setQuoteMessage = _p[1];
    var _q = React.useState(false), isScrolled = _q[0], setIsScrolled = _q[1];
    var _r = React.useReducer(channelReducer, initialState), messagesStore = _r[0], messagesDispatcher = _r[1];
    var scrollRef = React.useRef(null);
    var allMessages = messagesStore.allMessages, localMessages = messagesStore.localMessages, loading = messagesStore.loading, initialized = messagesStore.initialized, unreadSince = messagesStore.unreadSince, unreadSinceDate = messagesStore.unreadSinceDate, isInvalid = messagesStore.isInvalid, currentGroupChannel = messagesStore.currentGroupChannel, hasMorePrev = messagesStore.hasMorePrev, oldestMessageTimeStamp = messagesStore.oldestMessageTimeStamp, hasMoreNext = messagesStore.hasMoreNext, latestMessageTimeStamp = messagesStore.latestMessageTimeStamp, emojiContainer = messagesStore.emojiContainer, readStatus = messagesStore.readStatus, typingMembers = messagesStore.typingMembers;
    var isSuper = (currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.isSuper) || false;
    var isBroadcast = (currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.isBroadcast) || false;
    var usingReaction = getIsReactionEnabled.getIsReactionEnabled({
        isBroadcast: isBroadcast,
        isSuper: isSuper,
        globalLevel: config === null || config === void 0 ? void 0 : config.isReactionEnabled,
        moduleLevel: isReactionEnabled,
    });
    var emojiAllMap = React.useMemo(function () { return (usingReaction
        ? utils.getAllEmojisMapFromEmojiContainer(emojiContainer)
        : new Map()); }, [emojiContainer]);
    var nicknamesMap = React.useMemo(function () { return ((usingReaction && currentGroupChannel)
        ? utils.getNicknamesMapFromMembers(currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.members)
        : new Map()); }, [currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.members]);
    // Animate message
    React.useEffect(function () {
        if (animatedMessage) {
            setAnimatedMessageId(animatedMessage);
        }
    }, [animatedMessage]);
    // Scrollup is default scroll for channel
    var onScrollCallback = useScrollCallback({
        currentGroupChannel: currentGroupChannel,
        oldestMessageTimeStamp: oldestMessageTimeStamp,
        userFilledMessageListQuery: userFilledMessageListQuery,
        replyType: replyType,
    }, {
        hasMorePrev: hasMorePrev,
        logger: logger,
        messagesDispatcher: messagesDispatcher,
        sdk: sdk,
    });
    var scrollToMessage = useScrollToMessage({
        setInitialTimeStamp: setInitialTimeStamp,
        setAnimatedMessageId: setAnimatedMessageId,
        allMessages: allMessages,
        scrollRef: scrollRef,
    }, { logger: logger });
    // onScrollDownCallback is added for navigation to different timestamps on messageSearch
    // hasMorePrev, onScrollCallback -> scroll up(default behavior)
    // hasMoreNext, onScrollDownCallback -> scroll down
    var onScrollDownCallback = useScrollDownCallback({
        currentGroupChannel: currentGroupChannel,
        latestMessageTimeStamp: latestMessageTimeStamp,
        userFilledMessageListQuery: userFilledMessageListQuery,
        hasMoreNext: hasMoreNext,
        replyType: replyType,
    }, {
        logger: logger,
        messagesDispatcher: messagesDispatcher,
        sdk: sdk,
    });
    var toggleReaction = useToggleReactionCallback.useToggleReactionCallback(currentGroupChannel, logger);
    // to create message-datasource
    // this hook sets currentGroupChannel asynchronously
    useGetChannel({ channelUrl: channelUrl, sdkInit: sdkInit, disableMarkAsRead: disableMarkAsRead }, { messagesDispatcher: messagesDispatcher, sdk: sdk, logger: logger, markAsReadScheduler: markAsReadScheduler });
    // to set quote message as null
    React.useEffect(function () {
        setQuoteMessage(null);
    }, [channelUrl]);
    // Hook to handle ChannelEvents and send values to useReducer using messagesDispatcher
    useHandleChannelEvents({
        currentGroupChannel: currentGroupChannel,
        sdkInit: sdkInit,
        currentUserId: userId,
        disableMarkAsRead: disableMarkAsRead,
    }, {
        messagesDispatcher: messagesDispatcher,
        sdk: sdk,
        logger: logger,
        scrollRef: scrollRef,
        setQuoteMessage: setQuoteMessage,
    });
    // hook that fetches messages when channel changes
    // to be clear here useGetChannel sets currentGroupChannel
    // and useInitialMessagesFetch executes when currentGroupChannel changes
    // p.s This one executes on initialTimeStamp change too
    Channel_hooks_useInitialMessagesFetch.useInitialMessagesFetch({
        currentGroupChannel: currentGroupChannel,
        userFilledMessageListQuery: userFilledMessageListQuery,
        initialTimeStamp: initialTimeStamp,
        replyType: replyType,
        setIsScrolled: setIsScrolled,
    }, {
        logger: logger,
        scrollRef: scrollRef,
        messagesDispatcher: messagesDispatcher,
    });
    // handles API calls from withSendbird
    useHandleChannelPubsubEvents({
        channelUrl: channelUrl,
        sdkInit: sdkInit,
        pubSub: pubSub,
        dispatcher: messagesDispatcher,
        scrollRef: scrollRef,
    });
    // handling connection breaks
    useHandleReconnect({ isOnline: isOnline, replyType: replyType, disableMarkAsRead: disableMarkAsRead, reconnectOnIdle: reconnectOnIdle }, {
        logger: logger,
        sdk: sdk,
        scrollRef: scrollRef,
        currentGroupChannel: currentGroupChannel,
        messagesDispatcher: messagesDispatcher,
        userFilledMessageListQuery: userFilledMessageListQuery,
        markAsReadScheduler: markAsReadScheduler,
    });
    // callbacks for Message CURD actions
    var deleteMessage = useDeleteMessageCallback({ currentGroupChannel: currentGroupChannel, messagesDispatcher: messagesDispatcher }, { logger: logger });
    var updateMessage = useUpdateMessageCallback({ currentGroupChannel: currentGroupChannel, messagesDispatcher: messagesDispatcher, onBeforeUpdateUserMessage: onBeforeUpdateUserMessage, isMentionEnabled: isMentionEnabled }, { logger: logger, pubSub: pubSub });
    var resendMessage = useResendMessageCallback({ currentGroupChannel: currentGroupChannel, messagesDispatcher: messagesDispatcher }, { logger: logger, pubSub: pubSub });
    var _s = useSendMessageCallback({
        currentGroupChannel: currentGroupChannel,
        isMentionEnabled: isMentionEnabled,
        onBeforeSendUserMessage: onBeforeSendUserMessage,
    }, {
        logger: logger,
        pubSub: pubSub,
        scrollRef: scrollRef,
        messagesDispatcher: messagesDispatcher,
    }), messageInputRef = _s[0], sendMessage = _s[1];
    var sendFileMessage = useSendFileMessageCallback({
        currentGroupChannel: currentGroupChannel,
        imageCompression: imageCompression,
        onBeforeSendFileMessage: onBeforeSendFileMessage,
    }, {
        logger: logger,
        pubSub: pubSub,
        scrollRef: scrollRef,
        messagesDispatcher: messagesDispatcher,
    })[0];
    var sendVoiceMessage = useSendVoiceMessageCallback({
        currentGroupChannel: currentGroupChannel,
        onBeforeSendVoiceMessage: onBeforeSendVoiceMessage,
    }, {
        logger: logger,
        pubSub: pubSub,
        scrollRef: scrollRef,
        messagesDispatcher: messagesDispatcher,
    })[0];
    var sendMultipleFilesMessage = useSendMultipleFilesMessage.useSendMultipleFilesMessage({
        currentChannel: currentGroupChannel,
        onBeforeSendMultipleFilesMessage: onBeforeSendMultipleFilesMessage,
        publishingModules: [pubSub_topics.PublishingModuleType.CHANNEL],
    }, {
        logger: logger,
        pubSub: pubSub,
        scrollRef: scrollRef,
    })[0];
    return (React.createElement(ChannelContext.Provider, { value: {
            // props
            channelUrl: channelUrl,
            isReactionEnabled: usingReaction,
            isMessageGroupingEnabled: isMessageGroupingEnabled,
            isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled,
            showSearchIcon: showSearchIcon !== null && showSearchIcon !== void 0 ? showSearchIcon : globalConfigs.showSearchIcon,
            highlightedMessage: highlightedMessage,
            startingPoint: startingPoint,
            onBeforeSendUserMessage: onBeforeSendUserMessage,
            onBeforeSendFileMessage: onBeforeSendFileMessage,
            onBeforeUpdateUserMessage: onBeforeUpdateUserMessage,
            onChatHeaderActionClick: onChatHeaderActionClick,
            onSearchClick: onSearchClick,
            onBackClick: onBackClick,
            replyType: replyType,
            threadReplySelectType: (_e = threadReplySelectType !== null && threadReplySelectType !== void 0 ? threadReplySelectType : resolvedReplyType.getCaseResolvedThreadReplySelectType(groupChannel.threadReplySelectType).upperCase) !== null && _e !== void 0 ? _e : _const.ThreadReplySelectType.THREAD,
            queries: queries,
            filterMessageList: filterMessageList,
            disableMarkAsRead: disableMarkAsRead,
            onReplyInThread: onReplyInThread,
            onQuoteMessageClick: onQuoteMessageClick,
            onMessageAnimated: onMessageAnimated,
            onMessageHighlighted: onMessageHighlighted,
            // messagesStore
            allMessages: allMessages,
            localMessages: localMessages,
            loading: loading,
            initialized: initialized,
            unreadSince: unreadSince,
            unreadSinceDate: unreadSinceDate,
            isInvalid: isInvalid,
            currentGroupChannel: currentGroupChannel,
            hasMorePrev: hasMorePrev,
            hasMoreNext: hasMoreNext,
            oldestMessageTimeStamp: oldestMessageTimeStamp,
            latestMessageTimeStamp: latestMessageTimeStamp,
            emojiContainer: emojiContainer,
            readStatus: readStatus,
            typingMembers: typingMembers,
            // utils
            scrollToMessage: scrollToMessage,
            quoteMessage: quoteMessage,
            setQuoteMessage: setQuoteMessage,
            deleteMessage: deleteMessage,
            updateMessage: updateMessage,
            resendMessage: resendMessage,
            messageInputRef: messageInputRef,
            sendMessage: sendMessage,
            sendFileMessage: sendFileMessage,
            sendVoiceMessage: sendVoiceMessage,
            sendMultipleFilesMessage: sendMultipleFilesMessage,
            initialTimeStamp: initialTimeStamp,
            messageActionTypes: actionTypes.channelActions,
            messagesDispatcher: messagesDispatcher,
            setInitialTimeStamp: setInitialTimeStamp,
            setAnimatedMessageId: setAnimatedMessageId,
            setHighLightedMessageId: setHighLightedMessageId,
            animatedMessageId: animatedMessageId,
            highLightedMessageId: highLightedMessageId,
            nicknamesMap: nicknamesMap,
            emojiAllMap: emojiAllMap,
            onScrollCallback: onScrollCallback,
            onScrollDownCallback: onScrollDownCallback,
            scrollRef: scrollRef,
            scrollBehavior: scrollBehavior,
            toggleReaction: toggleReaction,
            isScrolled: isScrolled,
            setIsScrolled: setIsScrolled,
        } },
        React.createElement(UserProfileContext.UserProfileProvider, { disableUserProfile: (_f = props === null || props === void 0 ? void 0 : props.disableUserProfile) !== null && _f !== void 0 ? _f : config === null || config === void 0 ? void 0 : config.disableUserProfile, renderUserProfile: props === null || props === void 0 ? void 0 : props.renderUserProfile, onUserProfileMessage: onUserProfileMessage }, children)));
};
var useChannelContext = function () { return React.useContext(ChannelContext); };

exports.ChannelProvider = ChannelProvider;
exports.useChannelContext = useChannelContext;
//# sourceMappingURL=context.js.map
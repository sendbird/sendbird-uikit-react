'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var message = require('@sendbird/chat/message');
var groupChannel = require('@sendbird/chat/groupChannel');
var uikitTools = require('@sendbird/uikit-tools');
var UserProfileContext = require('../chunks/bundle-DKcL-93i.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var useToggleReactionCallback = require('../chunks/bundle-U874nqiD.js');
var resolvedReplyType = require('../chunks/bundle-2Ou4ZIu0.js');
var utils = require('../chunks/bundle-MGhVSK7j.js');
var index$1 = require('../chunks/bundle-A90WNbHn.js');
var index = require('../chunks/bundle-4TXS0UcW.js');
var pubSub_topics = require('../chunks/bundle-LutGJd7y.js');
var consts = require('../chunks/bundle-I79mHo_2.js');
require('../withSendbird.js');
require('../chunks/bundle-eDrjbSc-.js');
require('../chunks/bundle-Gu74ZSrJ.js');

function runCallback(callback, lazy) {
    if (lazy === void 0) { lazy = true; }
    if (lazy) {
        setTimeout(function () {
            callback();
        });
    }
    else {
        callback();
    }
}
function useMessageListScroll() {
    var scrollRef = React.useRef(null);
    var scrollDistanceFromBottomRef = React.useRef(0);
    var scrollPubSub = React.useState(function () { return index.pubSubFactory(); })[0];
    var _a = React.useState(false), isScrollBottomReached = _a[0], setIsScrollBottomReached = _a[1];
    React.useLayoutEffect(function () {
        var unsubscribes = [];
        unsubscribes.push(scrollPubSub.subscribe('scrollToBottom', function (resolve) {
            runCallback(function () {
                if (!scrollRef.current)
                    return;
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                // Update data by manual update
                scrollDistanceFromBottomRef.current = 0;
                setIsScrollBottomReached(true);
                if (resolve)
                    resolve();
            });
        }));
        unsubscribes.push(scrollPubSub.subscribe('scroll', function (_a) {
            var top = _a.top, _b = _a.animated, animated = _b === void 0 ? false : _b, lazy = _a.lazy, resolve = _a.resolve;
            runCallback(function () {
                if (!scrollRef.current)
                    return;
                var _a = scrollRef.current, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
                scrollRef.current.scroll({ top: top, behavior: animated ? 'smooth' : 'auto' });
                // Update data by manual update
                scrollDistanceFromBottomRef.current = Math.max(0, scrollHeight - scrollTop - clientHeight);
                setIsScrollBottomReached(scrollDistanceFromBottomRef.current === 0);
                if (resolve)
                    resolve();
            }, lazy);
        }));
        return function () {
            unsubscribes.forEach(function (_a) {
                var remove = _a.remove;
                return remove();
            });
        };
    }, []);
    // Update data by scroll events
    index$1.useOnScrollPositionChangeDetectorWithRef(scrollRef, {
        onReachedTop: function (_a) {
            var distanceFromBottom = _a.distanceFromBottom;
            setIsScrollBottomReached(false);
            scrollDistanceFromBottomRef.current = distanceFromBottom;
        },
        onInBetween: function (_a) {
            var distanceFromBottom = _a.distanceFromBottom;
            setIsScrollBottomReached(false);
            scrollDistanceFromBottomRef.current = distanceFromBottom;
        },
        onReachedBottom: function (_a) {
            var distanceFromBottom = _a.distanceFromBottom;
            setIsScrollBottomReached(true);
            scrollDistanceFromBottomRef.current = distanceFromBottom;
        },
    });
    return {
        scrollRef: scrollRef,
        scrollPubSub: scrollPubSub,
        isScrollBottomReached: isScrollBottomReached,
        setIsScrollBottomReached: setIsScrollBottomReached,
        scrollDistanceFromBottomRef: scrollDistanceFromBottomRef,
    };
}

var pass = function (value) { return value; };
/**
 * @description This hook controls common processes related to message sending, updating.
 * */
function useMessageActions(params) {
    var _this = this;
    var _a = params.onBeforeSendUserMessage, onBeforeSendUserMessage = _a === void 0 ? pass : _a, _b = params.onBeforeSendFileMessage, onBeforeSendFileMessage = _b === void 0 ? pass : _b, _c = params.onBeforeUpdateUserMessage, onBeforeUpdateUserMessage = _c === void 0 ? pass : _c, _d = params.onBeforeSendVoiceMessage, onBeforeSendVoiceMessage = _d === void 0 ? pass : _d, _e = params.onBeforeSendMultipleFilesMessage, onBeforeSendMultipleFilesMessage = _e === void 0 ? pass : _e, sendFileMessage = params.sendFileMessage, sendMultipleFilesMessage = params.sendMultipleFilesMessage, sendUserMessage = params.sendUserMessage, updateUserMessage = params.updateUserMessage, scrollToBottom = params.scrollToBottom, quoteMessage = params.quoteMessage, replyType = params.replyType;
    var buildInternalMessageParams = React.useCallback(function (basicParams) {
        var messageParams = _tslib.__assign({}, basicParams);
        if (params.quoteMessage && replyType !== 'NONE') {
            messageParams.isReplyToChannel = true;
            messageParams.parentMessageId = quoteMessage.messageId;
        }
        return messageParams;
    }, [replyType, quoteMessage]);
    return {
        sendUserMessage: React.useCallback(function (params) { return _tslib.__awaiter(_this, void 0, void 0, function () {
            var internalParams, processedParams;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        internalParams = buildInternalMessageParams(params);
                        return [4 /*yield*/, onBeforeSendUserMessage(internalParams)];
                    case 1:
                        processedParams = _a.sent();
                        return [2 /*return*/, sendUserMessage(processedParams, function () { return scrollToBottom(); })];
                }
            });
        }); }, [buildInternalMessageParams, sendUserMessage, scrollToBottom]),
        sendFileMessage: React.useCallback(function (params) { return _tslib.__awaiter(_this, void 0, void 0, function () {
            var internalParams, processedParams;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        internalParams = buildInternalMessageParams(params);
                        return [4 /*yield*/, onBeforeSendFileMessage(internalParams)];
                    case 1:
                        processedParams = _a.sent();
                        return [2 /*return*/, sendFileMessage(processedParams, function () { return scrollToBottom(); })];
                }
            });
        }); }, [buildInternalMessageParams, sendFileMessage, scrollToBottom]),
        sendMultipleFilesMessage: React.useCallback(function (params) { return _tslib.__awaiter(_this, void 0, void 0, function () {
            var internalParams, processedParams;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        internalParams = buildInternalMessageParams(params);
                        return [4 /*yield*/, onBeforeSendMultipleFilesMessage(internalParams)];
                    case 1:
                        processedParams = _a.sent();
                        return [2 /*return*/, sendMultipleFilesMessage(processedParams, function () { return scrollToBottom(); })];
                }
            });
        }); }, [buildInternalMessageParams, sendMultipleFilesMessage, scrollToBottom]),
        sendVoiceMessage: React.useCallback(function (params, duration) { return _tslib.__awaiter(_this, void 0, void 0, function () {
            var internalParams, processedParams;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        internalParams = buildInternalMessageParams(_tslib.__assign(_tslib.__assign({}, params), { fileName: consts.VOICE_MESSAGE_FILE_NAME, mimeType: consts.VOICE_MESSAGE_MIME_TYPE, metaArrays: [
                                new message.MessageMetaArray({
                                    key: consts.META_ARRAY_VOICE_DURATION_KEY,
                                    value: ["".concat(duration)],
                                }),
                                new message.MessageMetaArray({
                                    key: consts.META_ARRAY_MESSAGE_TYPE_KEY,
                                    value: [consts.META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
                                }),
                            ] }));
                        return [4 /*yield*/, onBeforeSendVoiceMessage(internalParams)];
                    case 1:
                        processedParams = _a.sent();
                        return [2 /*return*/, sendFileMessage(processedParams, function () { return scrollToBottom(); })];
                }
            });
        }); }, [buildInternalMessageParams, sendFileMessage, scrollToBottom]),
        updateUserMessage: React.useCallback(function (messageId, params) { return _tslib.__awaiter(_this, void 0, void 0, function () {
            var internalParams, processedParams;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        internalParams = buildInternalMessageParams(params);
                        return [4 /*yield*/, onBeforeUpdateUserMessage(internalParams)];
                    case 1:
                        processedParams = _a.sent();
                        return [2 /*return*/, updateUserMessage(messageId, processedParams)];
                }
            });
        }); }, [buildInternalMessageParams, updateUserMessage]),
    };
}

/**
 * @description This hook is designed to prevent scroll flickering caused by duplicate calls of onEndReached and onTopReached.
 * It controls the loading of messages to ensure a single request for message retrieval.
 * */
var usePreventDuplicateRequest = function () {
    var context = React.useRef({ locked: false, count: 0 }).current;
    return {
        lock: function () {
            context.locked = true;
        },
        run: function (callback) {
            return _tslib.__awaiter(this, void 0, void 0, function () {
                return _tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (context.locked && context.count > 0)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            context.count++;
                            return [4 /*yield*/, callback()];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        release: function () {
            context.locked = false;
            context.count = 0;
        },
    };
};

var GroupChannelContext = React.createContext(null);
var GroupChannelProvider = function (props) {
    var _a, _b, _c;
    var channelUrl = props.channelUrl, children = props.children, moduleReactionEnabled = props.isReactionEnabled, moduleReplyType = props.replyType, moduleThreadReplySelectType = props.threadReplySelectType, _d = props.isMessageGroupingEnabled, isMessageGroupingEnabled = _d === void 0 ? true : _d, isMultipleFilesMessageEnabled = props.isMultipleFilesMessageEnabled, showSearchIcon = props.showSearchIcon, _e = props.disableMarkAsRead, disableMarkAsRead = _e === void 0 ? false : _e, _f = props.scrollBehavior, scrollBehavior = _f === void 0 ? 'auto' : _f, startingPoint = props.startingPoint, _animatedMessageId = props.animatedMessageId, messageListQueryParams = props.messageListQueryParams, onBeforeSendUserMessage = props.onBeforeSendUserMessage, onBeforeSendFileMessage = props.onBeforeSendFileMessage, onBeforeSendVoiceMessage = props.onBeforeSendVoiceMessage, onBeforeSendMultipleFilesMessage = props.onBeforeSendMultipleFilesMessage, onBeforeUpdateUserMessage = props.onBeforeUpdateUserMessage, onMessageAnimated = props.onMessageAnimated, onBackClick = props.onBackClick, onChatHeaderActionClick = props.onChatHeaderActionClick, onReplyInThreadClick = props.onReplyInThreadClick, onSearchClick = props.onSearchClick, onQuoteMessageClick = props.onQuoteMessageClick, renderUserMentionItem = props.renderUserMentionItem;
    // Global context
    var _g = useSendbirdStateContext.useSendbirdStateContext(), config = _g.config, stores = _g.stores;
    var sdkStore = stores.sdkStore;
    var markAsReadScheduler = config.markAsReadScheduler;
    // State
    var _h = React.useState(null), quoteMessage = _h[0], setQuoteMessage = _h[1];
    var _j = React.useState(0), animatedMessageId = _j[0], setAnimatedMessageId = _j[1];
    var _k = React.useState(null), currentChannel = _k[0], setCurrentChannel = _k[1];
    var _l = React.useState(null), fetchChannelError = _l[0], setFetchChannelError = _l[1];
    // Ref
    var _m = useMessageListScroll(), scrollRef = _m.scrollRef, scrollPubSub = _m.scrollPubSub, scrollDistanceFromBottomRef = _m.scrollDistanceFromBottomRef, isScrollBottomReached = _m.isScrollBottomReached, setIsScrollBottomReached = _m.setIsScrollBottomReached;
    var messageInputRef = React.useRef(null);
    var toggleReaction = useToggleReactionCallback.useToggleReactionCallback(currentChannel, config.logger);
    var replyType = resolvedReplyType.getCaseResolvedReplyType(moduleReplyType !== null && moduleReplyType !== void 0 ? moduleReplyType : config.groupChannel.replyType).upperCase;
    var threadReplySelectType = resolvedReplyType.getCaseResolvedThreadReplySelectType(moduleThreadReplySelectType !== null && moduleThreadReplySelectType !== void 0 ? moduleThreadReplySelectType : config.groupChannel.threadReplySelectType).upperCase;
    var chatReplyType = uikitTools.useIIFE(function () {
        if (replyType === 'NONE')
            return message.ReplyType.NONE;
        return message.ReplyType.ONLY_REPLY_TO_CHANNEL;
    });
    var isReactionEnabled = uikitTools.useIIFE(function () {
        if (!currentChannel || currentChannel.isSuper || currentChannel.isBroadcast || currentChannel.isEphemeral)
            return false;
        return moduleReactionEnabled !== null && moduleReactionEnabled !== void 0 ? moduleReactionEnabled : config.groupChannel.enableReactions;
    });
    var nicknamesMap = React.useMemo(function () { var _a; return new Map(((_a = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members) !== null && _a !== void 0 ? _a : []).map(function (_a) {
        var userId = _a.userId, nickname = _a.nickname;
        return [userId, nickname];
    })); }, [currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members]);
    var preventDuplicateRequest = usePreventDuplicateRequest();
    var messageDataSource = uikitTools.useGroupChannelMessages(sdkStore.sdk, currentChannel, {
        startingPoint: startingPoint,
        replyType: chatReplyType,
        collectionCreator: getCollectionCreator(currentChannel, messageListQueryParams),
        shouldCountNewMessages: function () { return !isScrollBottomReached; },
        markAsRead: function (channels) {
            if (!disableMarkAsRead && isScrollBottomReached) {
                channels.forEach(function (it) { return markAsReadScheduler.push(it); });
            }
        },
        onMessagesReceived: function () {
            if (isScrollBottomReached && utils.isContextMenuClosed()) {
                scrollPubSub.publish('scrollToBottom', null);
            }
        },
        onChannelDeleted: function () {
            setCurrentChannel(null);
            setFetchChannelError(null);
        },
        onCurrentUserBanned: function () {
            setCurrentChannel(null);
            setFetchChannelError(null);
        },
        onChannelUpdated: function (channel) { return setCurrentChannel(channel); },
        logger: config.logger,
    });
    index$1.useOnScrollPositionChangeDetectorWithRef(scrollRef, {
        onReachedTop: function () {
            return _tslib.__awaiter(this, void 0, void 0, function () {
                var _this = this;
                return _tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preventDuplicateRequest.lock();
                            return [4 /*yield*/, preventDuplicateRequest.run(function () { return _tslib.__awaiter(_this, void 0, void 0, function () {
                                    var prevViewInfo;
                                    return _tslib.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!messageDataSource.hasPrevious())
                                                    return [2 /*return*/];
                                                prevViewInfo = { scrollTop: scrollRef.current.scrollTop, scrollHeight: scrollRef.current.scrollHeight };
                                                return [4 /*yield*/, messageDataSource.loadPrevious()];
                                            case 1:
                                                _a.sent();
                                                // FIXME: We need a good way to detect right after the rendering of the screen instead of using setTimeout.
                                                setTimeout(function () {
                                                    var nextViewInfo = { scrollHeight: scrollRef.current.scrollHeight };
                                                    var viewUpdated = prevViewInfo.scrollHeight < nextViewInfo.scrollHeight;
                                                    if (viewUpdated) {
                                                        var bottomOffset = prevViewInfo.scrollHeight - prevViewInfo.scrollTop;
                                                        scrollPubSub.publish('scroll', { top: nextViewInfo.scrollHeight - bottomOffset, lazy: false });
                                                    }
                                                });
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            preventDuplicateRequest.release();
                            return [2 /*return*/];
                    }
                });
            });
        },
        onReachedBottom: function () {
            return _tslib.__awaiter(this, void 0, void 0, function () {
                var _this = this;
                return _tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preventDuplicateRequest.lock();
                            return [4 /*yield*/, preventDuplicateRequest.run(function () { return _tslib.__awaiter(_this, void 0, void 0, function () {
                                    var prevViewInfo;
                                    return _tslib.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!messageDataSource.hasNext())
                                                    return [2 /*return*/];
                                                prevViewInfo = { scrollTop: scrollRef.current.scrollTop, scrollHeight: scrollRef.current.scrollHeight };
                                                return [4 /*yield*/, messageDataSource.loadNext()];
                                            case 1:
                                                _a.sent();
                                                setTimeout(function () {
                                                    var nextViewInfo = { scrollHeight: scrollRef.current.scrollHeight };
                                                    var viewUpdated = prevViewInfo.scrollHeight < nextViewInfo.scrollHeight;
                                                    if (viewUpdated) {
                                                        scrollPubSub.publish('scroll', { top: prevViewInfo.scrollTop, lazy: false });
                                                    }
                                                });
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            preventDuplicateRequest.release();
                            if (currentChannel && !messageDataSource.hasNext()) {
                                messageDataSource.resetNewMessages();
                                if (!disableMarkAsRead)
                                    markAsReadScheduler.push(currentChannel);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
    });
    // SideEffect: Fetch and set to current channel by channelUrl prop.
    uikitTools.useAsyncEffect(function () { return _tslib.__awaiter(void 0, void 0, void 0, function () {
        var channel, error_1;
        return _tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(sdkStore.initialized && channelUrl)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, sdkStore.sdk.groupChannel.getChannel(channelUrl)];
                case 2:
                    channel = _a.sent();
                    setCurrentChannel(channel);
                    setFetchChannelError(null);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setCurrentChannel(null);
                    setFetchChannelError(error_1);
                    return [3 /*break*/, 5];
                case 4:
                    // Reset states when channel changes
                    setQuoteMessage(null);
                    setAnimatedMessageId(0);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [sdkStore.initialized, sdkStore.sdk, channelUrl]);
    // SideEffect: Scroll to the bottom
    //  - On the initialized message list
    //  - On messages sent from the thread
    uikitTools.useAsyncLayoutEffect(function () { return _tslib.__awaiter(void 0, void 0, void 0, function () {
        var onSentMessageFromOtherModule, subscribes;
        return _tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!messageDataSource.initialized) return [3 /*break*/, 2];
                    // it prevents message load from previous/next before scroll to bottom finished.
                    preventDuplicateRequest.lock();
                    return [4 /*yield*/, preventDuplicateRequest.run(function () {
                            return new Promise(function (resolve) {
                                scrollPubSub.publish('scrollToBottom', resolve);
                            });
                        })];
                case 1:
                    _a.sent();
                    preventDuplicateRequest.release();
                    _a.label = 2;
                case 2:
                    onSentMessageFromOtherModule = function (data) {
                        if (data.channel.url === channelUrl)
                            scrollPubSub.publish('scrollToBottom', null);
                    };
                    subscribes = [
                        config.pubSub.subscribe(pubSub_topics.pubSubTopics.SEND_USER_MESSAGE, onSentMessageFromOtherModule),
                        config.pubSub.subscribe(pubSub_topics.pubSubTopics.SEND_FILE_MESSAGE, onSentMessageFromOtherModule),
                    ];
                    return [2 /*return*/, function () {
                            subscribes.forEach(function (subscribe) { return subscribe.remove(); });
                            scrollPubSub.publish('scrollToBottom', null);
                        }];
            }
        });
    }); }, [messageDataSource.initialized, channelUrl]);
    // SideEffect: Reset MessageCollection with startingPoint prop.
    React.useEffect(function () {
        if (typeof startingPoint === 'number') {
            // We do not handle animation for message search here.
            // Please update the animatedMessageId prop to trigger the animation.
            scrollToMessage(startingPoint, 0, false);
        }
    }, [startingPoint]);
    // SideEffect: Update animatedMessageId prop to state.
    React.useEffect(function () {
        if (_animatedMessageId)
            setAnimatedMessageId(_animatedMessageId);
    }, [_animatedMessageId]);
    var scrollToBottom = uikitTools.usePreservedCallback(function () { return _tslib.__awaiter(void 0, void 0, void 0, function () {
        return _tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!scrollRef.current)
                        return [2 /*return*/];
                    setAnimatedMessageId(0);
                    setIsScrollBottomReached(true);
                    if (!(config.isOnline && messageDataSource.hasNext())) return [3 /*break*/, 2];
                    return [4 /*yield*/, messageDataSource.resetWithStartingPoint(Number.MAX_SAFE_INTEGER)];
                case 1:
                    _a.sent();
                    scrollPubSub.publish('scrollToBottom', null);
                    return [3 /*break*/, 3];
                case 2:
                    scrollPubSub.publish('scrollToBottom', null);
                    _a.label = 3;
                case 3:
                    if (currentChannel && !messageDataSource.hasNext()) {
                        messageDataSource.resetNewMessages();
                        if (!disableMarkAsRead)
                            markAsReadScheduler.push(currentChannel);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    var scrollToMessage = uikitTools.usePreservedCallback(function (createdAt, messageId, animated) {
        if (animated === void 0) { animated = true; }
        return _tslib.__awaiter(void 0, void 0, void 0, function () {
            var element, parentNode, clickHandler, message, topOffset;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        element = scrollRef.current;
                        parentNode = element === null || element === void 0 ? void 0 : element.parentNode;
                        clickHandler = {
                            activate: function () {
                                if (!element || !parentNode)
                                    return;
                                element.style.pointerEvents = 'auto';
                                parentNode.style.cursor = 'auto';
                            },
                            deactivate: function () {
                                if (!element || !parentNode)
                                    return;
                                element.style.pointerEvents = 'none';
                                parentNode.style.cursor = 'wait';
                            },
                        };
                        clickHandler.deactivate();
                        setAnimatedMessageId(0);
                        message = messageDataSource.messages.find(function (it) { return it.messageId === messageId || it.createdAt === createdAt; });
                        if (!message) return [3 /*break*/, 1];
                        topOffset = utils.getMessageTopOffset(message.createdAt);
                        if (topOffset)
                            scrollPubSub.publish('scroll', { top: topOffset });
                        if (animated)
                            setAnimatedMessageId(messageId);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, messageDataSource.resetWithStartingPoint(createdAt)];
                    case 2:
                        _a.sent();
                        setTimeout(function () {
                            var topOffset = utils.getMessageTopOffset(createdAt);
                            if (topOffset)
                                scrollPubSub.publish('scroll', { top: topOffset, lazy: false });
                            if (animated)
                                setAnimatedMessageId(messageId);
                        });
                        _a.label = 3;
                    case 3:
                        clickHandler.activate();
                        return [2 /*return*/];
                }
            });
        });
    });
    var messageActions = useMessageActions(_tslib.__assign(_tslib.__assign(_tslib.__assign({}, props), messageDataSource), { scrollToBottom: scrollToBottom, quoteMessage: quoteMessage, replyType: replyType }));
    return (React.createElement(GroupChannelContext.Provider, { value: _tslib.__assign(_tslib.__assign({ 
            // # Props
            channelUrl: channelUrl, isReactionEnabled: isReactionEnabled, isMessageGroupingEnabled: isMessageGroupingEnabled, isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled, showSearchIcon: showSearchIcon !== null && showSearchIcon !== void 0 ? showSearchIcon : config.showSearchIcon, replyType: replyType, threadReplySelectType: threadReplySelectType, disableMarkAsRead: disableMarkAsRead, scrollBehavior: scrollBehavior, 
            // # Custom Props
            messageListQueryParams: messageListQueryParams, 
            // ## Message
            onBeforeSendUserMessage: onBeforeSendUserMessage, onBeforeSendFileMessage: onBeforeSendFileMessage, onBeforeSendVoiceMessage: onBeforeSendVoiceMessage, onBeforeSendMultipleFilesMessage: onBeforeSendMultipleFilesMessage, onBeforeUpdateUserMessage: onBeforeUpdateUserMessage, 
            // ## Focusing
            onMessageAnimated: onMessageAnimated, 
            // ## Click
            onBackClick: onBackClick, onChatHeaderActionClick: onChatHeaderActionClick, onReplyInThreadClick: onReplyInThreadClick, onSearchClick: onSearchClick, onQuoteMessageClick: onQuoteMessageClick, 
            // ## Custom render
            renderUserMentionItem: renderUserMentionItem, 
            // Internal Interface
            currentChannel: currentChannel, fetchChannelError: fetchChannelError, nicknamesMap: nicknamesMap, scrollRef: scrollRef, scrollDistanceFromBottomRef: scrollDistanceFromBottomRef, scrollPubSub: scrollPubSub, messageInputRef: messageInputRef, quoteMessage: quoteMessage, setQuoteMessage: setQuoteMessage, animatedMessageId: animatedMessageId, setAnimatedMessageId: setAnimatedMessageId, isScrollBottomReached: isScrollBottomReached, setIsScrollBottomReached: setIsScrollBottomReached, scrollToBottom: scrollToBottom, scrollToMessage: scrollToMessage, toggleReaction: toggleReaction }, messageDataSource), messageActions) },
        React.createElement(UserProfileContext.UserProfileProvider, { disableUserProfile: (_a = props === null || props === void 0 ? void 0 : props.disableUserProfile) !== null && _a !== void 0 ? _a : config === null || config === void 0 ? void 0 : config.disableUserProfile, renderUserProfile: (_b = props === null || props === void 0 ? void 0 : props.renderUserProfile) !== null && _b !== void 0 ? _b : config === null || config === void 0 ? void 0 : config.renderUserProfile, onUserProfileMessage: (_c = props === null || props === void 0 ? void 0 : props.onUserProfileMessage) !== null && _c !== void 0 ? _c : config === null || config === void 0 ? void 0 : config.onUserProfileMessage }, children)));
};
var useGroupChannelContext = function () {
    var context = React.useContext(GroupChannelContext);
    if (!context)
        throw new Error('GroupChannelContext not found. Use within the GroupChannel module.');
    return context;
};
function getCollectionCreator(groupChannel$1, messageListQueryParams) {
    return function (defaultParams) {
        var params = _tslib.__assign(_tslib.__assign(_tslib.__assign({}, defaultParams), { prevResultLimit: 30, nextResultLimit: 30 }), messageListQueryParams);
        return groupChannel$1.createMessageCollection(_tslib.__assign(_tslib.__assign({}, params), { filter: new groupChannel.MessageFilter(params) }));
    };
}

exports.GroupChannelContext = GroupChannelContext;
exports.GroupChannelProvider = GroupChannelProvider;
exports.useGroupChannelContext = useGroupChannelContext;
//# sourceMappingURL=context.js.map

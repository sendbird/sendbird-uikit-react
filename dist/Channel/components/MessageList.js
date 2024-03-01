import React__default, { useState, useEffect } from 'react';
import { useChannelContext } from '../context.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import Message from './Message.js';
import { T as TypingIndicatorType } from '../../chunks/bundle-sn2-VCB3.js';
import { i as isAboutSame } from '../../chunks/bundle-fO5XIU5Y.js';
import { UnreadCount } from '../../GroupChannel/components/UnreadCount.js';
import { FrozenNotification } from '../../GroupChannel/components/FrozenNotification.js';
import { S as SCROLL_BUFFER } from '../../chunks/bundle-AFXr5NmI.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { MessageProvider } from '../../Message/context.js';
import { u as useHandleOnScrollCallback } from '../../chunks/bundle-zhxgqh8X.js';
import { u as useThrottleCallback } from '../../chunks/bundle-JMVaVraV.js';
import TypingIndicatorBubble from '../../ui/TypingIndicatorBubble.js';
import { u as useOnScrollPositionChangeDetector } from '../../chunks/bundle-lPKA2RTf.js';
import { getMessagePartsInfo } from '../utils/getMessagePartsInfo.js';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-hKmRj7Ck.js';
import '../../chunks/bundle-ay4_3U9k.js';
import '../../chunks/bundle-KMsJXUN2.js';
import '../../chunks/bundle-vbGNKQpe.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-LZemF1A7.js';
import '../../chunks/bundle-Vkdvpta0.js';
import '../../chunks/bundle-xlx3bBW8.js';
import '../../chunks/bundle-1653azYX.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-9zSaTC1n.js';
import '../../chunks/bundle-THTV9S18.js';
import '../../chunks/bundle-TLAngIsc.js';
import '../../chunks/bundle-4Q6J8UBD.js';
import '../../chunks/bundle-DJdbc2nP.js';
import '../../chunks/bundle-msnuMA4R.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-kMMCn6GE.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-lWG-n9p0.js';
import '../../chunks/bundle-38Dx0S9V.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-nGuCRoDK.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-NOh3ukH6.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-1uBgZh_D.js';
import 'dompurify';
import '../../chunks/bundle-qauKidkr.js';
import '../../chunks/bundle-wf7f-9LT.js';
import '../../chunks/bundle-cMznkLt0.js';
import '../../chunks/bundle-pODFB39J.js';
import '../../withSendbird.js';
import '../../ui/MessageContent.js';
import '../../chunks/bundle-GQ4rK0ER.js';
import '../../chunks/bundle-vWrgNSvP.js';
import '../../chunks/bundle-SpfAN5pr.js';
import '../../ui/MessageItemMenu.js';
import '../../ui/ContextMenu.js';
import 'react-dom';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-lJ2SrsKF.js';
import '../../ui/MessageItemReactionMenu.js';
import '../../ui/ImageRenderer.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-3iFqiLDd.js';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-O8mkJ7az.js';
import '../../ui/UserListItem.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../ui/AdminMessage.js';
import '../../ui/QuoteMessage.js';
import '../../chunks/bundle--jWawO0i.js';
import '../../chunks/bundle-m-u0cD67.js';
import '../../ui/ThreadReplies.js';
import '../../ui/OGMessageItemBody.js';
import '../../chunks/bundle-AjBmMBJ5.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../ui/TextMessageItemBody.js';
import '../../ui/FileMessageItemBody.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-pWK0f3qD.js';
import '../../chunks/bundle-13MqUbIu.js';
import '../../chunks/bundle-HUsfnqzD.js';
import '@sendbird/uikit-tools';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-8TMXvllw.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/ThumbnailMessageItemBody.js';
import '../../ui/UnknownMessageItemBody.js';
import '../../ui/FeedbackIconButton.js';
import '../../ui/MobileFeedbackMenu.js';
import './MessageFeedbackModal.js';
import '../../ui/Input.js';
import '../../GroupChannel/components/SuggestedReplies.js';
import '../../chunks/bundle-CLnDoxQc.js';
import './FileViewer.js';
import '../../chunks/bundle-3wHCboJc.js';
import './RemoveMessageModal.js';
import '../../chunks/bundle-JMkFT5Td.js';
import '../../chunks/bundle-pZ049TQg.js';
import '../utils/compareMessagesForGrouping.js';

var DELAY = 100;
function useSetScrollToBottom(_a) {
    var loading = _a.loading;
    var _b = useState(0), scrollBottom = _b[0], setScrollBottom = _b[1];
    useEffect(function () {
        if (loading) {
            setScrollBottom(0);
        }
    }, [loading]);
    var scrollCb = function (e) {
        var element = e.target;
        try {
            setScrollBottom(element.scrollHeight - element.scrollTop - element.offsetHeight);
        }
        catch (_a) {
            //
        }
    };
    return {
        scrollBottom: scrollBottom,
        scrollToBottomHandler: useThrottleCallback(scrollCb, DELAY, { trailing: true }),
    };
}

function useScrollBehavior() {
    var _a = useChannelContext(), scrollRef = _a.scrollRef, _b = _a.scrollBehavior, scrollBehavior = _b === void 0 ? 'auto' : _b;
    useEffect(function () {
        if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = scrollBehavior;
        }
    }, [scrollRef.current]);
    return null;
}

/* We operate the CSS files for Channel&GroupChannel modules in the GroupChannel */
var SCROLL_BOTTOM_PADDING = 50;
var MessageList = function (_a) {
    var _b, _c, _d, _e, _f;
    var _g = _a.className, className = _g === void 0 ? '' : _g, renderMessage = _a.renderMessage, renderMessageContent = _a.renderMessageContent, renderCustomSeparator = _a.renderCustomSeparator, _h = _a.renderPlaceholderLoader, renderPlaceholderLoader = _h === void 0 ? function () { return React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.LOADING }); } : _h, _j = _a.renderPlaceholderEmpty, renderPlaceholderEmpty = _j === void 0 ? function () { return React__default.createElement(PlaceHolder, { className: "sendbird-conversation__no-messages", type: PlaceHolderTypes.NO_MESSAGES }); } : _j, _k = _a.renderFrozenNotification, renderFrozenNotification = _k === void 0 ? function () { return React__default.createElement(FrozenNotification, { className: "sendbird-conversation__messages__notification" }); } : _k;
    var _l = useChannelContext(), allMessages = _l.allMessages, localMessages = _l.localMessages, hasMorePrev = _l.hasMorePrev, hasMoreNext = _l.hasMoreNext, setInitialTimeStamp = _l.setInitialTimeStamp, setAnimatedMessageId = _l.setAnimatedMessageId, setHighLightedMessageId = _l.setHighLightedMessageId, isMessageGroupingEnabled = _l.isMessageGroupingEnabled, scrollRef = _l.scrollRef, onScrollCallback = _l.onScrollCallback, onScrollDownCallback = _l.onScrollDownCallback, messagesDispatcher = _l.messagesDispatcher, messageActionTypes = _l.messageActionTypes, currentGroupChannel = _l.currentGroupChannel, disableMarkAsRead = _l.disableMarkAsRead, filterMessageList = _l.filterMessageList, replyType = _l.replyType, loading = _l.loading, isScrolled = _l.isScrolled, unreadSince = _l.unreadSince, unreadSinceDate = _l.unreadSinceDate, typingMembers = _l.typingMembers;
    var store = useSendbirdStateContext();
    var allMessagesFiltered = typeof filterMessageList === 'function' ? allMessages.filter(filterMessageList) : allMessages;
    var markAsReadScheduler = store.config.markAsReadScheduler;
    var _m = useState(false), isScrollBottom = _m[0], setIsScrollBottom = _m[1];
    useScrollBehavior();
    /**
     * @param {function} callback callback from useHandleOnScrollCallback, it adjusts scroll position
     * */
    var onScroll = function (callback) {
        var element = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
        if (element == null) {
            return;
        }
        var scrollTop = element.scrollTop, clientHeight = element.clientHeight, scrollHeight = element.scrollHeight;
        if (hasMorePrev && isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
            onScrollCallback(callback);
        }
        if (hasMoreNext && isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER)) {
            onScrollDownCallback(callback);
        }
        if (!disableMarkAsRead && isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER) && !!currentGroupChannel) {
            messagesDispatcher({
                type: messageActionTypes.MARK_AS_READ,
                payload: { channel: currentGroupChannel },
            });
            markAsReadScheduler.push(currentGroupChannel);
        }
    };
    var onClickScrollBot = function () {
        var _a, _b, _c, _d, _e;
        setInitialTimeStamp === null || setInitialTimeStamp === void 0 ? void 0 : setInitialTimeStamp(null);
        setAnimatedMessageId === null || setAnimatedMessageId === void 0 ? void 0 : setAnimatedMessageId(null);
        setHighLightedMessageId === null || setHighLightedMessageId === void 0 ? void 0 : setHighLightedMessageId(null);
        if (((_a = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) > -1) {
            scrollRef.current.scrollTop = ((_c = (_b = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _b === void 0 ? void 0 : _b.scrollHeight) !== null && _c !== void 0 ? _c : 0) - ((_e = (_d = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _d === void 0 ? void 0 : _d.offsetHeight) !== null && _e !== void 0 ? _e : 0);
        }
    };
    /**
     * 1. Move the messsage list scroll
     *    when each message's height is changed by `reactions` OR `showEdit`
     * 2. Keep the scrollBottom value after fetching new message list
     */
    var moveScroll = function (isBottomMessageAffected) {
        if (isBottomMessageAffected === void 0) { isBottomMessageAffected = false; }
        var current = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
        if (current) {
            var bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
            if (scrollBottom < bottom && (!isBottomMessageAffected || scrollBottom < SCROLL_BUFFER)) {
                // Move the scroll as much as the height of the message has changed
                current.scrollTop += bottom - scrollBottom;
            }
        }
    };
    var handleOnScroll = useHandleOnScrollCallback({
        hasMore: hasMorePrev,
        hasNext: hasMoreNext,
        onScroll: onScroll,
        scrollRef: scrollRef,
    });
    var onScrollReachedEndDetector = useOnScrollPositionChangeDetector({
        onReachedBottom: function () {
            /**
             * Note that this event is already being called in onScroll() above. However, it is only being called when
             * hasMoreNext is true but it needs to be called when hasNext is false when reached bottom as well.
             */
            if (!hasMoreNext && !disableMarkAsRead && !!currentGroupChannel) {
                messagesDispatcher({
                    type: messageActionTypes.MARK_AS_READ,
                    payload: { channel: currentGroupChannel },
                });
                markAsReadScheduler.push(currentGroupChannel);
            }
            setIsScrollBottom(true);
        },
        onReachedTop: function () {
            setIsScrollBottom(false);
        },
        onInBetween: function () {
            setIsScrollBottom(false);
        },
    });
    var _o = useSetScrollToBottom({ loading: loading }), scrollToBottomHandler = _o.scrollToBottomHandler, scrollBottom = _o.scrollBottom;
    if (loading) {
        return renderPlaceholderLoader();
    }
    if (allMessagesFiltered.length < 1) {
        return renderPlaceholderEmpty();
    }
    return (React__default.createElement(React__default.Fragment, null,
        !isScrolled && React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.LOADING }),
        React__default.createElement("div", { className: "sendbird-conversation__messages ".concat(className) },
            React__default.createElement("div", { className: "sendbird-conversation__scroll-container" },
                React__default.createElement("div", { className: "sendbird-conversation__padding" }),
                React__default.createElement("div", { className: "sendbird-conversation__messages-padding", ref: scrollRef, onScroll: function (e) {
                        handleOnScroll();
                        scrollToBottomHandler(e);
                        onScrollReachedEndDetector(e);
                    } },
                    allMessagesFiltered.map(function (m, idx) {
                        var _a, _b;
                        var _c = getMessagePartsInfo({
                            allMessages: allMessagesFiltered,
                            replyType: replyType,
                            isMessageGroupingEnabled: isMessageGroupingEnabled,
                            currentIndex: idx,
                            currentMessage: m,
                            currentChannel: currentGroupChannel,
                        }), chainTop = _c.chainTop, chainBottom = _c.chainBottom, hasSeparator = _c.hasSeparator;
                        var isByMe = ((_a = m === null || m === void 0 ? void 0 : m.sender) === null || _a === void 0 ? void 0 : _a.userId) === ((_b = store === null || store === void 0 ? void 0 : store.config) === null || _b === void 0 ? void 0 : _b.userId);
                        return (React__default.createElement(MessageProvider, { message: m, key: m === null || m === void 0 ? void 0 : m.messageId, isByMe: isByMe },
                            React__default.createElement(Message, { handleScroll: moveScroll, message: m, hasSeparator: hasSeparator, chainTop: chainTop, chainBottom: chainBottom, renderMessageContent: renderMessageContent, renderCustomSeparator: renderCustomSeparator, 
                                // backward compatibility
                                renderMessage: renderMessage })));
                    }),
                    localMessages.map(function (m, idx) {
                        var _a, _b;
                        var _c = getMessagePartsInfo({
                            allMessages: allMessagesFiltered,
                            replyType: replyType,
                            isMessageGroupingEnabled: isMessageGroupingEnabled,
                            currentIndex: idx,
                            currentMessage: m,
                            currentChannel: currentGroupChannel,
                        }), chainTop = _c.chainTop, chainBottom = _c.chainBottom;
                        var isByMe = ((_a = m === null || m === void 0 ? void 0 : m.sender) === null || _a === void 0 ? void 0 : _a.userId) === ((_b = store === null || store === void 0 ? void 0 : store.config) === null || _b === void 0 ? void 0 : _b.userId);
                        return (React__default.createElement(MessageProvider, { message: m, key: m === null || m === void 0 ? void 0 : m.messageId, isByMe: isByMe },
                            React__default.createElement(Message, { handleScroll: moveScroll, message: m, chainTop: chainTop, chainBottom: chainBottom, renderMessageContent: renderMessageContent, renderCustomSeparator: renderCustomSeparator, 
                                // backward compatibility
                                renderMessage: renderMessage })));
                    }),
                    !hasMoreNext
                        && ((_c = (_b = store === null || store === void 0 ? void 0 : store.config) === null || _b === void 0 ? void 0 : _b.groupChannel) === null || _c === void 0 ? void 0 : _c.enableTypingIndicator)
                        && ((_f = (_e = (_d = store === null || store === void 0 ? void 0 : store.config) === null || _d === void 0 ? void 0 : _d.groupChannel) === null || _e === void 0 ? void 0 : _e.typingIndicatorTypes) === null || _f === void 0 ? void 0 : _f.has(TypingIndicatorType.Bubble)) && (React__default.createElement(TypingIndicatorBubble, { typingMembers: typingMembers, handleScroll: moveScroll })))),
            (currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.isFrozen) && renderFrozenNotification(),
            /**
             * Show unread count IFF scroll is not bottom or is bottom but hasNext is true.
             */
            (!isScrollBottom || hasMoreNext) && (unreadSince || unreadSinceDate) && (React__default.createElement(UnreadCount, { className: "sendbird-conversation__messages__notification", count: currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.unreadMessageCount, time: unreadSince, lastReadAt: unreadSinceDate, onClick: function () {
                    if (scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current)
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    if (!disableMarkAsRead && !!currentGroupChannel) {
                        markAsReadScheduler.push(currentGroupChannel);
                        messagesDispatcher({
                            type: messageActionTypes.MARK_AS_READ,
                            payload: { channel: currentGroupChannel },
                        });
                    }
                    setInitialTimeStamp(null);
                    setAnimatedMessageId(null);
                    setHighLightedMessageId(null);
                } })),
            // This flag is an unmatched variable
            scrollBottom > SCROLL_BOTTOM_PADDING && (React__default.createElement("div", { className: "sendbird-conversation__scroll-bottom-button", onClick: onClickScrollBot, onKeyDown: onClickScrollBot, tabIndex: 0, role: "button" },
                React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.CHEVRON_DOWN, fillColor: IconColors.PRIMARY }))))));
};

export { MessageList, MessageList as default };
//# sourceMappingURL=MessageList.js.map
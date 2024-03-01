'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var uikitTools = require('@sendbird/uikit-tools');
var index = require('../../chunks/bundle-Uw6P-cM9.js');
var types = require('../../chunks/bundle-gZD5lzcX.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var ui_Icon = require('../../ui/Icon.js');
var GroupChannel_components_Message = require('./Message.js');
var Channel_utils_getMessagePartsInfo = require('../../Channel/utils/getMessagePartsInfo.js');
var GroupChannel_components_UnreadCount = require('./UnreadCount.js');
var GroupChannel_components_FrozenNotification = require('./FrozenNotification.js');
var consts = require('../../chunks/bundle-Atn5EZwu.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var Message_context = require('../../Message/context.js');
var GroupChannel_context = require('../context.js');
var ui_TypingIndicatorBubble = require('../../ui/TypingIndicatorBubble.js');
var utils = require('../../chunks/bundle-U2YYVRfT.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-Q3LgnX7F.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../withSendbird.js');
require('../../ui/MessageContent.js');
require('../../chunks/bundle-VehpyAT7.js');
require('../../chunks/bundle-_wF3sJvp.js');
require('../../chunks/bundle-iPt3h7ba.js');
require('../../ui/MessageItemMenu.js');
require('../../ui/ContextMenu.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-K3wEmKTu.js');
require('../../ui/MessageItemReactionMenu.js');
require('../../ui/ImageRenderer.js');
require('../../ui/ReactionButton.js');
require('../../chunks/bundle-pOf7PZ4G.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/EmojiReactions.js');
require('../../ui/ReactionBadge.js');
require('../../ui/BottomSheet.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-6hGNMML2.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../ui/AdminMessage.js');
require('../../ui/QuoteMessage.js');
require('../../chunks/bundle--4Ob_RGQ.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-m5pFb_tZ.js');
require('../../ui/ThreadReplies.js');
require('../../ui/OGMessageItemBody.js');
require('../../chunks/bundle-DqKLlsGU.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../ui/TextMessageItemBody.js');
require('../../ui/FileMessageItemBody.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-wezC76id.js');
require('../../chunks/bundle-s5WIvT8N.js');
require('../../chunks/bundle-noP7JXqE.js');
require('../../ui/VoiceMessageItemBody.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-jXnX-7jH.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../ui/ThumbnailMessageItemBody.js');
require('../../ui/UnknownMessageItemBody.js');
require('../../ui/FeedbackIconButton.js');
require('../../ui/MobileFeedbackMenu.js');
require('../../Channel/components/MessageFeedbackModal.js');
require('../../ui/Input.js');
require('./SuggestedReplies.js');
require('../../chunks/bundle-rYFzQpzQ.js');
require('./FileViewer.js');
require('../../chunks/bundle-JARyNexc.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-48AiK3oz.js');
require('../../chunks/bundle-6xWNZugu.js');
require('../../chunks/bundle-Zw2P8RwZ.js');
require('../../chunks/bundle-2xXFQXmk.js');
require('./RemoveMessageModal.js');
require('../../chunks/bundle-L8T4CdY4.js');
require('../../chunks/bundle-gOYUXAiI.js');
require('../../Channel/utils/compareMessagesForGrouping.js');

function useScrollBehavior() {
    var _a = GroupChannel_context.useGroupChannelContext(), scrollRef = _a.scrollRef, _b = _a.scrollBehavior, scrollBehavior = _b === void 0 ? 'auto' : _b;
    React.useEffect(function () {
        if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = scrollBehavior;
        }
    }, [scrollRef.current]);
    return null;
}

var MessageList = function (_a) {
    var _b, _c, _d, _e, _f;
    var _g = _a.className, className = _g === void 0 ? '' : _g, _h = _a.renderMessage, renderMessage = _h === void 0 ? function (props) { return React.createElement(GroupChannel_components_Message.Message, _tslib.__assign({}, props)); } : _h, renderMessageContent = _a.renderMessageContent, renderCustomSeparator = _a.renderCustomSeparator, _j = _a.renderPlaceholderLoader, renderPlaceholderLoader = _j === void 0 ? function () { return React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.LOADING }); } : _j, _k = _a.renderPlaceholderEmpty, renderPlaceholderEmpty = _k === void 0 ? function () { return React.createElement(ui_PlaceHolder.default, { className: "sendbird-conversation__no-messages", type: ui_PlaceHolder.PlaceHolderTypes.NO_MESSAGES }); } : _k, _l = _a.renderFrozenNotification, renderFrozenNotification = _l === void 0 ? function () { return React.createElement(GroupChannel_components_FrozenNotification.FrozenNotification, { className: "sendbird-conversation__messages__notification" }); } : _l;
    var _m = GroupChannel_context.useGroupChannelContext(), channelUrl = _m.channelUrl, hasNext = _m.hasNext, loading = _m.loading, messages = _m.messages, newMessages = _m.newMessages, scrollToBottom = _m.scrollToBottom, isScrollBottomReached = _m.isScrollBottomReached, isMessageGroupingEnabled = _m.isMessageGroupingEnabled, scrollRef = _m.scrollRef, scrollDistanceFromBottomRef = _m.scrollDistanceFromBottomRef, currentChannel = _m.currentChannel, replyType = _m.replyType, scrollPubSub = _m.scrollPubSub;
    var store = useSendbirdStateContext.useSendbirdStateContext();
    var _o = React.useState(), unreadSinceDate = _o[0], setUnreadSinceDate = _o[1];
    useScrollBehavior();
    React.useEffect(function () {
        if (isScrollBottomReached) {
            setUnreadSinceDate(undefined);
        }
        else {
            setUnreadSinceDate(new Date());
        }
    }, [isScrollBottomReached]);
    /**
     * 1. Move the message list scroll
     *    when each message's height is changed by `reactions` OR `showEdit`
     * 2. Keep the scrollBottom value after fetching new message list
     */
    var onMessageContentSizeChanged = function (isBottomMessageAffected) {
        if (isBottomMessageAffected === void 0) { isBottomMessageAffected = false; }
        var elem = scrollRef.current;
        if (elem) {
            var latestDistance = scrollDistanceFromBottomRef.current;
            var currentDistance = elem.scrollHeight - elem.scrollTop - elem.offsetHeight;
            if (latestDistance < currentDistance && (!isBottomMessageAffected || latestDistance < consts.SCROLL_BUFFER)) {
                var diff = currentDistance - latestDistance;
                // Move the scroll as much as the height of the message has changed
                scrollPubSub.publish('scroll', { top: elem.scrollTop + diff, lazy: false });
            }
        }
    };
    var renderer = {
        frozenNotification: function () {
            if (!currentChannel || !currentChannel.isFrozen)
                return null;
            return renderFrozenNotification();
        },
        unreadMessagesNotification: function () {
            if (isScrollBottomReached || !unreadSinceDate)
                return null;
            return (React.createElement(GroupChannel_components_UnreadCount.UnreadCount, { className: "sendbird-conversation__messages__notification", count: newMessages.length, lastReadAt: unreadSinceDate, onClick: scrollToBottom }));
        },
        scrollToBottomButton: function () {
            if (!hasNext() && isScrollBottomReached)
                return null;
            return (React.createElement("div", { className: "sendbird-conversation__scroll-bottom-button", onClick: scrollToBottom, onKeyDown: scrollToBottom, tabIndex: 0, role: "button" },
                React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.CHEVRON_DOWN, fillColor: ui_Icon.IconColors.PRIMARY })));
        },
    };
    if (loading) {
        return renderPlaceholderLoader();
    }
    if (messages.length === 0) {
        return renderPlaceholderEmpty();
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "sendbird-conversation__messages ".concat(className) },
            React.createElement("div", { className: "sendbird-conversation__scroll-container" },
                React.createElement("div", { className: "sendbird-conversation__padding" }),
                React.createElement("div", { className: "sendbird-conversation__messages-padding", ref: scrollRef },
                    messages.map(function (message, idx) {
                        var _a = Channel_utils_getMessagePartsInfo.getMessagePartsInfo({
                            allMessages: messages,
                            replyType: replyType,
                            isMessageGroupingEnabled: isMessageGroupingEnabled,
                            currentIndex: idx,
                            currentMessage: message,
                            currentChannel: currentChannel,
                        }), chainTop = _a.chainTop, chainBottom = _a.chainBottom, hasSeparator = _a.hasSeparator;
                        var isOutgoingMessage = index.isSendableMessage(message) && message.sender.userId === store.config.userId;
                        return (React.createElement(Message_context.MessageProvider, { message: message, key: utils.getComponentKeyFromMessage(message), isByMe: isOutgoingMessage }, renderMessage({
                            handleScroll: onMessageContentSizeChanged,
                            message: message,
                            hasSeparator: hasSeparator,
                            chainTop: chainTop,
                            chainBottom: chainBottom,
                            renderMessageContent: renderMessageContent,
                            renderCustomSeparator: renderCustomSeparator,
                        })));
                    }),
                    !hasNext()
                        && ((_c = (_b = store === null || store === void 0 ? void 0 : store.config) === null || _b === void 0 ? void 0 : _b.groupChannel) === null || _c === void 0 ? void 0 : _c.enableTypingIndicator)
                        && ((_f = (_e = (_d = store === null || store === void 0 ? void 0 : store.config) === null || _d === void 0 ? void 0 : _d.groupChannel) === null || _e === void 0 ? void 0 : _e.typingIndicatorTypes) === null || _f === void 0 ? void 0 : _f.has(types.TypingIndicatorType.Bubble)) && (React.createElement(TypingIndicatorBubbleWrapper, { channelUrl: channelUrl, handleScroll: onMessageContentSizeChanged })))),
            React.createElement(React.Fragment, null, renderer.frozenNotification()),
            React.createElement(React.Fragment, null, renderer.unreadMessagesNotification()),
            React.createElement(React.Fragment, null, renderer.scrollToBottomButton()))));
};
var TypingIndicatorBubbleWrapper = function (props) {
    var stores = useSendbirdStateContext.useSendbirdStateContext().stores;
    var _a = React.useState([]), typingMembers = _a[0], setTypingMembers = _a[1];
    uikitTools.useGroupChannelHandler(stores.sdkStore.sdk, {
        onTypingStatusUpdated: function (channel) {
            if (channel.url === props.channelUrl) {
                setTypingMembers(channel.getTypingUsers());
            }
        },
    });
    return React.createElement(ui_TypingIndicatorBubble, { typingMembers: typingMembers, handleScroll: props.handleScroll });
};

exports.MessageList = MessageList;
exports.default = MessageList;
//# sourceMappingURL=MessageList.js.map

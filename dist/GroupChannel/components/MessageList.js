import { _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default, { useEffect, useState } from 'react';
import { useGroupChannelHandler } from '@sendbird/uikit-tools';
import { f as isSendableMessage } from '../../chunks/bundle-WrTlYypL.js';
import { T as TypingIndicatorType } from '../../chunks/bundle-djjOQJpz.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import { Message } from './Message.js';
import { getMessagePartsInfo } from '../../Channel/utils/getMessagePartsInfo.js';
import { UnreadCount } from './UnreadCount.js';
import { FrozenNotification } from './FrozenNotification.js';
import { S as SCROLL_BUFFER } from '../../chunks/bundle-1CfFFBx9.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { MessageProvider } from '../../Message/context.js';
import { useGroupChannelContext } from '../context.js';
import TypingIndicatorBubble from '../../ui/TypingIndicatorBubble.js';
import { g as getComponentKeyFromMessage } from '../../chunks/bundle-7nLQi_YH.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-Dv-ua0wB.js';
import '../../chunks/bundle-ePTRDi6d.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../withSendbird.js';
import '../../ui/MessageContent.js';
import '../../chunks/bundle-FTNAU8Uq.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../ui/MessageItemMenu.js';
import '../../ui/ContextMenu.js';
import 'react-dom';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-AGNrfX7p.js';
import '../../ui/MessageItemReactionMenu.js';
import '../../ui/ImageRenderer.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle--BlhOpUS.js';
import '../../ui/UserListItem.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../ui/AdminMessage.js';
import '../../ui/QuoteMessage.js';
import '../../chunks/bundle-S6OaNh10.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-Z-iEmjEQ.js';
import '../../ui/ThreadReplies.js';
import '../../ui/OGMessageItemBody.js';
import '../../chunks/bundle-1q5AhvE7.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../ui/TextMessageItemBody.js';
import '../../ui/FileMessageItemBody.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-2C9iP99S.js';
import '../../chunks/bundle-YfeG6LQ5.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/ThumbnailMessageItemBody.js';
import '../../ui/UnknownMessageItemBody.js';
import '../../ui/FeedbackIconButton.js';
import '../../ui/MobileFeedbackMenu.js';
import '../../Channel/components/MessageFeedbackModal.js';
import '../../ui/Input.js';
import './SuggestedReplies.js';
import '../../chunks/bundle-VwofrwBu.js';
import './FileViewer.js';
import '../../chunks/bundle-thfg3MZH.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-WFlcI9AO.js';
import '../../chunks/bundle-H77M-_wK.js';
import '../../chunks/bundle-6aMfjTWv.js';
import '../../chunks/bundle-_6EZcp4H.js';
import './RemoveMessageModal.js';
import '../../chunks/bundle-4fSjujOF.js';
import '../../chunks/bundle-zcfKjxS7.js';
import '../../Channel/utils/compareMessagesForGrouping.js';

function useScrollBehavior() {
    var _a = useGroupChannelContext(), scrollRef = _a.scrollRef, _b = _a.scrollBehavior, scrollBehavior = _b === void 0 ? 'auto' : _b;
    useEffect(function () {
        if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = scrollBehavior;
        }
    }, [scrollRef.current]);
    return null;
}

var MessageList = function (_a) {
    var _b, _c, _d, _e, _f;
    var _g = _a.className, className = _g === void 0 ? '' : _g, _h = _a.renderMessage, renderMessage = _h === void 0 ? function (props) { return React__default.createElement(Message, __assign({}, props)); } : _h, renderMessageContent = _a.renderMessageContent, renderCustomSeparator = _a.renderCustomSeparator, _j = _a.renderPlaceholderLoader, renderPlaceholderLoader = _j === void 0 ? function () { return React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.LOADING }); } : _j, _k = _a.renderPlaceholderEmpty, renderPlaceholderEmpty = _k === void 0 ? function () { return React__default.createElement(PlaceHolder, { className: "sendbird-conversation__no-messages", type: PlaceHolderTypes.NO_MESSAGES }); } : _k, _l = _a.renderFrozenNotification, renderFrozenNotification = _l === void 0 ? function () { return React__default.createElement(FrozenNotification, { className: "sendbird-conversation__messages__notification" }); } : _l;
    var _m = useGroupChannelContext(), channelUrl = _m.channelUrl, hasNext = _m.hasNext, loading = _m.loading, messages = _m.messages, newMessages = _m.newMessages, scrollToBottom = _m.scrollToBottom, isScrollBottomReached = _m.isScrollBottomReached, isMessageGroupingEnabled = _m.isMessageGroupingEnabled, scrollRef = _m.scrollRef, scrollDistanceFromBottomRef = _m.scrollDistanceFromBottomRef, currentChannel = _m.currentChannel, replyType = _m.replyType, scrollPubSub = _m.scrollPubSub;
    var store = useSendbirdStateContext();
    var _o = useState(), unreadSinceDate = _o[0], setUnreadSinceDate = _o[1];
    useScrollBehavior();
    useEffect(function () {
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
            if (latestDistance < currentDistance && (!isBottomMessageAffected || latestDistance < SCROLL_BUFFER)) {
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
            return (React__default.createElement(UnreadCount, { className: "sendbird-conversation__messages__notification", count: newMessages.length, lastReadAt: unreadSinceDate, onClick: scrollToBottom }));
        },
        scrollToBottomButton: function () {
            if (!hasNext() && isScrollBottomReached)
                return null;
            return (React__default.createElement("div", { className: "sendbird-conversation__scroll-bottom-button", onClick: scrollToBottom, onKeyDown: scrollToBottom, tabIndex: 0, role: "button" },
                React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.CHEVRON_DOWN, fillColor: IconColors.PRIMARY })));
        },
    };
    if (loading) {
        return renderPlaceholderLoader();
    }
    if (messages.length === 0) {
        return renderPlaceholderEmpty();
    }
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "sendbird-conversation__messages ".concat(className) },
            React__default.createElement("div", { className: "sendbird-conversation__scroll-container" },
                React__default.createElement("div", { className: "sendbird-conversation__padding" }),
                React__default.createElement("div", { className: "sendbird-conversation__messages-padding", ref: scrollRef },
                    messages.map(function (message, idx) {
                        var _a = getMessagePartsInfo({
                            allMessages: messages,
                            replyType: replyType,
                            isMessageGroupingEnabled: isMessageGroupingEnabled,
                            currentIndex: idx,
                            currentMessage: message,
                            currentChannel: currentChannel,
                        }), chainTop = _a.chainTop, chainBottom = _a.chainBottom, hasSeparator = _a.hasSeparator;
                        var isOutgoingMessage = isSendableMessage(message) && message.sender.userId === store.config.userId;
                        return (React__default.createElement(MessageProvider, { message: message, key: getComponentKeyFromMessage(message), isByMe: isOutgoingMessage }, renderMessage({
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
                        && ((_f = (_e = (_d = store === null || store === void 0 ? void 0 : store.config) === null || _d === void 0 ? void 0 : _d.groupChannel) === null || _e === void 0 ? void 0 : _e.typingIndicatorTypes) === null || _f === void 0 ? void 0 : _f.has(TypingIndicatorType.Bubble)) && (React__default.createElement(TypingIndicatorBubbleWrapper, { channelUrl: channelUrl, handleScroll: onMessageContentSizeChanged })))),
            React__default.createElement(React__default.Fragment, null, renderer.frozenNotification()),
            React__default.createElement(React__default.Fragment, null, renderer.unreadMessagesNotification()),
            React__default.createElement(React__default.Fragment, null, renderer.scrollToBottomButton()))));
};
var TypingIndicatorBubbleWrapper = function (props) {
    var stores = useSendbirdStateContext().stores;
    var _a = useState([]), typingMembers = _a[0], setTypingMembers = _a[1];
    useGroupChannelHandler(stores.sdkStore.sdk, {
        onTypingStatusUpdated: function (channel) {
            if (channel.url === props.channelUrl) {
                setTypingMembers(channel.getTypingUsers());
            }
        },
    });
    return React__default.createElement(TypingIndicatorBubble, { typingMembers: typingMembers, handleScroll: props.handleScroll });
};

export { MessageList, MessageList as default };
//# sourceMappingURL=MessageList.js.map

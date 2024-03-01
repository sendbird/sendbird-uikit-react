import React__default, { useMemo } from 'react';
import ThreadListItem from './ThreadListItem.js';
import { useThreadContext } from '../context.js';
import { compareMessagesForGrouping } from '../../Channel/utils/compareMessagesForGrouping.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { isSameDay } from 'date-fns';
import { MessageProvider } from '../../Message/context.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-ePTRDi6d.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-zKLRntCV.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-zcfKjxS7.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-YfeG6LQ5.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-P_s1ZfLh.js';
import '../../chunks/bundle-VwofrwBu.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../context/types.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../withSendbird.js';
import '../../ui/MessageItemMenu.js';
import '../../chunks/bundle-AGNrfX7p.js';
import '../../ui/MessageItemReactionMenu.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../chunks/bundle-FTNAU8Uq.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/BottomSheet.js';
import '../../ui/UserListItem.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../ui/TextMessageItemBody.js';
import '../../chunks/bundle-1q5AhvE7.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../ui/OGMessageItemBody.js';
import '../../ui/FileMessageItemBody.js';
import '../../ui/TextButton.js';
import '../../ui/ThumbnailMessageItemBody.js';
import '../../chunks/bundle-S6OaNh10.js';
import '../../ui/UnknownMessageItemBody.js';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../chunks/bundle-Z-iEmjEQ.js';
import '../../chunks/bundle-2C9iP99S.js';
import '@sendbird/chat/message';
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../chunks/bundle-inBt684F.js';
import '../../chunks/bundle-EHXBDBJS.js';
import '../../chunks/bundle-H77M-_wK.js';
import '@sendbird/chat';
import '../../chunks/bundle-iWB7G7Jl.js';
import '../../chunks/bundle-_WuZnpi-.js';

function ThreadList(_a) {
    var className = _a.className, renderMessage = _a.renderMessage, renderCustomSeparator = _a.renderCustomSeparator, scrollRef = _a.scrollRef, scrollBottom = _a.scrollBottom;
    var config = useSendbirdStateContext().config;
    var replyType = config.replyType, userId = config.userId;
    var _b = useThreadContext(), currentChannel = _b.currentChannel, allThreadMessages = _b.allThreadMessages, localThreadMessages = _b.localThreadMessages;
    var MemorizedMessage = useMemo(function () { return function (_a) {
        var message = _a.message, chainTop = _a.chainTop, chainBottom = _a.chainBottom, hasSeparator = _a.hasSeparator;
        if (typeof renderMessage === 'function') {
            return renderMessage({
                message: message,
                chainTop: chainTop,
                chainBottom: chainBottom,
                hasSeparator: hasSeparator,
            });
        }
        return null;
    }; }, [renderMessage]);
    return (React__default.createElement("div", { className: "sendbird-thread-list ".concat(className) },
        allThreadMessages.map(function (message, idx) {
            var _a;
            var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
            var prevMessage = allThreadMessages[idx - 1];
            var nextMessage = allThreadMessages[idx + 1];
            // eslint-disable-next-line no-constant-condition
            var _b = compareMessagesForGrouping(prevMessage, message, nextMessage, currentChannel, replyType)
                , chainTop = _b[0], chainBottom = _b[1];
            var hasSeparator = !((prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt) > 0 && (isSameDay(message === null || message === void 0 ? void 0 : message.createdAt, prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt)));
            var handleScroll = function () {
                var current = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
                if (current) {
                    var bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
                    if (scrollBottom < bottom) {
                        current.scrollTop += bottom - scrollBottom;
                    }
                }
            };
            return (React__default.createElement(MessageProvider, { message: message, isByMe: isByMe, key: message === null || message === void 0 ? void 0 : message.messageId }, MemorizedMessage({
                message: message,
                chainTop: chainTop,
                chainBottom: chainBottom,
                hasSeparator: hasSeparator,
            }) || (React__default.createElement(ThreadListItem, { message: message, chainTop: chainTop, chainBottom: chainBottom, hasSeparator: hasSeparator, renderCustomSeparator: renderCustomSeparator, handleScroll: handleScroll }))));
        }),
        localThreadMessages.map(function (message, idx) {
            var _a;
            var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
            var prevMessage = localThreadMessages[idx - 1];
            var nextMessage = localThreadMessages[idx + 1];
            // eslint-disable-next-line no-constant-condition
            var _b = compareMessagesForGrouping(prevMessage, message, nextMessage, currentChannel, replyType)
                , chainTop = _b[0], chainBottom = _b[1];
            var hasSeparator = !((prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt) > 0 && (isSameDay(message === null || message === void 0 ? void 0 : message.createdAt, prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt)));
            var handleScroll = function () {
                var current = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
                if (current) {
                    var bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
                    if (scrollBottom < bottom) {
                        current.scrollTop += bottom - scrollBottom;
                    }
                }
            };
            return (React__default.createElement(MessageProvider, { message: message, isByMe: isByMe, key: message === null || message === void 0 ? void 0 : message.messageId }, MemorizedMessage({
                message: message,
                chainTop: chainTop,
                chainBottom: chainBottom,
                hasSeparator: hasSeparator,
            }) || (React__default.createElement(ThreadListItem, { message: message, hasSeparator: false, renderCustomSeparator: renderCustomSeparator, handleScroll: handleScroll }))));
        })));
}

export { ThreadList as default };
//# sourceMappingURL=ThreadList.js.map

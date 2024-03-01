import React__default, { useMemo, useState, useRef } from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import { g as getChannelTitle } from '../../chunks/bundle-_9Y5-6si.js';
import { useThreadContext } from '../context.js';
import ParentMessageInfo from './ParentMessageInfo.js';
import ThreadHeader from './ThreadHeader.js';
import ThreadList from './ThreadList.js';
import ThreadMessageInput from './ThreadMessageInput.js';
import { ParentMessageStateTypes, ThreadListStateTypes } from '../context/types.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import { i as isAboutSame } from '../../chunks/bundle-EHXBDBJS.js';
import { MessageProvider } from '../../Message/context.js';
import '../../withSendbird.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '@sendbird/chat';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle-iWB7G7Jl.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-ePTRDi6d.js';
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
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import './ParentMessageInfoItem.js';
import '../../ui/ImageRenderer.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../ui/UserListItem.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-1q5AhvE7.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-2C9iP99S.js';
import '../../chunks/bundle-YfeG6LQ5.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-H77M-_wK.js';
import '../../chunks/bundle-inBt684F.js';
import '../../chunks/bundle-P_s1ZfLh.js';
import '../../chunks/bundle-VwofrwBu.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../ui/MessageItemMenu.js';
import '../../chunks/bundle-AGNrfX7p.js';
import '../../ui/MessageItemReactionMenu.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../chunks/bundle-Z-iEmjEQ.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import './ThreadListItem.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-FTNAU8Uq.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../ui/TextMessageItemBody.js';
import '../../ui/OGMessageItemBody.js';
import '../../ui/FileMessageItemBody.js';
import '../../ui/ThumbnailMessageItemBody.js';
import '../../chunks/bundle-S6OaNh10.js';
import '../../ui/UnknownMessageItemBody.js';
import '../../Channel/utils/compareMessagesForGrouping.js';
import 'date-fns';
import '../../chunks/bundle-RbS_k--P.js';
import '../../chunks/bundle-7nLQi_YH.js';
import '../../GroupChannel/components/SuggestedMentionList.js';
import '../../ui/QuoteMessageInput.js';
import '../../VoiceRecorder/useVoiceRecorder.js';
import '../../chunks/bundle-Syx3NAbT.js';
import '../../GroupChannel/hooks/useHandleUploadFiles.js';
import '../../chunks/bundle-QJa2lTJw.js';
import '../../GroupChannel/context.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-WFlcI9AO.js';
import '../../chunks/bundle-6aMfjTWv.js';
import '../../chunks/bundle-_6EZcp4H.js';
import '../../Channel/hooks/useHandleUploadFiles.js';

var useMemorizedHeader = function (_a) {
    var renderHeader = _a.renderHeader;
    return useMemo(function () {
        if (typeof renderHeader === 'function') {
            return renderHeader();
        }
        return null;
    }, [renderHeader]);
};

var useMemorizedParentMessageInfo = function (_a) {
    var parentMessage = _a.parentMessage, parentMessageState = _a.parentMessageState, renderParentMessageInfo = _a.renderParentMessageInfo, renderParentMessageInfoPlaceholder = _a.renderParentMessageInfoPlaceholder;
    return useMemo(function () {
        if (parentMessageState === ParentMessageStateTypes.NIL
            || parentMessageState === ParentMessageStateTypes.LOADING
            || parentMessageState === ParentMessageStateTypes.INVALID) {
            if (typeof renderParentMessageInfoPlaceholder === 'function') {
                return renderParentMessageInfoPlaceholder(parentMessageState);
            }
            switch (parentMessageState) {
                case ParentMessageStateTypes.NIL: {
                    return (React__default.createElement(PlaceHolder, { className: "sendbird-thread-ui__parent-message-info placeholder-nil", type: PlaceHolderTypes.NO_RESULTS, iconSize: "64px" }));
                }
                case ParentMessageStateTypes.LOADING: {
                    return (React__default.createElement(PlaceHolder, { className: "sendbird-thread-ui__parent-message-info placeholder-loading", type: PlaceHolderTypes.LOADING, iconSize: "64px" }));
                }
                case ParentMessageStateTypes.INVALID: {
                    return (React__default.createElement(PlaceHolder, { className: "sendbird-thread-ui__parent-message-info placeholder-invalid", type: PlaceHolderTypes.WRONG, iconSize: "64px" }));
                }
                default: {
                    return null;
                }
            }
        }
        else if (parentMessageState === ParentMessageStateTypes.INITIALIZED) {
            if (typeof renderParentMessageInfo === 'function') {
                return renderParentMessageInfo();
            }
        }
        return null;
    }, [
        parentMessage,
        parentMessageState,
        renderParentMessageInfo,
        renderParentMessageInfoPlaceholder,
    ]);
};

var useMemorizedThreadList = function (_a) {
    var threadListState = _a.threadListState, renderThreadListPlaceHolder = _a.renderThreadListPlaceHolder;
    return useMemo(function () {
        if (threadListState === ThreadListStateTypes.NIL
            || threadListState === ThreadListStateTypes.LOADING
            || threadListState === ThreadListStateTypes.INVALID) {
            if (typeof renderThreadListPlaceHolder === 'function') {
                return renderThreadListPlaceHolder(threadListState);
            }
            switch (threadListState) {
                case ThreadListStateTypes.LOADING: {
                    return (React__default.createElement(PlaceHolder, { className: "sendbird-thread-ui__thread-list placeholder-loading", type: PlaceHolderTypes.LOADING, iconSize: "64px" }));
                }
                case ThreadListStateTypes.INVALID: {
                    return (React__default.createElement(PlaceHolder, { className: "sendbird-thread-ui__thread-list placeholder-invalid", type: PlaceHolderTypes.WRONG, iconSize: "64px" }));
                }
                case ThreadListStateTypes.NIL: {
                    return React__default.createElement(React__default.Fragment, null);
                }
                default: {
                    return null;
                }
            }
        }
        return null;
    }, [
        threadListState,
        renderThreadListPlaceHolder,
    ]);
};

var ThreadUI = function (_a) {
    var _b, _c, _d, _e;
    var renderHeader = _a.renderHeader, renderParentMessageInfo = _a.renderParentMessageInfo, renderMessage = _a.renderMessage, renderMessageInput = _a.renderMessageInput, renderCustomSeparator = _a.renderCustomSeparator, renderParentMessageInfoPlaceholder = _a.renderParentMessageInfoPlaceholder, renderThreadListPlaceHolder = _a.renderThreadListPlaceHolder, renderFileUploadIcon = _a.renderFileUploadIcon, renderVoiceMessageIcon = _a.renderVoiceMessageIcon, renderSendMessageIcon = _a.renderSendMessageIcon;
    var stores = useSendbirdStateContext().stores;
    var currentUserId = (_d = (_c = (_b = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk) === null || _c === void 0 ? void 0 : _c.currentUser) === null || _d === void 0 ? void 0 : _d.userId;
    var stringSet = useLocalization().stringSet;
    var _f = useThreadContext(), currentChannel = _f.currentChannel, allThreadMessages = _f.allThreadMessages, parentMessage = _f.parentMessage, parentMessageState = _f.parentMessageState, threadListState = _f.threadListState, hasMorePrev = _f.hasMorePrev, hasMoreNext = _f.hasMoreNext, fetchPrevThreads = _f.fetchPrevThreads, fetchNextThreads = _f.fetchNextThreads, onHeaderActionClick = _f.onHeaderActionClick, onMoveToParentMessage = _f.onMoveToParentMessage;
    var replyCount = allThreadMessages.length;
    var isByMe = currentUserId === ((_e = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _e === void 0 ? void 0 : _e.userId);
    // Memoized custom components
    var MemorizedHeader = useMemorizedHeader({ renderHeader: renderHeader });
    var MemorizedParentMessageInfo = useMemorizedParentMessageInfo({
        parentMessage: parentMessage,
        parentMessageState: parentMessageState,
        renderParentMessageInfo: renderParentMessageInfo,
        renderParentMessageInfoPlaceholder: renderParentMessageInfoPlaceholder,
    });
    var MemorizedThreadList = useMemorizedThreadList({
        threadListState: threadListState,
        renderThreadListPlaceHolder: renderThreadListPlaceHolder,
    });
    // scroll
    var _g = useState(0), scrollBottom = _g[0], setScrollBottom = _g[1];
    var scrollRef = useRef(null);
    var onScroll = function (e) {
        var _a;
        var element = e.target;
        var scrollTop = element.scrollTop, clientHeight = element.clientHeight, scrollHeight = element.scrollHeight;
        var threadItemNodes = (_a = scrollRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.sendbird-thread-list-item');
        var firstNode = threadItemNodes === null || threadItemNodes === void 0 ? void 0 : threadItemNodes[0];
        if (isAboutSame(scrollTop, 0, 10) && hasMorePrev) {
            fetchPrevThreads(function (messages) {
                var _a;
                if (messages) {
                    try {
                        (_a = firstNode === null || firstNode === void 0 ? void 0 : firstNode.scrollIntoView) === null || _a === void 0 ? void 0 : _a.call(firstNode, { block: 'start', inline: 'nearest' });
                    }
                    catch (error) {
                        //
                    }
                }
            });
        }
        if (isAboutSame(clientHeight + scrollTop, scrollHeight, 10) && hasMoreNext) {
            var scrollTop_1 = scrollTop;
            fetchNextThreads(function (messages) {
                if (messages) {
                    try {
                        element.scrollTop = scrollTop_1;
                        scrollRef.current.scrollTop = scrollTop_1;
                    }
                    catch (error) {
                        //
                    }
                }
            });
        }
        // save the lastest scroll bottom value
        if (scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) {
            var current = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
            setScrollBottom(current.scrollHeight - current.scrollTop - current.offsetHeight);
        }
    };
    return (React__default.createElement("div", { className: 'sendbird-thread-ui' },
        MemorizedHeader || (React__default.createElement(ThreadHeader, { className: "sendbird-thread-ui__header", channelName: getChannelTitle(currentChannel, currentUserId, stringSet), onActionIconClick: onHeaderActionClick, onChannelNameClick: function () {
                onMoveToParentMessage === null || onMoveToParentMessage === void 0 ? void 0 : onMoveToParentMessage({ message: parentMessage, channel: currentChannel });
            } })),
        React__default.createElement("div", { className: "sendbird-thread-ui--scroll", ref: scrollRef, onScroll: onScroll },
            React__default.createElement(MessageProvider, { message: parentMessage, isByMe: isByMe }, MemorizedParentMessageInfo || (React__default.createElement(ParentMessageInfo, { className: "sendbird-thread-ui__parent-message-info" }))),
            replyCount > 0 && (React__default.createElement("div", { className: "sendbird-thread-ui__reply-counts" },
                React__default.createElement(Label, { type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_3 }, "".concat(replyCount, " ").concat(replyCount > 1 ? stringSet.THREAD__THREAD_REPLIES : stringSet.THREAD__THREAD_REPLY)))),
            MemorizedThreadList || (React__default.createElement(ThreadList, { className: "sendbird-thread-ui__thread-list", renderMessage: renderMessage, renderCustomSeparator: renderCustomSeparator, scrollRef: scrollRef, scrollBottom: scrollBottom }))),
        (renderMessageInput === null || renderMessageInput === void 0 ? void 0 : renderMessageInput()) || (React__default.createElement(ThreadMessageInput, { className: "sendbird-thread-ui__message-input", renderFileUploadIcon: renderFileUploadIcon, renderVoiceMessageIcon: renderVoiceMessageIcon, renderSendMessageIcon: renderSendMessageIcon }))));
};

export { ThreadUI as default };
//# sourceMappingURL=ThreadUI.js.map

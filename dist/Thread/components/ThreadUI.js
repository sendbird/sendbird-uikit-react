import React__default, { useMemo, useState, useRef } from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-msnuMA4R.js';
import { g as getChannelTitle } from '../../chunks/bundle-YvC6HhRC.js';
import { useThreadContext } from '../context.js';
import ParentMessageInfo from './ParentMessageInfo.js';
import ThreadHeader from './ThreadHeader.js';
import ThreadList from './ThreadList.js';
import ThreadMessageInput from './ThreadMessageInput.js';
import { ParentMessageStateTypes, ThreadListStateTypes } from '../context/types.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-kMMCn6GE.js';
import { i as isAboutSame } from '../../chunks/bundle-DJdbc2nP.js';
import { MessageProvider } from '../../Message/context.js';
import '../../withSendbird.js';
import '../../chunks/bundle-KMsJXUN2.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '../../chunks/bundle-x78eEPy7.js';
import '@sendbird/chat';
import '../../chunks/bundle-THTV9S18.js';
import '../../chunks/bundle-Vkdvpta0.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-xlx3bBW8.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../chunks/bundle-vbGNKQpe.js';
import '../../chunks/bundle-kzKqUU0b.js';
import '../../chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-pZ049TQg.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-LZemF1A7.js';
import './ParentMessageInfoItem.js';
import '../../ui/ImageRenderer.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nGuCRoDK.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-3iFqiLDd.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../ui/UserListItem.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-8TMXvllw.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-AjBmMBJ5.js';
import '../../chunks/bundle-pODFB39J.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-pWK0f3qD.js';
import '../../chunks/bundle-13MqUbIu.js';
import '../../chunks/bundle-HUsfnqzD.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-fO5XIU5Y.js';
import '../../chunks/bundle-ay4_3U9k.js';
import '../../chunks/bundle-6HzeOqth.js';
import '../../chunks/bundle-CLnDoxQc.js';
import '../../chunks/bundle-hKmRj7Ck.js';
import '../../chunks/bundle-NOh3ukH6.js';
import '../../ui/MessageItemMenu.js';
import '../../chunks/bundle-lJ2SrsKF.js';
import '../../ui/MessageItemReactionMenu.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-1uBgZh_D.js';
import 'dompurify';
import '../../chunks/bundle-qauKidkr.js';
import '../../chunks/bundle-wf7f-9LT.js';
import '../../chunks/bundle-cMznkLt0.js';
import '../../chunks/bundle-m-u0cD67.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import './ThreadListItem.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-GQ4rK0ER.js';
import '../../chunks/bundle-vWrgNSvP.js';
import '../../chunks/bundle-SpfAN5pr.js';
import '../../ui/TextMessageItemBody.js';
import '../../ui/OGMessageItemBody.js';
import '../../ui/FileMessageItemBody.js';
import '../../ui/ThumbnailMessageItemBody.js';
import '../../chunks/bundle--jWawO0i.js';
import '../../ui/UnknownMessageItemBody.js';
import '../../Channel/utils/compareMessagesForGrouping.js';
import 'date-fns';
import '../../chunks/bundle-zv656l7I.js';
import '../../chunks/bundle-38Dx0S9V.js';
import '../../GroupChannel/components/SuggestedMentionList.js';
import '../../ui/QuoteMessageInput.js';
import '../../VoiceRecorder/useVoiceRecorder.js';
import '../../chunks/bundle-M3g0UgDk.js';
import '../../GroupChannel/hooks/useHandleUploadFiles.js';
import '../../chunks/bundle-J4Twjc27.js';
import '../../GroupChannel/context.js';
import '../../chunks/bundle-TLAngIsc.js';
import '../../chunks/bundle-4Q6J8UBD.js';
import '../../chunks/bundle-lPKA2RTf.js';
import '../../chunks/bundle-JMVaVraV.js';
import '../../chunks/bundle-i4OMePA5.js';
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

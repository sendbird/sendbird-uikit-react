'use strict';

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var utils = require('../../chunks/bundle-ZXiz-rp_.js');
var Thread_context = require('../context.js');
var Thread_components_ParentMessageInfo = require('./ParentMessageInfo.js');
var Thread_components_ThreadHeader = require('./ThreadHeader.js');
var Thread_components_ThreadList = require('./ThreadList.js');
var Thread_components_ThreadMessageInput = require('./ThreadMessageInput.js');
var Thread_context_types = require('../context/types.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var useSendMultipleFilesMessage = require('../../chunks/bundle-Q5GNNUqM.js');
var Message_context = require('../../Message/context.js');
require('../../withSendbird.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-uzKywAVp.js');
require('@sendbird/chat');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-a7LVpeCR.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-Wt6H25kL.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-gOYUXAiI.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('./ParentMessageInfoItem.js');
require('../../ui/ImageRenderer.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../ui/EmojiReactions.js');
require('../../ui/ReactionBadge.js');
require('../../ui/ReactionButton.js');
require('../../chunks/bundle-pOf7PZ4G.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../ui/BottomSheet.js');
require('../../hooks/useModal.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../ui/VoiceMessageItemBody.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-jXnX-7jH.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-DqKLlsGU.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-wezC76id.js');
require('../../chunks/bundle-s5WIvT8N.js');
require('../../chunks/bundle-noP7JXqE.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-6xWNZugu.js');
require('../../chunks/bundle-JLP3WF2h.js');
require('../../chunks/bundle-vs1IDbbN.js');
require('../../chunks/bundle-rYFzQpzQ.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../ui/MessageItemMenu.js');
require('../../chunks/bundle-K3wEmKTu.js');
require('../../ui/MessageItemReactionMenu.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../chunks/bundle-m5pFb_tZ.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('./ThreadListItem.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-VehpyAT7.js');
require('../../chunks/bundle-_wF3sJvp.js');
require('../../chunks/bundle-iPt3h7ba.js');
require('../../ui/TextMessageItemBody.js');
require('../../ui/OGMessageItemBody.js');
require('../../ui/FileMessageItemBody.js');
require('../../ui/ThumbnailMessageItemBody.js');
require('../../chunks/bundle--4Ob_RGQ.js');
require('../../ui/UnknownMessageItemBody.js');
require('../../Channel/utils/compareMessagesForGrouping.js');
require('date-fns');
require('../../chunks/bundle-Xa3hXyhu.js');
require('../../chunks/bundle-U2YYVRfT.js');
require('../../GroupChannel/components/SuggestedMentionList.js');
require('../../ui/QuoteMessageInput.js');
require('../../VoiceRecorder/useVoiceRecorder.js');
require('../../chunks/bundle-pKCe2hVu.js');
require('../../GroupChannel/hooks/useHandleUploadFiles.js');
require('../../chunks/bundle-a5LHhP6m.js');
require('../../GroupChannel/context.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-48AiK3oz.js');
require('../../chunks/bundle-Zw2P8RwZ.js');
require('../../chunks/bundle-2xXFQXmk.js');
require('../../Channel/hooks/useHandleUploadFiles.js');

var useMemorizedHeader = function (_a) {
    var renderHeader = _a.renderHeader;
    return React.useMemo(function () {
        if (typeof renderHeader === 'function') {
            return renderHeader();
        }
        return null;
    }, [renderHeader]);
};

var useMemorizedParentMessageInfo = function (_a) {
    var parentMessage = _a.parentMessage, parentMessageState = _a.parentMessageState, renderParentMessageInfo = _a.renderParentMessageInfo, renderParentMessageInfoPlaceholder = _a.renderParentMessageInfoPlaceholder;
    return React.useMemo(function () {
        if (parentMessageState === Thread_context_types.ParentMessageStateTypes.NIL
            || parentMessageState === Thread_context_types.ParentMessageStateTypes.LOADING
            || parentMessageState === Thread_context_types.ParentMessageStateTypes.INVALID) {
            if (typeof renderParentMessageInfoPlaceholder === 'function') {
                return renderParentMessageInfoPlaceholder(parentMessageState);
            }
            switch (parentMessageState) {
                case Thread_context_types.ParentMessageStateTypes.NIL: {
                    return (React.createElement(ui_PlaceHolder.default, { className: "sendbird-thread-ui__parent-message-info placeholder-nil", type: ui_PlaceHolder.PlaceHolderTypes.NO_RESULTS, iconSize: "64px" }));
                }
                case Thread_context_types.ParentMessageStateTypes.LOADING: {
                    return (React.createElement(ui_PlaceHolder.default, { className: "sendbird-thread-ui__parent-message-info placeholder-loading", type: ui_PlaceHolder.PlaceHolderTypes.LOADING, iconSize: "64px" }));
                }
                case Thread_context_types.ParentMessageStateTypes.INVALID: {
                    return (React.createElement(ui_PlaceHolder.default, { className: "sendbird-thread-ui__parent-message-info placeholder-invalid", type: ui_PlaceHolder.PlaceHolderTypes.WRONG, iconSize: "64px" }));
                }
                default: {
                    return null;
                }
            }
        }
        else if (parentMessageState === Thread_context_types.ParentMessageStateTypes.INITIALIZED) {
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
    return React.useMemo(function () {
        if (threadListState === Thread_context_types.ThreadListStateTypes.NIL
            || threadListState === Thread_context_types.ThreadListStateTypes.LOADING
            || threadListState === Thread_context_types.ThreadListStateTypes.INVALID) {
            if (typeof renderThreadListPlaceHolder === 'function') {
                return renderThreadListPlaceHolder(threadListState);
            }
            switch (threadListState) {
                case Thread_context_types.ThreadListStateTypes.LOADING: {
                    return (React.createElement(ui_PlaceHolder.default, { className: "sendbird-thread-ui__thread-list placeholder-loading", type: ui_PlaceHolder.PlaceHolderTypes.LOADING, iconSize: "64px" }));
                }
                case Thread_context_types.ThreadListStateTypes.INVALID: {
                    return (React.createElement(ui_PlaceHolder.default, { className: "sendbird-thread-ui__thread-list placeholder-invalid", type: ui_PlaceHolder.PlaceHolderTypes.WRONG, iconSize: "64px" }));
                }
                case Thread_context_types.ThreadListStateTypes.NIL: {
                    return React.createElement(React.Fragment, null);
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
    var stores = useSendbirdStateContext.useSendbirdStateContext().stores;
    var currentUserId = (_d = (_c = (_b = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk) === null || _c === void 0 ? void 0 : _c.currentUser) === null || _d === void 0 ? void 0 : _d.userId;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var _f = Thread_context.useThreadContext(), currentChannel = _f.currentChannel, allThreadMessages = _f.allThreadMessages, parentMessage = _f.parentMessage, parentMessageState = _f.parentMessageState, threadListState = _f.threadListState, hasMorePrev = _f.hasMorePrev, hasMoreNext = _f.hasMoreNext, fetchPrevThreads = _f.fetchPrevThreads, fetchNextThreads = _f.fetchNextThreads, onHeaderActionClick = _f.onHeaderActionClick, onMoveToParentMessage = _f.onMoveToParentMessage;
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
    var _g = React.useState(0), scrollBottom = _g[0], setScrollBottom = _g[1];
    var scrollRef = React.useRef(null);
    var onScroll = function (e) {
        var _a;
        var element = e.target;
        var scrollTop = element.scrollTop, clientHeight = element.clientHeight, scrollHeight = element.scrollHeight;
        var threadItemNodes = (_a = scrollRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.sendbird-thread-list-item');
        var firstNode = threadItemNodes === null || threadItemNodes === void 0 ? void 0 : threadItemNodes[0];
        if (useSendMultipleFilesMessage.isAboutSame(scrollTop, 0, 10) && hasMorePrev) {
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
        if (useSendMultipleFilesMessage.isAboutSame(clientHeight + scrollTop, scrollHeight, 10) && hasMoreNext) {
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
    return (React.createElement("div", { className: 'sendbird-thread-ui' },
        MemorizedHeader || (React.createElement(Thread_components_ThreadHeader, { className: "sendbird-thread-ui__header", channelName: utils.getChannelTitle(currentChannel, currentUserId, stringSet), onActionIconClick: onHeaderActionClick, onChannelNameClick: function () {
                onMoveToParentMessage === null || onMoveToParentMessage === void 0 ? void 0 : onMoveToParentMessage({ message: parentMessage, channel: currentChannel });
            } })),
        React.createElement("div", { className: "sendbird-thread-ui--scroll", ref: scrollRef, onScroll: onScroll },
            React.createElement(Message_context.MessageProvider, { message: parentMessage, isByMe: isByMe }, MemorizedParentMessageInfo || (React.createElement(Thread_components_ParentMessageInfo, { className: "sendbird-thread-ui__parent-message-info" }))),
            replyCount > 0 && (React.createElement("div", { className: "sendbird-thread-ui__reply-counts" },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_3 }, "".concat(replyCount, " ").concat(replyCount > 1 ? stringSet.THREAD__THREAD_REPLIES : stringSet.THREAD__THREAD_REPLY)))),
            MemorizedThreadList || (React.createElement(Thread_components_ThreadList, { className: "sendbird-thread-ui__thread-list", renderMessage: renderMessage, renderCustomSeparator: renderCustomSeparator, scrollRef: scrollRef, scrollBottom: scrollBottom }))),
        (renderMessageInput === null || renderMessageInput === void 0 ? void 0 : renderMessageInput()) || (React.createElement(Thread_components_ThreadMessageInput, { className: "sendbird-thread-ui__message-input", renderFileUploadIcon: renderFileUploadIcon, renderVoiceMessageIcon: renderVoiceMessageIcon, renderSendMessageIcon: renderSendMessageIcon }))));
};

module.exports = ThreadUI;
//# sourceMappingURL=ThreadUI.js.map

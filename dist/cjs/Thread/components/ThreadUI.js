'use strict';

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var utils = require('../../chunks/bundle-sMN62IQs.js');
var Thread_context = require('../context.js');
var Thread_components_ParentMessageInfo = require('./ParentMessageInfo.js');
var Thread_components_ThreadHeader = require('./ThreadHeader.js');
var Thread_components_ThreadList = require('./ThreadList.js');
var Thread_components_ThreadMessageInput = require('./ThreadMessageInput.js');
var Thread_context_types = require('../context/types.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var ui_Label = require('../../chunks/bundle-26QzFMMl.js');
var useSendMultipleFilesMessage = require('../../chunks/bundle-xgiAxHSr.js');
var Message_context = require('../../Message/context.js');
require('../../withSendbird.js');
require('../../chunks/bundle-2dG9SU7T.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-DKcL-93i.js');
require('@sendbird/chat');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-XgxbsHav.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-ZoEtk6Hz.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-Ny3NKw-X.js');
require('../../chunks/bundle-ulZ-c4e6.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-_t5Ozfpd.js');
require('../../chunks/bundle-wzulmlgb.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('./ParentMessageInfoItem.js');
require('../../ui/ImageRenderer.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-KNt569rP.js');
require('../../ui/EmojiReactions.js');
require('../../ui/ReactionBadge.js');
require('../../ui/ReactionButton.js');
require('../../chunks/bundle-Kz-b8WGm.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../ui/BottomSheet.js');
require('../../hooks/useModal.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../ui/VoiceMessageItemBody.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-C8zLDVXs.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-TSHHC3WX.js');
require('../../chunks/bundle-Q2J-7okW.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-Oj0T8nIQ.js');
require('../../chunks/bundle-x2xJziaA.js');
require('../../chunks/bundle-A_ipX_Gf.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-eDrjbSc-.js');
require('../../chunks/bundle-FMwBmvVd.js');
require('../../chunks/bundle-Zp3OkE8e.js');
require('../../chunks/bundle-isZYiJlA.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../chunks/bundle-m-c1V2jE.js');
require('../../ui/MessageItemMenu.js');
require('../../chunks/bundle-a0KHaUDZ.js');
require('../../ui/MessageItemReactionMenu.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-jh--qeoy.js');
require('dompurify');
require('../../chunks/bundle-9O_6GMbC.js');
require('../../chunks/bundle-q13fOZ_V.js');
require('../../chunks/bundle-TCEkQl9R.js');
require('../../chunks/bundle-VLUCx6pj.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('./ThreadListItem.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-1dlTcCK5.js');
require('../../chunks/bundle-Z1maM5mk.js');
require('../../chunks/bundle-LQQkMjKl.js');
require('../../ui/TextMessageItemBody.js');
require('../../ui/OGMessageItemBody.js');
require('../../ui/FileMessageItemBody.js');
require('../../ui/ThumbnailMessageItemBody.js');
require('../../chunks/bundle-38g4arE5.js');
require('../../ui/UnknownMessageItemBody.js');
require('../../Channel/utils/compareMessagesForGrouping.js');
require('date-fns');
require('../../chunks/bundle-ANsbY5YP.js');
require('../../chunks/bundle-MGhVSK7j.js');
require('../../GroupChannel/components/SuggestedMentionList.js');
require('../../ui/QuoteMessageInput.js');
require('../../VoiceRecorder/useVoiceRecorder.js');
require('../../chunks/bundle-1LKSecgr.js');
require('../../GroupChannel/hooks/useHandleUploadFiles.js');
require('../../chunks/bundle-Z1BkfIY5.js');
require('../../GroupChannel/context.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-A90WNbHn.js');
require('../../chunks/bundle-Gu74ZSrJ.js');
require('../../chunks/bundle-4TXS0UcW.js');
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

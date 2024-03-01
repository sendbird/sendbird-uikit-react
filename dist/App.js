import React__default, { useState, useEffect } from 'react';
import { SendbirdProvider } from './SendbirdProvider.js';
import { u as useMediaQueryContext } from './chunks/bundle-qlkGlvyT.js';
import { _ as __assign } from './chunks/bundle-UnAcr6wX.js';
import { GroupChannel } from './GroupChannel.js';
import { GroupChannelList } from './GroupChannelList.js';
import Channel from './Channel.js';
import ChannelList from './ChannelList.js';
import ChannelSettings from './ChannelSettings.js';
import MessageSearchPannel from './MessageSearch.js';
import Thread from './Thread.js';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { useSendbirdStateContext } from './useSendbirdStateContext.js';
import { u as uuidv4 } from './chunks/bundle-0Kp88b8b.js';
import { u as useVoicePlayerContext, a as ALL } from './chunks/bundle-r7HG_ptO.js';
import '@sendbird/uikit-tools';
import './withSendbird.js';
import 'css-vars-ponyfill';
import './chunks/bundle-UuydkZ4A.js';
import './chunks/bundle-cjOTjxeU.js';
import './chunks/bundle-TqITKNRx.js';
import '@sendbird/chat';
import '@sendbird/chat/openChannel';
import './chunks/bundle-WrTlYypL.js';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-CRwhglru.js';
import './chunks/bundle-_6EZcp4H.js';
import './VoiceRecorder/context.js';
import './chunks/bundle-hS8Jw8F1.js';
import './chunks/bundle-PIrj5Rm1.js';
import './chunks/bundle-8u3PnqsX.js';
import './chunks/bundle--BlhOpUS.js';
import 'react-dom';
import './ui/IconButton.js';
import './ui/Button.js';
import './chunks/bundle-ljRDDTki.js';
import './ui/Icon.js';
import './chunks/bundle-1CfFFBx9.js';
import './chunks/bundle-iU7PXFos.js';
import './hooks/useModal.js';
import './GroupChannel/context.js';
import '@sendbird/chat/message';
import './chunks/bundle-jDtVwIPR.js';
import './chunks/bundle-XFxecIn0.js';
import './chunks/bundle-7nLQi_YH.js';
import './chunks/bundle-WFlcI9AO.js';
import './chunks/bundle-H77M-_wK.js';
import './chunks/bundle-6aMfjTWv.js';
import './chunks/bundle-7BSf_PUT.js';
import './GroupChannel/components/GroupChannelUI.js';
import './chunks/bundle-2nnZrM7w.js';
import './GroupChannel/components/TypingIndicator.js';
import './chunks/bundle-djjOQJpz.js';
import './ui/ConnectionStatus.js';
import './ui/PlaceHolder.js';
import './ui/Loader.js';
import './GroupChannel/components/GroupChannelHeader.js';
import './chunks/bundle-6uJ_roBM.js';
import './ui/ChannelAvatar.js';
import './chunks/bundle-LbQw2cVx.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-fNigAmmf.js';
import './chunks/bundle-k8wZLjPN.js';
import './chunks/bundle-_9Y5-6si.js';
import './GroupChannel/components/MessageList.js';
import './GroupChannel/components/Message.js';
import './chunks/bundle-Dv-ua0wB.js';
import './chunks/bundle-ePTRDi6d.js';
import './chunks/bundle--NfXT-0k.js';
import './Message/hooks/useDirtyGetMentions.js';
import './ui/DateSeparator.js';
import './chunks/bundle-02rQraFs.js';
import './ui/MessageInput.js';
import './chunks/bundle-NK74hfcu.js';
import './chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import './chunks/bundle-v7DbCTsH.js';
import './chunks/bundle-BInhYJCq.js';
import './chunks/bundle-D_x1OSEQ.js';
import './chunks/bundle-coC6nc_5.js';
import './ui/MessageContent.js';
import './chunks/bundle-FTNAU8Uq.js';
import './chunks/bundle-uq2crLI0.js';
import './chunks/bundle-6_aRz_Ld.js';
import './ui/MessageItemMenu.js';
import './ui/ContextMenu.js';
import './ui/SortByRow.js';
import './chunks/bundle-AGNrfX7p.js';
import './ui/MessageItemReactionMenu.js';
import './ui/ReactionButton.js';
import './chunks/bundle-okHpD60h.js';
import './ui/EmojiReactions.js';
import './ui/ReactionBadge.js';
import './ui/BottomSheet.js';
import './ui/UserListItem.js';
import './ui/MutedAvatarOverlay.js';
import './ui/Checkbox.js';
import './ui/UserProfile.js';
import './sendbirdSelectors.js';
import './ui/Tooltip.js';
import './ui/TooltipWrapper.js';
import './Message/context.js';
import './ui/AdminMessage.js';
import './ui/QuoteMessage.js';
import './chunks/bundle-S6OaNh10.js';
import './chunks/bundle-Z-iEmjEQ.js';
import './ui/ThreadReplies.js';
import './ui/OGMessageItemBody.js';
import './chunks/bundle-1q5AhvE7.js';
import './ui/MentionLabel.js';
import './ui/LinkLabel.js';
import './ui/TextMessageItemBody.js';
import './ui/FileMessageItemBody.js';
import './ui/TextButton.js';
import './chunks/bundle-2C9iP99S.js';
import './chunks/bundle-YfeG6LQ5.js';
import './chunks/bundle-KL4mvVMo.js';
import './ui/VoiceMessageItemBody.js';
import './ui/ProgressBar.js';
import './VoicePlayer/useVoicePlayer.js';
import './ui/PlaybackTime.js';
import './ui/ThumbnailMessageItemBody.js';
import './ui/UnknownMessageItemBody.js';
import './ui/FeedbackIconButton.js';
import './ui/MobileFeedbackMenu.js';
import './Channel/components/MessageFeedbackModal.js';
import './ui/Input.js';
import './GroupChannel/components/SuggestedReplies.js';
import './chunks/bundle-VwofrwBu.js';
import './GroupChannel/components/FileViewer.js';
import './chunks/bundle-thfg3MZH.js';
import './GroupChannel/components/RemoveMessageModal.js';
import './chunks/bundle-4fSjujOF.js';
import './chunks/bundle-zcfKjxS7.js';
import './Channel/utils/getMessagePartsInfo.js';
import './Channel/utils/compareMessagesForGrouping.js';
import './GroupChannel/components/UnreadCount.js';
import './GroupChannel/components/FrozenNotification.js';
import './ui/TypingIndicatorBubble.js';
import './GroupChannel/components/MessageInputWrapper.js';
import './chunks/bundle-RbS_k--P.js';
import './GroupChannel/components/SuggestedMentionList.js';
import './ui/QuoteMessageInput.js';
import './VoiceRecorder/useVoiceRecorder.js';
import './chunks/bundle-Syx3NAbT.js';
import './GroupChannel/hooks/useHandleUploadFiles.js';
import './chunks/bundle-QJa2lTJw.js';
import './GroupChannelList/context.js';
import './GroupChannelList/components/GroupChannelListUI.js';
import './chunks/bundle-nmq7a_d7.js';
import './GroupChannelList/components/GroupChannelListHeader.js';
import './EditUserProfile.js';
import './EditUserProfile/context.js';
import './EditUserProfile/components/EditUserProfileUI.js';
import './GroupChannelList/components/GroupChannelPreviewAction.js';
import './GroupChannelList/components/GroupChannelListItem.js';
import './chunks/bundle-wPETx6j0.js';
import './ui/Badge.js';
import './ui/MentionUserLabel.js';
import './GroupChannelList/components/AddGroupChannel.js';
import './chunks/bundle-RAzr6why.js';
import './CreateChannel.js';
import './CreateChannel/components/CreateChannelUI.js';
import './chunks/bundle-rpehLlJe.js';
import './CreateChannel/components/InviteUsers.js';
import './CreateChannel/components/SelectChannelType.js';
import './Channel/context.js';
import './chunks/bundle-inBt684F.js';
import './chunks/bundle-iWB7G7Jl.js';
import './chunks/bundle-_WuZnpi-.js';
import './chunks/bundle-SReX4IhW.js';
import './chunks/bundle-5c9A2KLX.js';
import './chunks/bundle-EHXBDBJS.js';
import './Channel/components/ChannelUI.js';
import './Channel/components/ChannelHeader.js';
import './Channel/components/MessageList.js';
import './Channel/components/Message.js';
import './Channel/components/FileViewer.js';
import './Channel/components/RemoveMessageModal.js';
import './chunks/bundle-6ZgG3gte.js';
import './Channel/components/MessageInput.js';
import './chunks/bundle-fD7gUgus.js';
import './ChannelList/components/ChannelListUI.js';
import './ChannelList/components/ChannelPreview.js';
import './ChannelList/components/AddChannel.js';
import './ChannelSettings/components/ChannelSettingsUI.js';
import './ChannelSettings/context.js';
import './ChannelSettings/components/ChannelProfile.js';
import './ChannelSettings/components/EditDetailsModal.js';
import './ChannelSettings/components/ModerationPanel.js';
import './ui/Accordion.js';
import './ui/AccordionGroup.js';
import './chunks/bundle-0AnE5qN8.js';
import './ui/Toggle.js';
import './ChannelSettings/components/UserListItem.js';
import './chunks/bundle-3E8xSyj7.js';
import './ChannelSettings/components/LeaveChannel.js';
import './ChannelSettings/components/UserPanel.js';
import './MessageSearch/components/MessageSearchUI.js';
import './MessageSearch/context.js';
import './ui/MessageSearchItem.js';
import './ui/MessageSearchFileItem.js';
import './Thread/context.js';
import './Thread/context/types.js';
import './Thread/components/ThreadUI.js';
import './Thread/components/ParentMessageInfo.js';
import './chunks/bundle-zKLRntCV.js';
import './Thread/components/ParentMessageInfoItem.js';
import './chunks/bundle-P_s1ZfLh.js';
import './Thread/components/ThreadHeader.js';
import './Thread/components/ThreadList.js';
import './Thread/components/ThreadListItem.js';
import 'date-fns';
import './Thread/components/ThreadMessageInput.js';
import './Channel/hooks/useHandleUploadFiles.js';

var DesktopLayout = function (props) {
    var isReactionEnabled = props.isReactionEnabled, replyType = props.replyType, isMessageGroupingEnabled = props.isMessageGroupingEnabled, isMultipleFilesMessageEnabled = props.isMultipleFilesMessageEnabled, allowProfileEdit = props.allowProfileEdit, showSearchIcon = props.showSearchIcon, onProfileEditSuccess = props.onProfileEditSuccess, disableAutoSelect = props.disableAutoSelect, currentChannel = props.currentChannel, setCurrentChannel = props.setCurrentChannel, showSettings = props.showSettings, setShowSettings = props.setShowSettings, showSearch = props.showSearch, setShowSearch = props.setShowSearch, highlightedMessage = props.highlightedMessage, setHighlightedMessage = props.setHighlightedMessage, startingPoint = props.startingPoint, setStartingPoint = props.setStartingPoint, showThread = props.showThread, setShowThread = props.setShowThread, threadTargetMessage = props.threadTargetMessage, setThreadTargetMessage = props.setThreadTargetMessage, enableLegacyChannelModules = props.enableLegacyChannelModules;
    var updateFocusedChannel = function (channel) {
        setStartingPoint === null || setStartingPoint === void 0 ? void 0 : setStartingPoint(null);
        setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(null);
        if (channel) {
            setCurrentChannel(channel);
        }
        else {
            setCurrentChannel(null);
        }
    };
    var onClickThreadReply = function (_a) {
        var message = _a.message;
        // parent message
        setShowSettings(false);
        setShowSearch(false);
        if (replyType === 'THREAD') {
            setThreadTargetMessage(message);
            setShowThread(true);
        }
    };
    var channelListProps = {
        allowProfileEdit: allowProfileEdit,
        activeChannelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url,
        onProfileEditSuccess: onProfileEditSuccess,
        disableAutoSelect: disableAutoSelect,
        onChannelSelect: updateFocusedChannel,
        // for GroupChannelList
        selectedChannelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url,
        onChannelCreated: updateFocusedChannel,
        onUserProfileUpdated: onProfileEditSuccess,
    };
    var channelProps = {
        channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '',
        onChatHeaderActionClick: function () {
            setShowSearch(false);
            setShowThread(false);
            setShowSettings(!showSettings);
        },
        onSearchClick: function () {
            setShowSettings(false);
            setShowThread(false);
            setShowSearch(!showSearch);
        },
        onReplyInThread: onClickThreadReply,
        onQuoteMessageClick: function (_a) {
            var message = _a.message;
            // thread message
            setShowSettings(false);
            setShowSearch(false);
            if (replyType === 'THREAD') {
                setThreadTargetMessage(message);
                setShowThread(true);
            }
        },
        animatedMessage: highlightedMessage,
        onMessageAnimated: function () { return setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(null); },
        showSearchIcon: showSearchIcon,
        startingPoint: startingPoint,
        isReactionEnabled: isReactionEnabled,
        replyType: replyType,
        isMessageGroupingEnabled: isMessageGroupingEnabled,
        isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled,
        // for GroupChannel
        animatedMessageId: highlightedMessage,
        onReplyInThreadClick: onClickThreadReply,
    };
    return (React__default.createElement("div", { className: "sendbird-app__wrap" },
        React__default.createElement("div", { className: "sendbird-app__channellist-wrap" }, enableLegacyChannelModules ? React__default.createElement(ChannelList, __assign({}, channelListProps)) : React__default.createElement(GroupChannelList, __assign({}, channelListProps))),
        React__default.createElement("div", { className: "\n          ".concat(showSettings ? 'sendbird-app__conversation--settings-open' : '', "\n          ").concat(showSearch ? 'sendbird-app__conversation--search-open' : '', "\n          sendbird-app__conversation-wrap\n        ") }, enableLegacyChannelModules ? React__default.createElement(Channel, __assign({}, channelProps)) : React__default.createElement(GroupChannel, __assign({}, channelProps))),
        showSettings && (React__default.createElement("div", { className: "sendbird-app__settingspanel-wrap" },
            React__default.createElement(ChannelSettings, { className: "sendbird-channel-settings", channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onCloseClick: function () {
                    setShowSettings(false);
                } }))),
        showSearch && (React__default.createElement("div", { className: "sendbird-app__searchpanel-wrap" },
            React__default.createElement(MessageSearchPannel, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onResultClick: function (message) {
                    if (message.messageId === highlightedMessage) {
                        setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(null);
                        setTimeout(function () {
                            setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(message.messageId);
                        });
                    }
                    else {
                        setStartingPoint === null || setStartingPoint === void 0 ? void 0 : setStartingPoint(message.createdAt);
                        setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(message.messageId);
                    }
                }, onCloseClick: function () {
                    setShowSearch(false);
                } }))),
        showThread && (React__default.createElement(Thread, { className: "sendbird-app__thread", channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', message: threadTargetMessage, onHeaderActionClick: function () {
                setShowThread(false);
            }, onMoveToParentMessage: function (_a) {
                var message = _a.message, channel = _a.channel;
                if ((channel === null || channel === void 0 ? void 0 : channel.url) !== (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url)) {
                    setCurrentChannel(channel);
                }
                if ((message === null || message === void 0 ? void 0 : message.messageId) !== highlightedMessage) {
                    setStartingPoint === null || setStartingPoint === void 0 ? void 0 : setStartingPoint(message === null || message === void 0 ? void 0 : message.createdAt);
                }
                setTimeout(function () {
                    setStartingPoint === null || setStartingPoint === void 0 ? void 0 : setStartingPoint(null);
                    setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(message === null || message === void 0 ? void 0 : message.messageId);
                }, 500);
            } }))));
};

var PANELS;
(function (PANELS) {
    PANELS["CHANNEL_LIST"] = "CHANNEL_LIST";
    PANELS["CHANNEL"] = "CHANNEL";
    PANELS["CHANNEL_SETTINGS"] = "CHANNEL_SETTINGS";
    PANELS["MESSAGE_SEARCH"] = "MESSAGE_SEARCH";
    PANELS["THREAD"] = "THREAD";
})(PANELS || (PANELS = {}));
var MobileLayout = function (props) {
    var _a, _b, _c;
    var replyType = props.replyType, isMessageGroupingEnabled = props.isMessageGroupingEnabled, isMultipleFilesMessageEnabled = props.isMultipleFilesMessageEnabled, allowProfileEdit = props.allowProfileEdit, isReactionEnabled = props.isReactionEnabled, showSearchIcon = props.showSearchIcon, onProfileEditSuccess = props.onProfileEditSuccess, currentChannel = props.currentChannel, setCurrentChannel = props.setCurrentChannel, startingPoint = props.startingPoint, setStartingPoint = props.setStartingPoint, threadTargetMessage = props.threadTargetMessage, setThreadTargetMessage = props.setThreadTargetMessage, highlightedMessage = props.highlightedMessage, setHighlightedMessage = props.setHighlightedMessage, enableLegacyChannelModules = props.enableLegacyChannelModules;
    var _d = useState(PANELS.CHANNEL_LIST), panel = _d[0], setPanel = _d[1];
    var store = useSendbirdStateContext();
    var sdk = (_b = (_a = store === null || store === void 0 ? void 0 : store.stores) === null || _a === void 0 ? void 0 : _a.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk;
    var userId = (_c = store === null || store === void 0 ? void 0 : store.config) === null || _c === void 0 ? void 0 : _c.userId;
    var pause = useVoicePlayerContext().pause;
    var goToMessage = function (message, timeoutCb) {
        setStartingPoint === null || setStartingPoint === void 0 ? void 0 : setStartingPoint((message === null || message === void 0 ? void 0 : message.createdAt) || null);
        setTimeout(function () {
            timeoutCb === null || timeoutCb === void 0 ? void 0 : timeoutCb((message === null || message === void 0 ? void 0 : message.messageId) || null);
        }, 500);
    };
    useEffect(function () {
        if (panel !== PANELS.CHANNEL) {
            goToMessage(null, function () { return setHighlightedMessage(null); });
        }
    }, [panel]);
    useEffect(function () {
        var _a, _b;
        var handlerId = uuidv4();
        if ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.addGroupChannelHandler) {
            var handler = new GroupChannelHandler({
                onUserBanned: function (groupChannel, user) {
                    if (groupChannel.url === (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) && (user === null || user === void 0 ? void 0 : user.userId) === userId) {
                        setPanel(PANELS.CHANNEL_LIST);
                    }
                },
                onChannelDeleted: function (channelUrl) {
                    if (channelUrl === (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url)) {
                        setPanel(PANELS.CHANNEL_LIST);
                    }
                },
                onUserLeft: function (groupChannel, user) {
                    if (groupChannel.url === (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) && (user === null || user === void 0 ? void 0 : user.userId) === userId) {
                        setPanel(PANELS.CHANNEL_LIST);
                    }
                },
            });
            (_b = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _b === void 0 ? void 0 : _b.addGroupChannelHandler(handlerId, handler);
        }
        return function () {
            var _a, _b;
            (_b = (_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.removeGroupChannelHandler) === null || _b === void 0 ? void 0 : _b.call(_a, handlerId);
        };
    }, [sdk, currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url]);
    // if currentChannel is changed while on Thread
    // then change panel type to CHANNEL
    useEffect(function () {
        if (panel === PANELS.THREAD) {
            setPanel(PANELS.CHANNEL);
        }
    }, [currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url]);
    var channelListProps = {
        allowProfileEdit: allowProfileEdit,
        onProfileEditSuccess: onProfileEditSuccess,
        disableAutoSelect: true,
        onChannelSelect: function (channel) {
            setCurrentChannel(channel);
            if (channel) {
                setPanel(PANELS.CHANNEL);
            }
            else {
                setPanel(PANELS.CHANNEL_LIST);
            }
        },
        // for GroupChannelList
        onChannelCreated: function (channel) {
            setCurrentChannel(channel);
            setPanel(PANELS.CHANNEL);
        },
        onUserProfileUpdated: onProfileEditSuccess,
    };
    var channelProps = {
        channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '',
        onChatHeaderActionClick: function () {
            setPanel(PANELS.CHANNEL_SETTINGS);
        },
        onBackClick: function () {
            setPanel(PANELS.CHANNEL_LIST);
            pause(ALL);
        },
        onSearchClick: function () {
            setPanel(PANELS.MESSAGE_SEARCH);
        },
        onReplyInThread: function (_a) {
            var message = _a.message;
            if (replyType === 'THREAD') {
                setPanel(PANELS.THREAD);
                setThreadTargetMessage(message);
            }
        },
        onQuoteMessageClick: function (_a) {
            var message = _a.message;
            // thread message
            if (replyType === 'THREAD') {
                setThreadTargetMessage(message);
                setPanel(PANELS.THREAD);
            }
        },
        animatedMessage: highlightedMessage,
        onMessageAnimated: function () { return setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(null); },
        showSearchIcon: showSearchIcon,
        startingPoint: startingPoint,
        isReactionEnabled: isReactionEnabled,
        replyType: replyType,
        isMessageGroupingEnabled: isMessageGroupingEnabled,
        isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled,
        // for GroupChannel
        animatedMessageId: highlightedMessage,
        onReplyInThreadClick: function (_a) {
            var message = _a.message;
            if (replyType === 'THREAD') {
                setPanel(PANELS.THREAD);
                setThreadTargetMessage(message);
            }
        },
    };
    return (React__default.createElement("div", { className: "sb_mobile" },
        panel === PANELS.CHANNEL_LIST && (React__default.createElement("div", { className: "sb_mobile__panelwrap" }, enableLegacyChannelModules ? React__default.createElement(ChannelList, __assign({}, channelListProps)) : React__default.createElement(GroupChannelList, __assign({}, channelListProps)))),
        panel === PANELS.CHANNEL && (React__default.createElement("div", { className: "sb_mobile__panelwrap" }, enableLegacyChannelModules ? React__default.createElement(Channel, __assign({}, channelProps)) : React__default.createElement(GroupChannel, __assign({}, channelProps)))),
        panel === PANELS.CHANNEL_SETTINGS && (React__default.createElement("div", { className: "sb_mobile__panelwrap" },
            React__default.createElement(ChannelSettings, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onCloseClick: function () {
                    setPanel(PANELS.CHANNEL);
                }, onLeaveChannel: function () {
                    setPanel(PANELS.CHANNEL_LIST);
                } }))),
        panel === PANELS.MESSAGE_SEARCH && (React__default.createElement("div", { className: "sb_mobile__panelwrap" },
            React__default.createElement(MessageSearchPannel, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onCloseClick: function () {
                    setPanel(PANELS.CHANNEL);
                }, onResultClick: function (message) {
                    setPanel(PANELS.CHANNEL);
                    goToMessage(message, function (messageId) {
                        setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(messageId);
                    });
                } }))),
        panel === PANELS.THREAD && (React__default.createElement("div", { className: "sb_mobile__panelwrap" },
            React__default.createElement(Thread, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', message: threadTargetMessage, onHeaderActionClick: function () {
                    setPanel(PANELS.CHANNEL);
                    pause(ALL);
                }, onMoveToParentMessage: function (_a) {
                    var message = _a.message, channel = _a.channel;
                    setCurrentChannel(channel);
                    goToMessage(message, function (messageId) {
                        setPanel(PANELS.CHANNEL);
                        setHighlightedMessage(messageId);
                    });
                } })))));
};

var AppLayout = function (props) {
    var _a, _b, _c;
    var isMessageGroupingEnabled = props.isMessageGroupingEnabled, allowProfileEdit = props.allowProfileEdit, onProfileEditSuccess = props.onProfileEditSuccess, disableAutoSelect = props.disableAutoSelect, currentChannel = props.currentChannel, setCurrentChannel = props.setCurrentChannel, enableLegacyChannelModules = props.enableLegacyChannelModules;
    var globalStore = useSendbirdStateContext();
    var globalConfigs = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config;
    var _d = useState(false), showThread = _d[0], setShowThread = _d[1];
    var _e = useState(null), threadTargetMessage = _e[0], setThreadTargetMessage = _e[1];
    var _f = useState(false), showSettings = _f[0], setShowSettings = _f[1];
    var _g = useState(false), showSearch = _g[0], setShowSearch = _g[1];
    var _h = useState(null), highlightedMessage = _h[0], setHighlightedMessage = _h[1];
    var _j = useState(null), startingPoint = _j[0], setStartingPoint = _j[1];
    var isMobile = useMediaQueryContext().isMobile;
    /**
     * Below configs can be set via Dashboard UIKit config setting but as a lower priority than App props.
     * So need to be have fallback value \w global configs even though each prop values are undefined
     */
    var replyType = (_a = props.replyType) !== null && _a !== void 0 ? _a : globalConfigs === null || globalConfigs === void 0 ? void 0 : globalConfigs.replyType;
    var isReactionEnabled = (_b = props.isReactionEnabled) !== null && _b !== void 0 ? _b : globalConfigs === null || globalConfigs === void 0 ? void 0 : globalConfigs.isReactionEnabled;
    var showSearchIcon = (_c = props.showSearchIcon) !== null && _c !== void 0 ? _c : globalConfigs === null || globalConfigs === void 0 ? void 0 : globalConfigs.showSearchIcon;
    return (React__default.createElement(React__default.Fragment, null, isMobile
        ? (React__default.createElement(MobileLayout, { replyType: replyType, showSearchIcon: showSearchIcon, isReactionEnabled: isReactionEnabled, isMessageGroupingEnabled: isMessageGroupingEnabled, allowProfileEdit: allowProfileEdit, onProfileEditSuccess: onProfileEditSuccess, currentChannel: currentChannel, setCurrentChannel: setCurrentChannel, highlightedMessage: highlightedMessage, setHighlightedMessage: setHighlightedMessage, startingPoint: startingPoint, setStartingPoint: setStartingPoint, threadTargetMessage: threadTargetMessage, setThreadTargetMessage: setThreadTargetMessage, enableLegacyChannelModules: enableLegacyChannelModules }))
        : (React__default.createElement(DesktopLayout, { replyType: replyType, isReactionEnabled: isReactionEnabled, showSearchIcon: showSearchIcon, isMessageGroupingEnabled: isMessageGroupingEnabled, allowProfileEdit: allowProfileEdit, onProfileEditSuccess: onProfileEditSuccess, disableAutoSelect: disableAutoSelect, currentChannel: currentChannel, setCurrentChannel: setCurrentChannel, showThread: showThread, setShowThread: setShowThread, threadTargetMessage: threadTargetMessage, setThreadTargetMessage: setThreadTargetMessage, showSettings: showSettings, setShowSettings: setShowSettings, showSearch: showSearch, setShowSearch: setShowSearch, highlightedMessage: highlightedMessage, setHighlightedMessage: setHighlightedMessage, startingPoint: startingPoint, setStartingPoint: setStartingPoint, enableLegacyChannelModules: enableLegacyChannelModules }))));
};

/**
 * This is a drop in Chat solution
 * Can also be used as an example for creating
 * default chat apps
 */
function App(props) {
    var appId = props.appId, userId = props.userId, _a = props.accessToken, accessToken = _a === void 0 ? '' : _a, _b = props.customApiHost, customApiHost = _b === void 0 ? '' : _b, _c = props.customWebSocketHost, customWebSocketHost = _c === void 0 ? '' : _c, _d = props.breakpoint, breakpoint = _d === void 0 ? null : _d, _e = props.theme, theme = _e === void 0 ? 'light' : _e, _f = props.userListQuery, userListQuery = _f === void 0 ? null : _f, _g = props.nickname, nickname = _g === void 0 ? '' : _g, _h = props.profileUrl, profileUrl = _h === void 0 ? '' : _h, _j = props.dateLocale, dateLocale = _j === void 0 ? null : _j, _k = props.config, config = _k === void 0 ? {} : _k, voiceRecord = props.voiceRecord, _l = props.isMessageGroupingEnabled, isMessageGroupingEnabled = _l === void 0 ? true : _l, _m = props.colorSet, colorSet = _m === void 0 ? null : _m, _o = props.stringSet, stringSet = _o === void 0 ? null : _o, _p = props.allowProfileEdit, allowProfileEdit = _p === void 0 ? false : _p, _q = props.disableMarkAsDelivered, disableMarkAsDelivered = _q === void 0 ? false : _q, _r = props.renderUserProfile, renderUserProfile = _r === void 0 ? null : _r, _s = props.onProfileEditSuccess, onProfileEditSuccess = _s === void 0 ? null : _s, _t = props.imageCompression, imageCompression = _t === void 0 ? {} : _t, _u = props.disableAutoSelect, disableAutoSelect = _u === void 0 ? false : _u, sdkInitParams = props.sdkInitParams, customExtensionParams = props.customExtensionParams, eventHandlers = props.eventHandlers, uikitOptions = props.uikitOptions, 
    // The below configs are duplicates of the Dashboard UIKit Configs.
    // Since their default values will be set in the Sendbird component,
    // we don't need to set them here.
    showSearchIcon = props.showSearchIcon, isMentionEnabled = props.isMentionEnabled, isReactionEnabled = props.isReactionEnabled, replyType = props.replyType, disableUserProfile = props.disableUserProfile, isVoiceMessageEnabled = props.isVoiceMessageEnabled, isMultipleFilesMessageEnabled = props.isMultipleFilesMessageEnabled, isTypingIndicatorEnabledOnChannelList = props.isTypingIndicatorEnabledOnChannelList, isMessageReceiptStatusEnabledOnChannelList = props.isMessageReceiptStatusEnabledOnChannelList, _v = props.isUserIdUsedForNickname, isUserIdUsedForNickname = _v === void 0 ? true : _v, _w = props.enableLegacyChannelModules, enableLegacyChannelModules = _w === void 0 ? false : _w;
    var _x = useState(null), currentChannel = _x[0], setCurrentChannel = _x[1];
    return (React__default.createElement(SendbirdProvider, { stringSet: stringSet, appId: appId, userId: userId, accessToken: accessToken, customApiHost: customApiHost, customWebSocketHost: customWebSocketHost, breakpoint: breakpoint, theme: theme, nickname: nickname, profileUrl: profileUrl, dateLocale: dateLocale, userListQuery: userListQuery, config: config, colorSet: colorSet, disableUserProfile: disableUserProfile, disableMarkAsDelivered: disableMarkAsDelivered, renderUserProfile: renderUserProfile, imageCompression: imageCompression, isReactionEnabled: isReactionEnabled, isMentionEnabled: isMentionEnabled, isVoiceMessageEnabled: isVoiceMessageEnabled, isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled, voiceRecord: voiceRecord, onUserProfileMessage: function (channel) {
            setCurrentChannel(channel);
        }, isTypingIndicatorEnabledOnChannelList: isTypingIndicatorEnabledOnChannelList, isMessageReceiptStatusEnabledOnChannelList: isMessageReceiptStatusEnabledOnChannelList, replyType: replyType, showSearchIcon: showSearchIcon, uikitOptions: uikitOptions, isUserIdUsedForNickname: isUserIdUsedForNickname, sdkInitParams: sdkInitParams, customExtensionParams: customExtensionParams, eventHandlers: eventHandlers },
        React__default.createElement(AppLayout, { isReactionEnabled: isReactionEnabled, replyType: replyType, showSearchIcon: showSearchIcon, isMessageGroupingEnabled: isMessageGroupingEnabled, allowProfileEdit: allowProfileEdit, onProfileEditSuccess: onProfileEditSuccess, disableAutoSelect: disableAutoSelect, currentChannel: currentChannel, setCurrentChannel: setCurrentChannel, enableLegacyChannelModules: enableLegacyChannelModules })));
}

export { App as default };
//# sourceMappingURL=App.js.map

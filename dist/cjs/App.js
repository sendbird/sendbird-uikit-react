'use strict';

var React = require('react');
var SendbirdProvider = require('./SendbirdProvider.js');
var MediaQueryContext = require('./chunks/bundle-37dz9yoi.js');
var _tslib = require('./chunks/bundle-zYqQA3cT.js');
var GroupChannel = require('./GroupChannel.js');
var GroupChannelList = require('./GroupChannelList.js');
var Channel = require('./Channel.js');
var ChannelList = require('./ChannelList.js');
var ChannelSettings = require('./ChannelSettings.js');
var MessageSearch = require('./MessageSearch.js');
var Thread = require('./Thread.js');
var groupChannel = require('@sendbird/chat/groupChannel');
var useSendbirdStateContext = require('./useSendbirdStateContext.js');
var uuid = require('./chunks/bundle-NNEanMqk.js');
var VoicePlayer_context = require('./chunks/bundle-RZEbRa4M.js');
require('@sendbird/uikit-tools');
require('./withSendbird.js');
require('css-vars-ponyfill');
require('./chunks/bundle-8G36Z6Or.js');
require('./chunks/bundle-sHU9iRBT.js');
require('./chunks/bundle-lPuw7NHh.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('./chunks/bundle-bjSez2lv.js');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-Xwl4gw4D.js');
require('./chunks/bundle-6zBpI6FB.js');
require('./VoiceRecorder/context.js');
require('./chunks/bundle-Nz6fSUye.js');
require('./chunks/bundle-xYV6cL9E.js');
require('./chunks/bundle-eyiJykZ-.js');
require('./chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./chunks/bundle-2Pq38lvD.js');
require('./ui/Icon.js');
require('./chunks/bundle-4jVvOUfV.js');
require('./chunks/bundle-5ucHJjT6.js');
require('./hooks/useModal.js');
require('./GroupChannel/context.js');
require('@sendbird/chat/message');
require('./chunks/bundle-HnlcCy36.js');
require('./chunks/bundle-b-DMr0gw.js');
require('./chunks/bundle-6wRNuySu.js');
require('./chunks/bundle-FgihvR5h.js');
require('./chunks/bundle-CPnHexJQ.js');
require('./chunks/bundle-hWEZzs4y.js');
require('./chunks/bundle-NfUcey5s.js');
require('./GroupChannel/components/GroupChannelUI.js');
require('./chunks/bundle-LoS8sC56.js');
require('./GroupChannel/components/TypingIndicator.js');
require('./chunks/bundle-3juzrueE.js');
require('./ui/ConnectionStatus.js');
require('./ui/PlaceHolder.js');
require('./ui/Loader.js');
require('./GroupChannel/components/GroupChannelHeader.js');
require('./chunks/bundle-nLUlh2UO.js');
require('./ui/ChannelAvatar.js');
require('./chunks/bundle-PoiZwjvJ.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-5mXB6h1C.js');
require('./chunks/bundle-dQYtPkLv.js');
require('./chunks/bundle-uzP6MTD5.js');
require('./GroupChannel/components/MessageList.js');
require('./GroupChannel/components/Message.js');
require('./chunks/bundle-Eh1XQ7zf.js');
require('./chunks/bundle-T9gnzy2i.js');
require('./chunks/bundle-2FdL4aA6.js');
require('./Message/hooks/useDirtyGetMentions.js');
require('./ui/DateSeparator.js');
require('./chunks/bundle-oaDSLq17.js');
require('./ui/MessageInput.js');
require('./chunks/bundle-Ka3VBiNF.js');
require('./chunks/bundle-vnNrprB3.js');
require('dompurify');
require('./chunks/bundle-suIvps1I.js');
require('./chunks/bundle-bXe-_rig.js');
require('./chunks/bundle-scYpz-Ln.js');
require('./chunks/bundle-URV6GLmd.js');
require('./ui/MessageContent.js');
require('./chunks/bundle-vsw2g6d5.js');
require('./chunks/bundle-k4IOvwe9.js');
require('./chunks/bundle-r8DyENxy.js');
require('./ui/MessageItemMenu.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./chunks/bundle-qKiW2e44.js');
require('./ui/MessageItemReactionMenu.js');
require('./ui/ReactionButton.js');
require('./chunks/bundle-l768-Ldg.js');
require('./ui/EmojiReactions.js');
require('./ui/ReactionBadge.js');
require('./ui/BottomSheet.js');
require('./ui/UserListItem.js');
require('./ui/MutedAvatarOverlay.js');
require('./ui/Checkbox.js');
require('./ui/UserProfile.js');
require('./sendbirdSelectors.js');
require('./ui/Tooltip.js');
require('./ui/TooltipWrapper.js');
require('./Message/context.js');
require('./ui/AdminMessage.js');
require('./ui/QuoteMessage.js');
require('./chunks/bundle-Oijs10ng.js');
require('./chunks/bundle-Y93r8Xy_.js');
require('./ui/ThreadReplies.js');
require('./ui/OGMessageItemBody.js');
require('./chunks/bundle-zswKzOJx.js');
require('./ui/MentionLabel.js');
require('./ui/LinkLabel.js');
require('./ui/TextMessageItemBody.js');
require('./ui/FileMessageItemBody.js');
require('./ui/TextButton.js');
require('./chunks/bundle-GJsJRUXc.js');
require('./chunks/bundle-9DG1byjg.js');
require('./chunks/bundle-mO4Gb6oX.js');
require('./ui/VoiceMessageItemBody.js');
require('./ui/ProgressBar.js');
require('./VoicePlayer/useVoicePlayer.js');
require('./ui/PlaybackTime.js');
require('./ui/ThumbnailMessageItemBody.js');
require('./ui/UnknownMessageItemBody.js');
require('./ui/FeedbackIconButton.js');
require('./ui/MobileFeedbackMenu.js');
require('./Channel/components/MessageFeedbackModal.js');
require('./ui/Input.js');
require('./GroupChannel/components/SuggestedReplies.js');
require('./chunks/bundle-QLdAEK3e.js');
require('./GroupChannel/components/FileViewer.js');
require('./chunks/bundle-dIspFdXr.js');
require('./GroupChannel/components/RemoveMessageModal.js');
require('./chunks/bundle-Nn9qAcpF.js');
require('./chunks/bundle-Ri0nZ4E4.js');
require('./Channel/utils/getMessagePartsInfo.js');
require('./Channel/utils/compareMessagesForGrouping.js');
require('./GroupChannel/components/UnreadCount.js');
require('./GroupChannel/components/FrozenNotification.js');
require('./ui/TypingIndicatorBubble.js');
require('./GroupChannel/components/MessageInputWrapper.js');
require('./chunks/bundle-T_i-7yWX.js');
require('./GroupChannel/components/SuggestedMentionList.js');
require('./ui/QuoteMessageInput.js');
require('./VoiceRecorder/useVoiceRecorder.js');
require('./chunks/bundle-S1jItXMj.js');
require('./GroupChannel/hooks/useHandleUploadFiles.js');
require('./chunks/bundle-izlAxQOw.js');
require('./GroupChannelList/context.js');
require('./GroupChannelList/components/GroupChannelListUI.js');
require('./chunks/bundle-UwFF7vgz.js');
require('./GroupChannelList/components/GroupChannelListHeader.js');
require('./EditUserProfile.js');
require('./EditUserProfile/context.js');
require('./EditUserProfile/components/EditUserProfileUI.js');
require('./GroupChannelList/components/GroupChannelPreviewAction.js');
require('./GroupChannelList/components/GroupChannelListItem.js');
require('./chunks/bundle-2qhx9zdL.js');
require('./ui/Badge.js');
require('./ui/MentionUserLabel.js');
require('./GroupChannelList/components/AddGroupChannel.js');
require('./chunks/bundle-yDyrmXqw.js');
require('./CreateChannel.js');
require('./CreateChannel/components/CreateChannelUI.js');
require('./chunks/bundle-RWfI6raz.js');
require('./CreateChannel/components/InviteUsers.js');
require('./CreateChannel/components/SelectChannelType.js');
require('./Channel/context.js');
require('./chunks/bundle-M4WNZlHL.js');
require('./chunks/bundle-vxARP6GP.js');
require('./chunks/bundle-vmQPp-90.js');
require('./chunks/bundle-8TphtY0G.js');
require('./chunks/bundle-ZngtlfeR.js');
require('./chunks/bundle-uyZV0VMO.js');
require('./Channel/components/ChannelUI.js');
require('./Channel/components/ChannelHeader.js');
require('./Channel/components/MessageList.js');
require('./Channel/components/Message.js');
require('./Channel/components/FileViewer.js');
require('./Channel/components/RemoveMessageModal.js');
require('./chunks/bundle-nrHJPIVo.js');
require('./Channel/components/MessageInput.js');
require('./chunks/bundle-33cx5rNA.js');
require('./ChannelList/components/ChannelListUI.js');
require('./ChannelList/components/ChannelPreview.js');
require('./ChannelList/components/AddChannel.js');
require('./ChannelSettings/components/ChannelSettingsUI.js');
require('./ChannelSettings/context.js');
require('./ChannelSettings/components/ChannelProfile.js');
require('./ChannelSettings/components/EditDetailsModal.js');
require('./ChannelSettings/components/ModerationPanel.js');
require('./ui/Accordion.js');
require('./ui/AccordionGroup.js');
require('./chunks/bundle-o6ZMXHG_.js');
require('./ui/Toggle.js');
require('./ChannelSettings/components/UserListItem.js');
require('./chunks/bundle-zraEYh7E.js');
require('./ChannelSettings/components/LeaveChannel.js');
require('./ChannelSettings/components/UserPanel.js');
require('./MessageSearch/components/MessageSearchUI.js');
require('./MessageSearch/context.js');
require('./ui/MessageSearchItem.js');
require('./ui/MessageSearchFileItem.js');
require('./Thread/context.js');
require('./Thread/context/types.js');
require('./Thread/components/ThreadUI.js');
require('./Thread/components/ParentMessageInfo.js');
require('./chunks/bundle-Z55ii8J-.js');
require('./Thread/components/ParentMessageInfoItem.js');
require('./chunks/bundle-qjBqtuP3.js');
require('./Thread/components/ThreadHeader.js');
require('./Thread/components/ThreadList.js');
require('./Thread/components/ThreadListItem.js');
require('date-fns');
require('./Thread/components/ThreadMessageInput.js');
require('./Channel/hooks/useHandleUploadFiles.js');

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
    return (React.createElement("div", { className: "sendbird-app__wrap" },
        React.createElement("div", { className: "sendbird-app__channellist-wrap" }, enableLegacyChannelModules ? React.createElement(ChannelList, _tslib.__assign({}, channelListProps)) : React.createElement(GroupChannelList.GroupChannelList, _tslib.__assign({}, channelListProps))),
        React.createElement("div", { className: "\n          ".concat(showSettings ? 'sendbird-app__conversation--settings-open' : '', "\n          ").concat(showSearch ? 'sendbird-app__conversation--search-open' : '', "\n          sendbird-app__conversation-wrap\n        ") }, enableLegacyChannelModules ? React.createElement(Channel, _tslib.__assign({}, channelProps)) : React.createElement(GroupChannel.GroupChannel, _tslib.__assign({}, channelProps))),
        showSettings && (React.createElement("div", { className: "sendbird-app__settingspanel-wrap" },
            React.createElement(ChannelSettings, { className: "sendbird-channel-settings", channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onCloseClick: function () {
                    setShowSettings(false);
                } }))),
        showSearch && (React.createElement("div", { className: "sendbird-app__searchpanel-wrap" },
            React.createElement(MessageSearch, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onResultClick: function (message) {
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
        showThread && (React.createElement(Thread, { className: "sendbird-app__thread", channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', message: threadTargetMessage, onHeaderActionClick: function () {
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
    var _d = React.useState(PANELS.CHANNEL_LIST), panel = _d[0], setPanel = _d[1];
    var store = useSendbirdStateContext.useSendbirdStateContext();
    var sdk = (_b = (_a = store === null || store === void 0 ? void 0 : store.stores) === null || _a === void 0 ? void 0 : _a.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk;
    var userId = (_c = store === null || store === void 0 ? void 0 : store.config) === null || _c === void 0 ? void 0 : _c.userId;
    var pause = VoicePlayer_context.useVoicePlayerContext().pause;
    var goToMessage = function (message, timeoutCb) {
        setStartingPoint === null || setStartingPoint === void 0 ? void 0 : setStartingPoint((message === null || message === void 0 ? void 0 : message.createdAt) || null);
        setTimeout(function () {
            timeoutCb === null || timeoutCb === void 0 ? void 0 : timeoutCb((message === null || message === void 0 ? void 0 : message.messageId) || null);
        }, 500);
    };
    React.useEffect(function () {
        if (panel !== PANELS.CHANNEL) {
            goToMessage(null, function () { return setHighlightedMessage(null); });
        }
    }, [panel]);
    React.useEffect(function () {
        var _a, _b;
        var handlerId = uuid.uuidv4();
        if ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.addGroupChannelHandler) {
            var handler = new groupChannel.GroupChannelHandler({
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
    React.useEffect(function () {
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
            pause(VoicePlayer_context.ALL);
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
    return (React.createElement("div", { className: "sb_mobile" },
        panel === PANELS.CHANNEL_LIST && (React.createElement("div", { className: "sb_mobile__panelwrap" }, enableLegacyChannelModules ? React.createElement(ChannelList, _tslib.__assign({}, channelListProps)) : React.createElement(GroupChannelList.GroupChannelList, _tslib.__assign({}, channelListProps)))),
        panel === PANELS.CHANNEL && (React.createElement("div", { className: "sb_mobile__panelwrap" }, enableLegacyChannelModules ? React.createElement(Channel, _tslib.__assign({}, channelProps)) : React.createElement(GroupChannel.GroupChannel, _tslib.__assign({}, channelProps)))),
        panel === PANELS.CHANNEL_SETTINGS && (React.createElement("div", { className: "sb_mobile__panelwrap" },
            React.createElement(ChannelSettings, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onCloseClick: function () {
                    setPanel(PANELS.CHANNEL);
                }, onLeaveChannel: function () {
                    setPanel(PANELS.CHANNEL_LIST);
                } }))),
        panel === PANELS.MESSAGE_SEARCH && (React.createElement("div", { className: "sb_mobile__panelwrap" },
            React.createElement(MessageSearch, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', onCloseClick: function () {
                    setPanel(PANELS.CHANNEL);
                }, onResultClick: function (message) {
                    setPanel(PANELS.CHANNEL);
                    goToMessage(message, function (messageId) {
                        setHighlightedMessage === null || setHighlightedMessage === void 0 ? void 0 : setHighlightedMessage(messageId);
                    });
                } }))),
        panel === PANELS.THREAD && (React.createElement("div", { className: "sb_mobile__panelwrap" },
            React.createElement(Thread, { channelUrl: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) || '', message: threadTargetMessage, onHeaderActionClick: function () {
                    setPanel(PANELS.CHANNEL);
                    pause(VoicePlayer_context.ALL);
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
    var globalStore = useSendbirdStateContext.useSendbirdStateContext();
    var globalConfigs = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config;
    var _d = React.useState(false), showThread = _d[0], setShowThread = _d[1];
    var _e = React.useState(null), threadTargetMessage = _e[0], setThreadTargetMessage = _e[1];
    var _f = React.useState(false), showSettings = _f[0], setShowSettings = _f[1];
    var _g = React.useState(false), showSearch = _g[0], setShowSearch = _g[1];
    var _h = React.useState(null), highlightedMessage = _h[0], setHighlightedMessage = _h[1];
    var _j = React.useState(null), startingPoint = _j[0], setStartingPoint = _j[1];
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    /**
     * Below configs can be set via Dashboard UIKit config setting but as a lower priority than App props.
     * So need to be have fallback value \w global configs even though each prop values are undefined
     */
    var replyType = (_a = props.replyType) !== null && _a !== void 0 ? _a : globalConfigs === null || globalConfigs === void 0 ? void 0 : globalConfigs.replyType;
    var isReactionEnabled = (_b = props.isReactionEnabled) !== null && _b !== void 0 ? _b : globalConfigs === null || globalConfigs === void 0 ? void 0 : globalConfigs.isReactionEnabled;
    var showSearchIcon = (_c = props.showSearchIcon) !== null && _c !== void 0 ? _c : globalConfigs === null || globalConfigs === void 0 ? void 0 : globalConfigs.showSearchIcon;
    return (React.createElement(React.Fragment, null, isMobile
        ? (React.createElement(MobileLayout, { replyType: replyType, showSearchIcon: showSearchIcon, isReactionEnabled: isReactionEnabled, isMessageGroupingEnabled: isMessageGroupingEnabled, allowProfileEdit: allowProfileEdit, onProfileEditSuccess: onProfileEditSuccess, currentChannel: currentChannel, setCurrentChannel: setCurrentChannel, highlightedMessage: highlightedMessage, setHighlightedMessage: setHighlightedMessage, startingPoint: startingPoint, setStartingPoint: setStartingPoint, threadTargetMessage: threadTargetMessage, setThreadTargetMessage: setThreadTargetMessage, enableLegacyChannelModules: enableLegacyChannelModules }))
        : (React.createElement(DesktopLayout, { replyType: replyType, isReactionEnabled: isReactionEnabled, showSearchIcon: showSearchIcon, isMessageGroupingEnabled: isMessageGroupingEnabled, allowProfileEdit: allowProfileEdit, onProfileEditSuccess: onProfileEditSuccess, disableAutoSelect: disableAutoSelect, currentChannel: currentChannel, setCurrentChannel: setCurrentChannel, showThread: showThread, setShowThread: setShowThread, threadTargetMessage: threadTargetMessage, setThreadTargetMessage: setThreadTargetMessage, showSettings: showSettings, setShowSettings: setShowSettings, showSearch: showSearch, setShowSearch: setShowSearch, highlightedMessage: highlightedMessage, setHighlightedMessage: setHighlightedMessage, startingPoint: startingPoint, setStartingPoint: setStartingPoint, enableLegacyChannelModules: enableLegacyChannelModules }))));
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
    var _x = React.useState(null), currentChannel = _x[0], setCurrentChannel = _x[1];
    return (React.createElement(SendbirdProvider.SendbirdProvider, { stringSet: stringSet, appId: appId, userId: userId, accessToken: accessToken, customApiHost: customApiHost, customWebSocketHost: customWebSocketHost, breakpoint: breakpoint, theme: theme, nickname: nickname, profileUrl: profileUrl, dateLocale: dateLocale, userListQuery: userListQuery, config: config, colorSet: colorSet, disableUserProfile: disableUserProfile, disableMarkAsDelivered: disableMarkAsDelivered, renderUserProfile: renderUserProfile, imageCompression: imageCompression, isReactionEnabled: isReactionEnabled, isMentionEnabled: isMentionEnabled, isVoiceMessageEnabled: isVoiceMessageEnabled, isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled, voiceRecord: voiceRecord, onUserProfileMessage: function (channel) {
            setCurrentChannel(channel);
        }, isTypingIndicatorEnabledOnChannelList: isTypingIndicatorEnabledOnChannelList, isMessageReceiptStatusEnabledOnChannelList: isMessageReceiptStatusEnabledOnChannelList, replyType: replyType, showSearchIcon: showSearchIcon, uikitOptions: uikitOptions, isUserIdUsedForNickname: isUserIdUsedForNickname, sdkInitParams: sdkInitParams, customExtensionParams: customExtensionParams, eventHandlers: eventHandlers },
        React.createElement(AppLayout, { isReactionEnabled: isReactionEnabled, replyType: replyType, showSearchIcon: showSearchIcon, isMessageGroupingEnabled: isMessageGroupingEnabled, allowProfileEdit: allowProfileEdit, onProfileEditSuccess: onProfileEditSuccess, disableAutoSelect: disableAutoSelect, currentChannel: currentChannel, setCurrentChannel: setCurrentChannel, enableLegacyChannelModules: enableLegacyChannelModules })));
}

module.exports = App;
//# sourceMappingURL=App.js.map

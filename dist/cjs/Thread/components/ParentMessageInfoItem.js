'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-Nz6fSUye.js');
var index = require('../../chunks/bundle-bjSez2lv.js');
var ui_Label = require('../../chunks/bundle-2Pq38lvD.js');
var ui_ImageRenderer = require('../../ui/ImageRenderer.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_TextButton = require('../../ui/TextButton.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var ui_EmojiReactions = require('../../ui/EmojiReactions.js');
var Thread_context = require('../context.js');
var ui_VoiceMessageItemBody = require('../../ui/VoiceMessageItemBody.js');
var index$1 = require('../../chunks/bundle-zswKzOJx.js');
var tokenize = require('../../chunks/bundle-URV6GLmd.js');
var useFileInfoListWithUploaded = require('../../chunks/bundle-GJsJRUXc.js');
var MediaQueryContext = require('../../chunks/bundle-37dz9yoi.js');
var color = require('../../chunks/bundle-oaDSLq17.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../withSendbird.js');
require('../../ui/ReactionBadge.js');
require('../../ui/ReactionButton.js');
require('../../chunks/bundle-l768-Ldg.js');
require('../../ui/ContextMenu.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-NNEanMqk.js');
require('../../ui/BottomSheet.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-NfUcey5s.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../Message/context.js');
require('../../chunks/bundle-uyZV0VMO.js');
require('../../chunks/bundle-CPnHexJQ.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-4jVvOUfV.js');
require('../context/types.js');
require('@sendbird/chat');
require('../../chunks/bundle-vxARP6GP.js');
require('../../chunks/bundle-vmQPp-90.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-RZEbRa4M.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../ui/Loader.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-9DG1byjg.js');
require('../../chunks/bundle-mO4Gb6oX.js');
require('@sendbird/uikit-tools');

function ParentMessageInfoItem(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var className = _a.className, message = _a.message, showFileViewer = _a.showFileViewer;
    var _l = (useSendbirdStateContext.useSendbirdStateContext === null || useSendbirdStateContext.useSendbirdStateContext === void 0 ? void 0 : useSendbirdStateContext.useSendbirdStateContext()) || {}, stores = _l.stores, config = _l.config, eventHandlers = _l.eventHandlers;
    var onPressUserProfileHandler = (_b = eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.reaction) === null || _b === void 0 ? void 0 : _b.onPressUserProfile;
    var replyType = config.replyType, isMentionEnabled = config.isMentionEnabled, isReactionEnabled = config.isReactionEnabled;
    var currentUserId = (_d = (_c = stores === null || stores === void 0 ? void 0 : stores.userStore) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.userId;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var _m = Thread_context.useThreadContext(), currentChannel = _m.currentChannel, emojiContainer = _m.emojiContainer, nicknamesMap = _m.nicknamesMap, toggleReaction = _m.toggleReaction;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var threadMessageKindKey = useFileInfoListWithUploaded.useThreadMessageKindKeySelector({
        threadMessageKind: useFileInfoListWithUploaded.ThreadMessageKind.PARENT,
        isMobile: isMobile,
    });
    // For MultipleFilesMessage only.
    var statefulFileInfoList = useFileInfoListWithUploaded.useFileInfoListWithUploaded(message);
    var isMentionedMessage = isMentionEnabled
        && ((_e = message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate) === null || _e === void 0 ? void 0 : _e.length) > 0
        && ((_f = message === null || message === void 0 ? void 0 : message.mentionedUsers) === null || _f === void 0 ? void 0 : _f.length) > 0;
    // Emoji reactions
    var isReactionActivated = isReactionEnabled
        && replyType === 'THREAD'
        && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isSuper)
        && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast)
        && ((_g = message === null || message === void 0 ? void 0 : message.reactions) === null || _g === void 0 ? void 0 : _g.length) > 0;
    var tokens = React.useMemo(function () {
        if (isMentionedMessage) {
            return tokenize.tokenizeMessage({
                mentionedUsers: message === null || message === void 0 ? void 0 : message.mentionedUsers,
                messageText: message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate,
            });
        }
        return tokenize.tokenizeMessage({
            messageText: message === null || message === void 0 ? void 0 : message.message,
        });
    }, [message === null || message === void 0 ? void 0 : message.updatedAt, message === null || message === void 0 ? void 0 : message.message]);
    // Thumbnail mesage
    var _o = React.useState(false), isImageRendered = _o[0], setImageRendered = _o[1];
    var thumbnailUrl = ((_h = message === null || message === void 0 ? void 0 : message.thumbnails) === null || _h === void 0 ? void 0 : _h.length) > 0
        ? (_j = message === null || message === void 0 ? void 0 : message.thumbnails[0]) === null || _j === void 0 ? void 0 : _j.url : '';
    return (React.createElement("div", { className: "sendbird-parent-message-info-item ".concat(className) },
        index.isUserMessage(message) && (React.createElement(ui_Label.Label, { className: "sendbird-parent-message-info-item__text-message", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 },
            React.createElement(index$1.TextFragment, { tokens: tokens }),
            index.isEditedMessage(message) && (React.createElement(ui_Label.Label, { className: "sendbird-parent-message-info-item__text-message edited", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_2 }, " ".concat(stringSet.MESSAGE_EDITED, " "))))),
        (index.getUIKitMessageType(message) === index.getUIKitMessageTypes().FILE) && (React.createElement("div", { className: "sendbird-parent-message-info-item__file-message" },
            React.createElement("div", { className: "sendbird-parent-message-info-item__file-message__file-icon" },
                React.createElement(ui_Icon.default, { className: "sendbird-parent-message-info-item__file-message__file-icon__icon", type: {
                        IMAGE: ui_Icon.IconTypes.PHOTO,
                        VIDEO: ui_Icon.IconTypes.PLAY,
                        AUDIO: ui_Icon.IconTypes.FILE_AUDIO,
                        GIF: ui_Icon.IconTypes.GIF,
                        OTHERS: ui_Icon.IconTypes.FILE_DOCUMENT,
                    }[index.getUIKitFileType(message === null || message === void 0 ? void 0 : message.type)], fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" })),
            React.createElement(ui_TextButton, { className: "sendbird-parent-message-info-item__file-message__file-name", onClick: function () { window.open(message === null || message === void 0 ? void 0 : message.url); }, color: color.Colors.ONBACKGROUND_1 },
                React.createElement(ui_Label.Label, { className: "sendbird-parent-message-info-item__file-message__file-name__text", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, index.truncateString((message === null || message === void 0 ? void 0 : message.name) || (message === null || message === void 0 ? void 0 : message.url), 30))))),
        index.isMultipleFilesMessage(message) && (React.createElement(useFileInfoListWithUploaded.MultipleFilesMessageItemBody, { className: "sendbird-parent-message-info-item__multiple-files-message-wrapper", message: message, isByMe: false, isReactionEnabled: isReactionEnabled, threadMessageKindKey: threadMessageKindKey, statefulFileInfoList: statefulFileInfoList })),
        index.isVoiceMessage(message) && (React.createElement("div", { className: "sendbird-parent-message-info-item__voice-message" },
            React.createElement(ui_VoiceMessageItemBody.VoiceMessageItemBody, { className: "sendbird-parent-message-info-item__voice-message__item", message: message, channelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url, isByMe: false, isReactionEnabled: isReactionEnabled }))),
        index.isThumbnailMessage(message) && (React.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message", onClick: function () {
                if (index.isSentMessage(message)) {
                    showFileViewer(true);
                }
            } },
            React.createElement(ui_ImageRenderer.default, { className: "sendbird-parent-message-info-item__thumbnail-message__thumbnail", url: thumbnailUrl || (message === null || message === void 0 ? void 0 : message.url) || (message === null || message === void 0 ? void 0 : message.plainUrl), alt: message === null || message === void 0 ? void 0 : message.type, width: "200px", height: "148px", onLoad: function () { setImageRendered(true); }, placeHolder: function (_a) {
                    var style = _a.style;
                    return (React.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__placeholder", style: style },
                        React.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__placeholder__icon" },
                            React.createElement(ui_Icon.default, { type: index.isVideoMessage(message) ? ui_Icon.IconTypes.PLAY : ui_Icon.IconTypes.PHOTO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "34px", height: "34px" }))));
                } }),
            (index.isVideoMessage(message) && !thumbnailUrl) && !isImageRendered && (React.createElement("video", { className: "sendbird-parent-message-info-item__thumbnail-message__video" },
                React.createElement("source", { src: (message === null || message === void 0 ? void 0 : message.url) || (message === null || message === void 0 ? void 0 : message.plainUrl), type: message === null || message === void 0 ? void 0 : message.type }))),
            React.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__image-cover" }),
            (index.isVideoMessage(message) || index.isGifMessage(message)) && (React.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__icon-wrapper" },
                React.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__icon-wrapper__icon" },
                    React.createElement(ui_Icon.default, { type: index.isVideoMessage(message) ? ui_Icon.IconTypes.PLAY : ui_Icon.IconTypes.GIF, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "34px", height: "34px" })))))),
        index.getUIKitMessageType(message) === ((_k = index.getUIKitMessageTypes === null || index.getUIKitMessageTypes === void 0 ? void 0 : index.getUIKitMessageTypes()) === null || _k === void 0 ? void 0 : _k.UNKNOWN) && (React.createElement("div", { className: "sendbird-parent-message-info-item__unknown-message" },
            React.createElement(ui_Label.Label, { className: "sendbird-parent-message-info-item__unknown-message__header", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE),
            React.createElement(ui_Label.Label, { className: "sendbird-parent-message-info-item__unknown-message__description", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.UNKNOWN__CANNOT_READ_MESSAGE))),
        isReactionActivated && (React.createElement("div", { className: "sendbird-parent-message-info__reactions" },
            React.createElement(ui_EmojiReactions, { userId: currentUserId, message: message, channel: currentChannel, isByMe: false, emojiContainer: emojiContainer, memberNicknamesMap: nicknamesMap, toggleReaction: toggleReaction, onPressUserProfile: onPressUserProfileHandler })))));
}

module.exports = ParentMessageInfoItem;
//# sourceMappingURL=ParentMessageInfoItem.js.map

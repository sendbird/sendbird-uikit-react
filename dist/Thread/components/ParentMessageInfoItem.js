import React__default, { useMemo, useState } from 'react';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import { l as isUserMessage, e as isEditedMessage, m as getUIKitMessageType, n as getUIKitMessageTypes, o as getUIKitFileType, t as truncateString, c as isMultipleFilesMessage, i as isVoiceMessage, p as isThumbnailMessage, q as isSentMessage, r as isVideoMessage, s as isGifMessage } from '../../chunks/bundle-WrTlYypL.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import ImageRenderer from '../../ui/ImageRenderer.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import TextButton from '../../ui/TextButton.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import EmojiReactions from '../../ui/EmojiReactions.js';
import { useThreadContext } from '../context.js';
import { VoiceMessageItemBody } from '../../ui/VoiceMessageItemBody.js';
import { T as TextFragment } from '../../chunks/bundle-1q5AhvE7.js';
import { t as tokenizeMessage } from '../../chunks/bundle-coC6nc_5.js';
import { u as useThreadMessageKindKeySelector, a as useFileInfoListWithUploaded, M as MultipleFilesMessageItemBody, T as ThreadMessageKind } from '../../chunks/bundle-2C9iP99S.js';
import { u as useMediaQueryContext } from '../../chunks/bundle-qlkGlvyT.js';
import { C as Colors } from '../../chunks/bundle-02rQraFs.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../withSendbird.js';
import '../../ui/ReactionBadge.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../ui/ContextMenu.js';
import 'react-dom';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle--BlhOpUS.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
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
import '../../Message/context.js';
import '../../chunks/bundle-EHXBDBJS.js';
import '../../chunks/bundle-H77M-_wK.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-1CfFFBx9.js';
import '../context/types.js';
import '@sendbird/chat';
import '../../chunks/bundle-iWB7G7Jl.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/Loader.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-YfeG6LQ5.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';

function ParentMessageInfoItem(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var className = _a.className, message = _a.message, showFileViewer = _a.showFileViewer;
    var _l = (useSendbirdStateContext === null || useSendbirdStateContext === void 0 ? void 0 : useSendbirdStateContext()) || {}, stores = _l.stores, config = _l.config, eventHandlers = _l.eventHandlers;
    var onPressUserProfileHandler = (_b = eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.reaction) === null || _b === void 0 ? void 0 : _b.onPressUserProfile;
    var replyType = config.replyType, isMentionEnabled = config.isMentionEnabled, isReactionEnabled = config.isReactionEnabled;
    var currentUserId = (_d = (_c = stores === null || stores === void 0 ? void 0 : stores.userStore) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.userId;
    var stringSet = useLocalization().stringSet;
    var _m = useThreadContext(), currentChannel = _m.currentChannel, emojiContainer = _m.emojiContainer, nicknamesMap = _m.nicknamesMap, toggleReaction = _m.toggleReaction;
    var isMobile = useMediaQueryContext().isMobile;
    var threadMessageKindKey = useThreadMessageKindKeySelector({
        threadMessageKind: ThreadMessageKind.PARENT,
        isMobile: isMobile,
    });
    // For MultipleFilesMessage only.
    var statefulFileInfoList = useFileInfoListWithUploaded(message);
    var isMentionedMessage = isMentionEnabled
        && ((_e = message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate) === null || _e === void 0 ? void 0 : _e.length) > 0
        && ((_f = message === null || message === void 0 ? void 0 : message.mentionedUsers) === null || _f === void 0 ? void 0 : _f.length) > 0;
    // Emoji reactions
    var isReactionActivated = isReactionEnabled
        && replyType === 'THREAD'
        && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isSuper)
        && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast)
        && ((_g = message === null || message === void 0 ? void 0 : message.reactions) === null || _g === void 0 ? void 0 : _g.length) > 0;
    var tokens = useMemo(function () {
        if (isMentionedMessage) {
            return tokenizeMessage({
                mentionedUsers: message === null || message === void 0 ? void 0 : message.mentionedUsers,
                messageText: message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate,
            });
        }
        return tokenizeMessage({
            messageText: message === null || message === void 0 ? void 0 : message.message,
        });
    }, [message === null || message === void 0 ? void 0 : message.updatedAt, message === null || message === void 0 ? void 0 : message.message]);
    // Thumbnail mesage
    var _o = useState(false), isImageRendered = _o[0], setImageRendered = _o[1];
    var thumbnailUrl = ((_h = message === null || message === void 0 ? void 0 : message.thumbnails) === null || _h === void 0 ? void 0 : _h.length) > 0
        ? (_j = message === null || message === void 0 ? void 0 : message.thumbnails[0]) === null || _j === void 0 ? void 0 : _j.url : '';
    return (React__default.createElement("div", { className: "sendbird-parent-message-info-item ".concat(className) },
        isUserMessage(message) && (React__default.createElement(Label, { className: "sendbird-parent-message-info-item__text-message", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_1 },
            React__default.createElement(TextFragment, { tokens: tokens }),
            isEditedMessage(message) && (React__default.createElement(Label, { className: "sendbird-parent-message-info-item__text-message edited", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_2 }, " ".concat(stringSet.MESSAGE_EDITED, " "))))),
        (getUIKitMessageType(message) === getUIKitMessageTypes().FILE) && (React__default.createElement("div", { className: "sendbird-parent-message-info-item__file-message" },
            React__default.createElement("div", { className: "sendbird-parent-message-info-item__file-message__file-icon" },
                React__default.createElement(Icon, { className: "sendbird-parent-message-info-item__file-message__file-icon__icon", type: {
                        IMAGE: IconTypes.PHOTO,
                        VIDEO: IconTypes.PLAY,
                        AUDIO: IconTypes.FILE_AUDIO,
                        GIF: IconTypes.GIF,
                        OTHERS: IconTypes.FILE_DOCUMENT,
                    }[getUIKitFileType(message === null || message === void 0 ? void 0 : message.type)], fillColor: IconColors.PRIMARY, width: "24px", height: "24px" })),
            React__default.createElement(TextButton, { className: "sendbird-parent-message-info-item__file-message__file-name", onClick: function () { window.open(message === null || message === void 0 ? void 0 : message.url); }, color: Colors.ONBACKGROUND_1 },
                React__default.createElement(Label, { className: "sendbird-parent-message-info-item__file-message__file-name__text", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_1 }, truncateString((message === null || message === void 0 ? void 0 : message.name) || (message === null || message === void 0 ? void 0 : message.url), 30))))),
        isMultipleFilesMessage(message) && (React__default.createElement(MultipleFilesMessageItemBody, { className: "sendbird-parent-message-info-item__multiple-files-message-wrapper", message: message, isByMe: false, isReactionEnabled: isReactionEnabled, threadMessageKindKey: threadMessageKindKey, statefulFileInfoList: statefulFileInfoList })),
        isVoiceMessage(message) && (React__default.createElement("div", { className: "sendbird-parent-message-info-item__voice-message" },
            React__default.createElement(VoiceMessageItemBody, { className: "sendbird-parent-message-info-item__voice-message__item", message: message, channelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url, isByMe: false, isReactionEnabled: isReactionEnabled }))),
        isThumbnailMessage(message) && (React__default.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message", onClick: function () {
                if (isSentMessage(message)) {
                    showFileViewer(true);
                }
            } },
            React__default.createElement(ImageRenderer, { className: "sendbird-parent-message-info-item__thumbnail-message__thumbnail", url: thumbnailUrl || (message === null || message === void 0 ? void 0 : message.url) || (message === null || message === void 0 ? void 0 : message.plainUrl), alt: message === null || message === void 0 ? void 0 : message.type, width: "200px", height: "148px", onLoad: function () { setImageRendered(true); }, placeHolder: function (_a) {
                    var style = _a.style;
                    return (React__default.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__placeholder", style: style },
                        React__default.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__placeholder__icon" },
                            React__default.createElement(Icon, { type: isVideoMessage(message) ? IconTypes.PLAY : IconTypes.PHOTO, fillColor: IconColors.ON_BACKGROUND_2, width: "34px", height: "34px" }))));
                } }),
            (isVideoMessage(message) && !thumbnailUrl) && !isImageRendered && (React__default.createElement("video", { className: "sendbird-parent-message-info-item__thumbnail-message__video" },
                React__default.createElement("source", { src: (message === null || message === void 0 ? void 0 : message.url) || (message === null || message === void 0 ? void 0 : message.plainUrl), type: message === null || message === void 0 ? void 0 : message.type }))),
            React__default.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__image-cover" }),
            (isVideoMessage(message) || isGifMessage(message)) && (React__default.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__icon-wrapper" },
                React__default.createElement("div", { className: "sendbird-parent-message-info-item__thumbnail-message__icon-wrapper__icon" },
                    React__default.createElement(Icon, { type: isVideoMessage(message) ? IconTypes.PLAY : IconTypes.GIF, fillColor: IconColors.ON_BACKGROUND_2, width: "34px", height: "34px" })))))),
        getUIKitMessageType(message) === ((_k = getUIKitMessageTypes === null || getUIKitMessageTypes === void 0 ? void 0 : getUIKitMessageTypes()) === null || _k === void 0 ? void 0 : _k.UNKNOWN) && (React__default.createElement("div", { className: "sendbird-parent-message-info-item__unknown-message" },
            React__default.createElement(Label, { className: "sendbird-parent-message-info-item__unknown-message__header", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE),
            React__default.createElement(Label, { className: "sendbird-parent-message-info-item__unknown-message__description", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_2 }, stringSet.UNKNOWN__CANNOT_READ_MESSAGE))),
        isReactionActivated && (React__default.createElement("div", { className: "sendbird-parent-message-info__reactions" },
            React__default.createElement(EmojiReactions, { userId: currentUserId, message: message, channel: currentChannel, isByMe: false, emojiContainer: emojiContainer, memberNicknamesMap: nicknamesMap, toggleReaction: toggleReaction, onPressUserProfile: onPressUserProfileHandler })))));
}

export { ParentMessageInfoItem as default };
//# sourceMappingURL=ParentMessageInfoItem.js.map

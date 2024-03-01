import { _ as __assign, c as __spreadArray } from '../../chunks/bundle-UnAcr6wX.js';
import React__default, { useState, useContext, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { f as format } from '../../chunks/bundle-ePTRDi6d.js';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import DateSeparator from '../../ui/DateSeparator.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import { R as RemoveMessage } from '../../chunks/bundle-zKLRntCV.js';
import { F as FileViewer } from '../../chunks/bundle-YfeG6LQ5.js';
import { useThreadContext } from '../context.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { S as SuggestedMentionList } from '../../chunks/bundle-P_s1ZfLh.js';
import MessageInput from '../../ui/MessageInput.js';
import { ThreadListStateTypes } from '../context/types.js';
import { M as MessageInputKeys } from '../../chunks/bundle-NK74hfcu.js';
import ContextMenu, { MenuItems } from '../../ui/ContextMenu.js';
import { A as Avatar } from '../../chunks/bundle-LbQw2cVx.js';
import { a as UserProfileContext } from '../../chunks/bundle-jDtVwIPR.js';
import UserProfile from '../../ui/UserProfile.js';
import { MessageMenu } from '../../ui/MessageItemMenu.js';
import { MessageEmojiMenu } from '../../ui/MessageItemReactionMenu.js';
import { n as getUIKitMessageTypes, h as getSenderName, w as getClassName, K as isOGMessage, L as isTextMessage, i as isVoiceMessage, m as getUIKitMessageType, c as isMultipleFilesMessage, p as isThumbnailMessage } from '../../chunks/bundle-WrTlYypL.js';
import { M as MessageStatus } from '../../chunks/bundle-FTNAU8Uq.js';
import EmojiReactions from '../../ui/EmojiReactions.js';
import TextMessageItemBody from '../../ui/TextMessageItemBody.js';
import OGMessageItemBody from '../../ui/OGMessageItemBody.js';
import FileMessageItemBody from '../../ui/FileMessageItemBody.js';
import ThumbnailMessageItemBody from '../../ui/ThumbnailMessageItemBody.js';
import UnknownMessageItemBody from '../../ui/UnknownMessageItemBody.js';
import { VoiceMessageItemBody } from '../../ui/VoiceMessageItemBody.js';
import { u as useMediaQueryContext } from '../../chunks/bundle-qlkGlvyT.js';
import { u as useLongPress } from '../../chunks/bundle-okHpD60h.js';
import { M as MobileMenu } from '../../chunks/bundle-Z-iEmjEQ.js';
import { u as useThreadMessageKindKeySelector, a as useFileInfoListWithUploaded, M as MultipleFilesMessageItemBody, T as ThreadMessageKind } from '../../chunks/bundle-2C9iP99S.js';
import { R as Role } from '../../chunks/bundle-AGNrfX7p.js';
import { useDirtyGetMentions } from '../../Message/hooks/useDirtyGetMentions.js';
import { g as getIsReactionEnabled } from '../../chunks/bundle-inBt684F.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-CRwhglru.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-zcfKjxS7.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-EHXBDBJS.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle-H77M-_wK.js';
import '@sendbird/chat/message';
import '../../utils/message/getOutgoingMessageState.js';
import '@sendbird/chat';
import '../../chunks/bundle-iWB7G7Jl.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '../../withSendbird.js';
import '../../chunks/bundle-VwofrwBu.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../ui/SortByRow.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../sendbirdSelectors.js';
import '../../ui/ReactionButton.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../ui/ReactionBadge.js';
import '../../ui/BottomSheet.js';
import '../../ui/UserListItem.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../Message/context.js';
import '../../chunks/bundle-1q5AhvE7.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-S6OaNh10.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';

function ThreadListItemContent(_a) {
    var _b, _c, _d, _e, _f;
    var className = _a.className, userId = _a.userId, channel = _a.channel, message = _a.message, _g = _a.disabled, disabled = _g === void 0 ? false : _g, _h = _a.chainTop, chainTop = _h === void 0 ? false : _h, _j = _a.chainBottom, chainBottom = _j === void 0 ? false : _j, _k = _a.isMentionEnabled, isMentionEnabled = _k === void 0 ? false : _k, _l = _a.isReactionEnabled, isReactionEnabled = _l === void 0 ? false : _l, _m = _a.disableQuoteMessage, disableQuoteMessage = _m === void 0 ? false : _m, replyType = _a.replyType, nicknamesMap = _a.nicknamesMap, emojiContainer = _a.emojiContainer, showEdit = _a.showEdit, showRemove = _a.showRemove, showFileViewer = _a.showFileViewer, resendMessage = _a.resendMessage, toggleReaction = _a.toggleReaction, onReplyInThread = _a.onReplyInThread;
    var messageTypes = getUIKitMessageTypes();
    var isMobile = useMediaQueryContext().isMobile;
    var dateLocale = useLocalization().dateLocale;
    var _o = (useSendbirdStateContext === null || useSendbirdStateContext === void 0 ? void 0 : useSendbirdStateContext()) || {}, config = _o.config, eventHandlers = _o.eventHandlers;
    var onPressUserProfileHandler = (_b = eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.reaction) === null || _b === void 0 ? void 0 : _b.onPressUserProfile;
    var _p = useState(false), supposedHover = _p[0], setSupposedHover = _p[1];
    var _q = useContext(UserProfileContext), disableUserProfile = _q.disableUserProfile, renderUserProfile = _q.renderUserProfile;
    var deleteMessage = useThreadContext().deleteMessage;
    var avatarRef = useRef(null);
    var isByMe = (userId === ((_c = message === null || message === void 0 ? void 0 : message.sender) === null || _c === void 0 ? void 0 : _c.userId))
        || ((message === null || message === void 0 ? void 0 : message.sendingStatus) === 'pending')
        || ((message === null || message === void 0 ? void 0 : message.sendingStatus) === 'failed');
    var useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
        && (message === null || message === void 0 ? void 0 : message.parentMessageId) && (message === null || message === void 0 ? void 0 : message.parentMessage)
        && !disableQuoteMessage);
    var supposedHoverClassName = supposedHover ? 'sendbird-mouse-hover' : '';
    var isReactionEnabledInChannel = isReactionEnabled && !(channel === null || channel === void 0 ? void 0 : channel.isEphemeral);
    var isOgMessageEnabledInGroupChannel = channel.isGroupChannel() && config.groupChannel.enableOgtag;
    // Mobile
    var mobileMenuRef = useRef(null);
    var _r = useState(false), showMobileMenu = _r[0], setShowMobileMenu = _r[1];
    var longPress = useLongPress({
        onLongPress: function () {
            if (isMobile) {
                setShowMobileMenu(true);
            }
        },
    }, {
        shouldPreventDefault: false,
    });
    var threadMessageKindKey = useThreadMessageKindKeySelector({
        threadMessageKind: ThreadMessageKind.CHILD,
        isMobile: isMobile,
    });
    // For MultipleFilesMessage only.
    var statefulFileInfoList = useFileInfoListWithUploaded(message);
    return (React__default.createElement("div", { className: "sendbird-thread-list-item-content ".concat(className, " ").concat(isByMe ? 'outgoing' : 'incoming'), ref: mobileMenuRef },
        React__default.createElement("div", { className: "sendbird-thread-list-item-content__left ".concat(isReactionEnabledInChannel ? 'use-reaction' : '', " ").concat(isByMe ? 'outgoing' : 'incoming') },
            (!isByMe && !chainBottom) && (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) {
                    var _a, _b, _c;
                    return (React__default.createElement(Avatar, { className: "sendbird-thread-list-item-content__left__avatar", src: ((_b = (_a = channel === null || channel === void 0 ? void 0 : channel.members) === null || _a === void 0 ? void 0 : _a.find(function (member) { var _a; return (member === null || member === void 0 ? void 0 : member.userId) === ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId); })) === null || _b === void 0 ? void 0 : _b.profileUrl) || ((_c = message === null || message === void 0 ? void 0 : message.sender) === null || _c === void 0 ? void 0 : _c.profileUrl) || '', ref: avatarRef, width: "28px", height: "28px", onClick: function () {
                            if (!disableUserProfile) {
                                toggleDropdown === null || toggleDropdown === void 0 ? void 0 : toggleDropdown();
                            }
                        } }));
                }, menuItems: function (closeDropdown) { return (renderUserProfile
                    ? renderUserProfile({
                        user: message === null || message === void 0 ? void 0 : message.sender,
                        close: closeDropdown,
                        currentUserId: userId,
                        avatarRef: avatarRef,
                    })
                    : (React__default.createElement(MenuItems, { parentRef: avatarRef, parentContainRef: avatarRef, closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                        React__default.createElement(UserProfile, { user: message === null || message === void 0 ? void 0 : message.sender, onSuccess: closeDropdown })))); } })),
            (isByMe && !isMobile) && (React__default.createElement("div", { className: "sendbird-thread-list-item-content-menu ".concat(isReactionEnabledInChannel ? 'use-reaction' : '', " ").concat(isByMe ? 'outgoing' : 'incoming', " ").concat(supposedHoverClassName) },
                React__default.createElement(MessageMenu, { className: "sendbird-thread-list-item-content-menu__normal-menu", channel: channel, message: message, isByMe: isByMe, replyType: replyType, disabled: disabled, showEdit: showEdit, showRemove: showRemove, resendMessage: resendMessage, setSupposedHover: setSupposedHover, onReplyInThread: onReplyInThread, deleteMessage: deleteMessage }),
                isReactionEnabledInChannel && (React__default.createElement(MessageEmojiMenu, { className: "sendbird-thread-list-item-content-menu__reaction-menu", message: message, userId: userId, emojiContainer: emojiContainer, toggleReaction: toggleReaction, setSupposedHover: setSupposedHover }))))),
        React__default.createElement("div", __assign({ className: "sendbird-thread-list-item-content__middle" }, (isMobile) ? __assign({}, longPress) : {}),
            (!isByMe && !chainTop && !useReplying) && (React__default.createElement(Label, { className: "sendbird-thread-list-item-content__middle__sender-name", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, ((_e = (_d = channel === null || channel === void 0 ? void 0 : channel.members) === null || _d === void 0 ? void 0 : _d.find(function (member) { var _a; return (member === null || member === void 0 ? void 0 : member.userId) === ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId); })) === null || _e === void 0 ? void 0 : _e.nickname)
                || getSenderName(message)
            // TODO: Divide getting profileUrl logic to utils
            )),
            React__default.createElement("div", { className: getClassName(['sendbird-thread-list-item-content__middle__body-container']) },
                (isByMe && !chainBottom) && (React__default.createElement("div", { className: getClassName(['sendbird-thread-list-item-content__middle__body-container__created-at', 'left', supposedHoverClassName]) },
                    React__default.createElement("div", { className: "sendbird-thread-list-item-content__middle__body-container__created-at__component-container" },
                        React__default.createElement(MessageStatus, { message: message, channel: channel })))),
                isOgMessageEnabledInGroupChannel && isOGMessage(message)
                    ? (React__default.createElement(OGMessageItemBody, { className: "sendbird-thread-list-item-content__middle__message-item-body", message: message, isByMe: isByMe, isMentionEnabled: isMentionEnabled, isReactionEnabled: isReactionEnabledInChannel })) : isTextMessage(message) && (React__default.createElement(TextMessageItemBody, { className: "sendbird-thread-list-item-content__middle__message-item-body", message: message, isByMe: isByMe, isMentionEnabled: isMentionEnabled, isReactionEnabled: isReactionEnabledInChannel })),
                isVoiceMessage(message) && (React__default.createElement(VoiceMessageItemBody, { className: "sendbird-thread-list-item-content__middle__message-item-body", message: message, channelUrl: channel === null || channel === void 0 ? void 0 : channel.url, isByMe: isByMe, isReactionEnabled: isReactionEnabledInChannel })),
                (getUIKitMessageType(message) === messageTypes.FILE) && (React__default.createElement(FileMessageItemBody, { className: "sendbird-thread-list-item-content__middle__message-item-body", message: message, isByMe: isByMe, isReactionEnabled: isReactionEnabledInChannel, truncateLimit: isByMe ? 18 : 14 })),
                isMultipleFilesMessage(message) && (React__default.createElement(MultipleFilesMessageItemBody, { className: "sendbird-thread-list-item-content__middle__message-item-body", message: message, isByMe: isByMe, isReactionEnabled: isReactionEnabled, threadMessageKindKey: threadMessageKindKey, statefulFileInfoList: statefulFileInfoList })),
                (isThumbnailMessage(message)) && (React__default.createElement(ThumbnailMessageItemBody, { className: "sendbird-thread-list-item-content__middle__message-item-body", message: message, isByMe: isByMe, isReactionEnabled: isReactionEnabledInChannel, showFileViewer: showFileViewer, style: {
                        width: isMobile ? '100%' : '200px',
                        height: '148px',
                    } })),
                (getUIKitMessageType(message) === messageTypes.UNKNOWN) && (React__default.createElement(UnknownMessageItemBody, { className: "sendbird-thread-list-item-content__middle__message-item-body", message: message, isByMe: isByMe, isReactionEnabled: isReactionEnabledInChannel })),
                (isReactionEnabledInChannel && ((_f = message === null || message === void 0 ? void 0 : message.reactions) === null || _f === void 0 ? void 0 : _f.length) > 0) && (React__default.createElement("div", { className: getClassName([
                        'sendbird-thread-list-item-content-reactions',
                        (!isByMe
                            || isThumbnailMessage(message)
                            || (isOgMessageEnabledInGroupChannel && isOGMessage(message))
                            || isMultipleFilesMessage(message)) ? '' : 'primary',
                    ]) },
                    React__default.createElement(EmojiReactions, { userId: userId, message: message, channel: channel, isByMe: isByMe, emojiContainer: emojiContainer, memberNicknamesMap: nicknamesMap, toggleReaction: toggleReaction, onPressUserProfile: onPressUserProfileHandler }))),
                (!isByMe && !chainBottom) && (React__default.createElement(Label, { className: getClassName(['sendbird-thread-list-item-content__middle__body-container__created-at', 'right', supposedHoverClassName]), type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, format((message === null || message === void 0 ? void 0 : message.createdAt) || 0, 'p', {
                    locale: dateLocale,
                }))))),
        React__default.createElement("div", { className: "sendbird-thread-list-item-content__right ".concat(chainTop ? 'chain-top' : '', " ").concat(isByMe ? 'outgoing' : 'incoming') }, (!isByMe && !isMobile) && (React__default.createElement("div", { className: "sendbird-thread-list-item-content-menu ".concat(supposedHoverClassName) },
            isReactionEnabledInChannel && (React__default.createElement(MessageEmojiMenu, { className: "sendbird-thread-list-item-content-menu__reaction-menu", message: message, userId: userId, emojiContainer: emojiContainer, toggleReaction: toggleReaction, setSupposedHover: setSupposedHover })),
            React__default.createElement(MessageMenu, { className: "sendbird-thread-list-item-content-menu__normal-menu", channel: channel, message: message, isByMe: isByMe, replyType: replyType, disabled: disabled, showRemove: showRemove, resendMessage: resendMessage, setSupposedHover: setSupposedHover, onReplyInThread: onReplyInThread, deleteMessage: deleteMessage })))),
        showMobileMenu && (React__default.createElement(MobileMenu, { parentRef: mobileMenuRef, channel: channel, message: message, userId: userId, replyType: replyType, hideMenu: function () {
                setShowMobileMenu(false);
            }, isReactionEnabled: isReactionEnabled, isByMe: isByMe, emojiContainer: emojiContainer, showEdit: showEdit, showRemove: showRemove, toggleReaction: toggleReaction, isOpenedFromThread: true, deleteMessage: deleteMessage }))));
}

function ThreadListItem(_a) {
    var _b, _c, _d, _e;
    var className = _a.className, message = _a.message, chainTop = _a.chainTop, chainBottom = _a.chainBottom, hasSeparator = _a.hasSeparator, renderCustomSeparator = _a.renderCustomSeparator, handleScroll = _a.handleScroll;
    var _f = useSendbirdStateContext(), stores = _f.stores, config = _f.config;
    var isReactionEnabled = config.isReactionEnabled, isMentionEnabled = config.isMentionEnabled, isOnline = config.isOnline, replyType = config.replyType, userMention = config.userMention, logger = config.logger;
    var userId = (_c = (_b = stores === null || stores === void 0 ? void 0 : stores.userStore) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.userId;
    var _g = useLocalization(), dateLocale = _g.dateLocale, stringSet = _g.stringSet;
    var threadContext = useThreadContext === null || useThreadContext === void 0 ? void 0 : useThreadContext();
    var currentChannel = threadContext.currentChannel, nicknamesMap = threadContext.nicknamesMap, emojiContainer = threadContext.emojiContainer, toggleReaction = threadContext.toggleReaction, threadListState = threadContext.threadListState, updateMessage = threadContext.updateMessage, resendMessage = threadContext.resendMessage, deleteMessage = threadContext.deleteMessage, isMuted = threadContext.isMuted, isChannelFrozen = threadContext.isChannelFrozen;
    var openingMessage = threadContext === null || threadContext === void 0 ? void 0 : threadContext.message;
    var _h = useState(false), showEdit = _h[0], setShowEdit = _h[1];
    var _j = useState(false), showRemove = _j[0], setShowRemove = _j[1];
    var _k = useState(false), showFileViewer = _k[0], setShowFileViewer = _k[1];
    var usingReaction = getIsReactionEnabled({
        globalLevel: isReactionEnabled,
        isSuper: currentChannel.isSuper,
        isBroadcast: currentChannel.isBroadcast,
    });
    // Move to message
    var messageScrollRef = useRef(null);
    useLayoutEffect(function () {
        var _a;
        if ((openingMessage === null || openingMessage === void 0 ? void 0 : openingMessage.messageId) === (message === null || message === void 0 ? void 0 : message.messageId) && (messageScrollRef === null || messageScrollRef === void 0 ? void 0 : messageScrollRef.current)) {
            (_a = messageScrollRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: 'center', inline: 'center' });
        }
    }, [openingMessage, messageScrollRef === null || messageScrollRef === void 0 ? void 0 : messageScrollRef.current]);
    // reactions
    useLayoutEffect(function () {
        handleScroll === null || handleScroll === void 0 ? void 0 : handleScroll();
    }, [showEdit, (_d = message === null || message === void 0 ? void 0 : message.reactions) === null || _d === void 0 ? void 0 : _d.length]);
    // mention
    var editMessageInputRef = useRef(null);
    var _l = useState(''), mentionNickname = _l[0], setMentionNickname = _l[1];
    var _m = useState([]), mentionedUsers = _m[0], setMentionedUsers = _m[1];
    var _o = useState([]), mentionedUserIds = _o[0], setMentionedUserIds = _o[1];
    var _p = useState(null), messageInputEvent = _p[0], setMessageInputEvent = _p[1];
    var _q = useState(null), selectedUser = _q[0], setSelectedUser = _q[1];
    var _r = useState([]), mentionSuggestedUsers = _r[0], setMentionSuggestedUsers = _r[1];
    var displaySuggestedMentionList = isOnline
        && isMentionEnabled
        && mentionNickname.length > 0
        && !isMuted
        && !(isChannelFrozen && !(currentChannel.myRole === Role.OPERATOR));
    var mentionNodes = useDirtyGetMentions({ ref: editMessageInputRef }, { logger: logger });
    var ableMention = (mentionNodes === null || mentionNodes === void 0 ? void 0 : mentionNodes.length) < (userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount);
    useEffect(function () {
        setMentionedUsers(mentionedUsers.filter(function (_a) {
            var userId = _a.userId;
            var i = mentionedUserIds.indexOf(userId);
            if (i < 0) {
                return false;
            }
            else {
                mentionedUserIds.splice(i, 1);
                return true;
            }
        }));
    }, [mentionedUserIds]);
    // edit input
    var disabled = !(threadListState === ThreadListStateTypes.INITIALIZED)
        || !isOnline
        || isMuted
        || isChannelFrozen;
    // memorize
    var MemorizedSeparator = useMemo(function () {
        if (typeof renderCustomSeparator === 'function') {
            return renderCustomSeparator === null || renderCustomSeparator === void 0 ? void 0 : renderCustomSeparator({ message: message });
        }
    }, [message, renderCustomSeparator]);
    // Edit message
    if (showEdit && message.isUserMessage()) {
        return (React__default.createElement(React__default.Fragment, null,
            displaySuggestedMentionList && (React__default.createElement(SuggestedMentionList, { targetNickname: mentionNickname, inputEvent: messageInputEvent, 
                // renderUserMentionItem={renderUserMentionItem}
                onUserItemClick: function (user) {
                    if (user) {
                        setMentionedUsers(__spreadArray(__spreadArray([], mentionedUsers, true), [user], false));
                    }
                    setMentionNickname('');
                    setSelectedUser(user);
                    setMessageInputEvent(null);
                }, onFocusItemChange: function () {
                    setMessageInputEvent(null);
                }, onFetchUsers: function (users) {
                    setMentionSuggestedUsers(users);
                }, ableAddMention: ableMention, maxMentionCount: userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount, maxSuggestionCount: userMention === null || userMention === void 0 ? void 0 : userMention.maxSuggestionCount })),
            React__default.createElement(MessageInput, { isEdit: true, channel: currentChannel, disabled: disabled, ref: editMessageInputRef, mentionSelectedUser: selectedUser, isMentionEnabled: isMentionEnabled, message: message, onStartTyping: function () {
                    var _a;
                    (_a = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.startTyping) === null || _a === void 0 ? void 0 : _a.call(currentChannel);
                }, onUpdateMessage: function (_a) {
                    var _b;
                    var messageId = _a.messageId, message = _a.message, mentionTemplate = _a.mentionTemplate;
                    updateMessage({
                        messageId: messageId,
                        message: message,
                        mentionedUsers: mentionedUsers,
                        mentionTemplate: mentionTemplate,
                    });
                    setShowEdit(false);
                    (_b = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.endTyping) === null || _b === void 0 ? void 0 : _b.call(currentChannel);
                }, onCancelEdit: function () {
                    var _a;
                    setMentionNickname('');
                    setMentionedUsers([]);
                    setMentionedUserIds([]);
                    setMentionSuggestedUsers([]);
                    setShowEdit(false);
                    (_a = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.endTyping) === null || _a === void 0 ? void 0 : _a.call(currentChannel);
                }, onUserMentioned: function (user) {
                    if ((selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.userId) === (user === null || user === void 0 ? void 0 : user.userId)) {
                        setSelectedUser(null);
                        setMentionNickname('');
                    }
                }, onMentionStringChange: function (mentionText) {
                    setMentionNickname(mentionText);
                }, onMentionedUserIdsUpdated: function (userIds) {
                    setMentionedUserIds(userIds);
                }, onKeyDown: function (e) {
                    if (displaySuggestedMentionList && (mentionSuggestedUsers === null || mentionSuggestedUsers === void 0 ? void 0 : mentionSuggestedUsers.length) > 0
                        && ((e.key === MessageInputKeys.Enter && ableMention) || e.key === MessageInputKeys.ArrowUp || e.key === MessageInputKeys.ArrowDown)) {
                        setMessageInputEvent(e);
                        return true;
                    }
                    return false;
                } })));
    }
    return (React__default.createElement("div", { ref: messageScrollRef, className: "sendbird-thread-list-item ".concat(className) },
        hasSeparator && (message === null || message === void 0 ? void 0 : message.createdAt) && (MemorizedSeparator || (React__default.createElement(DateSeparator, null,
            React__default.createElement(Label, { type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, format(message === null || message === void 0 ? void 0 : message.createdAt, stringSet.DATE_FORMAT__THREAD_LIST__DATE_SEPARATOR, { locale: dateLocale }))))),
        React__default.createElement(ThreadListItemContent, { userId: userId, channel: currentChannel, message: message, chainTop: chainTop, chainBottom: chainBottom, isReactionEnabled: usingReaction, isMentionEnabled: isMentionEnabled, disableQuoteMessage: true, replyType: replyType, nicknamesMap: nicknamesMap, emojiContainer: emojiContainer, resendMessage: resendMessage, showRemove: setShowRemove, showFileViewer: setShowFileViewer, toggleReaction: toggleReaction, showEdit: setShowEdit }),
        showRemove && (React__default.createElement(RemoveMessage, { message: message, onCancel: function () { return setShowRemove(false); } })),
        showFileViewer && (React__default.createElement(FileViewer, { message: message, isByMe: ((_e = message === null || message === void 0 ? void 0 : message.sender) === null || _e === void 0 ? void 0 : _e.userId) === userId, onClose: function () { return setShowFileViewer(false); }, onDelete: function () {
                deleteMessage(message);
                setShowFileViewer(false);
            } }))));
}

export { ThreadListItem as default };
//# sourceMappingURL=ThreadListItem.js.map

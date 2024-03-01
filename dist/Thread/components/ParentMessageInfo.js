import { c as __spreadArray, _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default, { useState, useRef, useEffect, useContext } from 'react';
import { f as format } from '../../chunks/bundle-ePTRDi6d.js';
import { R as RemoveMessage } from '../../chunks/bundle-zKLRntCV.js';
import ParentMessageInfoItem from './ParentMessageInfoItem.js';
import { h as getSenderName } from '../../chunks/bundle-WrTlYypL.js';
import { g as getIsReactionEnabled } from '../../chunks/bundle-inBt684F.js';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useThreadContext } from '../context.js';
import { a as UserProfileContext } from '../../chunks/bundle-jDtVwIPR.js';
import { S as SuggestedMentionList } from '../../chunks/bundle-P_s1ZfLh.js';
import { A as Avatar } from '../../chunks/bundle-LbQw2cVx.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import { F as FileViewer } from '../../chunks/bundle-YfeG6LQ5.js';
import { MessageMenu } from '../../ui/MessageItemMenu.js';
import { MessageEmojiMenu } from '../../ui/MessageItemReactionMenu.js';
import ContextMenu, { MenuItems } from '../../ui/ContextMenu.js';
import UserProfile from '../../ui/UserProfile.js';
import MessageInput from '../../ui/MessageInput.js';
import { M as MessageInputKeys } from '../../chunks/bundle-NK74hfcu.js';
import { R as Role } from '../../chunks/bundle-AGNrfX7p.js';
import { u as useMediaQueryContext } from '../../chunks/bundle-qlkGlvyT.js';
import { u as useLongPress } from '../../chunks/bundle-okHpD60h.js';
import { M as MobileMenu } from '../../chunks/bundle-Z-iEmjEQ.js';
import { useDirtyGetMentions } from '../../Message/hooks/useDirtyGetMentions.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-CRwhglru.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-zcfKjxS7.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../ui/ImageRenderer.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/ReactionButton.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../ui/UserListItem.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../withSendbird.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../Message/context.js';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-1q5AhvE7.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-2C9iP99S.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-EHXBDBJS.js';
import '../../chunks/bundle-H77M-_wK.js';
import '../context/types.js';
import '@sendbird/chat';
import '../../chunks/bundle-iWB7G7Jl.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '../../chunks/bundle-VwofrwBu.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';

function ParentMessageInfo(_a) {
    var _b, _c, _d, _e, _f, _g;
    var className = _a.className;
    var _h = useSendbirdStateContext(), stores = _h.stores, config = _h.config;
    var isMentionEnabled = config.isMentionEnabled, isReactionEnabled = config.isReactionEnabled, replyType = config.replyType, isOnline = config.isOnline, userMention = config.userMention, logger = config.logger;
    var userId = (_c = (_b = stores.userStore.user) === null || _b === void 0 ? void 0 : _b.userId) !== null && _c !== void 0 ? _c : '';
    var dateLocale = useLocalization().dateLocale;
    var _j = useThreadContext(), currentChannel = _j.currentChannel, parentMessage = _j.parentMessage, allThreadMessages = _j.allThreadMessages, emojiContainer = _j.emojiContainer, toggleReaction = _j.toggleReaction, updateMessage = _j.updateMessage, deleteMessage = _j.deleteMessage, onMoveToParentMessage = _j.onMoveToParentMessage, onHeaderActionClick = _j.onHeaderActionClick, isMuted = _j.isMuted, isChannelFrozen = _j.isChannelFrozen;
    var isMobile = useMediaQueryContext().isMobile;
    var _k = useState(false), showRemove = _k[0], setShowRemove = _k[1];
    var _l = useState(false), supposedHover = _l[0], setSupposedHover = _l[1];
    var _m = useState(false), showFileViewer = _m[0], setShowFileViewer = _m[1];
    var usingReaction = getIsReactionEnabled({
        globalLevel: isReactionEnabled,
        isSuper: currentChannel.isSuper,
        isBroadcast: currentChannel.isBroadcast,
    });
    var isByMe = userId === parentMessage.sender.userId;
    // Mobile
    var mobileMenuRef = useRef(null);
    var _o = useState(false), showMobileMenu = _o[0], setShowMobileMenu = _o[1];
    var longPress = useLongPress({
        onLongPress: function () {
            if (isMobile) {
                setShowMobileMenu(true);
            }
        },
    }, {
        shouldPreventDefault: false,
    });
    // Edit message
    var _p = useState(false), showEditInput = _p[0], setShowEditInput = _p[1];
    var disabled = !isOnline || isMuted || isChannelFrozen && !((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === Role.OPERATOR);
    // Mention
    var editMessageInputRef = useRef(null);
    var _q = useState(''), mentionNickname = _q[0], setMentionNickname = _q[1];
    var _r = useState([]), mentionedUsers = _r[0], setMentionedUsers = _r[1];
    var _s = useState([]), mentionedUserIds = _s[0], setMentionedUserIds = _s[1];
    var _t = useState(null), messageInputEvent = _t[0], setMessageInputEvent = _t[1];
    var _u = useState(null), selectedUser = _u[0], setSelectedUser = _u[1];
    var _v = useState([]), mentionSuggestedUsers = _v[0], setMentionSuggestedUsers = _v[1];
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
    // User Profile
    var avatarRef = useRef(null);
    var _w = useContext(UserProfileContext), disableUserProfile = _w.disableUserProfile, renderUserProfile = _w.renderUserProfile;
    if (showEditInput && ((_d = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.isUserMessage) === null || _d === void 0 ? void 0 : _d.call(parentMessage))) {
        return (React__default.createElement(React__default.Fragment, null,
            displaySuggestedMentionList && (React__default.createElement(SuggestedMentionList, { className: "parent-message-info--suggested-mention-list", targetNickname: mentionNickname, inputEvent: messageInputEvent, 
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
            React__default.createElement(MessageInput, { channel: currentChannel, isEdit: true, disabled: disabled, ref: editMessageInputRef, mentionSelectedUser: selectedUser, isMentionEnabled: isMentionEnabled, message: parentMessage, onStartTyping: function () {
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
                    setShowEditInput(false);
                    (_b = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.endTyping) === null || _b === void 0 ? void 0 : _b.call(currentChannel);
                }, onCancelEdit: function () {
                    var _a;
                    setMentionNickname('');
                    setMentionedUsers([]);
                    setMentionedUserIds([]);
                    setMentionSuggestedUsers([]);
                    setShowEditInput(false);
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
    return (React__default.createElement("div", __assign({ className: "sendbird-parent-message-info ".concat(className) }, (isMobile) ? __assign({}, longPress) : {}, { ref: mobileMenuRef }),
        React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) {
                var _a, _b, _c;
                return (React__default.createElement(Avatar, { className: "sendbird-parent-message-info__sender", ref: avatarRef, src: ((_b = (_a = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members) === null || _a === void 0 ? void 0 : _a.find(function (m) { var _a; return (m === null || m === void 0 ? void 0 : m.userId) === ((_a = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _a === void 0 ? void 0 : _a.userId); })) === null || _b === void 0 ? void 0 : _b.profileUrl)
                        || ((_c = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _c === void 0 ? void 0 : _c.profileUrl), alt: "thread message sender", width: "40px", height: "40px", onClick: function () {
                        if (!disableUserProfile) {
                            toggleDropdown();
                        }
                    } }));
            }, menuItems: function (closeDropdown) { return (renderUserProfile
                ? renderUserProfile({
                    user: parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender,
                    close: closeDropdown,
                    currentUserId: userId,
                    avatarRef: avatarRef,
                })
                : (React__default.createElement(MenuItems, { parentRef: avatarRef, parentContainRef: avatarRef, closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                    React__default.createElement(UserProfile, { user: parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender, currentUserId: userId, onSuccess: closeDropdown })))); } }),
        React__default.createElement("div", { className: "sendbird-parent-message-info__content" },
            React__default.createElement("div", { className: "sendbird-parent-message-info__content__info" },
                React__default.createElement(Label, { className: "sendbird-parent-message-info__content__info__sender-name".concat(usingReaction ? '--use-reaction' : ''), type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, ((_f = (_e = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members) === null || _e === void 0 ? void 0 : _e.find(function (member) { var _a; return (member === null || member === void 0 ? void 0 : member.userId) === ((_a = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _a === void 0 ? void 0 : _a.userId); })) === null || _f === void 0 ? void 0 : _f.nickname) || (getSenderName === null || getSenderName === void 0 ? void 0 : getSenderName(parentMessage))),
                React__default.createElement(Label, { className: "sendbird-parent-message-info__content__info__sent-at", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, format((parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.createdAt) || 0, 'p', { locale: dateLocale }))),
            React__default.createElement(ParentMessageInfoItem, { message: parentMessage, showFileViewer: setShowFileViewer })),
        !isMobile && (React__default.createElement(MessageMenu, { className: "sendbird-parent-message-info__context-menu ".concat(usingReaction ? 'use-reaction' : '', " ").concat(supposedHover ? 'sendbird-mouse-hover' : ''), channel: currentChannel, message: parentMessage, isByMe: userId === ((_g = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _g === void 0 ? void 0 : _g.userId), disableDeleteMessage: allThreadMessages.length > 0, replyType: replyType, showEdit: setShowEditInput, showRemove: setShowRemove, setSupposedHover: setSupposedHover, onMoveToParentMessage: function () {
                onMoveToParentMessage({ message: parentMessage, channel: currentChannel });
            }, deleteMessage: deleteMessage })),
        (usingReaction && !isMobile) && (React__default.createElement(MessageEmojiMenu, { className: "sendbird-parent-message-info__reaction-menu ".concat(supposedHover ? 'sendbird-mouse-hover' : ''), message: parentMessage, userId: userId, emojiContainer: emojiContainer, toggleReaction: toggleReaction, setSupposedHover: setSupposedHover })),
        showRemove && (React__default.createElement(RemoveMessage, { onCancel: function () { return setShowRemove(false); }, onSubmit: function () {
                onHeaderActionClick === null || onHeaderActionClick === void 0 ? void 0 : onHeaderActionClick();
            }, message: parentMessage })),
        showFileViewer && (React__default.createElement(FileViewer, { message: parentMessage, onClose: function () { return setShowFileViewer(false); }, onDelete: function () {
                deleteMessage(parentMessage)
                    .then(function () {
                    setShowFileViewer(false);
                });
            } })),
        showMobileMenu && (React__default.createElement(MobileMenu, { parentRef: mobileMenuRef, channel: currentChannel, message: parentMessage, userId: userId, replyType: replyType, hideMenu: function () {
                setShowMobileMenu(false);
            }, deleteMessage: deleteMessage, deleteMenuState: (allThreadMessages === null || allThreadMessages === void 0 ? void 0 : allThreadMessages.length) === 0
                ? 'ACTIVE'
                : 'HIDE', isReactionEnabled: usingReaction, isByMe: isByMe, emojiContainer: emojiContainer, showEdit: setShowEditInput, showRemove: setShowRemove, toggleReaction: toggleReaction, isOpenedFromThread: true }))));
}

export { ParentMessageInfo as default };
//# sourceMappingURL=ParentMessageInfo.js.map

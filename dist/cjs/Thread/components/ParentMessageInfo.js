'use strict';

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var index$1 = require('../../chunks/bundle-Ny3NKw-X.js');
var RemoveMessageModal = require('../../chunks/bundle-ulZ-c4e6.js');
var Thread_components_ParentMessageInfoItem = require('./ParentMessageInfoItem.js');
var index = require('../../chunks/bundle-wzulmlgb.js');
var getIsReactionEnabled = require('../../chunks/bundle-FMwBmvVd.js');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var Thread_context = require('../context.js');
var UserProfileContext = require('../../chunks/bundle-DKcL-93i.js');
var SuggestedMentionList = require('../../chunks/bundle-Zp3OkE8e.js');
var ui_Avatar = require('../../chunks/bundle-OfFu3N1i.js');
var ui_Label = require('../../chunks/bundle-26QzFMMl.js');
var ui_FileViewer = require('../../chunks/bundle-x2xJziaA.js');
var ui_MessageItemMenu = require('../../ui/MessageItemMenu.js');
var ui_MessageItemReactionMenu = require('../../ui/MessageItemReactionMenu.js');
var ui_ContextMenu = require('../../ui/ContextMenu.js');
var ui_UserProfile = require('../../ui/UserProfile.js');
var ui_MessageInput = require('../../ui/MessageInput.js');
var _const = require('../../chunks/bundle-m-c1V2jE.js');
var types = require('../../chunks/bundle-a0KHaUDZ.js');
var MediaQueryContext = require('../../chunks/bundle-MZHOyRuu.js');
var useLongPress = require('../../chunks/bundle-Kz-b8WGm.js');
var index$2 = require('../../chunks/bundle-VLUCx6pj.js');
var Message_hooks_useDirtyGetMentions = require('../../Message/hooks/useDirtyGetMentions.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../chunks/bundle-QStqvuCY.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-_t5Ozfpd.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../ui/ImageRenderer.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-KNt569rP.js');
require('../../ui/EmojiReactions.js');
require('../../ui/ReactionBadge.js');
require('../../ui/ReactionButton.js');
require('../../ui/BottomSheet.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../ui/UserListItem.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../withSendbird.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../Message/context.js');
require('../../ui/VoiceMessageItemBody.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-C8zLDVXs.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-TSHHC3WX.js');
require('../../chunks/bundle-Q2J-7okW.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-Oj0T8nIQ.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-xgiAxHSr.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('../context/types.js');
require('@sendbird/chat');
require('../../chunks/bundle-XgxbsHav.js');
require('../../chunks/bundle-ZoEtk6Hz.js');
require('../../chunks/bundle-isZYiJlA.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../chunks/bundle-A_ipX_Gf.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-jh--qeoy.js');
require('dompurify');
require('../../chunks/bundle-9O_6GMbC.js');
require('../../chunks/bundle-q13fOZ_V.js');
require('../../chunks/bundle-TCEkQl9R.js');

function ParentMessageInfo(_a) {
    var _b, _c, _d, _e, _f, _g;
    var className = _a.className;
    var _h = useSendbirdStateContext.useSendbirdStateContext(), stores = _h.stores, config = _h.config;
    var isMentionEnabled = config.isMentionEnabled, isReactionEnabled = config.isReactionEnabled, replyType = config.replyType, isOnline = config.isOnline, userMention = config.userMention, logger = config.logger;
    var userId = (_c = (_b = stores.userStore.user) === null || _b === void 0 ? void 0 : _b.userId) !== null && _c !== void 0 ? _c : '';
    var dateLocale = LocalizationContext.useLocalization().dateLocale;
    var _j = Thread_context.useThreadContext(), currentChannel = _j.currentChannel, parentMessage = _j.parentMessage, allThreadMessages = _j.allThreadMessages, emojiContainer = _j.emojiContainer, toggleReaction = _j.toggleReaction, updateMessage = _j.updateMessage, deleteMessage = _j.deleteMessage, onMoveToParentMessage = _j.onMoveToParentMessage, onHeaderActionClick = _j.onHeaderActionClick, isMuted = _j.isMuted, isChannelFrozen = _j.isChannelFrozen;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var _k = React.useState(false), showRemove = _k[0], setShowRemove = _k[1];
    var _l = React.useState(false), supposedHover = _l[0], setSupposedHover = _l[1];
    var _m = React.useState(false), showFileViewer = _m[0], setShowFileViewer = _m[1];
    var usingReaction = getIsReactionEnabled.getIsReactionEnabled({
        globalLevel: isReactionEnabled,
        isSuper: currentChannel.isSuper,
        isBroadcast: currentChannel.isBroadcast,
    });
    var isByMe = userId === parentMessage.sender.userId;
    // Mobile
    var mobileMenuRef = React.useRef(null);
    var _o = React.useState(false), showMobileMenu = _o[0], setShowMobileMenu = _o[1];
    var longPress = useLongPress.useLongPress({
        onLongPress: function () {
            if (isMobile) {
                setShowMobileMenu(true);
            }
        },
    }, {
        shouldPreventDefault: false,
    });
    // Edit message
    var _p = React.useState(false), showEditInput = _p[0], setShowEditInput = _p[1];
    var disabled = !isOnline || isMuted || isChannelFrozen && !((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === types.Role.OPERATOR);
    // Mention
    var editMessageInputRef = React.useRef(null);
    var _q = React.useState(''), mentionNickname = _q[0], setMentionNickname = _q[1];
    var _r = React.useState([]), mentionedUsers = _r[0], setMentionedUsers = _r[1];
    var _s = React.useState([]), mentionedUserIds = _s[0], setMentionedUserIds = _s[1];
    var _t = React.useState(null), messageInputEvent = _t[0], setMessageInputEvent = _t[1];
    var _u = React.useState(null), selectedUser = _u[0], setSelectedUser = _u[1];
    var _v = React.useState([]), mentionSuggestedUsers = _v[0], setMentionSuggestedUsers = _v[1];
    var displaySuggestedMentionList = isOnline
        && isMentionEnabled
        && mentionNickname.length > 0
        && !isMuted
        && !(isChannelFrozen && !(currentChannel.myRole === types.Role.OPERATOR));
    var mentionNodes = Message_hooks_useDirtyGetMentions.useDirtyGetMentions({ ref: editMessageInputRef }, { logger: logger });
    var ableMention = (mentionNodes === null || mentionNodes === void 0 ? void 0 : mentionNodes.length) < (userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount);
    React.useEffect(function () {
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
    var avatarRef = React.useRef(null);
    var _w = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _w.disableUserProfile, renderUserProfile = _w.renderUserProfile;
    if (showEditInput && ((_d = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.isUserMessage) === null || _d === void 0 ? void 0 : _d.call(parentMessage))) {
        return (React.createElement(React.Fragment, null,
            displaySuggestedMentionList && (React.createElement(SuggestedMentionList.SuggestedMentionList, { className: "parent-message-info--suggested-mention-list", targetNickname: mentionNickname, inputEvent: messageInputEvent, 
                // renderUserMentionItem={renderUserMentionItem}
                onUserItemClick: function (user) {
                    if (user) {
                        setMentionedUsers(_tslib.__spreadArray(_tslib.__spreadArray([], mentionedUsers, true), [user], false));
                    }
                    setMentionNickname('');
                    setSelectedUser(user);
                    setMessageInputEvent(null);
                }, onFocusItemChange: function () {
                    setMessageInputEvent(null);
                }, onFetchUsers: function (users) {
                    setMentionSuggestedUsers(users);
                }, ableAddMention: ableMention, maxMentionCount: userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount, maxSuggestionCount: userMention === null || userMention === void 0 ? void 0 : userMention.maxSuggestionCount })),
            React.createElement(ui_MessageInput, { channel: currentChannel, isEdit: true, disabled: disabled, ref: editMessageInputRef, mentionSelectedUser: selectedUser, isMentionEnabled: isMentionEnabled, message: parentMessage, onStartTyping: function () {
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
                        && ((e.key === _const.MessageInputKeys.Enter && ableMention) || e.key === _const.MessageInputKeys.ArrowUp || e.key === _const.MessageInputKeys.ArrowDown)) {
                        setMessageInputEvent(e);
                        return true;
                    }
                    return false;
                } })));
    }
    return (React.createElement("div", _tslib.__assign({ className: "sendbird-parent-message-info ".concat(className) }, (isMobile) ? _tslib.__assign({}, longPress) : {}, { ref: mobileMenuRef }),
        React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) {
                var _a, _b, _c;
                return (React.createElement(ui_Avatar.Avatar, { className: "sendbird-parent-message-info__sender", ref: avatarRef, src: ((_b = (_a = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members) === null || _a === void 0 ? void 0 : _a.find(function (m) { var _a; return (m === null || m === void 0 ? void 0 : m.userId) === ((_a = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _a === void 0 ? void 0 : _a.userId); })) === null || _b === void 0 ? void 0 : _b.profileUrl)
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
                : (React.createElement(ui_ContextMenu.MenuItems, { parentRef: avatarRef, parentContainRef: avatarRef, closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                    React.createElement(ui_UserProfile, { user: parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender, currentUserId: userId, onSuccess: closeDropdown })))); } }),
        React.createElement("div", { className: "sendbird-parent-message-info__content" },
            React.createElement("div", { className: "sendbird-parent-message-info__content__info" },
                React.createElement(ui_Label.Label, { className: "sendbird-parent-message-info__content__info__sender-name".concat(usingReaction ? '--use-reaction' : ''), type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, ((_f = (_e = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members) === null || _e === void 0 ? void 0 : _e.find(function (member) { var _a; return (member === null || member === void 0 ? void 0 : member.userId) === ((_a = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _a === void 0 ? void 0 : _a.userId); })) === null || _f === void 0 ? void 0 : _f.nickname) || (index.getSenderName === null || index.getSenderName === void 0 ? void 0 : index.getSenderName(parentMessage))),
                React.createElement(ui_Label.Label, { className: "sendbird-parent-message-info__content__info__sent-at", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, index$1.format((parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.createdAt) || 0, 'p', { locale: dateLocale }))),
            React.createElement(Thread_components_ParentMessageInfoItem, { message: parentMessage, showFileViewer: setShowFileViewer })),
        !isMobile && (React.createElement(ui_MessageItemMenu.MessageMenu, { className: "sendbird-parent-message-info__context-menu ".concat(usingReaction ? 'use-reaction' : '', " ").concat(supposedHover ? 'sendbird-mouse-hover' : ''), channel: currentChannel, message: parentMessage, isByMe: userId === ((_g = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender) === null || _g === void 0 ? void 0 : _g.userId), disableDeleteMessage: allThreadMessages.length > 0, replyType: replyType, showEdit: setShowEditInput, showRemove: setShowRemove, setSupposedHover: setSupposedHover, onMoveToParentMessage: function () {
                onMoveToParentMessage({ message: parentMessage, channel: currentChannel });
            }, deleteMessage: deleteMessage })),
        (usingReaction && !isMobile) && (React.createElement(ui_MessageItemReactionMenu.MessageEmojiMenu, { className: "sendbird-parent-message-info__reaction-menu ".concat(supposedHover ? 'sendbird-mouse-hover' : ''), message: parentMessage, userId: userId, emojiContainer: emojiContainer, toggleReaction: toggleReaction, setSupposedHover: setSupposedHover })),
        showRemove && (React.createElement(RemoveMessageModal.RemoveMessage, { onCancel: function () { return setShowRemove(false); }, onSubmit: function () {
                onHeaderActionClick === null || onHeaderActionClick === void 0 ? void 0 : onHeaderActionClick();
            }, message: parentMessage })),
        showFileViewer && (React.createElement(ui_FileViewer.FileViewer, { message: parentMessage, onClose: function () { return setShowFileViewer(false); }, onDelete: function () {
                deleteMessage(parentMessage)
                    .then(function () {
                    setShowFileViewer(false);
                });
            } })),
        showMobileMenu && (React.createElement(index$2.MobileMenu, { parentRef: mobileMenuRef, channel: currentChannel, message: parentMessage, userId: userId, replyType: replyType, hideMenu: function () {
                setShowMobileMenu(false);
            }, deleteMessage: deleteMessage, deleteMenuState: (allThreadMessages === null || allThreadMessages === void 0 ? void 0 : allThreadMessages.length) === 0
                ? 'ACTIVE'
                : 'HIDE', isReactionEnabled: usingReaction, isByMe: isByMe, emojiContainer: emojiContainer, showEdit: setShowEditInput, showRemove: setShowRemove, toggleReaction: toggleReaction, isOpenedFromThread: true }))));
}

module.exports = ParentMessageInfo;
//# sourceMappingURL=ParentMessageInfo.js.map

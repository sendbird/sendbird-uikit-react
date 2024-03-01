'use strict';

var React = require('react');
var ui_ReactionBadge = require('./ReactionBadge.js');
var ui_ReactionButton = require('./ReactionButton.js');
var ui_ImageRenderer = require('./ImageRenderer.js');
var ui_Icon = require('./Icon.js');
var ui_ContextMenu = require('./ContextMenu.js');
var index = require('../chunks/bundle-wzulmlgb.js');
var ui_BottomSheet = require('./BottomSheet.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var ui_UserListItem = require('./UserListItem.js');
var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var ui_Tooltip = require('./Tooltip.js');
var ui_TooltipWrapper = require('./TooltipWrapper.js');
var MediaQueryContext = require('../chunks/bundle-MZHOyRuu.js');
var useLongPress = require('../chunks/bundle-Kz-b8WGm.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var Message_context = require('../Message/context.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-QStqvuCY.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-Gzug-R-w.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');
require('../hooks/useModal.js');
require('../chunks/bundle-CfdtYkhL.js');
require('./IconButton.js');
require('./Button.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../chunks/bundle-DKcL-93i.js');
require('../chunks/bundle-OfFu3N1i.js');
require('../chunks/bundle-uGaTvmsl.js');
require('./MutedAvatarOverlay.js');
require('./Checkbox.js');
require('./UserProfile.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-LutGJd7y.js');
require('../withSendbird.js');

var ReactedMembersBottomSheet = function (_a) {
    var _b, _c, _d;
    var message = _a.message, channel = _a.channel, _e = _a.emojiKey, emojiKey = _e === void 0 ? '' : _e, hideMenu = _a.hideMenu, emojiContainer = _a.emojiContainer, onPressUserProfileHandler = _a.onPressUserProfileHandler;
    var _f = channel.members, members = _f === void 0 ? [] : _f;
    var _g = React.useState(emojiKey), selectedEmoji = _g[0], setSelectedEmoji = _g[1];
    function onPressUserProfileCallBack() {
        if (onPressUserProfileHandler && message) {
            var sender = message === null || message === void 0 ? void 0 : message.sender;
            onPressUserProfileHandler(sender);
        }
    }
    return (React.createElement(ui_BottomSheet, { onBackdropClick: hideMenu },
        React.createElement("div", { className: "sendbird-message__bottomsheet" },
            React.createElement("div", { className: "sendbird-message__bottomsheet__reacted-members" }, (_b = message.reactions) === null || _b === void 0 ? void 0 : _b.map(function (reaction) {
                var emojiUrl = index.getEmojiUrl(emojiContainer, reaction.key);
                return (React.createElement("div", { key: reaction.key, className: "\n                  sendbird-message__bottomsheet__reacted-members__item\n                  ".concat(selectedEmoji === reaction.key ? 'sendbird-message__bottomsheet__reacted-members__item__selected' : '', "\n                "), onClick: function () {
                        setSelectedEmoji(reaction.key);
                    } },
                    React.createElement(ui_ImageRenderer.default, { url: emojiUrl, width: "28px", height: "28px", placeHolder: function (_a) {
                            var style = _a.style;
                            return (React.createElement("div", { style: style },
                                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.QUESTION, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                        } }),
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BUTTON_2, color: selectedEmoji === reaction.key ? ui_Label.LabelColors.PRIMARY : ui_Label.LabelColors.ONBACKGROUND_3 }, reaction.userIds.length)));
            })),
            React.createElement("div", { className: "sendbird-message__bottomsheet__reactor-list" }, // making a member list who reacted to the message with the `selectedEmoji`
            ((_d = (_c = message.reactions) === null || _c === void 0 ? void 0 : _c.find(function (reaction) { return reaction.key === selectedEmoji; })) === null || _d === void 0 ? void 0 : _d.userIds.map(function (userId) { return members.find(function (member) { return member.userId === userId; }); }).filter(function (member) { return member !== undefined; }))
                .map(function (member) { return (React.createElement(ui_UserListItem, { key: member.userId, className: "sendbird-message__bottomsheet__reactor-list__item", user: member, avatarSize: "36px", onClick: onPressUserProfileCallBack })); })))));
};

function ReactionItem(_a) {
    var _b;
    var reaction = _a.reaction, memberNicknamesMap = _a.memberNicknamesMap, setEmojiKey = _a.setEmojiKey, toggleReaction = _a.toggleReaction, emojisMap = _a.emojisMap, channel = _a.channel, message = _a.message;
    var store = useSendbirdStateContext.useSendbirdStateContext();
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var messageStore = Message_context.useMessageContext();
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var userId = store.config.userId;
    var reactedByMe = index.isReactedBy(userId, reaction);
    var showHoverTooltip = (reaction.userIds.length > 0)
        && ((channel === null || channel === void 0 ? void 0 : channel.isGroupChannel()) && !channel.isSuper);
    var handleOnClick = function () {
        setEmojiKey('');
        toggleReaction === null || toggleReaction === void 0 ? void 0 : toggleReaction((message !== null && message !== void 0 ? message : messageStore === null || messageStore === void 0 ? void 0 : messageStore.message), reaction.key, reactedByMe);
    };
    var longPress = useLongPress.useLongPress({
        onLongPress: function () {
            setEmojiKey(reaction.key);
        },
        onClick: handleOnClick,
    }, {
        shouldPreventDefault: true,
        shouldStopPropagation: true,
    });
    return (React.createElement(ui_TooltipWrapper, { className: "sendbird-emoji-reactions__reaction-badge", hoverTooltip: showHoverTooltip ? (React.createElement(ui_Tooltip, null, index.getEmojiTooltipString(reaction, userId, memberNicknamesMap, stringSet))) : React.createElement(React.Fragment, null) },
        React.createElement("div", _tslib.__assign({}, (isMobile
            ? longPress
            : { onClick: handleOnClick })),
            React.createElement(ui_ReactionBadge, { count: reaction.userIds.length, selected: reactedByMe },
                React.createElement(ui_ImageRenderer.default, { circle: true, url: ((_b = emojisMap.get(reaction === null || reaction === void 0 ? void 0 : reaction.key)) === null || _b === void 0 ? void 0 : _b.url) || '', width: "20px", height: "20px", defaultComponent: (React.createElement(ui_Icon.default, { width: "20px", height: "20px", type: ui_Icon.IconTypes.QUESTION })) })))));
}

var AddReactionBadgeItem = function (_a) {
    var onClick = _a.onClick;
    var onlyClick = useLongPress.useLongPress({
        onLongPress: function () { },
        onClick: onClick,
    }, {
        shouldPreventDefault: true,
        shouldStopPropagation: true,
    });
    return (React.createElement("div", _tslib.__assign({ className: "sendbird-emoji-reactions__add-reaction-badge" }, onlyClick),
        React.createElement(ui_ReactionBadge, { isAdd: true },
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.EMOJI_MORE, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "20px", height: "20px" }))));
};

var MobileEmojisBottomSheet = function (_a) {
    var userId = _a.userId, message = _a.message, emojiContainer = _a.emojiContainer, hideMenu = _a.hideMenu, toggleReaction = _a.toggleReaction;
    var emojiAllList = React.useMemo(function () {
        return index.getEmojiListAll(emojiContainer);
    }, [emojiContainer]);
    return (React.createElement(ui_BottomSheet, { onBackdropClick: hideMenu },
        React.createElement("div", { className: "sendbird-message__bottomsheet sendbird-message__emojis-bottomsheet" }, emojiAllList.map(function (emoji) {
            var _a, _b, _c, _d;
            var isReacted = (_d = ((_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.reactions) === null || _a === void 0 ? void 0 : _a.find(function (reaction) { return reaction.key === emoji.key; })) === null || _b === void 0 ? void 0 : _b.userIds) === null || _c === void 0 ? void 0 : _c.some(function (reactorId) { return reactorId === userId; }))) !== null && _d !== void 0 ? _d : false;
            return (React.createElement(ui_ReactionButton, { key: emoji.key, width: "44px", height: "44px", selected: isReacted, onClick: function (e) {
                    e === null || e === void 0 ? void 0 : e.stopPropagation();
                    toggleReaction === null || toggleReaction === void 0 ? void 0 : toggleReaction(message, emoji.key, isReacted);
                    hideMenu();
                }, dataSbId: "ui_mobile_emoji_reactions_menu_".concat(emoji.key) },
                React.createElement(ui_ImageRenderer.default, { url: emoji.url, width: "38px", height: "38px", placeHolder: function (_a) {
                        var style = _a.style;
                        return (React.createElement("div", { style: style },
                            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.QUESTION, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                    } })));
        }))));
};

var EmojiReactions = function (_a) {
    var _b, _c, _d, _e, _f;
    var _g = _a.className, className = _g === void 0 ? '' : _g, userId = _a.userId, message = _a.message, channel = _a.channel, emojiContainer = _a.emojiContainer, memberNicknamesMap = _a.memberNicknamesMap, _h = _a.spaceFromTrigger, spaceFromTrigger = _h === void 0 ? { x: 0, y: 0 } : _h, _j = _a.isByMe, isByMe = _j === void 0 ? false : _j, toggleReaction = _a.toggleReaction, onPressUserProfile = _a.onPressUserProfile;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var addReactionRef = React.useRef(null);
    var _k = React.useState(false), showEmojiList = _k[0], setShowEmojiList = _k[1];
    var _l = React.useState(''), selectedEmojiKey = _l[0], setSelectedEmojiKey = _l[1];
    var emojisMap = index.getEmojiMapAll(emojiContainer);
    var showAddReactionBadge = ((_c = (_b = message.reactions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) < emojisMap.size;
    return (React.createElement("div", { className: index.getClassName([
            className, 'sendbird-emoji-reactions',
            isByMe ? 'outgoing' : 'incoming',
        ]) },
        (((_e = (_d = message.reactions) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 0) && ((_f = message.reactions) === null || _f === void 0 ? void 0 : _f.map(function (reaction) {
            return (React.createElement(ReactionItem, { key: reaction === null || reaction === void 0 ? void 0 : reaction.key, reaction: reaction, memberNicknamesMap: memberNicknamesMap, setEmojiKey: setSelectedEmojiKey, toggleReaction: toggleReaction, emojisMap: emojisMap, channel: channel, message: message }));
        })),
        (!isMobile && showAddReactionBadge) && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_ReactionBadge, { className: "sendbird-emoji-reactions__add-reaction-badge", ref: addReactionRef, isAdd: true, onClick: function (e) {
                    var _a;
                    toggleDropdown();
                    (_a = e === null || e === void 0 ? void 0 : e.stopPropagation) === null || _a === void 0 ? void 0 : _a.call(e);
                } },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.EMOJI_MORE, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "20px", height: "20px" }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.EmojiListItems, { parentRef: addReactionRef, parentContainRef: addReactionRef, closeDropdown: closeDropdown, spaceFromTrigger: spaceFromTrigger }, index.getEmojiListAll(emojiContainer).map(function (emoji) {
                var _a, _b, _c;
                var isReacted = ((_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.reactions) === null || _a === void 0 ? void 0 : _a.find(function (reaction) { return reaction.key === emoji.key; })) === null || _b === void 0 ? void 0 : _b.userIds) === null || _c === void 0 ? void 0 : _c.some(function (reactorId) { return reactorId === userId; })) || false;
                return (React.createElement(ui_ReactionButton, { key: emoji.key, width: "36px", height: "36px", selected: isReacted, onClick: function (e) {
                        closeDropdown();
                        toggleReaction === null || toggleReaction === void 0 ? void 0 : toggleReaction(message, emoji.key, isReacted);
                        e === null || e === void 0 ? void 0 : e.stopPropagation();
                    }, dataSbId: "ui_emoji_reactions_menu_".concat(emoji.key) },
                    React.createElement(ui_ImageRenderer.default, { url: (emoji === null || emoji === void 0 ? void 0 : emoji.url) || '', width: "28px", height: "28px", placeHolder: function (_a) {
                            var style = _a.style;
                            return (React.createElement("div", { style: style },
                                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.QUESTION, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                        } })));
            }))); } })),
        (isMobile && showAddReactionBadge) && (React.createElement(AddReactionBadgeItem, { onClick: function () {
                setShowEmojiList(true);
            } })),
        (isMobile && showEmojiList) && (React.createElement(MobileEmojisBottomSheet, { userId: userId, message: message, emojiContainer: emojiContainer, hideMenu: function () {
                setShowEmojiList(false);
            }, toggleReaction: toggleReaction })),
        (isMobile && selectedEmojiKey && channel !== null) && (React.createElement(ReactedMembersBottomSheet, { message: message, channel: channel, emojiKey: selectedEmojiKey, hideMenu: function () {
                setSelectedEmojiKey('');
            }, emojiContainer: emojiContainer, onPressUserProfileHandler: onPressUserProfile }))));
};

module.exports = EmojiReactions;
//# sourceMappingURL=EmojiReactions.js.map

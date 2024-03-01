'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Icon = require('./Icon.js');
var ui_IconButton = require('./IconButton.js');
var ui_ImageRenderer = require('./ImageRenderer.js');
var ui_ReactionButton = require('./ReactionButton.js');
var index = require('../chunks/bundle-Uw6P-cM9.js');
require('../chunks/bundle-xbdnJE9-.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-SOIkTCep.js');
require('../chunks/bundle-KkCwxjVN.js');
require('../chunks/bundle-Yzhiyr0t.js');
require('../chunks/bundle-jCTpndN0.js');
require('../chunks/bundle-pOf7PZ4G.js');
require('../chunks/bundle-4WvE40Un.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-tNuJSOqI.js');

function MessageEmojiMenu(_a) {
    var className = _a.className, message = _a.message, userId = _a.userId, _b = _a.spaceFromTrigger, spaceFromTrigger = _b === void 0 ? { x: 0, y: 0 } : _b, emojiContainer = _a.emojiContainer, toggleReaction = _a.toggleReaction, setSupposedHover = _a.setSupposedHover;
    var triggerRef = React.useRef(null);
    var containerRef = React.useRef(null);
    if (index.isPendingMessage(message) || index.isFailedMessage(message)) {
        return null;
    }
    return (React.createElement("div", { className: index.getClassName([className, 'sendbird-message-item-reaction-menu']), ref: containerRef },
        React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-message-item-reaction-menu__trigger", ref: triggerRef, width: "32px", height: "32px", onClick: function () {
                    toggleDropdown();
                    setSupposedHover(true);
                }, onBlur: function () {
                    setSupposedHover(false);
                } },
                React.createElement(ui_Icon.default, { className: "sendbird-message-item-reaction-menu__trigger__icon", type: ui_Icon.IconTypes.EMOJI_MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE, width: "24px", height: "24px" }))); }, menuItems: function (close) {
                var closeDropdown = function () {
                    close();
                    setSupposedHover(false);
                };
                return (React.createElement(ui_ContextMenu.EmojiListItems, { parentRef: triggerRef, parentContainRef: containerRef, closeDropdown: closeDropdown, spaceFromTrigger: spaceFromTrigger }, index.getEmojiListAll(emojiContainer).map(function (emoji) {
                    var _a, _b, _c;
                    var isReacted = ((_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.reactions) === null || _a === void 0 ? void 0 : _a.find(function (reaction) { return reaction.key === emoji.key; })) === null || _b === void 0 ? void 0 : _b.userIds) === null || _c === void 0 ? void 0 : _c.some(function (reactorId) { return reactorId === userId; })) || false;
                    return (React.createElement(ui_ReactionButton, { key: emoji.key, width: "36px", height: "36px", selected: isReacted, onClick: function () {
                            closeDropdown();
                            toggleReaction(message, emoji.key, isReacted);
                        }, dataSbId: "ui_emoji_reactions_menu_".concat(emoji.key) },
                        React.createElement(ui_ImageRenderer.default, { url: emoji.url, width: "28px", height: "28px", placeHolder: function (_a) {
                                var style = _a.style;
                                return (React.createElement("div", { style: style },
                                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.QUESTION, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                            } })));
                })));
            } })));
}

exports.MessageEmojiMenu = MessageEmojiMenu;
exports.default = MessageEmojiMenu;
//# sourceMappingURL=MessageItemReactionMenu.js.map

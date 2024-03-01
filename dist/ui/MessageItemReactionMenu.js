import React__default, { useRef } from 'react';
import ContextMenu, { EmojiListItems } from './ContextMenu.js';
import Icon, { IconTypes, IconColors } from './Icon.js';
import IconButton from './IconButton.js';
import ImageRenderer from './ImageRenderer.js';
import ReactionButton from './ReactionButton.js';
import { v as isPendingMessage, u as isFailedMessage, w as getClassName, y as getEmojiListAll } from '../chunks/bundle-Jwc7mleJ.js';
import '../chunks/bundle-xhjHZ041.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-BZ3hPsJ8.js';
import '../chunks/bundle-sR62lMVk.js';
import '../chunks/bundle--MbN9aKT.js';
import '../chunks/bundle-IDH-OOHE.js';
import '../chunks/bundle-FgXHPuhY.js';
import '../chunks/bundle-pjLq9qJd.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-AN6QCsUL.js';

function MessageEmojiMenu(_a) {
    var className = _a.className, message = _a.message, userId = _a.userId, _b = _a.spaceFromTrigger, spaceFromTrigger = _b === void 0 ? { x: 0, y: 0 } : _b, emojiContainer = _a.emojiContainer, toggleReaction = _a.toggleReaction, setSupposedHover = _a.setSupposedHover;
    var triggerRef = useRef(null);
    var containerRef = useRef(null);
    if (isPendingMessage(message) || isFailedMessage(message)) {
        return null;
    }
    return (React__default.createElement("div", { className: getClassName([className, 'sendbird-message-item-reaction-menu']), ref: containerRef },
        React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-message-item-reaction-menu__trigger", ref: triggerRef, width: "32px", height: "32px", onClick: function () {
                    toggleDropdown();
                    setSupposedHover(true);
                }, onBlur: function () {
                    setSupposedHover(false);
                } },
                React__default.createElement(Icon, { className: "sendbird-message-item-reaction-menu__trigger__icon", type: IconTypes.EMOJI_MORE, fillColor: IconColors.CONTENT_INVERSE, width: "24px", height: "24px" }))); }, menuItems: function (close) {
                var closeDropdown = function () {
                    close();
                    setSupposedHover(false);
                };
                return (React__default.createElement(EmojiListItems, { parentRef: triggerRef, parentContainRef: containerRef, closeDropdown: closeDropdown, spaceFromTrigger: spaceFromTrigger }, getEmojiListAll(emojiContainer).map(function (emoji) {
                    var _a, _b, _c;
                    var isReacted = ((_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.reactions) === null || _a === void 0 ? void 0 : _a.find(function (reaction) { return reaction.key === emoji.key; })) === null || _b === void 0 ? void 0 : _b.userIds) === null || _c === void 0 ? void 0 : _c.some(function (reactorId) { return reactorId === userId; })) || false;
                    return (React__default.createElement(ReactionButton, { key: emoji.key, width: "36px", height: "36px", selected: isReacted, onClick: function () {
                            closeDropdown();
                            toggleReaction(message, emoji.key, isReacted);
                        }, dataSbId: "ui_emoji_reactions_menu_".concat(emoji.key) },
                        React__default.createElement(ImageRenderer, { url: emoji.url, width: "28px", height: "28px", placeHolder: function (_a) {
                                var style = _a.style;
                                return (React__default.createElement("div", { style: style },
                                    React__default.createElement(Icon, { type: IconTypes.QUESTION, fillColor: IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                            } })));
                })));
            } })));
}

export { MessageEmojiMenu, MessageEmojiMenu as default };
//# sourceMappingURL=MessageItemReactionMenu.js.map

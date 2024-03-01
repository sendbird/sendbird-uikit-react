import React__default, { useLayoutEffect } from 'react';
import { A as Avatar, a as AvatarDefault } from '../chunks/bundle-LbQw2cVx.js';
import '../chunks/bundle-UnAcr6wX.js';
import './ImageRenderer.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle-fNigAmmf.js';
import './Icon.js';

var TypingDots = function () {
    return (React__default.createElement("div", { className: 'typing-dots-container' },
        React__default.createElement("span", null),
        React__default.createElement("span", null),
        React__default.createElement("span", null)));
};

var AVATAR_BORDER_SIZE = 2;
var AVATAR_DIAMETER_WITHOUT_BORDER = 28;
var AVATAR_DIAMETER = AVATAR_DIAMETER_WITHOUT_BORDER + (AVATAR_BORDER_SIZE * 2);
var LEFT_GAP = 24;
var MAX_PROFILES_COUNT = 3;
var LEFT_FOR_BORDER = AVATAR_BORDER_SIZE;
var AvatarStack = function (props) {
    var sources = props.sources, max = props.max;
    return (React__default.createElement(React__default.Fragment, null,
        " ",
        sources.slice(0, max).map(function (src, index) { return (React__default.createElement(Avatar, { className: 'sendbird-message-content__left__avatar multiple', src: src || '', key: "avatar_stack_item_".concat(src), 
            // TODO: Divide getting profileUrl logic to utils
            width: "".concat(AVATAR_DIAMETER_WITHOUT_BORDER, "px"), height: "".concat(AVATAR_DIAMETER_WITHOUT_BORDER, "px"), zIndex: index, left: "".concat(index * LEFT_GAP - LEFT_FOR_BORDER, "px") })); }),
        " "));
};
var TypingIndicatorBubbleAvatar = function (props) {
    var typingMembers = props.typingMembers;
    var membersCount = typingMembers.length;
    var displayCount = Math.min(membersCount, 4);
    var hiddenCount = membersCount - MAX_PROFILES_COUNT;
    var superImposedWidth = ((displayCount - 1) * (AVATAR_DIAMETER - LEFT_GAP));
    var rightPaddingSize = 12;
    return (React__default.createElement("div", { className: 'sendbird-message-content__left incoming', style: {
            minWidth: (displayCount * AVATAR_DIAMETER) - superImposedWidth + rightPaddingSize,
        } },
        React__default.createElement(AvatarStack, { sources: typingMembers.map(function (member) { return member.profileUrl; }), max: MAX_PROFILES_COUNT }),
        hiddenCount > 0
            ? React__default.createElement(Avatar, { className: 'sendbird-message-content__left__avatar multiple', 
                // TODO: Divide getting profileUrl logic to utils
                width: "".concat(AVATAR_DIAMETER_WITHOUT_BORDER, "px"), height: "".concat(AVATAR_DIAMETER_WITHOUT_BORDER, "px"), zIndex: MAX_PROFILES_COUNT, left: "".concat(MAX_PROFILES_COUNT * LEFT_GAP, "px"), customDefaultComponent: function (_a) {
                    var width = _a.width, height = _a.height;
                    return (React__default.createElement(AvatarDefault, { width: width, height: height, text: "+".concat(hiddenCount) }));
                } })
            : null));
};
var TypingIndicatorBubble = function (props) {
    var typingMembers = props.typingMembers, handleScroll = props.handleScroll;
    if (typingMembers.length === 0)
        return null;
    useLayoutEffect(function () {
        // Keep the scrollBottom value after fetching new message list
        handleScroll === null || handleScroll === void 0 ? void 0 : handleScroll(true);
    }, []);
    return React__default.createElement("div", { className: 'sendbird-message-content incoming', style: { marginBottom: '2px' } },
        React__default.createElement(TypingIndicatorBubbleAvatar, { typingMembers: typingMembers }),
        React__default.createElement("div", { className: 'sendbird-message-content__middle' },
            React__default.createElement(TypingDots, null)));
};

export { TypingIndicatorBubble as default };
//# sourceMappingURL=TypingIndicatorBubble.js.map

'use strict';

function getComponentKeyFromMessage(message) {
    if ('sendingStatus' in message) {
        if (message.sendingStatus === 'succeeded')
            return String(message.messageId);
        return message.reqId;
    }
    return String(message.messageId);
}
function isContextMenuClosed() {
    var _a, _b;
    return (((_a = document.getElementById('sendbird-dropdown-portal')) === null || _a === void 0 ? void 0 : _a.childElementCount) === 0
        && ((_b = document.getElementById('sendbird-emoji-list-portal')) === null || _b === void 0 ? void 0 : _b.childElementCount) === 0);
}
function getMessageTopOffset(messageCreatedAt) {
    var _a;
    var element = (_a = document.querySelectorAll("[data-sb-created-at=\"".concat(messageCreatedAt, "\"]"))) === null || _a === void 0 ? void 0 : _a[0];
    if (element instanceof HTMLElement) {
        return element.offsetTop;
    }
    return null;
}
var isDisabledBecauseFrozen = function (groupChannel) {
    if (!groupChannel)
        return false;
    return groupChannel.isFrozen && groupChannel.myRole !== 'operator';
};
var isDisabledBecauseMuted = function (groupChannel) {
    if (!groupChannel)
        return false;
    return groupChannel.myMutedState === 'muted';
};

exports.getComponentKeyFromMessage = getComponentKeyFromMessage;
exports.getMessageTopOffset = getMessageTopOffset;
exports.isContextMenuClosed = isContextMenuClosed;
exports.isDisabledBecauseFrozen = isDisabledBecauseFrozen;
exports.isDisabledBecauseMuted = isDisabledBecauseMuted;
//# sourceMappingURL=bundle-MGhVSK7j.js.map

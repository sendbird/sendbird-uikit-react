'use strict';

var React = require('react');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var ui_Icon = require('./Icon.js');
var ui_TextButton = require('./TextButton.js');
var index = require('../chunks/bundle-wzulmlgb.js');
var color = require('../chunks/bundle-KNt569rP.js');
var MediaQueryContext = require('../chunks/bundle-MZHOyRuu.js');
require('../chunks/bundle-2dG9SU7T.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-QStqvuCY.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');

function FileMessageItemBody(_a) {
    var _b;
    var className = _a.className, message = _a.message, _c = _a.isByMe, isByMe = _c === void 0 ? false : _c, _d = _a.mouseHover, mouseHover = _d === void 0 ? false : _d, _e = _a.isReactionEnabled, isReactionEnabled = _e === void 0 ? false : _e, _f = _a.truncateLimit, truncateLimit = _f === void 0 ? null : _f;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var truncateMaxNum = truncateLimit || (isMobile ? 20 : null);
    return (React.createElement("div", { className: index.getClassName([
            className,
            'sendbird-file-message-item-body',
            isByMe ? 'outgoing' : 'incoming',
            mouseHover ? 'mouse-hover' : '',
            (isReactionEnabled && ((_b = message === null || message === void 0 ? void 0 : message.reactions) === null || _b === void 0 ? void 0 : _b.length) > 0) ? 'reactions' : '',
        ]) },
        React.createElement("div", { className: "sendbird-file-message-item-body__file-icon" },
            React.createElement(ui_Icon.default, { className: "sendbird-file-message-item-body__file-icon__icon", type: {
                    IMAGE: ui_Icon.IconTypes.PHOTO,
                    VIDEO: ui_Icon.IconTypes.PLAY,
                    AUDIO: ui_Icon.IconTypes.FILE_AUDIO,
                    GIF: ui_Icon.IconTypes.GIF,
                    OTHERS: ui_Icon.IconTypes.FILE_DOCUMENT,
                }[index.getUIKitFileType(message === null || message === void 0 ? void 0 : message.type)], fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" })),
        React.createElement(ui_TextButton, { className: "sendbird-file-message-item-body__file-name", onClick: function () { window.open(message === null || message === void 0 ? void 0 : message.url); }, color: isByMe ? color.Colors.ONCONTENT_1 : color.Colors.ONBACKGROUND_1 },
            React.createElement(ui_Label.Label, { className: "sendbird-file-message-item-body__file-name__text", type: ui_Label.LabelTypography.BODY_1, color: isByMe ? ui_Label.LabelColors.ONCONTENT_1 : ui_Label.LabelColors.ONBACKGROUND_1 }, index.truncateString((message === null || message === void 0 ? void 0 : message.name) || (message === null || message === void 0 ? void 0 : message.url), truncateMaxNum)))));
}

module.exports = FileMessageItemBody;
//# sourceMappingURL=FileMessageItemBody.js.map

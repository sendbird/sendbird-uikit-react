'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var ui_Label = require('../../chunks/bundle-26QzFMMl.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-2dG9SU7T.js');

var FrozenNotification = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: "sendbird-notification sendbird-notification--frozen ".concat(className) },
        React.createElement(ui_Label.Label, { className: "sendbird-notification__text", type: ui_Label.LabelTypography.CAPTION_2 }, stringSet.CHANNEL_FROZEN)));
};

exports.FrozenNotification = FrozenNotification;
exports.default = FrozenNotification;
//# sourceMappingURL=FrozenNotification.js.map

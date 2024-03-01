'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');

function Badge(_a) {
    var count = _a.count, _b = _a.maxLevel, maxLevel = _b === void 0 ? 2 : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var maximumNumber = parseInt('9'.repeat(maxLevel > 6 ? 6 : maxLevel), 10);
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-badge',
        ], false).join(' ') },
        React.createElement("div", { className: "sendbird-badge__text" },
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONCONTENT_1 }, typeof count === 'string'
                ? count
                : count > maximumNumber
                    ? "".concat(maximumNumber).concat(stringSet.BADGE__OVER)
                    : count))));
}

module.exports = Badge;
//# sourceMappingURL=Badge.js.map

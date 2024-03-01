'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
require('../chunks/bundle-eH49AisR.js');

function Tooltip(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.children, children = _c === void 0 ? '' : _c;
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-tooltip',
        ], false).join(' ') },
        React.createElement(ui_Label.Label, { className: "sendbird-tooltip__text", type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONCONTENT_1 }, children)));
}

module.exports = Tooltip;
//# sourceMappingURL=Tooltip.js.map

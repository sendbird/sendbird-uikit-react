'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var useLongPress = require('../chunks/bundle-Kz-b8WGm.js');
var utils = require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-MZHOyRuu.js');

var ReactionButton = React.forwardRef(function (props, ref) {
    var className = props.className, width = props.width, height = props.height, selected = props.selected, _a = props.dataSbId, dataSbId = _a === void 0 ? '' : _a, onClick = props.onClick, children = props.children;
    var onClickHandler = useLongPress.useLongPress({
        onLongPress: utils.noop,
        onClick: onClick,
    }, {
        shouldPreventDefault: true,
        shouldStopPropagation: true,
    });
    return (React.createElement("div", _tslib.__assign({ className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            "sendbird-reaction-button".concat(selected ? '--selected' : ''),
        ], false).join(' '), ref: ref, role: "button", style: { width: width, height: height } }, onClickHandler, { tabIndex: 0, "data-sb-id": dataSbId }),
        React.createElement("div", { className: "sendbird-reaction-button__inner" }, children)));
});

module.exports = ReactionButton;
//# sourceMappingURL=ReactionButton.js.map
'use strict';

var React = require('react');

var FeedbackIconButton = React.forwardRef(function (props, ref) {
    var children = props.children, isSelected = props.isSelected, _a = props.onClick, onClick = _a === void 0 ? function () { } : _a, _b = props.disabled, disabled = _b === void 0 ? false : _b;
    return (React.createElement("button", { className: [
            'sendbird-iconbutton__feedback',
            isSelected ? 'sendbird-iconbutton__feedback__pressed' : '',
            disabled ? 'sendbird-iconbutton__feedback__disabled' : '',
        ].join(' '), ref: ref, type: 'button', onClick: function (e) {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
        }, disabled: disabled },
        React.createElement("span", { className: [
                'sendbird-iconbutton__feedback__inner',
                isSelected ? 'sendbird-iconbutton__feedback__inner__pressed' : '',
                disabled ? 'sendbird-iconbutton__feedback__inner__disabled' : '',
            ].join(' ') }, children)));
});

module.exports = FeedbackIconButton;
//# sourceMappingURL=FeedbackIconButton.js.map

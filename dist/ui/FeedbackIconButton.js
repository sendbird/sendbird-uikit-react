import React__default from 'react';

var FeedbackIconButton = React__default.forwardRef(function (props, ref) {
    var children = props.children, isSelected = props.isSelected, _a = props.onClick, onClick = _a === void 0 ? function () { } : _a, _b = props.disabled, disabled = _b === void 0 ? false : _b;
    return (React__default.createElement("button", { className: [
            'sendbird-iconbutton__feedback',
            isSelected ? 'sendbird-iconbutton__feedback__pressed' : '',
            disabled ? 'sendbird-iconbutton__feedback__disabled' : '',
        ].join(' '), ref: ref, type: 'button', onClick: function (e) {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
        }, disabled: disabled },
        React__default.createElement("span", { className: [
                'sendbird-iconbutton__feedback__inner',
                isSelected ? 'sendbird-iconbutton__feedback__inner__pressed' : '',
                disabled ? 'sendbird-iconbutton__feedback__inner__disabled' : '',
            ].join(' ') }, children)));
});

export { FeedbackIconButton as default };
//# sourceMappingURL=FeedbackIconButton.js.map

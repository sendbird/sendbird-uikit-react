'use strict';

var React = require('react');

function Checkbox(_a) {
    var id = _a.id, _b = _a.checked, checked = _b === void 0 ? false : _b, disabled = _a.disabled, onChange = _a.onChange;
    var _c = React.useState(checked), isChecked = _c[0], setIsCheck = _c[1];
    return (React.createElement("label", { className: [
            'sendbird-checkbox',
            disabled ? 'disabled' : '',
        ].join(' '), htmlFor: id },
        React.createElement("input", { disabled: disabled, id: id, type: "checkbox", checked: isChecked, onClick: function () {
                if (!disabled)
                    setIsCheck(!isChecked);
            }, onChange: onChange }),
        React.createElement("span", { className: [
                'sendbird-checkbox--checkmark',
                disabled ? 'disabled' : '',
            ].join(' ') })));
}

module.exports = Checkbox;
//# sourceMappingURL=Checkbox.js.map

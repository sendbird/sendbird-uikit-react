import React__default, { useState, useCallback } from 'react';
import { _ as __assign } from '../chunks/bundle-xhjHZ041.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import '../withSendbird.js';

/**
 * The default value of `checked` should be null
 * to support both case of controlled and uncontrolled component
 * ref: https://github.com/aaronshaf/react-toggle#props
 */
var noop = function () { };
var TOGGLE_DEFAULT_VALUE = {
    checked: null,
    defaultChecked: false,
    disabled: false,
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
};
var ToggleContext = React__default.createContext(TOGGLE_DEFAULT_VALUE);
function useToggleContext() {
    var context = React__default.useContext(ToggleContext);
    if (context === undefined) {
        throw new Error('@sendbird/uikit-react/ui/Toggle: useToggleContext must be used within a ToggleContainer.');
    }
    return context;
}

// Props Explanation https://github.com/aaronshaf/react-toggle#props
function ToggleContainer(_a) {
    var _b = _a.checked, checked = _b === void 0 ? TOGGLE_DEFAULT_VALUE.checked : _b, // null
    _c = _a.defaultChecked, // null
    defaultChecked = _c === void 0 ? TOGGLE_DEFAULT_VALUE.defaultChecked : _c, _d = _a.disabled, disabled = _d === void 0 ? TOGGLE_DEFAULT_VALUE.disabled : _d, _e = _a.onChange, onChange = _e === void 0 ? TOGGLE_DEFAULT_VALUE.onChange : _e, _f = _a.onFocus, onFocus = _f === void 0 ? TOGGLE_DEFAULT_VALUE.onFocus : _f, _g = _a.onBlur, onBlur = _g === void 0 ? TOGGLE_DEFAULT_VALUE.onBlur : _g, children = _a.children;
    var _h = useState(defaultChecked || false), isChecked = _h[0], setChecked = _h[1];
    var handleChange = useCallback(function (e) {
        if (disabled) {
            return;
        }
        if (checked === null) {
            setChecked(e.currentTarget.checked);
        }
        onChange(e);
    }, [onChange, checked]);
    return (React__default.createElement(ToggleContext.Provider, { value: {
            checked: checked !== null ? checked : isChecked,
            disabled: disabled,
            onChange: handleChange,
            onFocus: function (e) {
                if (!disabled) {
                    onFocus(e);
                }
            },
            onBlur: function (e) {
                if (!disabled) {
                    onBlur(e);
                }
            },
        } }, children));
}

function filterNumber(input) {
    if (typeof input !== 'string' && typeof input !== 'number') {
        try {
            var config = useSendbirdStateContext().config;
            var logger = config.logger;
            logger.warning('@sendbird/uikit-react/ui/Toggle: TypeError - expected string or number.', input);
        }
        catch (_) { /* noop */ }
        return [];
    }
    if (typeof input === 'number') {
        return [input];
    }
    var regex = /(-?\d+)(\.\d+)?/g;
    var numbers = input.match(regex) || [];
    return numbers.map(parseFloat);
}

function ToggleUI(props) {
    var _a;
    var _b = props.reversed, reversed = _b === void 0 ? false : _b, _c = props.width, width = _c === void 0 ? '40px' : _c, _d = props.animationDuration, animationDuration = _d === void 0 ? '0.5s' : _d, _e = props.style, style = _e === void 0 ? {} : _e, _f = props.name, name = _f === void 0 ? '' : _f, _g = props.id, id = _g === void 0 ? '' : _g, _h = props.ariaLabel, ariaLabel = _h === void 0 ? '' : _h, _j = props.ariaLabelledby, ariaLabelledby = _j === void 0 ? '' : _j;
    var _k = useToggleContext(), checked = _k.checked, disabled = _k.disabled, onChange = _k.onChange, onFocus = _k.onFocus, onBlur = _k.onBlur;
    // animation should not be activated in the initialization step
    var _l = useState(''), animatedClassName = _l[0], setAnimatedClassName = _l[1];
    var toggleWidth = (_a = filterNumber(width)) === null || _a === void 0 ? void 0 : _a[0];
    var toggleHeight = toggleWidth / 2;
    // The size of dot should be 60% of toggle height
    var dotSize = toggleHeight * 0.6;
    return (React__default.createElement("label", { className: [
            'sendbird-input-toggle-button',
            animatedClassName,
            checked ? 'sendbird-input-toggle-button--checked' : 'sendbird-input-toggle-button--unchecked',
            disabled ? 'sendbird-input-toggle-button--disabled' : [],
            reversed ? 'sendbird-input-toggle-button--reversed' : [],
        ].flat().join(' '), style: __assign({ width: "".concat(toggleWidth, "px"), height: "".concat(toggleHeight, "px"), borderRadius: "".concat(dotSize, "px") }, style) },
        React__default.createElement("div", { className: [
                'sendbird-input-toggle-button__inner-dot',
                checked
                    ? 'sendbird-input-toggle-button__inner-dot--activate'
                    : 'sendbird-input-toggle-button__inner-dot--inactivate',
            ].join(' '), style: {
                width: "".concat(dotSize, "px"),
                height: "".concat(dotSize, "px"),
                animationDuration: animationDuration,
            } }),
        React__default.createElement("input", { type: "checkbox", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, name: name, id: id, checked: checked, disabled: disabled, onChange: function (e) {
                onChange(e);
                setAnimatedClassName(e.currentTarget.checked ? 'sendbird-input-toggle-button--turned-on' : 'sendbird-input-toggle-button--turned-off');
            }, onFocus: onFocus, onBlur: onBlur })));
}

function Toggle(props) {
    var 
    // ToggleProvider
    checked = props.checked, defaultChecked = props.defaultChecked, disabled = props.disabled, onChange = props.onChange, onFocus = props.onFocus, onBlur = props.onBlur, 
    // ToggleUI
    className = props.className, reversed = props.reversed, width = props.width, 
    // height will be half of width
    animationDuration = props.animationDuration, style = props.style, name = props.name, id = props.id, ariaLabel = props.ariaLabel, ariaLabelledby = props.ariaLabelledby;
    return (React__default.createElement("div", { className: "sendbird-ui-toggle ".concat(className) },
        React__default.createElement(ToggleContainer, { checked: checked, defaultChecked: defaultChecked, disabled: disabled, onChange: onChange, onFocus: onFocus, onBlur: onBlur },
            React__default.createElement(ToggleUI, { reversed: reversed, width: width, animationDuration: animationDuration, style: style, name: name, id: id, ariaLabel: ariaLabel, ariaLabelledby: ariaLabelledby }))));
}

export { Toggle, ToggleContainer, ToggleUI, useToggleContext };
//# sourceMappingURL=Toggle.js.map

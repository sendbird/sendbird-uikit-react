'use strict';

var React = require('react');
var uikitTools = require('@sendbird/uikit-tools');

/**
 * Note: `leading` has higher priority rather than `trailing`
 * */
function useThrottleCallback(callback, delay, options) {
    if (options === void 0) { options = {
        leading: true,
        trailing: false,
    }; }
    var timer = React.useRef(null);
    var trailingArgs = React.useRef(null);
    React.useEffect(function () {
        return function () {
            if (timer.current)
                clearTimeout(timer.current);
        };
    }, []);
    return uikitTools.usePreservedCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer.current) {
            trailingArgs.current = args;
            return;
        }
        if (options.leading) {
            callback.apply(void 0, args);
        }
        else {
            trailingArgs.current = args;
        }
        var invoke = function () {
            if (options.trailing && trailingArgs.current) {
                callback.apply(void 0, trailingArgs.current);
                trailingArgs.current = null;
                timer.current = setTimeout(invoke, delay);
            }
            else {
                timer.current = null;
            }
        };
        timer.current = setTimeout(invoke, delay);
    });
}
/**
 * Note: `leading` has higher priority rather than `trailing`
 * */
function throttle(callback, delay, options) {
    if (options === void 0) { options = {
        leading: true,
        trailing: false,
    }; }
    var timer = null;
    var trailingArgs = null;
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer) {
            trailingArgs = args;
            return;
        }
        if (options.leading) {
            callback.apply(void 0, args);
        }
        else {
            trailingArgs = args;
        }
        var invoke = function () {
            if (options.trailing && trailingArgs) {
                callback.apply(void 0, trailingArgs);
                trailingArgs = null;
                timer = setTimeout(invoke, delay);
            }
            else {
                timer = null;
            }
        };
        timer = setTimeout(invoke, delay);
    });
}

exports.throttle = throttle;
exports.useThrottleCallback = useThrottleCallback;
//# sourceMappingURL=bundle-hWEZzs4y.js.map

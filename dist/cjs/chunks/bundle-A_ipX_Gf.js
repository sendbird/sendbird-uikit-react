'use strict';

var React = require('react');
var uikitTools = require('@sendbird/uikit-tools');

function useKeyDown(ref, keyDownCallbackMap) {
    React.useLayoutEffect(function () {
        var _a;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [ref.current]);
    var onKeyDown = uikitTools.usePreservedCallback(function (event) {
        var callback = keyDownCallbackMap[event.key];
        callback === null || callback === void 0 ? void 0 : callback(event);
        event.stopPropagation();
    });
    return onKeyDown;
}

exports.useKeyDown = useKeyDown;
//# sourceMappingURL=bundle-A_ipX_Gf.js.map

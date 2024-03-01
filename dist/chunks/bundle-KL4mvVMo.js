import { useLayoutEffect } from 'react';
import { usePreservedCallback } from '@sendbird/uikit-tools';

function useKeyDown(ref, keyDownCallbackMap) {
    useLayoutEffect(function () {
        var _a;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [ref.current]);
    var onKeyDown = usePreservedCallback(function (event) {
        var callback = keyDownCallbackMap[event.key];
        callback === null || callback === void 0 ? void 0 : callback(event);
        event.stopPropagation();
    });
    return onKeyDown;
}

export { useKeyDown as u };
//# sourceMappingURL=bundle-KL4mvVMo.js.map

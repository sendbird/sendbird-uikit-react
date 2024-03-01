import { _ as __assign } from './bundle-UnAcr6wX.js';
import { useState, useRef, useCallback } from 'react';
import { u as useMediaQueryContext } from './bundle-qlkGlvyT.js';

var DEFAULT_DURATION = 300;
function preventDefault(e) {
    if (!isTouchEvent(e)) {
        return;
    }
    if (e.touches.length < 2 && e.preventDefault) {
        e.preventDefault();
    }
}
function isTouchEvent(e) {
    return e && 'touches' in e;
}
function useLongPress(_a, _b) {
    var onLongPress = _a.onLongPress, onClick = _a.onClick;
    var _c = _b === void 0 ? {} : _b, _d = _c.delay, delay = _d === void 0 ? DEFAULT_DURATION : _d, _e = _c.shouldPreventDefault, shouldPreventDefault = _e === void 0 ? true : _e, _f = _c.shouldStopPropagation, shouldStopPropagation = _f === void 0 ? false : _f;
    var isMobile = useMediaQueryContext().isMobile;
    var _g = useState(false), longPressTriggered = _g[0], setLongPressTriggered = _g[1];
    var _h = useState(false), dragTriggered = _h[0], setDragTriggered = _h[1];
    // https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype
    var timeout = useRef();
    var target = useRef();
    var start = useCallback(function (e) {
        e.persist();
        var clonedEvent = __assign({}, e);
        setDragTriggered(false);
        if (shouldStopPropagation) {
            e.stopPropagation();
        }
        if (shouldPreventDefault && e.target) {
            e.target.addEventListener('touchend', preventDefault, {
                passive: false,
            });
            target.current = e.target;
        }
        timeout.current = setTimeout(function () {
            onLongPress(clonedEvent);
            setLongPressTriggered(true);
        }, delay);
    }, [onLongPress, delay, shouldPreventDefault, shouldStopPropagation, isMobile]);
    var clear = useCallback(function (e, shouldTriggerClick, onDrag) {
        if (shouldTriggerClick === void 0) { shouldTriggerClick = true; }
        if (onDrag === void 0) { onDrag = false; }
        if (onDrag) {
            setDragTriggered(true);
        }
        else {
            setDragTriggered(false);
        }
        if (timeout === null || timeout === void 0 ? void 0 : timeout.current) {
            clearTimeout(timeout.current);
        }
        if (shouldTriggerClick && !longPressTriggered && !dragTriggered) {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
        }
        setLongPressTriggered(false);
        if (shouldPreventDefault && target.current) {
            target.current.removeEventListener('touchend', preventDefault);
        }
    }, [shouldPreventDefault, onClick, longPressTriggered, dragTriggered]);
    return {
        onMouseDown: function (e) { return start(e); },
        onMouseUp: function (e) { return clear(e); },
        onMouseLeave: function (e) { return clear(e, false); },
        onTouchStart: function (e) { return start(e); },
        // setDragTriggered as true on touchmove, so that next onTouchEnd is ignored
        // if we dont do it, onClick?.(e) will be triggred, see inside clear()
        onTouchMove: function (e) { return clear(e, false, true); },
        onTouchEnd: function (e) { return clear(e); },
    };
}

export { useLongPress as u };
//# sourceMappingURL=bundle-okHpD60h.js.map

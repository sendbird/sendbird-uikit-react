import { useRef, useLayoutEffect } from 'react';
import { S as SCROLL_BUFFER } from './bundle-AFXr5NmI.js';
import { i as isAboutSame } from './bundle-fO5XIU5Y.js';
import { usePreservedCallback } from '@sendbird/uikit-tools';
import { u as useThrottleCallback, t as throttle } from './bundle-JMVaVraV.js';

var BUFFER_DELAY = 100;
function useOnScrollPositionChangeDetector(params) {
    var onReachedTop = params.onReachedTop, onReachedBottom = params.onReachedBottom, onInBetween = params.onInBetween;
    var cb = usePreservedCallback(function (event) {
        if (event === null || event === void 0 ? void 0 : event.target) {
            var _a = event.target, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
            var positionEvent = {
                distanceFromBottom: scrollHeight - scrollTop - clientHeight,
            };
            if (onReachedTop && isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
                onReachedTop(positionEvent);
            }
            else if (onReachedBottom && isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER)) {
                onReachedBottom(positionEvent);
            }
            else if (onInBetween) {
                onInBetween(positionEvent);
            }
        }
    });
    return useThrottleCallback(cb, BUFFER_DELAY, { trailing: true });
}
function useOnScrollPositionChangeDetectorWithRef(scrollRef, params) {
    var _params = useRef(params);
    _params.current = params;
    useLayoutEffect(function () {
        var elem = scrollRef.current;
        if (elem) {
            var callback_1 = throttle(function () {
                var scrollTop = elem.scrollTop, scrollHeight = elem.scrollHeight, clientHeight = elem.clientHeight;
                var event = {
                    distanceFromBottom: scrollHeight - scrollTop - clientHeight,
                };
                if (_params.current.onReachedTop && isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
                    _params.current.onReachedTop(event);
                }
                else if (_params.current.onReachedBottom && isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER)) {
                    _params.current.onReachedBottom(event);
                }
                else if (_params.current.onInBetween) {
                    _params.current.onInBetween(event);
                }
            }, BUFFER_DELAY, { trailing: true });
            elem.addEventListener('scroll', callback_1);
            return function () { return elem.removeEventListener('scroll', callback_1); };
        }
    }, [scrollRef.current]);
}

export { useOnScrollPositionChangeDetectorWithRef as a, useOnScrollPositionChangeDetector as u };
//# sourceMappingURL=bundle-lPKA2RTf.js.map

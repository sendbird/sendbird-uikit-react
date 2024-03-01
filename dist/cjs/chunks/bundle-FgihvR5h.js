'use strict';

var React = require('react');
var consts = require('./bundle-4jVvOUfV.js');
var utils = require('./bundle-CPnHexJQ.js');
var uikitTools = require('@sendbird/uikit-tools');
var useThrottleCallback = require('./bundle-hWEZzs4y.js');

var BUFFER_DELAY = 100;
function useOnScrollPositionChangeDetector(params) {
    var onReachedTop = params.onReachedTop, onReachedBottom = params.onReachedBottom, onInBetween = params.onInBetween;
    var cb = uikitTools.usePreservedCallback(function (event) {
        if (event === null || event === void 0 ? void 0 : event.target) {
            var _a = event.target, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
            var positionEvent = {
                distanceFromBottom: scrollHeight - scrollTop - clientHeight,
            };
            if (onReachedTop && utils.isAboutSame(scrollTop, 0, consts.SCROLL_BUFFER)) {
                onReachedTop(positionEvent);
            }
            else if (onReachedBottom && utils.isAboutSame(scrollHeight, clientHeight + scrollTop, consts.SCROLL_BUFFER)) {
                onReachedBottom(positionEvent);
            }
            else if (onInBetween) {
                onInBetween(positionEvent);
            }
        }
    });
    return useThrottleCallback.useThrottleCallback(cb, BUFFER_DELAY, { trailing: true });
}
function useOnScrollPositionChangeDetectorWithRef(scrollRef, params) {
    var _params = React.useRef(params);
    _params.current = params;
    React.useLayoutEffect(function () {
        var elem = scrollRef.current;
        if (elem) {
            var callback_1 = useThrottleCallback.throttle(function () {
                var scrollTop = elem.scrollTop, scrollHeight = elem.scrollHeight, clientHeight = elem.clientHeight;
                var event = {
                    distanceFromBottom: scrollHeight - scrollTop - clientHeight,
                };
                if (_params.current.onReachedTop && utils.isAboutSame(scrollTop, 0, consts.SCROLL_BUFFER)) {
                    _params.current.onReachedTop(event);
                }
                else if (_params.current.onReachedBottom && utils.isAboutSame(scrollHeight, clientHeight + scrollTop, consts.SCROLL_BUFFER)) {
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

exports.useOnScrollPositionChangeDetector = useOnScrollPositionChangeDetector;
exports.useOnScrollPositionChangeDetectorWithRef = useOnScrollPositionChangeDetectorWithRef;
//# sourceMappingURL=bundle-FgihvR5h.js.map

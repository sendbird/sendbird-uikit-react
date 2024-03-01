'use strict';

var React = require('react');

function useReconnectOnIdle(isOnline, currentGroupChannel, reconnectOnIdle) {
    if (reconnectOnIdle === void 0) { reconnectOnIdle = true; }
    var _a = React.useState(false), isTabHidden = _a[0], setIsTabHidden = _a[1];
    var wasOffline = !isOnline;
    React.useEffect(function () {
        var handleVisibilityChange = function () {
            if (reconnectOnIdle) {
                setIsTabHidden(document.hidden);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function () {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [reconnectOnIdle, document.hidden]);
    var shouldReconnect = wasOffline && (currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url) != null && !isTabHidden;
    return { shouldReconnect: shouldReconnect };
}

exports.useReconnectOnIdle = useReconnectOnIdle;
//# sourceMappingURL=bundle-vtSSgUjy.js.map

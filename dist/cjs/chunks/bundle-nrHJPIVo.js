'use strict';

var consts = require('./bundle-4jVvOUfV.js');
var useThrottleCallback = require('./bundle-hWEZzs4y.js');
var utils = require('./bundle-CPnHexJQ.js');
var uikitTools = require('@sendbird/uikit-tools');

var DELAY = 100;
function calcScrollBottom(scrollHeight, scrollTop) {
    return scrollHeight - scrollTop;
}
function useHandleOnScrollCallback(_a) {
    var hasMore = _a.hasMore, hasNext = _a.hasNext, onScroll = _a.onScroll, scrollRef = _a.scrollRef, setShowScrollDownButton = _a.setShowScrollDownButton;
    var scrollCb = uikitTools.usePreservedCallback(function () {
        var element = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
        if (element == null)
            return;
        var scrollTop = element.scrollTop, scrollHeight = element.scrollHeight, clientHeight = element.clientHeight;
        // https://sendbird.atlassian.net/browse/SBISSUE-11759
        // the edge case where channel is inside a page that already has scroll
        // scrollintoView will move the whole page, which we dont want
        var scrollBottom = calcScrollBottom(scrollHeight, scrollTop);
        // even if there is more to fetch or not,
        // we still have to show the scroll to bottom button
        if (typeof setShowScrollDownButton === 'function') {
            setShowScrollDownButton(scrollHeight > scrollTop + clientHeight + 1);
        }
        // Load previous messages
        // 1. check if hasMore(hasPrevious) and reached to top
        // 2. load previous messages (onScroll)
        // 3. maintain scroll position (sets the scroll position to the bottom of the new messages)
        if (hasMore && utils.isAboutSame(scrollTop, 0, consts.SCROLL_BUFFER)) {
            onScroll(function () {
                var messagesAreAddedToView = element.scrollHeight > scrollHeight;
                if (messagesAreAddedToView)
                    element.scrollTop = element.scrollHeight - scrollBottom;
            });
        }
        // Load next messages
        // 1. check if hasNext and reached to bottom
        // 2. load next messages (onScroll)
        // 3. maintain scroll position (sets the scroll position to the top of the new messages)
        if (hasNext && utils.isAboutSame(clientHeight + scrollTop, scrollHeight, consts.SCROLL_BUFFER)) {
            onScroll(function () {
                var messagesAreAddedToView = element.scrollHeight > scrollHeight;
                if (messagesAreAddedToView)
                    element.scrollTop = scrollTop;
            });
        }
    });
    return useThrottleCallback.useThrottleCallback(scrollCb, DELAY, { trailing: true });
}

exports.useHandleOnScrollCallback = useHandleOnScrollCallback;
//# sourceMappingURL=bundle-nrHJPIVo.js.map

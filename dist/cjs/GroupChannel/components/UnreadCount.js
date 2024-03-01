'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var ui_Icon = require('../../ui/Icon.js');
var index = require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-jCTpndN0.js');

var UnreadCount = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.count, count = _c === void 0 ? 0 : _c, _d = _a.time, time = _d === void 0 ? '' : _d, onClick = _a.onClick, lastReadAt = _a.lastReadAt;
    var _e = React.useContext(LocalizationContext.LocalizationContext), stringSet = _e.stringSet, dateLocale = _e.dateLocale;
    var unreadSince = React.useMemo(function () {
        var _a, _b;
        // TODO: Remove this on v4
        if (stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON !== 'on') {
            var timeArray = ((_b = (_a = time === null || time === void 0 ? void 0 : time.toString) === null || _a === void 0 ? void 0 : _a.call(time)) === null || _b === void 0 ? void 0 : _b.split(' ')) || [];
            timeArray === null || timeArray === void 0 ? void 0 : timeArray.splice(-2, 0, stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON);
            return timeArray.join(' ');
        }
        else if (lastReadAt) {
            return index.format(lastReadAt, stringSet.DATE_FORMAT__MESSAGE_LIST__NOTIFICATION__UNREAD_SINCE, { locale: dateLocale });
        }
    }, [time, lastReadAt]);
    return (React.createElement("div", { className: "sendbird-notification".concat(count < 1 ? '--hide' : '', " ").concat(className), onClick: onClick },
        React.createElement(ui_Label.Label, { className: "sendbird-notification__text", color: ui_Label.LabelColors.ONCONTENT_1, type: ui_Label.LabelTypography.CAPTION_2 }, "".concat(count, " "),
            stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE, " ".concat(unreadSince)),
        React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.CHEVRON_DOWN, fillColor: ui_Icon.IconColors.CONTENT })));
};

exports.UnreadCount = UnreadCount;
exports.default = UnreadCount;
//# sourceMappingURL=UnreadCount.js.map

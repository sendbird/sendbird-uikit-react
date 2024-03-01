import React__default, { useContext, useMemo } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-msnuMA4R.js';
import { L as Label, b as LabelColors, a as LabelTypography } from '../../chunks/bundle-kMMCn6GE.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import { f as format } from '../../chunks/bundle-vbGNKQpe.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '../../chunks/bundle-KMsJXUN2.js';
import '../../chunks/bundle-7YRb7CRq.js';

var UnreadCount = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.count, count = _c === void 0 ? 0 : _c, _d = _a.time, time = _d === void 0 ? '' : _d, onClick = _a.onClick, lastReadAt = _a.lastReadAt;
    var _e = useContext(LocalizationContext), stringSet = _e.stringSet, dateLocale = _e.dateLocale;
    var unreadSince = useMemo(function () {
        var _a, _b;
        // TODO: Remove this on v4
        if (stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON !== 'on') {
            var timeArray = ((_b = (_a = time === null || time === void 0 ? void 0 : time.toString) === null || _a === void 0 ? void 0 : _a.call(time)) === null || _b === void 0 ? void 0 : _b.split(' ')) || [];
            timeArray === null || timeArray === void 0 ? void 0 : timeArray.splice(-2, 0, stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON);
            return timeArray.join(' ');
        }
        else if (lastReadAt) {
            return format(lastReadAt, stringSet.DATE_FORMAT__MESSAGE_LIST__NOTIFICATION__UNREAD_SINCE, { locale: dateLocale });
        }
    }, [time, lastReadAt]);
    return (React__default.createElement("div", { className: "sendbird-notification".concat(count < 1 ? '--hide' : '', " ").concat(className), onClick: onClick },
        React__default.createElement(Label, { className: "sendbird-notification__text", color: LabelColors.ONCONTENT_1, type: LabelTypography.CAPTION_2 }, "".concat(count, " "),
            stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE, " ".concat(unreadSince)),
        React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.CHEVRON_DOWN, fillColor: IconColors.CONTENT })));
};

export { UnreadCount, UnreadCount as default };
//# sourceMappingURL=UnreadCount.js.map

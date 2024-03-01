import React__default, { useMemo } from 'react';
import IconButton from '../../ui/IconButton.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-kMMCn6GE.js';
import TextButton from '../../ui/TextButton.js';
import { u as useLocalization } from '../../chunks/bundle-msnuMA4R.js';
import '../../chunks/bundle-KMsJXUN2.js';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-nGuCRoDK.js';
import '../../chunks/bundle-CsWYoRVd.js';

function ThreadHeader(_a) {
    var className = _a.className, channelName = _a.channelName, renderActionIcon = _a.renderActionIcon, onActionIconClick = _a.onActionIconClick, onChannelNameClick = _a.onChannelNameClick;
    var stringSet = useLocalization().stringSet;
    var MemoizedActionIcon = useMemo(function () {
        if (typeof renderActionIcon === 'function') {
            return renderActionIcon({ onActionIconClick: onActionIconClick });
        }
        return null;
    }, [renderActionIcon]);
    return (React__default.createElement("div", { className: "sendbird-thread-header ".concat(className) },
        React__default.createElement(Label, { className: "sendbird-thread-header__title", type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.THREAD__HEADER_TITLE),
        React__default.createElement(TextButton, { onClick: function (e) { return onChannelNameClick === null || onChannelNameClick === void 0 ? void 0 : onChannelNameClick(e); }, disableUnderline: true },
            React__default.createElement(Label, { className: "sendbird-thread-header__channel-name", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, channelName)),
        MemoizedActionIcon || (React__default.createElement("div", { className: "sendbird-thread-header__action" },
            React__default.createElement(IconButton, { width: "32px", height: "32px", onClick: function (e) { return onActionIconClick(e); } },
                React__default.createElement(Icon, { type: IconTypes.CLOSE, fillColor: IconColors.ON_BACKGROUND_1, width: "22px", height: "22px" }))))));
}

export { ThreadHeader as default };
//# sourceMappingURL=ThreadHeader.js.map

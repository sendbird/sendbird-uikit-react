import React__default, { useMemo } from 'react';
import IconButton from '../../ui/IconButton.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-sR62lMVk.js';
import TextButton from '../../ui/TextButton.js';
import { u as useLocalization } from '../../chunks/bundle-1inZXcUV.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-nMxV4WMS.js';
import '../../chunks/bundle-V_fO-GlK.js';

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

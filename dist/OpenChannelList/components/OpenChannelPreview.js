import React__default from 'react';
import { A as Avatar } from '../../chunks/bundle-LbQw2cVx.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-PIrj5Rm1.js';

function OpenChannelPreview(_a) {
    var className = _a.className, isSelected = _a.isSelected, channel = _a.channel, onClick = _a.onClick;
    return (React__default.createElement("div", { className: "sendbird-open-channel-preview ".concat(isSelected ? 'selected' : '', " ").concat(className), onClick: onClick },
        React__default.createElement("div", { className: "sendbird-open-channel-preview__cover-image" },
            React__default.createElement(Avatar, { className: "sendbird-open-channel-preview__cover-image__avatar", src: channel === null || channel === void 0 ? void 0 : channel.coverUrl, alt: "cover-image", width: "42px", height: "42px", customDefaultComponent: function () { return (React__default.createElement("div", { className: "sendbird-open-channel-preview__cover-image__avatar--default" },
                    React__default.createElement(Icon, { type: IconTypes.CHANNELS, fillColor: IconColors.CONTENT, width: "24px", height: "24px" }))); } })),
        React__default.createElement("div", { className: "sendbird-open-channel-preview__context" },
            React__default.createElement("div", { className: "sendbird-open-channel-preview__context__title" },
                React__default.createElement(Label, { className: "sendbird-open-channel-preview__context__title__channel-name ".concat((channel === null || channel === void 0 ? void 0 : channel.isFrozen) ? 'frozen' : ''), type: LabelTypography.SUBTITLE_2, color: isSelected ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_1 }, channel === null || channel === void 0 ? void 0 : channel.name),
                (channel === null || channel === void 0 ? void 0 : channel.isFrozen)
                    ? (React__default.createElement(Icon, { className: "sendbird-open-channel-preview__context__title__frozen", type: IconTypes.FREEZE, fillColor: IconColors.PRIMARY, width: "16px", height: "16px" })) : ''),
            React__default.createElement("div", { className: "sendbird-open-channel-preview__context__participants" },
                React__default.createElement(Icon, { className: "sendbird-open-channel-preview__context__participants__icon", type: IconTypes.MEMBERS, fillColor: IconColors.ON_BACKGROUND_2, width: "14px", height: "14px" }),
                React__default.createElement(Label, { className: "sendbird-open-channel-preview__context__participants__count", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, (channel === null || channel === void 0 ? void 0 : channel.participantCount) || '0')))));
}

export { OpenChannelPreview as default };
//# sourceMappingURL=OpenChannelPreview.js.map

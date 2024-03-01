'use strict';

var React = require('react');
var ui_Avatar = require('../../chunks/bundle-PoiZwjvJ.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_Label = require('../../chunks/bundle-2Pq38lvD.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../chunks/bundle-xYV6cL9E.js');

function OpenChannelPreview(_a) {
    var className = _a.className, isSelected = _a.isSelected, channel = _a.channel, onClick = _a.onClick;
    return (React.createElement("div", { className: "sendbird-open-channel-preview ".concat(isSelected ? 'selected' : '', " ").concat(className), onClick: onClick },
        React.createElement("div", { className: "sendbird-open-channel-preview__cover-image" },
            React.createElement(ui_Avatar.Avatar, { className: "sendbird-open-channel-preview__cover-image__avatar", src: channel === null || channel === void 0 ? void 0 : channel.coverUrl, alt: "cover-image", width: "42px", height: "42px", customDefaultComponent: function () { return (React.createElement("div", { className: "sendbird-open-channel-preview__cover-image__avatar--default" },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CHANNELS, fillColor: ui_Icon.IconColors.CONTENT, width: "24px", height: "24px" }))); } })),
        React.createElement("div", { className: "sendbird-open-channel-preview__context" },
            React.createElement("div", { className: "sendbird-open-channel-preview__context__title" },
                React.createElement(ui_Label.Label, { className: "sendbird-open-channel-preview__context__title__channel-name ".concat((channel === null || channel === void 0 ? void 0 : channel.isFrozen) ? 'frozen' : ''), type: ui_Label.LabelTypography.SUBTITLE_2, color: isSelected ? ui_Label.LabelColors.PRIMARY : ui_Label.LabelColors.ONBACKGROUND_1 }, channel === null || channel === void 0 ? void 0 : channel.name),
                (channel === null || channel === void 0 ? void 0 : channel.isFrozen)
                    ? (React.createElement(ui_Icon.default, { className: "sendbird-open-channel-preview__context__title__frozen", type: ui_Icon.IconTypes.FREEZE, fillColor: ui_Icon.IconColors.PRIMARY, width: "16px", height: "16px" })) : ''),
            React.createElement("div", { className: "sendbird-open-channel-preview__context__participants" },
                React.createElement(ui_Icon.default, { className: "sendbird-open-channel-preview__context__participants__icon", type: ui_Icon.IconTypes.MEMBERS, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "14px", height: "14px" }),
                React.createElement(ui_Label.Label, { className: "sendbird-open-channel-preview__context__participants__count", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, (channel === null || channel === void 0 ? void 0 : channel.participantCount) || '0')))));
}

module.exports = OpenChannelPreview;
//# sourceMappingURL=OpenChannelPreview.js.map

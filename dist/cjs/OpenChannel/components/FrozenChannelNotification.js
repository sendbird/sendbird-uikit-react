'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-xbdnJE9-.js');

var FrozenNotification = function () {
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: "sendbird-frozen-channel-notification" },
        React.createElement(ui_Label.Label, { className: "sendbird-frozen-channel-notification__text", type: ui_Label.LabelTypography.CAPTION_2 }, stringSet.CHANNEL_FROZEN)));
};

module.exports = FrozenNotification;
//# sourceMappingURL=FrozenChannelNotification.js.map

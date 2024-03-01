'use strict';

var React = require('react');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-KkCwxjVN.js');
var LocalizationContext = require('../chunks/bundle-WKa05h0_.js');
require('../chunks/bundle-xbdnJE9-.js');
require('../chunks/bundle-jCTpndN0.js');
require('../chunks/bundle-Yzhiyr0t.js');
require('../chunks/bundle-HY8cubCp.js');

function ConnectionStatus() {
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: "sendbird-connection-status" },
        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.TRYING_TO_CONNECT),
        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.DISCONNECTED, fillColor: ui_Icon.IconColors.SENT, width: "14px", height: "14px" })));
}

module.exports = ConnectionStatus;
//# sourceMappingURL=ConnectionStatus.js.map

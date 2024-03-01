'use strict';

var React = require('react');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-2Pq38lvD.js');
var LocalizationContext = require('../chunks/bundle-Nz6fSUye.js');
require('../chunks/bundle-zYqQA3cT.js');
require('../chunks/bundle-Xwl4gw4D.js');
require('../chunks/bundle-xYV6cL9E.js');
require('../chunks/bundle-eyiJykZ-.js');

function ConnectionStatus() {
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: "sendbird-connection-status" },
        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.TRYING_TO_CONNECT),
        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.DISCONNECTED, fillColor: ui_Icon.IconColors.SENT, width: "14px", height: "14px" })));
}

module.exports = ConnectionStatus;
//# sourceMappingURL=ConnectionStatus.js.map

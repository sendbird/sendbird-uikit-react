'use strict';

var React = require('react');
var ui_IconButton = require('../ui/IconButton.js');
var ui_Icon = require('../ui/Icon.js');
var CreateChannel = require('../CreateChannel.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');

var AddGroupChannelView = function (_a) {
    var createChannelVisible = _a.createChannelVisible, onChangeCreateChannelVisible = _a.onChangeCreateChannelVisible, onBeforeCreateChannel = _a.onBeforeCreateChannel, onCreateChannelClick = _a.onCreateChannelClick, onChannelCreated = _a.onChannelCreated;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    return (React.createElement(React.Fragment, null,
        React.createElement(ui_IconButton, { height: '32px', width: '32px', disabled: !config.isOnline, onClick: function () { return onChangeCreateChannelVisible(true); } },
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CREATE, fillColor: ui_Icon.IconColors.PRIMARY, width: '24px', height: '24px' })),
        createChannelVisible && (React.createElement(CreateChannel, { onCancel: function () { return onChangeCreateChannelVisible(false); }, onChannelCreated: function (channel) {
                onChannelCreated === null || onChannelCreated === void 0 ? void 0 : onChannelCreated(channel);
                onChangeCreateChannelVisible(false);
            }, onBeforeCreateChannel: onBeforeCreateChannel, onCreateChannelClick: onCreateChannelClick }))));
};

exports.AddGroupChannelView = AddGroupChannelView;
//# sourceMappingURL=bundle-jYoH3x3I.js.map

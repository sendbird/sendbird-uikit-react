import React__default from 'react';
import IconButton from '../ui/IconButton.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import CreateChannel from '../CreateChannel.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';

var AddGroupChannelView = function (_a) {
    var createChannelVisible = _a.createChannelVisible, onChangeCreateChannelVisible = _a.onChangeCreateChannelVisible, onBeforeCreateChannel = _a.onBeforeCreateChannel, onCreateChannelClick = _a.onCreateChannelClick, onChannelCreated = _a.onChannelCreated;
    var config = useSendbirdStateContext().config;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(IconButton, { height: '32px', width: '32px', disabled: !config.isOnline, onClick: function () { return onChangeCreateChannelVisible(true); } },
            React__default.createElement(Icon, { type: IconTypes.CREATE, fillColor: IconColors.PRIMARY, width: '24px', height: '24px' })),
        createChannelVisible && (React__default.createElement(CreateChannel, { onCancel: function () { return onChangeCreateChannelVisible(false); }, onChannelCreated: function (channel) {
                onChannelCreated === null || onChannelCreated === void 0 ? void 0 : onChannelCreated(channel);
                onChangeCreateChannelVisible(false);
            }, onBeforeCreateChannel: onBeforeCreateChannel, onCreateChannelClick: onCreateChannelClick }))));
};

export { AddGroupChannelView as A };
//# sourceMappingURL=bundle-u-NtVSae.js.map

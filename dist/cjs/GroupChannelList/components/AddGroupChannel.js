'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var AddGroupChannelView = require('../../chunks/bundle-pO3WtufJ.js');
var GroupChannelList_context = require('../context.js');
require('../../ui/IconButton.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../CreateChannel.js');
require('../../CreateChannel/components/CreateChannelUI.js');
require('../../chunks/bundle-chizstU7.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../CreateChannel/components/InviteUsers.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../ui/Button.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../CreateChannel/components/SelectChannelType.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-Fj06oDBD.js');
require('@sendbird/chat');

var AddGroupChannel = function () {
    var _a = React.useState(false), createChannelVisible = _a[0], setCreateChannelVisible = _a[1];
    var _b = GroupChannelList_context.useGroupChannelListContext(), onChannelCreated = _b.onChannelCreated, onBeforeCreateChannel = _b.onBeforeCreateChannel, onCreateChannelClick = _b.onCreateChannelClick;
    return (React.createElement(AddGroupChannelView.AddGroupChannelView, { createChannelVisible: createChannelVisible, onChangeCreateChannelVisible: setCreateChannelVisible, onCreateChannelClick: onCreateChannelClick, onBeforeCreateChannel: onBeforeCreateChannel, onChannelCreated: onChannelCreated }));
};

exports.AddGroupChannel = AddGroupChannel;
exports.default = AddGroupChannel;
//# sourceMappingURL=AddGroupChannel.js.map

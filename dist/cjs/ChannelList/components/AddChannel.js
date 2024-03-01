'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ChannelList_context = require('../../chunks/bundle-0sfo9lj4.js');
var AddGroupChannelView = require('../../chunks/bundle-pO3WtufJ.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-W24S10k5.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../CreateChannel.js');
require('../../CreateChannel/components/CreateChannelUI.js');
require('../../chunks/bundle-chizstU7.js');
require('../../sendbirdSelectors.js');
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
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../CreateChannel/components/SelectChannelType.js');

var AddChannel = function () {
    var _a = React.useState(false), showModal = _a[0], setShowModal = _a[1];
    var _b = ChannelList_context.useChannelListContext(), overrideInviteUser = _b.overrideInviteUser, onBeforeCreateChannel = _b.onBeforeCreateChannel, onChannelSelect = _b.onChannelSelect;
    return (React.createElement(AddGroupChannelView.AddGroupChannelView, { createChannelVisible: showModal, onChangeCreateChannelVisible: setShowModal, onCreateChannelClick: overrideInviteUser, onBeforeCreateChannel: onBeforeCreateChannel, onChannelCreated: onChannelSelect }));
};

exports.AddChannel = AddChannel;
exports.default = AddChannel;
//# sourceMappingURL=AddChannel.js.map

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ChannelList_context = require('../../chunks/bundle-33cx5rNA.js');
var AddGroupChannelView = require('../../chunks/bundle-yDyrmXqw.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-NfUcey5s.js');
require('../../chunks/bundle-NNEanMqk.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-4jVvOUfV.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../chunks/bundle-bjSez2lv.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-ZngtlfeR.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../CreateChannel.js');
require('../../CreateChannel/components/CreateChannelUI.js');
require('../../chunks/bundle-RWfI6raz.js');
require('../../sendbirdSelectors.js');
require('../../CreateChannel/components/InviteUsers.js');
require('../../chunks/bundle-Nz6fSUye.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../chunks/bundle-37dz9yoi.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('../../ui/Button.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-5mXB6h1C.js');
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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ChannelList_context = require('../../chunks/bundle-DfDBkt_w.js');
var AddGroupChannelView = require('../../chunks/bundle-jYoH3x3I.js');
require('../../chunks/bundle-2dG9SU7T.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-wzulmlgb.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-vtSSgUjy.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../CreateChannel.js');
require('../../CreateChannel/components/CreateChannelUI.js');
require('../../chunks/bundle-DRe-mU2_.js');
require('../../sendbirdSelectors.js');
require('../../CreateChannel/components/InviteUsers.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../ui/Button.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-uGaTvmsl.js');
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

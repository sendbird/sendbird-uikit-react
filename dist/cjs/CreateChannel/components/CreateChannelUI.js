'use strict';

var React = require('react');
var CreateChannel_context = require('../../chunks/bundle-chizstU7.js');
var CreateChannel_components_InviteUsers = require('./InviteUsers.js');
var CreateChannel_components_SelectChannelType = require('./SelectChannelType.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/Icon.js');
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

var CreateChannel = function (props) {
    var onCancel = props.onCancel, renderStepOne = props.renderStepOne;
    var _a = CreateChannel_context.useCreateChannelContext(), step = _a.step, setStep = _a.setStep, userListQuery = _a.userListQuery;
    return (React.createElement(React.Fragment, null,
        step === 0 && ((renderStepOne === null || renderStepOne === void 0 ? void 0 : renderStepOne()) || (React.createElement(CreateChannel_components_SelectChannelType, { onCancel: onCancel }))),
        step === 1 && (React.createElement(CreateChannel_components_InviteUsers, { userListQuery: userListQuery, onCancel: function () {
                setStep(0);
                onCancel();
            } }))));
};

module.exports = CreateChannel;
//# sourceMappingURL=CreateChannelUI.js.map

'use strict';

var React = require('react');
var CreateChannel_context = require('../../chunks/bundle-DRe-mU2_.js');
var CreateChannel_components_InviteUsers = require('./InviteUsers.js');
var CreateChannel_components_SelectChannelType = require('./SelectChannelType.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-2dG9SU7T.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../ui/Icon.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');

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

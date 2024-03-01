import React__default from 'react';
import { u as useCreateChannelContext } from '../../chunks/bundle-rpehLlJe.js';
import InviteUsers from './InviteUsers.js';
import SelectChannelType from './SelectChannelType.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../ui/Icon.js';
import '../../ui/UserListItem.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';

var CreateChannel = function (props) {
    var onCancel = props.onCancel, renderStepOne = props.renderStepOne;
    var _a = useCreateChannelContext(), step = _a.step, setStep = _a.setStep, userListQuery = _a.userListQuery;
    return (React__default.createElement(React__default.Fragment, null,
        step === 0 && ((renderStepOne === null || renderStepOne === void 0 ? void 0 : renderStepOne()) || (React__default.createElement(SelectChannelType, { onCancel: onCancel }))),
        step === 1 && (React__default.createElement(InviteUsers, { userListQuery: userListQuery, onCancel: function () {
                setStep(0);
                onCancel();
            } }))));
};

export { CreateChannel as default };
//# sourceMappingURL=CreateChannelUI.js.map

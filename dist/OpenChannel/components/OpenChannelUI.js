import React__default from 'react';
import { u as useOpenChannelContext } from '../../chunks/bundle-qsYpqw_E.js';
import OpenChannelInput from './OpenChannelInput.js';
import FrozenNotification from './FrozenChannelNotification.js';
import OpenchannelConversationHeader from './OpenChannelHeader.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import OpenChannelMessageList from './OpenChannelMessageList.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '@sendbird/chat';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-QJa2lTJw.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../chunks/bundle-ePTRDi6d.js';
import './OpenChannelMessage.js';
import '../../ui/OpenchannelUserMessage.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-8kOzvGVm.js';
import '../../chunks/bundle-_I_VShhL.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../ui/OpenChannelAdminMessage.js';
import '../../ui/OpenchannelOGMessage.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-1q5AhvE7.js';
import '../../Message/context.js';
import '../../ui/MentionLabel.js';
import '../../ui/OpenchannelThumbnailMessage.js';
import '../../ui/OpenchannelFileMessage.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-YfeG6LQ5.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-zcfKjxS7.js';
import '../../chunks/bundle-6ZgG3gte.js';
import '../../chunks/bundle-6aMfjTWv.js';
import '../../chunks/bundle-H77M-_wK.js';
import '@sendbird/chat/message';
import '../../Channel/utils/compareMessagesForGrouping.js';

var COMPONENT_CLASS_NAME = 'sendbird-openchannel-conversation';
var OpenChannelUI = function (_a) {
    var renderMessage = _a.renderMessage, renderHeader = _a.renderHeader, renderInput = _a.renderInput, renderPlaceHolderEmptyList = _a.renderPlaceHolderEmptyList, renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading;
    var _b = useOpenChannelContext(), currentOpenChannel = _b.currentOpenChannel, amIBanned = _b.amIBanned, loading = _b.loading, isInvalid = _b.isInvalid, messageInputRef = _b.messageInputRef, conversationScrollRef = _b.conversationScrollRef;
    if (!currentOpenChannel
        || !(currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.url)
        || amIBanned) {
        return ((renderPlaceHolderError === null || renderPlaceHolderError === void 0 ? void 0 : renderPlaceHolderError())
            || React__default.createElement("div", { className: COMPONENT_CLASS_NAME },
                React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.NO_CHANNELS })));
    }
    if (loading) {
        return ((renderPlaceHolderLoading === null || renderPlaceHolderLoading === void 0 ? void 0 : renderPlaceHolderLoading())
            || React__default.createElement("div", { className: COMPONENT_CLASS_NAME },
                React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.LOADING })));
    }
    if (isInvalid) {
        return ((renderPlaceHolderError === null || renderPlaceHolderError === void 0 ? void 0 : renderPlaceHolderError())
            || React__default.createElement("div", { className: COMPONENT_CLASS_NAME },
                React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.WRONG })));
    }
    return (React__default.createElement("div", { className: COMPONENT_CLASS_NAME },
        (renderHeader === null || renderHeader === void 0 ? void 0 : renderHeader()) || (React__default.createElement(OpenchannelConversationHeader, null)),
        (currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isFrozen) && (React__default.createElement(FrozenNotification, null)),
        React__default.createElement(OpenChannelMessageList, { ref: conversationScrollRef, renderMessage: renderMessage, renderPlaceHolderEmptyList: renderPlaceHolderEmptyList }),
        (renderInput === null || renderInput === void 0 ? void 0 : renderInput()) || (React__default.createElement(OpenChannelInput, { ref: messageInputRef }))));
};

export { OpenChannelUI as default };
//# sourceMappingURL=OpenChannelUI.js.map

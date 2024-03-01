import React__default from 'react';
import { u as useOpenChannelContext } from '../../chunks/bundle-QqSGl9UA.js';
import OpenChannelInput from './OpenChannelInput.js';
import FrozenNotification from './FrozenChannelNotification.js';
import OpenchannelConversationHeader from './OpenChannelHeader.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import OpenChannelMessageList from './OpenChannelMessageList.js';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../chunks/bundle-qPq2iACJ.js';
import '../../chunks/bundle-yarrTY_z.js';
import '@sendbird/chat';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-BZ3hPsJ8.js';
import '../../chunks/bundle-FmRroF-I.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-AN6QCsUL.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../chunks/bundle-1inZXcUV.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-sR62lMVk.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-UKdN0Ihw.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-8RTviqdm.js';
import '../../chunks/bundle-tIdypo_v.js';
import '../../chunks/bundle-p0_Jj2xm.js';
import 'dompurify';
import '../../chunks/bundle-zp72gyE3.js';
import '../../chunks/bundle-kgn8HcWj.js';
import '../../chunks/bundle-_MABCkOp.js';
import '../../chunks/bundle-Jwc7mleJ.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-IqjS0ok_.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../ui/ImageRenderer.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-RfBkMeJ1.js';
import '../../chunks/bundle-o-FVZr_e.js';
import './OpenChannelMessage.js';
import '../../ui/OpenchannelUserMessage.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-IzjvDxft.js';
import '../../chunks/bundle--hvOY2k-.js';
import '../../chunks/bundle-FgXHPuhY.js';
import '../../ui/OpenChannelAdminMessage.js';
import '../../ui/OpenchannelOGMessage.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-wKuesro0.js';
import '../../Message/context.js';
import '../../ui/MentionLabel.js';
import '../../ui/OpenchannelThumbnailMessage.js';
import '../../ui/OpenchannelFileMessage.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nMxV4WMS.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-mMigBvPD.js';
import '../../chunks/bundle-2hneibdl.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-9qb1BPMn.js';
import '../../chunks/bundle-17qkheiM.js';
import '../../chunks/bundle-p0z4OS-3.js';
import '../../chunks/bundle-LgR-0X7v.js';
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

import React__default from 'react';
import { u as useOpenChannelContext } from '../../chunks/bundle-x3Hh1WqI.js';
import OpenChannelInput from './OpenChannelInput.js';
import FrozenNotification from './FrozenChannelNotification.js';
import OpenchannelConversationHeader from './OpenChannelHeader.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import OpenChannelMessageList from './OpenChannelMessageList.js';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-KMsJXUN2.js';
import '../../chunks/bundle-xlx3bBW8.js';
import '../../chunks/bundle-THTV9S18.js';
import '@sendbird/chat';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-J4Twjc27.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import '../../chunks/bundle-msnuMA4R.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-kMMCn6GE.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-NOh3ukH6.js';
import '../../chunks/bundle-hKmRj7Ck.js';
import '../../chunks/bundle-1uBgZh_D.js';
import 'dompurify';
import '../../chunks/bundle-qauKidkr.js';
import '../../chunks/bundle-wf7f-9LT.js';
import '../../chunks/bundle-cMznkLt0.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-pODFB39J.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../ui/ImageRenderer.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-SpfAN5pr.js';
import '../../chunks/bundle-vbGNKQpe.js';
import './OpenChannelMessage.js';
import '../../ui/OpenchannelUserMessage.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-gkw1uTO0.js';
import '../../chunks/bundle-o82HAP3p.js';
import '../../chunks/bundle-3iFqiLDd.js';
import '../../ui/OpenChannelAdminMessage.js';
import '../../ui/OpenchannelOGMessage.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-AjBmMBJ5.js';
import '../../Message/context.js';
import '../../ui/MentionLabel.js';
import '../../ui/OpenchannelThumbnailMessage.js';
import '../../ui/OpenchannelFileMessage.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nGuCRoDK.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-13MqUbIu.js';
import '../../chunks/bundle-HUsfnqzD.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-pZ049TQg.js';
import '../../chunks/bundle-zhxgqh8X.js';
import '../../chunks/bundle-JMVaVraV.js';
import '../../chunks/bundle-fO5XIU5Y.js';
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

'use strict';

var React = require('react');
var OpenChannel_context = require('../../chunks/bundle-YHE2Epiq.js');
var OpenChannel_components_OpenChannelInput = require('./OpenChannelInput.js');
var OpenChannel_components_FrozenChannelNotification = require('./FrozenChannelNotification.js');
var OpenChannel_components_OpenChannelHeader = require('./OpenChannelHeader.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var OpenChannel_components_OpenChannelMessageList = require('./OpenChannelMessageList.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('../../chunks/bundle-vmQPp-90.js');
require('../../chunks/bundle-NfUcey5s.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-NNEanMqk.js');
require('../../chunks/bundle-izlAxQOw.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('../../chunks/bundle-Nz6fSUye.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../chunks/bundle-37dz9yoi.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-4jVvOUfV.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-Ka3VBiNF.js');
require('../../chunks/bundle-2FdL4aA6.js');
require('../../chunks/bundle-vnNrprB3.js');
require('dompurify');
require('../../chunks/bundle-suIvps1I.js');
require('../../chunks/bundle-bXe-_rig.js');
require('../../chunks/bundle-scYpz-Ln.js');
require('../../chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-URV6GLmd.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-r8DyENxy.js');
require('../../chunks/bundle-T9gnzy2i.js');
require('./OpenChannelMessage.js');
require('../../ui/OpenchannelUserMessage.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-8WEXT27N.js');
require('../../chunks/bundle-onSp6JcR.js');
require('../../chunks/bundle-l768-Ldg.js');
require('../../ui/OpenChannelAdminMessage.js');
require('../../ui/OpenchannelOGMessage.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-zswKzOJx.js');
require('../../Message/context.js');
require('../../ui/MentionLabel.js');
require('../../ui/OpenchannelThumbnailMessage.js');
require('../../ui/OpenchannelFileMessage.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-oaDSLq17.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-9DG1byjg.js');
require('../../chunks/bundle-mO4Gb6oX.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-Ri0nZ4E4.js');
require('../../chunks/bundle-nrHJPIVo.js');
require('../../chunks/bundle-hWEZzs4y.js');
require('../../chunks/bundle-CPnHexJQ.js');
require('@sendbird/chat/message');
require('../../Channel/utils/compareMessagesForGrouping.js');

var COMPONENT_CLASS_NAME = 'sendbird-openchannel-conversation';
var OpenChannelUI = function (_a) {
    var renderMessage = _a.renderMessage, renderHeader = _a.renderHeader, renderInput = _a.renderInput, renderPlaceHolderEmptyList = _a.renderPlaceHolderEmptyList, renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading;
    var _b = OpenChannel_context.useOpenChannelContext(), currentOpenChannel = _b.currentOpenChannel, amIBanned = _b.amIBanned, loading = _b.loading, isInvalid = _b.isInvalid, messageInputRef = _b.messageInputRef, conversationScrollRef = _b.conversationScrollRef;
    if (!currentOpenChannel
        || !(currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.url)
        || amIBanned) {
        return ((renderPlaceHolderError === null || renderPlaceHolderError === void 0 ? void 0 : renderPlaceHolderError())
            || React.createElement("div", { className: COMPONENT_CLASS_NAME },
                React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.NO_CHANNELS })));
    }
    if (loading) {
        return ((renderPlaceHolderLoading === null || renderPlaceHolderLoading === void 0 ? void 0 : renderPlaceHolderLoading())
            || React.createElement("div", { className: COMPONENT_CLASS_NAME },
                React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.LOADING })));
    }
    if (isInvalid) {
        return ((renderPlaceHolderError === null || renderPlaceHolderError === void 0 ? void 0 : renderPlaceHolderError())
            || React.createElement("div", { className: COMPONENT_CLASS_NAME },
                React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.WRONG })));
    }
    return (React.createElement("div", { className: COMPONENT_CLASS_NAME },
        (renderHeader === null || renderHeader === void 0 ? void 0 : renderHeader()) || (React.createElement(OpenChannel_components_OpenChannelHeader, null)),
        (currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isFrozen) && (React.createElement(OpenChannel_components_FrozenChannelNotification, null)),
        React.createElement(OpenChannel_components_OpenChannelMessageList, { ref: conversationScrollRef, renderMessage: renderMessage, renderPlaceHolderEmptyList: renderPlaceHolderEmptyList }),
        (renderInput === null || renderInput === void 0 ? void 0 : renderInput()) || (React.createElement(OpenChannel_components_OpenChannelInput, { ref: messageInputRef }))));
};

module.exports = OpenChannelUI;
//# sourceMappingURL=OpenChannelUI.js.map

'use strict';

var React = require('react');
var OpenChannel_context = require('../../chunks/bundle-T5IkV5L8.js');
var OpenChannel_components_OpenChannelInput = require('./OpenChannelInput.js');
var OpenChannel_components_FrozenChannelNotification = require('./FrozenChannelNotification.js');
var OpenChannel_components_OpenChannelHeader = require('./OpenChannelHeader.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var OpenChannel_components_OpenChannelMessageList = require('./OpenChannelMessageList.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('../../chunks/bundle-VqRllkVd.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-a5LHhP6m.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-iPt3h7ba.js');
require('../../chunks/bundle-KOig1nUx.js');
require('./OpenChannelMessage.js');
require('../../ui/OpenchannelUserMessage.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-vDHl9-Jj.js');
require('../../chunks/bundle-70I7qjvf.js');
require('../../chunks/bundle-pOf7PZ4G.js');
require('../../ui/OpenChannelAdminMessage.js');
require('../../ui/OpenchannelOGMessage.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-DqKLlsGU.js');
require('../../Message/context.js');
require('../../ui/MentionLabel.js');
require('../../ui/OpenchannelThumbnailMessage.js');
require('../../ui/OpenchannelFileMessage.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-s5WIvT8N.js');
require('../../chunks/bundle-noP7JXqE.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-gOYUXAiI.js');
require('../../chunks/bundle-zlfJ0EDR.js');
require('../../chunks/bundle-Zw2P8RwZ.js');
require('../../chunks/bundle-6xWNZugu.js');
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

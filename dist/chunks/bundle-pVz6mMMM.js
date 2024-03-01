import React__default from 'react';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { TypingIndicator } from '../GroupChannel/components/TypingIndicator.js';
import { T as TypingIndicatorType } from './bundle-sn2-VCB3.js';
import ConnectionStatus from '../ui/ConnectionStatus.js';
import PlaceHolder, { PlaceHolderTypes } from '../ui/PlaceHolder.js';

var GroupChannelUIView = function (props) {
    var _a, _b, _c, _d;
    var isLoading = props.isLoading, isInvalid = props.isInvalid, channelUrl = props.channelUrl, renderChannelHeader = props.renderChannelHeader, renderMessageList = props.renderMessageList, renderMessageInput = props.renderMessageInput, renderTypingIndicator = props.renderTypingIndicator, renderPlaceholderLoader = props.renderPlaceholderLoader, renderPlaceholderInvalid = props.renderPlaceholderInvalid;
    var _e = useSendbirdStateContext(), stores = _e.stores, config = _e.config;
    var sdkError = (_a = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _a === void 0 ? void 0 : _a.error;
    var logger = config.logger, isOnline = config.isOnline;
    // Note: This is not a loading status of the message list.
    //  It is just for custom props from the Channel module and is not used in the GroupChannel module. (We should remove this in v4)
    if (isLoading) {
        return React__default.createElement("div", { className: "sendbird-conversation" }, (renderPlaceholderLoader === null || renderPlaceholderLoader === void 0 ? void 0 : renderPlaceholderLoader()) || React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.LOADING }));
    }
    if (!channelUrl) {
        return (React__default.createElement("div", { className: "sendbird-conversation" }, (renderPlaceholderInvalid === null || renderPlaceholderInvalid === void 0 ? void 0 : renderPlaceholderInvalid()) || React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.NO_CHANNELS })));
    }
    if (isInvalid) {
        return React__default.createElement("div", { className: "sendbird-conversation" }, (renderPlaceholderInvalid === null || renderPlaceholderInvalid === void 0 ? void 0 : renderPlaceholderInvalid()) || React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.WRONG }));
    }
    if (sdkError) {
        return (React__default.createElement("div", { className: "sendbird-conversation" }, (renderPlaceholderInvalid === null || renderPlaceholderInvalid === void 0 ? void 0 : renderPlaceholderInvalid()) || (React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.WRONG, retryToConnect: function () {
                logger.info('Channel: reconnecting');
                // reconnect();
            } }))));
    }
    return (React__default.createElement("div", { className: "sendbird-conversation" }, renderChannelHeader === null || renderChannelHeader === void 0 ? void 0 :
        renderChannelHeader({ className: 'sendbird-conversation__channel-header' }), renderMessageList === null || renderMessageList === void 0 ? void 0 :
        renderMessageList(props),
        React__default.createElement("div", { className: "sendbird-conversation__footer" }, renderMessageInput === null || renderMessageInput === void 0 ? void 0 :
            renderMessageInput(),
            React__default.createElement("div", { className: "sendbird-conversation__footer__typing-indicator" },
                (renderTypingIndicator === null || renderTypingIndicator === void 0 ? void 0 : renderTypingIndicator())
                    || (((_b = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _b === void 0 ? void 0 : _b.enableTypingIndicator) && ((_d = (_c = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _c === void 0 ? void 0 : _c.typingIndicatorTypes) === null || _d === void 0 ? void 0 : _d.has(TypingIndicatorType.Text)) && (React__default.createElement(TypingIndicator, { channelUrl: channelUrl }))),
                !isOnline && React__default.createElement(ConnectionStatus, null)))));
};

export { GroupChannelUIView as G };
//# sourceMappingURL=bundle-pVz6mMMM.js.map

'use strict';

var React = require('react');
var index = require('../chunks/bundle-Uw6P-cM9.js');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-KkCwxjVN.js');
var LocalizationContext = require('../chunks/bundle-WKa05h0_.js');
var ui_ImageRenderer = require('./ImageRenderer.js');
var utils = require('../chunks/bundle--4Ob_RGQ.js');
require('../chunks/bundle-xbdnJE9-.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-tNuJSOqI.js');
require('../chunks/bundle-jCTpndN0.js');
require('../chunks/bundle-Yzhiyr0t.js');
require('../chunks/bundle-HY8cubCp.js');

var componentClassname = 'sendbird-quote_message_input__avatar';
function QuoteMessageThumbnail(_a) {
    var _b, _c;
    var message = _a.message;
    if (!index.isFileMessage(message) && !index.isMultipleFilesMessage(message) || index.isVoiceMessage(message)) {
        return null;
    }
    var thumbnailUrl = utils.getMessageFirstFileThumbnailUrl(message);
    if (!thumbnailUrl) {
        if (((_b = message.isFileMessage) === null || _b === void 0 ? void 0 : _b.call(message))
            && (index.isImageMessage(message)
                || index.isVideoMessage(message))) {
            thumbnailUrl = utils.getMessageFirstFileUrl(message);
        }
        else if (((_c = message.isMultipleFilesMessage) === null || _c === void 0 ? void 0 : _c.call(message))
            && (message.fileInfoList.length > 0
                && index.isImageFileInfo((message).fileInfoList[0]))) {
            thumbnailUrl = message.fileInfoList[0].url;
        }
    }
    if (index.isVideoMessage(message) && thumbnailUrl) {
        return (React.createElement("div", { className: componentClassname },
            React.createElement("video", { style: {
                    width: '44px',
                    height: '44px',
                }, src: thumbnailUrl })));
    }
    else if ((index.isThumbnailMessage(message) || index.isMultipleFilesMessage(message)) && thumbnailUrl) {
        return (React.createElement(ui_ImageRenderer.default, { className: componentClassname, url: thumbnailUrl, alt: utils.getMessageFirstFileType(message), width: "44px", height: "44px", fixedSize: true }));
    }
    else if (index.isAudioMessage(message)) {
        return (React.createElement("div", { className: componentClassname },
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.FILE_AUDIO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "24px", height: "24px" })));
    }
    else {
        return (React.createElement("div", { className: componentClassname },
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.FILE_DOCUMENT, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "24px", height: "24px" })));
    }
}

function QuoteMessageInput(_a) {
    var className = _a.className, replyingMessage = _a.replyingMessage, onClose = _a.onClose;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var fileMessage = replyingMessage;
    var sender = replyingMessage === null || replyingMessage === void 0 ? void 0 : replyingMessage.sender;
    var displayFileIcon = (index.isFileMessage(replyingMessage) || index.isMultipleFilesMessage(replyingMessage))
        && !index.isVoiceMessage(replyingMessage);
    return (React.createElement("div", { className: index.getClassName(['sendbird-quote_message_input', className]) },
        displayFileIcon && (React.createElement(QuoteMessageThumbnail, { message: fileMessage })),
        React.createElement("div", { className: "sendbird-quote_message_input__body", style: {
                width: "calc(100% - ".concat(displayFileIcon ? '164px' : '120px', ")"),
                left: displayFileIcon ? '92px' : '40px',
            } },
            React.createElement(ui_Label.Label, { className: "sendbird-quote_message_input__body__sender-name", type: ui_Label.LabelTypography.CAPTION_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, "".concat(stringSet.QUOTE_MESSAGE_INPUT__REPLY_TO, " ").concat((sender && sender.nickname) ? sender.nickname : stringSet.NO_NAME)),
            React.createElement(ui_Label.Label, { className: "sendbird-quote_message_input__body__message-content", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_3 },
                index.isImageMessage(fileMessage) && !index.isGifMessage(fileMessage) && stringSet.QUOTE_MESSAGE_INPUT__FILE_TYPE_IMAGE,
                index.isVideoMessage(fileMessage) && stringSet.QUOTE_MESSAGE_INPUT__FILE_TYPE__VIDEO,
                index.isGifMessage(fileMessage) && stringSet.QUOTE_MESSAGE_INPUT__FILE_TYPE_GIF,
                index.isUserMessage(replyingMessage) && replyingMessage.message,
                index.getUIKitMessageType(replyingMessage) === index.UIKitMessageTypes.FILE && utils.getMessageFirstFileName(fileMessage),
                index.isMultipleFilesMessage(replyingMessage)
                    && "".concat(fileMessage.fileInfoList.length, " Photos"),
                index.isVoiceMessage(replyingMessage) && stringSet.VOICE_MESSAGE)),
        React.createElement(ui_Icon.default, { className: "sendbird-quote_message_input__close-button", type: ui_Icon.IconTypes.CLOSE, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "24px", height: "24px", onClick: function () { return onClose(replyingMessage); } })));
}

module.exports = QuoteMessageInput;
//# sourceMappingURL=QuoteMessageInput.js.map

'use strict';

var React = require('react');
var index = require('../../chunks/bundle-KOig1nUx.js');
var ui_OpenchannelUserMessage = require('../../ui/OpenchannelUserMessage.js');
var ui_OpenChannelAdminMessage = require('../../ui/OpenChannelAdminMessage.js');
var ui_OpenchannelOGMessage = require('../../ui/OpenchannelOGMessage.js');
var ui_OpenchannelThumbnailMessage = require('../../ui/OpenchannelThumbnailMessage.js');
var ui_OpenchannelFileMessage = require('../../ui/OpenchannelFileMessage.js');
var ui_DateSeparator = require('../../ui/DateSeparator.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var ui_MessageInput = require('../../ui/MessageInput.js');
var ui_FileViewer = require('../../chunks/bundle-s5WIvT8N.js');
var ui_Modal = require('../../chunks/bundle-6hGNMML2.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var stringFormatterUtils = require('../../chunks/bundle-gOYUXAiI.js');
var OpenChannel_context = require('../../chunks/bundle-T5IkV5L8.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/Icon.js');
require('../../ui/ContextMenu.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../ui/IconButton.js');
require('../../ui/Loader.js');
require('../../ui/UserProfile.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../ui/Button.js');
require('../../withSendbird.js');
require('../../chunks/bundle-vDHl9-Jj.js');
require('../../chunks/bundle-70I7qjvf.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../chunks/bundle-pOf7PZ4G.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-DqKLlsGU.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../Message/context.js');
require('../../ui/MentionLabel.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-noP7JXqE.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-kLoWlyQs.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-a5LHhP6m.js');

function RemoveMessageModal(_a) {
    var message = _a.message, onCloseModal = _a.onCloseModal, onDeleteMessage = _a.onDeleteMessage;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement(ui_Modal.Modal, { onCancel: onCloseModal, onSubmit: onDeleteMessage, submitText: stringSet.MESSAGE_MENU__DELETE, titleText: stringFormatterUtils.getModalDeleteMessageTitle(stringSet, message) }));
}

var MessageTypes = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    FILE: 'FILE',
    THUMBNAIL: 'THUMBNAIL',
    OG: 'OG',
    UNKNOWN: 'UNKNOWN',
};
var SendingMessageStatus = {
    NONE: 'none',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
    PENDING: 'pending',
};
var getMessageType = function (message, options) {
    var _a, _b;
    var isOgMessageEnabledInOpenChannel = options === null || options === void 0 ? void 0 : options.isOgMessageEnabledInOpenChannel;
    if (((_a = message === null || message === void 0 ? void 0 : message.isUserMessage) === null || _a === void 0 ? void 0 : _a.call(message)) || (message === null || message === void 0 ? void 0 : message.messageType) === 'user') {
        return ((message === null || message === void 0 ? void 0 : message.ogMetaData) && isOgMessageEnabledInOpenChannel)
            ? MessageTypes.OG
            : MessageTypes.USER;
    }
    if ((_b = message === null || message === void 0 ? void 0 : message.isAdminMessage) === null || _b === void 0 ? void 0 : _b.call(message)) {
        return MessageTypes.ADMIN;
    }
    if ((message === null || message === void 0 ? void 0 : message.messageType) === 'file') {
        return (ui_FileViewer.isImage(message.type) || ui_FileViewer.isVideo(message.type))
            ? MessageTypes.THUMBNAIL
            : MessageTypes.FILE;
    }
    return MessageTypes.UNKNOWN;
};

function MessagOpenChannelMessageeHoc(props) {
    var _a;
    var _b;
    var message = props.message, chainTop = props.chainTop, chainBottom = props.chainBottom, hasSeparator = props.hasSeparator, renderMessage = props.renderMessage;
    var _c = OpenChannel_context.useOpenChannelContext(), currentOpenChannel = _c.currentOpenChannel, deleteMessage = _c.deleteMessage, updateMessage = _c.updateMessage, resendMessage = _c.resendMessage;
    var _d = LocalizationContext.useLocalization(), dateLocale = _d.dateLocale, stringSet = _d.stringSet;
    var editDisabled = currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isFrozen;
    var globalState = useSendbirdStateContext.useSendbirdStateContext();
    var currentUserId = (_b = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _b === void 0 ? void 0 : _b.userId;
    var isOgMessageEnabledInOpenChannel = globalState.config.openChannel.enableOgtag;
    var sender = null;
    if ((message === null || message === void 0 ? void 0 : message.messageType) !== 'admin') {
        sender = message === null || message === void 0 ? void 0 : message.sender;
    }
    var RenderedMessage = React.useMemo(function () { return function (props) {
        return React.createElement(React.Fragment, null, renderMessage ? renderMessage(props) : null);
    }; }, [message, renderMessage]);
    var _e = React.useState(false), showEdit = _e[0], setShowEdit = _e[1];
    var _f = React.useState(false), showRemove = _f[0], setShowRemove = _f[1];
    var _g = React.useState(false), showFileViewer = _g[0], setShowFileViewer = _g[1];
    var editMessageInputRef = React.useRef(null);
    var isByMe = false;
    if (sender && (message === null || message === void 0 ? void 0 : message.messageType) !== 'admin') {
        // pending and failed messages are by me
        isByMe = currentUserId === sender.userId
            || (message === null || message === void 0 ? void 0 : message.sendingStatus)
                === SendingMessageStatus.PENDING
            || (message === null || message === void 0 ? void 0 : message.sendingStatus)
                === SendingMessageStatus.FAILED;
    }
    if (renderMessage && RenderedMessage) {
        return (React.createElement("div", { className: "sendbird-msg-hoc sendbird-msg--scroll-ref" },
            React.createElement(RenderedMessage, { message: message, chainTop: chainTop, chainBottom: chainBottom })));
    }
    if ((message === null || message === void 0 ? void 0 : message.messageType) === 'user' && showEdit) {
        return (React.createElement(ui_MessageInput, { isEdit: true, channel: currentOpenChannel, disabled: editDisabled, ref: editMessageInputRef, message: message, onUpdateMessage: function (_a) {
                var messageId = _a.messageId, message = _a.message;
                updateMessage(messageId, message);
                setShowEdit(false);
            }, onCancelEdit: function () {
                setShowEdit(false);
            } }));
    }
    return (React.createElement("div", { className: "sendbird-msg-hoc sendbird-msg--scroll-ref" },
        React.createElement(React.Fragment, null,
            hasSeparator && (message === null || message === void 0 ? void 0 : message.createdAt) && (React.createElement(ui_DateSeparator, null,
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, index.format(message === null || message === void 0 ? void 0 : message.createdAt, stringSet.DATE_FORMAT__MESSAGE_LIST__DATE_SEPARATOR, { locale: dateLocale })))),
            (_a = {},
                _a[MessageTypes.ADMIN] = (function () {
                    if ((message === null || message === void 0 ? void 0 : message.messageType) === 'admin') {
                        return (React.createElement(ui_OpenChannelAdminMessage, { message: message }));
                    }
                })(),
                _a[MessageTypes.FILE] = (function () {
                    var _a;
                    if ((message === null || message === void 0 ? void 0 : message.messageType) === 'file') {
                        return (React.createElement(ui_OpenchannelFileMessage, { message: message, isOperator: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isOperator((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId), isEphemeral: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isEphemeral, disabled: editDisabled, userId: currentUserId, showRemove: setShowRemove, resendMessage: resendMessage, chainTop: chainTop, chainBottom: chainBottom }));
                    }
                })(),
                _a[MessageTypes.OG] = (function () {
                    var _a;
                    if ((message === null || message === void 0 ? void 0 : message.messageType) === 'user'
                        && isOgMessageEnabledInOpenChannel) {
                        return (React.createElement(ui_OpenchannelOGMessage, { message: message, isOperator: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isOperator((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId), isEphemeral: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isEphemeral, userId: currentUserId, showEdit: setShowEdit, disabled: editDisabled, showRemove: setShowRemove, resendMessage: resendMessage, chainTop: chainTop, chainBottom: chainBottom }));
                    }
                })(),
                _a[MessageTypes.THUMBNAIL] = (function () {
                    var _a;
                    if ((message === null || message === void 0 ? void 0 : message.messageType) === 'file') {
                        return (React.createElement(ui_OpenchannelThumbnailMessage, { message: message, isOperator: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isOperator((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId), isEphemeral: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isEphemeral, disabled: editDisabled, userId: currentUserId, showRemove: setShowRemove, resendMessage: resendMessage, onClick: setShowFileViewer, chainTop: chainTop, chainBottom: chainBottom }));
                    }
                })(),
                _a[MessageTypes.USER] = (function () {
                    var _a;
                    if ((message === null || message === void 0 ? void 0 : message.messageType) === 'user') {
                        return (React.createElement(ui_OpenchannelUserMessage, { message: message, isOperator: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isOperator((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId), isEphemeral: currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.isEphemeral, userId: currentUserId, disabled: editDisabled, showEdit: setShowEdit, showRemove: setShowRemove, resendMessage: resendMessage, chainTop: chainTop, chainBottom: chainBottom }));
                    }
                })(),
                _a[MessageTypes.UNKNOWN] = (function () {
                    // return (
                    //   <OpenChannelUnknownMessage message={message} />
                    // );
                })(),
                _a)[getMessageType(message, { isOgMessageEnabledInOpenChannel: isOgMessageEnabledInOpenChannel })],
            showRemove && (React.createElement(RemoveMessageModal, { message: message, onCloseModal: function () { return setShowRemove(false); }, onDeleteMessage: function () {
                    if ((message === null || message === void 0 ? void 0 : message.messageType) !== 'admin') {
                        deleteMessage(message);
                    }
                } })),
            showFileViewer && (message === null || message === void 0 ? void 0 : message.messageType) === 'file' && (React.createElement(ui_FileViewer.FileViewer, { onClose: function () { return setShowFileViewer(false); }, message: message, onDelete: function () { return deleteMessage(message); }, isByMe: isByMe })))));
}

module.exports = MessagOpenChannelMessageeHoc;
//# sourceMappingURL=OpenChannelMessage.js.map

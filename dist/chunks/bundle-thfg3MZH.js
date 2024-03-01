import React__default from 'react';
import { createPortal } from 'react-dom';
import { A as Avatar } from './bundle-LbQw2cVx.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from './bundle-ljRDDTki.js';
import { j as isSupportedFileView, k as isVideo, d as isImage } from './bundle-WrTlYypL.js';
import '../hooks/useModal.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { a as MODAL_ROOT } from './bundle--BlhOpUS.js';

var FileViewerView = function (_a) {
    var message = _a.message, onCancel = _a.onCancel, deleteMessage = _a.deleteMessage;
    var sender = message.sender, type = message.type, url = message.url, _b = message.name, name = _b === void 0 ? '' : _b, threadInfo = message.threadInfo;
    var profileUrl = sender.profileUrl, nickname = sender.nickname, userId = sender.userId;
    var config = useSendbirdStateContext().config;
    return createPortal(React__default.createElement(FileViewerComponent, { profileUrl: profileUrl, nickname: nickname, type: type, url: url, name: name, onCancel: onCancel, onDelete: function () { return deleteMessage(message).then(function () { return onCancel(); }); }, isByMe: config.userId === userId, disableDelete: (threadInfo === null || threadInfo === void 0 ? void 0 : threadInfo.replyCount) > 0 }), document.getElementById(MODAL_ROOT));
};
var FileViewerComponent = function (_a) {
    var 
    // sender
    profileUrl = _a.profileUrl, nickname = _a.nickname, 
    // file
    name = _a.name, type = _a.type, url = _a.url, 
    // others
    isByMe = _a.isByMe, onCancel = _a.onCancel, onDelete = _a.onDelete, disableDelete = _a.disableDelete;
    return (React__default.createElement("div", { className: "sendbird-fileviewer" },
        React__default.createElement("div", { className: "sendbird-fileviewer__header" },
            React__default.createElement("div", { className: "sendbird-fileviewer__header__left" },
                React__default.createElement("div", { className: "sendbird-fileviewer__header__left__avatar" },
                    React__default.createElement(Avatar, { height: "32px", width: "32px", src: profileUrl })),
                React__default.createElement(Label, { className: "sendbird-fileviewer__header__left__filename", type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, name),
                React__default.createElement(Label, { className: "sendbird-fileviewer__header__left__sender-name", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_2 }, nickname)),
            React__default.createElement("div", { className: "sendbird-fileviewer__header__right" },
                isSupportedFileView(type) && (React__default.createElement("div", { className: "sendbird-fileviewer__header__right__actions" },
                    React__default.createElement("a", { className: "sendbird-fileviewer__header__right__actions__download", rel: "noopener noreferrer", href: url, target: "_blank" },
                        React__default.createElement(Icon, { type: IconTypes.DOWNLOAD, fillColor: IconColors.ON_BACKGROUND_1, height: "24px", width: "24px" })),
                    onDelete && isByMe && (React__default.createElement("div", { className: "sendbird-fileviewer__header__right__actions__delete" },
                        React__default.createElement(Icon, { className: disableDelete ? 'disabled' : '', type: IconTypes.DELETE, fillColor: disableDelete ? IconColors.GRAY : IconColors.ON_BACKGROUND_1, height: "24px", width: "24px", onClick: function () {
                                if (!disableDelete) {
                                    onDelete();
                                }
                            } }))))),
                React__default.createElement("div", { className: "sendbird-fileviewer__header__right__actions__close" },
                    React__default.createElement(Icon, { type: IconTypes.CLOSE, fillColor: IconColors.ON_BACKGROUND_1, height: "24px", width: "24px", onClick: onCancel })))),
        React__default.createElement("div", { className: "sendbird-fileviewer__content" },
            isVideo(type) && (React__default.createElement("video", { controls: true, className: "sendbird-fileviewer__content__video" },
                React__default.createElement("source", { src: url, type: type }))),
            isImage(type) && React__default.createElement("img", { src: url, alt: name, className: "sendbird-fileviewer__content__img" }),
            !isSupportedFileView(type) && (React__default.createElement("div", { className: "sendbird-fileviewer__content__unsupported" },
                React__default.createElement(Label, { type: LabelTypography.H_1, color: LabelColors.ONBACKGROUND_1 }, "Unsupoprted message"))))));
};

export { FileViewerView as F };
//# sourceMappingURL=bundle-thfg3MZH.js.map

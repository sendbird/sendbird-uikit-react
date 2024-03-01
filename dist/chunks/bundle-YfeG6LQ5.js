import { _ as __assign } from './bundle-UnAcr6wX.js';
import React__default, { useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { L as LocalizationContext } from './bundle-hS8Jw8F1.js';
import '../hooks/useModal.js';
import { c as isMultipleFilesMessage, b as isFileMessage, j as isSupportedFileView, k as isVideo$1, d as isImage$1 } from './bundle-WrTlYypL.js';
import { n as noop } from './bundle-CRwhglru.js';
import { A as Avatar } from './bundle-LbQw2cVx.js';
import { L as Label, a as LabelTypography, b as LabelColors } from './bundle-ljRDDTki.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { l as SLIDER_BUTTON_ICON_SIDE_LENGTH } from './bundle-1CfFFBx9.js';
import { u as useKeyDown } from './bundle-KL4mvVMo.js';
import { a as MODAL_ROOT } from './bundle--BlhOpUS.js';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
var SUPPORTED_MIMES = {
    IMAGE: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp',
    ],
    VIDEO: [
        'video/mpeg',
        'video/ogg',
        'video/webm',
        'video/mp4',
    ],
};
var isImage = function (type) { return SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0; };
var isVideo = function (type) { return SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0; };
__assign({}, SUPPORTED_MIMES);
var ViewerTypes = {
    SINGLE: 'SINGLE',
    MULTI: 'MULTI',
};

function mapFileViewerComponentProps(_a) {
    var props = _a.props;
    if (props.viewerType === ViewerTypes.MULTI) {
        var _b = props, fileInfoList = _b.fileInfoList, currentIndex = _b.currentIndex;
        return fileInfoList[currentIndex];
    }
    var fileInfo = props;
    return {
        name: fileInfo.name,
        type: fileInfo.type,
        url: fileInfo.url,
    };
}

function DeleteButton(props) {
    if (props.viewerType !== ViewerTypes.MULTI) {
        var onDelete_1 = props.onDelete, isByMe = props.isByMe, disableDelete_1 = props.disableDelete, className = props.className;
        return (isByMe)
            ? (React__default.createElement("div", { className: "sendbird-fileviewer__header__right__actions__delete ".concat(className) },
                React__default.createElement(Icon, { className: disableDelete_1 ? 'disabled' : '', type: IconTypes.DELETE, fillColor: disableDelete_1 ? IconColors.GRAY : IconColors.ON_BACKGROUND_1, height: "24px", width: "24px", onClick: function (e) { if (!disableDelete_1) {
                        onDelete_1 === null || onDelete_1 === void 0 ? void 0 : onDelete_1(e);
                    } } })))
            : React__default.createElement(React__default.Fragment, null);
    }
    return React__default.createElement(React__default.Fragment, null);
}

// this is a slider component that is used to navigate between images
function Slider(props) {
    if (props.viewerType === ViewerTypes.MULTI) {
        var onClickLeft_1 = props.onClickLeft, onClickRight_1 = props.onClickRight;
        return (React__default.createElement("div", { className: "sendbird-file-viewer-slider" },
            React__default.createElement("div", { className: "sendbird-file-viewer-arrow--left" },
                React__default.createElement(Icon, { type: IconTypes.SLIDE_LEFT, fillColor: IconColors.ON_BACKGROUND_1, height: SLIDER_BUTTON_ICON_SIDE_LENGTH, width: SLIDER_BUTTON_ICON_SIDE_LENGTH, onClick: function (e) {
                        onClickLeft_1 === null || onClickLeft_1 === void 0 ? void 0 : onClickLeft_1();
                        e.stopPropagation();
                    } })),
            React__default.createElement("div", { className: "sendbird-file-viewer-arrow--right" },
                React__default.createElement(Icon, { type: IconTypes.SLIDE_LEFT, fillColor: IconColors.ON_BACKGROUND_1, height: SLIDER_BUTTON_ICON_SIDE_LENGTH, width: SLIDER_BUTTON_ICON_SIDE_LENGTH, onClick: function (e) {
                        e.stopPropagation();
                        onClickRight_1 === null || onClickRight_1 === void 0 ? void 0 : onClickRight_1();
                    } }))));
    }
    // return empty fragment if viewerType is not ViewerTypes.MULTI
    return React__default.createElement(React__default.Fragment, null);
}

var FileViewerComponent = function (props) {
    var ref = useRef(null);
    var profileUrl = props.profileUrl, nickname = props.nickname, onClose = props.onClose;
    var _a = props, onClickLeft = _a.onClickLeft, onClickRight = _a.onClickRight;
    var onKeyDown = useKeyDown(ref, {
        Escape: function (e) { return onClose === null || onClose === void 0 ? void 0 : onClose(e); },
        ArrowLeft: function () { return onClickLeft === null || onClickLeft === void 0 ? void 0 : onClickLeft(); },
        ArrowRight: function () { return onClickRight === null || onClickRight === void 0 ? void 0 : onClickRight(); },
    });
    var _b = mapFileViewerComponentProps({ props: props }), name = _b.name, type = _b.type, url = _b.url;
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-fileviewer", onKeyDown: onKeyDown, 
        // to focus
        tabIndex: 1, ref: ref },
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
                    React__default.createElement(DeleteButton, __assign({ className: 'sendbird-fileviewer__header__right__actions__delete' }, props)))),
                React__default.createElement("div", { className: "sendbird-fileviewer__header__right__actions__close" },
                    React__default.createElement(Icon, { type: IconTypes.CLOSE, fillColor: IconColors.ON_BACKGROUND_1, height: "24px", width: "24px", onClick: function (e) { return onClose === null || onClose === void 0 ? void 0 : onClose(e); } })))),
        React__default.createElement("div", { className: "sendbird-fileviewer__content" },
            isVideo$1(type) && (React__default.createElement("video", { controls: true, className: "sendbird-fileviewer__content__video" },
                React__default.createElement("source", { src: url, type: type }))),
            isImage$1(type) && (React__default.createElement("img", { src: url, alt: name, className: props.viewerType === ViewerTypes.MULTI
                    ? 'sendbird-fileviewer__content__img__multi'
                    : 'sendbird-fileviewer__content__img' })),
            !isSupportedFileView(type) && (React__default.createElement("div", { className: "sendbird-fileviewer__content__unsupported" },
                React__default.createElement(Label, { type: LabelTypography.H_1, color: LabelColors.ONBACKGROUND_1 }, (stringSet === null || stringSet === void 0 ? void 0 : stringSet.UI__FILE_VIEWER__UNSUPPORT) || 'Unsupported message'))),
            React__default.createElement(Slider, __assign({}, props)))));
};
function FileViewer(_a) {
    var _b, _c, _d;
    var message = _a.message, _e = _a.statefulFileInfoList, statefulFileInfoList = _e === void 0 ? [] : _e, onClose = _a.onClose, _f = _a.isByMe, isByMe = _f === void 0 ? false : _f, onDelete = _a.onDelete, currentIndex = _a.currentIndex, onClickLeft = _a.onClickLeft, onClickRight = _a.onClickRight;
    if (isMultipleFilesMessage(message)) {
        var castedMessage = message;
        return (React__default.createElement(FileViewerComponent, { profileUrl: castedMessage.sender.profileUrl, nickname: castedMessage.sender.nickname, viewerType: ViewerTypes.MULTI, fileInfoList: statefulFileInfoList.filter(function (fileInfo) {
                return fileInfo.url; // Caution: This assumes that defined url means file upload has completed.
            }).map(function (fileInfo) {
                return {
                    name: fileInfo.fileName || '',
                    type: fileInfo.mimeType || '',
                    url: fileInfo.url,
                };
            }), currentIndex: currentIndex || 0, onClickLeft: onClickLeft || noop, onClickRight: onClickRight || noop, onClose: onClose }));
    }
    else if (isFileMessage(message)) {
        var castedMessage = message;
        return createPortal((React__default.createElement(FileViewerComponent, { profileUrl: (_b = castedMessage.sender) === null || _b === void 0 ? void 0 : _b.profileUrl, nickname: (_c = castedMessage.sender) === null || _c === void 0 ? void 0 : _c.nickname, name: castedMessage.name, type: castedMessage.type, url: castedMessage === null || castedMessage === void 0 ? void 0 : castedMessage.url, isByMe: isByMe, disableDelete: (((_d = castedMessage.threadInfo) === null || _d === void 0 ? void 0 : _d.replyCount) || 0) > 0, onClose: onClose, onDelete: onDelete || noop })), document.getElementById(MODAL_ROOT));
    }
    return React__default.createElement(React__default.Fragment, null);
}

export { FileViewer as F, isVideo as a, FileViewerComponent as b, isImage as i };
//# sourceMappingURL=bundle-YfeG6LQ5.js.map

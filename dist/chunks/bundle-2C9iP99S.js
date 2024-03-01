import React__default, { useState, useMemo, useRef, useEffect } from 'react';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { SendingStatus } from '@sendbird/chat/message';
import ImageRenderer, { getBorderRadiusForMultipleImageRenderer } from '../ui/ImageRenderer.js';
import { w as getClassName, A as isGif } from './bundle-WrTlYypL.js';
import { F as FileViewer } from './bundle-YfeG6LQ5.js';
import { K } from './bundle-UuydkZ4A.js';
import { _ as __assign } from './bundle-UnAcr6wX.js';

function ImageGrid(_a) {
    var _b;
    var children = _a.children, className = _a.className, message = _a.message, isReactionEnabled = _a.isReactionEnabled;
    return (React__default.createElement("div", { className: 'sendbird-image-grid-wrap' },
        React__default.createElement("div", { className: getClassName([
                className,
                'sendbird-image-grid',
                (isReactionEnabled && ((_b = message === null || message === void 0 ? void 0 : message.reactions) === null || _b === void 0 ? void 0 : _b.length) > 0) ? 'reactions' : '',
            ]) }, children)));
}

var GRID_WIDTH_CHAT_WEB = 400;
var GRID_SIDE_PADDING = 8;
var GRID_GAP = 4;
var TIMESTAMP_WIDTH_AND_ITS_SIDE_MARGIN = 54;
var PROFILE_IMAGE_WIDTH = 40;
var CHAT_MOBILE_SIDE_PADDING = 48;
var THREAD_PARENT_WIDTH = 320;
var THREAD_PARENT_SIDE_PADDING = 28;
var THREAD_PARENT_GRID_MARGIN_LEFT = 12;
var THREAD_CHILD_WIDTH = 200;
var THREAD_CHILD_SIDE_PADDING = 8;
var THREAD_CHILD_MOBILE_SIDE_PADDING = 32;
var THREAD_CHILD_MOBILE_TIMESTAMP_WIDTH_AND_ITS_SIDE_MARGIN = 60;
var MULTIPLE_FILES_IMAGE_SIDE_LENGTH = {
    CHAT_WEB: "calc(".concat(GRID_WIDTH_CHAT_WEB / 2, "px - ").concat((GRID_SIDE_PADDING + GRID_GAP) / 2, "px)"),
    CHAT_MOBILE: "calc(50vw - ".concat((CHAT_MOBILE_SIDE_PADDING + PROFILE_IMAGE_WIDTH + TIMESTAMP_WIDTH_AND_ITS_SIDE_MARGIN + GRID_SIDE_PADDING + GRID_GAP) / 2, "px)"),
    THREAD_PARENT_WEB: "calc(".concat((THREAD_PARENT_WIDTH - (THREAD_PARENT_SIDE_PADDING + PROFILE_IMAGE_WIDTH + THREAD_PARENT_GRID_MARGIN_LEFT + GRID_GAP)) / 2, "px)"),
    THREAD_PARENT_MOBILE: "calc(50vw - ".concat((THREAD_PARENT_SIDE_PADDING + PROFILE_IMAGE_WIDTH + THREAD_PARENT_GRID_MARGIN_LEFT + GRID_GAP) / 2, "px)"),
    THREAD_CHILD_WEB: "calc(".concat((THREAD_CHILD_WIDTH - THREAD_CHILD_SIDE_PADDING - GRID_GAP) / 2, "px)"),
    THREAD_CHILD_MOBILE: "calc(50vw - ".concat((THREAD_CHILD_MOBILE_SIDE_PADDING + PROFILE_IMAGE_WIDTH + THREAD_CHILD_MOBILE_TIMESTAMP_WIDTH_AND_ITS_SIDE_MARGIN + GRID_SIDE_PADDING + GRID_GAP) / 2, "px)"),
};
var MULTIPLE_FILES_IMAGE_BORDER_RADIUS = {
    CHAT_WEB: '6px',
    CHAT_MOBILE: '6px',
    THREAD_PARENT_WEB: '6px',
    THREAD_PARENT_MOBILE: '6px',
    THREAD_CHILD_WEB: '6px',
    THREAD_CHILD_MOBILE: '6px',
};
var MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH = '34px';

var ThreadMessageKind = {
    PARENT: 'parent',
    CHILD: 'child',
};
function MultipleFilesMessageItemBody(_a) {
    var className = _a.className, message = _a.message, _b = _a.isReactionEnabled, isReactionEnabled = _b === void 0 ? false : _b, threadMessageKindKey = _a.threadMessageKindKey, _c = _a.statefulFileInfoList, statefulFileInfoList = _c === void 0 ? [] : _c;
    var _d = useState(-1), currentFileViewerIndex = _d[0], setCurrentFileViewerIndex = _d[1];
    function onClose() {
        setCurrentFileViewerIndex(-1);
    }
    function onClickLeft() {
        setCurrentFileViewerIndex(currentFileViewerIndex === 0 ? statefulFileInfoList.length - 1 : currentFileViewerIndex - 1);
    }
    function onClickRight() {
        setCurrentFileViewerIndex(currentFileViewerIndex === statefulFileInfoList.length - 1 ? 0 : currentFileViewerIndex + 1);
    }
    return (threadMessageKindKey && (React__default.createElement(React__default.Fragment, null,
        currentFileViewerIndex > -1 && (React__default.createElement(FileViewer, { message: message, statefulFileInfoList: statefulFileInfoList, currentIndex: currentFileViewerIndex, onClickLeft: onClickLeft, onClickRight: onClickRight, onClose: onClose })),
        React__default.createElement(ImageGrid, { className: className, message: message, isReactionEnabled: isReactionEnabled }, statefulFileInfoList.map(function (fileInfo, index) {
            var _a, _b, _c;
            return (React__default.createElement("div", { className: "sendbird-multiple-files-image-renderer-wrapper", onClick: message.sendingStatus === SendingStatus.SUCCEEDED ? function () { return setCurrentFileViewerIndex(index); } : undefined, key: "sendbird-multiple-files-image-renderer-".concat(index, "-").concat(fileInfo.url) },
                React__default.createElement(ImageRenderer, { url: (_c = (_b = (_a = fileInfo.thumbnails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : fileInfo.url, fixedSize: false, width: MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey], maxSideLength: MULTIPLE_FILES_IMAGE_SIDE_LENGTH.CHAT_WEB, height: MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey], borderRadius: getBorderRadiusForMultipleImageRenderer(MULTIPLE_FILES_IMAGE_BORDER_RADIUS[threadMessageKindKey], index, statefulFileInfoList.length), shadeOnHover: true, isUploaded: !!fileInfo.isUploaded, placeHolder: function (_a) {
                        var style = _a.style;
                        if (isGif(fileInfo.mimeType))
                            return React__default.createElement(ImagePlaceholder.GIF, { style: style });
                        return React__default.createElement(ImagePlaceholder.Default, { style: style });
                    }, defaultComponent: React__default.createElement(ImagePlaceholder.LoadError, null) })));
        })))));
}
var ImagePlaceholder = {
    Default: function (_a) {
        var style = _a.style;
        return (React__default.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder", style: style },
            React__default.createElement(Icon, { type: IconTypes.PHOTO, fillColor: IconColors.ON_BACKGROUND_2, width: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH, height: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH })));
    },
    GIF: function (_a) {
        var style = _a.style;
        return (React__default.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder", style: style },
            React__default.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder__icon" },
                React__default.createElement(Icon, { type: IconTypes.GIF, fillColor: IconColors.THUMBNAIL_ICON, width: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH, height: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH }))));
    },
    LoadError: function () { return (React__default.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder" },
        React__default.createElement(Icon, { type: IconTypes.THUMBNAIL_NONE, fillColor: IconColors.ON_BACKGROUND_2, width: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH, height: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH }))); },
};

function useThreadMessageKindKeySelector(_a) {
    var threadMessageKind = _a.threadMessageKind, isMobile = _a.isMobile;
    var threadMessageKindKey = useMemo(function () {
        return K(threadMessageKind)
            .with(ThreadMessageKind.PARENT, function () { return (isMobile
            ? 'THREAD_PARENT_MOBILE'
            : 'THREAD_PARENT_WEB'); })
            .with(ThreadMessageKind.CHILD, function () { return (isMobile
            ? 'THREAD_CHILD_MOBILE'
            : 'THREAD_CHILD_WEB'); })
            .otherwise(function () { return (isMobile
            ? 'CHAT_MOBILE'
            : 'CHAT_WEB'); });
    }, [isMobile, threadMessageKind]);
    return threadMessageKindKey;
}

// SendingStatus.SCHEDULED is currently not covered in UIKit
//  So we can ignore for now, but for future, it is better to explicitly use PENDING, FAILED, or CANCELED.
var useFileInfoListWithUploaded = function (message) {
    var blobHandler = useRef(new Map());
    var getObjectURL = function (index, blob) {
        if (!blobHandler.current.has(index) && blob)
            blobHandler.current.set(index, URL.createObjectURL(blob));
        return blobHandler.current.get(index);
    };
    var revokeURLs = function () {
        if (blobHandler.current.size > 0) {
            blobHandler.current.forEach(function (url) { return URL.revokeObjectURL(url); });
            blobHandler.current.clear();
        }
    };
    useEffect(function () {
        return function () { return revokeURLs(); };
    }, []);
    if (!message || !message.isMultipleFilesMessage || !message.isMultipleFilesMessage()) {
        return [];
    }
    else if (message.sendingStatus === SendingStatus.SUCCEEDED) {
        revokeURLs();
        return message.fileInfoList.map(function (it) { return (__assign(__assign({}, it), { url: it.url, isUploaded: true })); });
    }
    else {
        return message.messageParams.fileInfoList.map(function (it, index) {
            var _a, _b;
            return (__assign(__assign({}, it), { url: (_b = (_a = getObjectURL(index)) !== null && _a !== void 0 ? _a : it.fileUrl) !== null && _b !== void 0 ? _b : (it.file instanceof Blob ? getObjectURL(index, it.file) : undefined), isUploaded: !it.file && typeof it.fileUrl === 'string' && it.fileUrl.length > 0 }));
        });
    }
};

export { MultipleFilesMessageItemBody as M, ThreadMessageKind as T, useFileInfoListWithUploaded as a, useThreadMessageKindKeySelector as u };
//# sourceMappingURL=bundle-2C9iP99S.js.map

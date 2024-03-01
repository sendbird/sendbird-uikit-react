'use strict';

var React = require('react');
var ui_Icon = require('../ui/Icon.js');
var message = require('@sendbird/chat/message');
var ui_ImageRenderer = require('../ui/ImageRenderer.js');
var index = require('./bundle-Uw6P-cM9.js');
var ui_FileViewer = require('./bundle-s5WIvT8N.js');
var index$1 = require('./bundle-tNuJSOqI.js');
var _tslib = require('./bundle-xbdnJE9-.js');

function ImageGrid(_a) {
    var _b;
    var children = _a.children, className = _a.className, message = _a.message, isReactionEnabled = _a.isReactionEnabled;
    return (React.createElement("div", { className: 'sendbird-image-grid-wrap' },
        React.createElement("div", { className: index.getClassName([
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
    var className = _a.className, message$1 = _a.message, _b = _a.isReactionEnabled, isReactionEnabled = _b === void 0 ? false : _b, threadMessageKindKey = _a.threadMessageKindKey, _c = _a.statefulFileInfoList, statefulFileInfoList = _c === void 0 ? [] : _c;
    var _d = React.useState(-1), currentFileViewerIndex = _d[0], setCurrentFileViewerIndex = _d[1];
    function onClose() {
        setCurrentFileViewerIndex(-1);
    }
    function onClickLeft() {
        setCurrentFileViewerIndex(currentFileViewerIndex === 0 ? statefulFileInfoList.length - 1 : currentFileViewerIndex - 1);
    }
    function onClickRight() {
        setCurrentFileViewerIndex(currentFileViewerIndex === statefulFileInfoList.length - 1 ? 0 : currentFileViewerIndex + 1);
    }
    return (threadMessageKindKey && (React.createElement(React.Fragment, null,
        currentFileViewerIndex > -1 && (React.createElement(ui_FileViewer.FileViewer, { message: message$1, statefulFileInfoList: statefulFileInfoList, currentIndex: currentFileViewerIndex, onClickLeft: onClickLeft, onClickRight: onClickRight, onClose: onClose })),
        React.createElement(ImageGrid, { className: className, message: message$1, isReactionEnabled: isReactionEnabled }, statefulFileInfoList.map(function (fileInfo, index$1) {
            var _a, _b, _c;
            return (React.createElement("div", { className: "sendbird-multiple-files-image-renderer-wrapper", onClick: message$1.sendingStatus === message.SendingStatus.SUCCEEDED ? function () { return setCurrentFileViewerIndex(index$1); } : undefined, key: "sendbird-multiple-files-image-renderer-".concat(index$1, "-").concat(fileInfo.url) },
                React.createElement(ui_ImageRenderer.default, { url: (_c = (_b = (_a = fileInfo.thumbnails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : fileInfo.url, fixedSize: false, width: MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey], maxSideLength: MULTIPLE_FILES_IMAGE_SIDE_LENGTH.CHAT_WEB, height: MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey], borderRadius: ui_ImageRenderer.getBorderRadiusForMultipleImageRenderer(MULTIPLE_FILES_IMAGE_BORDER_RADIUS[threadMessageKindKey], index$1, statefulFileInfoList.length), shadeOnHover: true, isUploaded: !!fileInfo.isUploaded, placeHolder: function (_a) {
                        var style = _a.style;
                        if (index.isGif(fileInfo.mimeType))
                            return React.createElement(ImagePlaceholder.GIF, { style: style });
                        return React.createElement(ImagePlaceholder.Default, { style: style });
                    }, defaultComponent: React.createElement(ImagePlaceholder.LoadError, null) })));
        })))));
}
var ImagePlaceholder = {
    Default: function (_a) {
        var style = _a.style;
        return (React.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder", style: style },
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.PHOTO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH, height: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH })));
    },
    GIF: function (_a) {
        var style = _a.style;
        return (React.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder", style: style },
            React.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder__icon" },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.GIF, fillColor: ui_Icon.IconColors.THUMBNAIL_ICON, width: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH, height: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH }))));
    },
    LoadError: function () { return (React.createElement("div", { className: "sendbird-multiple-files-image-renderer__thumbnail__placeholder" },
        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.THUMBNAIL_NONE, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH, height: MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH }))); },
};

function useThreadMessageKindKeySelector(_a) {
    var threadMessageKind = _a.threadMessageKind, isMobile = _a.isMobile;
    var threadMessageKindKey = React.useMemo(function () {
        return index$1.K(threadMessageKind)
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
var useFileInfoListWithUploaded = function (message$1) {
    var blobHandler = React.useRef(new Map());
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
    React.useEffect(function () {
        return function () { return revokeURLs(); };
    }, []);
    if (!message$1 || !message$1.isMultipleFilesMessage || !message$1.isMultipleFilesMessage()) {
        return [];
    }
    else if (message$1.sendingStatus === message.SendingStatus.SUCCEEDED) {
        revokeURLs();
        return message$1.fileInfoList.map(function (it) { return (_tslib.__assign(_tslib.__assign({}, it), { url: it.url, isUploaded: true })); });
    }
    else {
        return message$1.messageParams.fileInfoList.map(function (it, index) {
            var _a, _b;
            return (_tslib.__assign(_tslib.__assign({}, it), { url: (_b = (_a = getObjectURL(index)) !== null && _a !== void 0 ? _a : it.fileUrl) !== null && _b !== void 0 ? _b : (it.file instanceof Blob ? getObjectURL(index, it.file) : undefined), isUploaded: !it.file && typeof it.fileUrl === 'string' && it.fileUrl.length > 0 }));
        });
    }
};

exports.MultipleFilesMessageItemBody = MultipleFilesMessageItemBody;
exports.ThreadMessageKind = ThreadMessageKind;
exports.useFileInfoListWithUploaded = useFileInfoListWithUploaded;
exports.useThreadMessageKindKeySelector = useThreadMessageKindKeySelector;
//# sourceMappingURL=bundle-wezC76id.js.map

'use strict';

var _tslib = require('../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var ui_Icon = require('./Icon.js');
var ui_ImageRenderer = require('./ImageRenderer.js');
var index = require('../chunks/bundle-bjSez2lv.js');
var utils$1 = require('../chunks/bundle-Xwl4gw4D.js');
var useLongPress = require('../chunks/bundle-l768-Ldg.js');
var utils = require('../chunks/bundle-Oijs10ng.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-8G36Z6Or.js');
require('../chunks/bundle-37dz9yoi.js');

function ThumbnailMessageItemBody(_a) {
    var _b, _c;
    var _d = _a.className, className = _d === void 0 ? '' : _d, message = _a.message, _e = _a.isByMe, isByMe = _e === void 0 ? false : _e, _f = _a.mouseHover, mouseHover = _f === void 0 ? false : _f, _g = _a.isReactionEnabled, isReactionEnabled = _g === void 0 ? false : _g, _h = _a.showFileViewer, showFileViewer = _h === void 0 ? utils$1.noop : _h, _j = _a.style, style = _j === void 0 ? {} : _j;
    var thumbnailUrl = utils.getMessageFirstFileThumbnailUrl(message);
    var _k = React.useState(false), imageRendered = _k[0], setImageRendered = _k[1];
    var onClickHandler = useLongPress.useLongPress({
        onLongPress: utils$1.noop,
        onClick: function () {
            if (index.isSentMessage(message)) {
                showFileViewer === null || showFileViewer === void 0 ? void 0 : showFileViewer(true);
            }
        },
    });
    return (React.createElement("div", _tslib.__assign({ className: index.getClassName([
            className,
            'sendbird-thumbnail-message-item-body',
            isByMe ? 'outgoing' : 'incoming',
            mouseHover ? 'mouse-hover' : '',
            (isReactionEnabled && ((_c = (_b = message.reactions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0) ? 'reactions' : '',
        ]) }, onClickHandler),
        React.createElement(ui_ImageRenderer.default, { className: "sendbird-thumbnail-message-item-body__thumbnail", url: thumbnailUrl || utils.getMessageFirstFileUrl(message), alt: utils.getMessageFirstFileType(message), width: (style === null || style === void 0 ? void 0 : style.width) || '360px', height: (style === null || style === void 0 ? void 0 : style.height) || '270px', onLoad: function () { setImageRendered(true); }, placeHolder: function (_a) {
                var style = _a.style;
                return (React.createElement("div", { className: "sendbird-thumbnail-message-item-body__placeholder", style: style }));
            } }),
        (index.isVideoMessage(message) && !thumbnailUrl) && !imageRendered && (React.createElement("video", { className: "sendbird-thumbnail-message-item-body__video" },
            React.createElement("source", { src: utils.getMessageFirstFileUrl(message), type: utils.getMessageFirstFileType(message) }))),
        React.createElement("div", { className: "sendbird-thumbnail-message-item-body__image-cover" }),
        (index.isVideoMessage(message) || index.isGifMessage(message)) && (React.createElement("div", { className: "sendbird-thumbnail-message-item-body__icon-wrapper" },
            React.createElement("div", { className: "sendbird-thumbnail-message-item-body__icon-wrapper__icon" },
                React.createElement(ui_Icon.default, { type: index.isVideoMessage(message) ? ui_Icon.IconTypes.PLAY : ui_Icon.IconTypes.GIF, fillColor: ui_Icon.IconColors.THUMBNAIL_ICON, width: "34px", height: "34px" }))))));
}

module.exports = ThumbnailMessageItemBody;
//# sourceMappingURL=ThumbnailMessageItemBody.js.map

'use strict';

var React = require('react');
var ui_ImageRenderer = require('./ImageRenderer.js');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-2Pq38lvD.js');
var index = require('../chunks/bundle-bjSez2lv.js');
var LocalizationContext = require('../chunks/bundle-Nz6fSUye.js');
var index$1 = require('../chunks/bundle-zswKzOJx.js');
var tokenize = require('../chunks/bundle-URV6GLmd.js');
var consts = require('../chunks/bundle-scYpz-Ln.js');
require('../chunks/bundle-zYqQA3cT.js');
require('../chunks/bundle-Xwl4gw4D.js');
require('../chunks/bundle-xYV6cL9E.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-8G36Z6Or.js');
require('../chunks/bundle-eyiJykZ-.js');
require('../Message/context.js');
require('./MentionLabel.js');
require('./ContextMenu.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-NNEanMqk.js');
require('./UserProfile.js');
require('../chunks/bundle-HnlcCy36.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-NfUcey5s.js');
require('../chunks/bundle-PoiZwjvJ.js');
require('../chunks/bundle-5mXB6h1C.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');
require('./LinkLabel.js');

function OGMessageItemBody(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var className = _a.className, message = _a.message, _p = _a.isByMe, isByMe = _p === void 0 ? false : _p, _q = _a.mouseHover, mouseHover = _q === void 0 ? false : _q, _r = _a.isMentionEnabled, isMentionEnabled = _r === void 0 ? false : _r, _s = _a.isReactionEnabled, isReactionEnabled = _s === void 0 ? false : _s, _t = _a.onMessageHeightChange, onMessageHeightChange = _t === void 0 ? function () { } : _t;
    var imageRef = React.useRef(null);
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var openOGUrl = function () {
        var _a;
        var url = (_a = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _a === void 0 ? void 0 : _a.url;
        if (url) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url);
        }
    };
    var isMessageMentioned = isMentionEnabled && ((_b = message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate) === null || _b === void 0 ? void 0 : _b.length) > 0 && ((_c = message === null || message === void 0 ? void 0 : message.mentionedUsers) === null || _c === void 0 ? void 0 : _c.length) > 0;
    var tokens = React.useMemo(function () {
        if (isMessageMentioned) {
            return tokenize.tokenizeMessage({
                mentionedUsers: message === null || message === void 0 ? void 0 : message.mentionedUsers,
                messageText: message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate,
            });
        }
        return tokenize.tokenizeMessage({
            messageText: message === null || message === void 0 ? void 0 : message.message,
        });
    }, [message === null || message === void 0 ? void 0 : message.updatedAt, message === null || message === void 0 ? void 0 : message.message]);
    return (React.createElement("div", { className: index.getClassName([
            className,
            'sendbird-og-message-item-body',
            isByMe ? 'outgoing' : 'incoming',
            mouseHover ? 'mouse-hover' : '',
            (isReactionEnabled && ((_d = message === null || message === void 0 ? void 0 : message.reactions) === null || _d === void 0 ? void 0 : _d.length) > 0) ? 'reactions' : '',
        ]) },
        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BODY_1, color: isByMe ? ui_Label.LabelColors.ONCONTENT_1 : ui_Label.LabelColors.ONBACKGROUND_1 },
            React.createElement("div", { className: consts.OG_MESSAGE_BODY_CLASSNAME },
                React.createElement(index$1.TextFragment, { tokens: tokens }),
                index.isEditedMessage(message) && (React.createElement(ui_Label.Label, { className: "sendbird-og-message-item-body__text-bubble__message", type: ui_Label.LabelTypography.BODY_1, color: isByMe ? ui_Label.LabelColors.ONCONTENT_2 : ui_Label.LabelColors.ONBACKGROUND_2 }, " ".concat(stringSet.MESSAGE_EDITED, " "))))),
        React.createElement("div", { ref: imageRef, className: "sendbird-og-message-item-body__og-thumbnail\n          ".concat(((_f = (_e = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _e === void 0 ? void 0 : _e.defaultImage) === null || _f === void 0 ? void 0 : _f.url) ? '' : 'sendbird-og-message-item-body__og-thumbnail__empty', "\n        "), onClick: openOGUrl },
            React.createElement(ui_ImageRenderer.default, { className: "sendbird-og-message-item-body__og-thumbnail__image", url: ((_h = (_g = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _g === void 0 ? void 0 : _g.defaultImage) === null || _h === void 0 ? void 0 : _h.url) || '', alt: (_k = (_j = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _j === void 0 ? void 0 : _j.defaultImage) === null || _k === void 0 ? void 0 : _k.alt, width: "100%", onLoad: onMessageHeightChange, onError: function () {
                    var _a, _b;
                    try {
                        (_b = (_a = imageRef === null || imageRef === void 0 ? void 0 : imageRef.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.add('sendbird-og-message-item-body__og-thumbnail__empty');
                    }
                    catch (error) {
                        // do nothing
                    }
                }, defaultComponent: (React.createElement("div", { className: "sendbird-og-message-item-body__og-thumbnail__place-holder" },
                    React.createElement(ui_Icon.default, { className: "sendbird-og-message-item-body__og-thumbnail__place-holder__icon", type: ui_Icon.IconTypes.THUMBNAIL_NONE, width: "56px", height: "56px" }))) })),
        React.createElement("div", { className: "sendbird-og-message-item-body__description", onClick: openOGUrl },
            ((_l = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _l === void 0 ? void 0 : _l.title) && (React.createElement(ui_Label.Label, { className: "sendbird-og-message-item-body__description__title", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, message.ogMetaData.title)),
            ((_m = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _m === void 0 ? void 0 : _m.description) && (React.createElement(ui_Label.Label, { className: "sendbird-og-message-item-body__description__description", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, message.ogMetaData.description)),
            ((_o = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _o === void 0 ? void 0 : _o.url) && (React.createElement(ui_Label.Label, { className: "sendbird-og-message-item-body__description__url", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, message.ogMetaData.url))),
        React.createElement("div", { className: "sendbird-og-message-item-body__cover" })));
}

module.exports = OGMessageItemBody;
//# sourceMappingURL=OGMessageItemBody.js.map

import React__default, { useRef, useContext, useMemo } from 'react';
import ImageRenderer from './ImageRenderer.js';
import Icon, { IconTypes } from './Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-sR62lMVk.js';
import { w as getClassName, e as isEditedMessage } from '../chunks/bundle-Jwc7mleJ.js';
import { L as LocalizationContext } from '../chunks/bundle-1inZXcUV.js';
import { T as TextFragment } from '../chunks/bundle-wKuesro0.js';
import { t as tokenizeMessage } from '../chunks/bundle-IqjS0ok_.js';
import { O as OG_MESSAGE_BODY_CLASSNAME } from '../chunks/bundle-_MABCkOp.js';
import '../chunks/bundle-xhjHZ041.js';
import '../chunks/bundle-IDH-OOHE.js';
import '../chunks/bundle--MbN9aKT.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-AN6QCsUL.js';
import '../chunks/bundle-V_fO-GlK.js';
import '../Message/context.js';
import './MentionLabel.js';
import './ContextMenu.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-BZ3hPsJ8.js';
import './UserProfile.js';
import '../chunks/bundle-9GBao6H-.js';
import '../sendbirdSelectors.js';
import '../chunks/bundle-yarrTY_z.js';
import '../chunks/bundle-VE0ige0C.js';
import '../chunks/bundle-3a5xXUZv.js';
import './Button.js';
import '../useSendbirdStateContext.js';
import '../withSendbird.js';
import './LinkLabel.js';

function OGMessageItemBody(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var className = _a.className, message = _a.message, _p = _a.isByMe, isByMe = _p === void 0 ? false : _p, _q = _a.mouseHover, mouseHover = _q === void 0 ? false : _q, _r = _a.isMentionEnabled, isMentionEnabled = _r === void 0 ? false : _r, _s = _a.isReactionEnabled, isReactionEnabled = _s === void 0 ? false : _s, _t = _a.onMessageHeightChange, onMessageHeightChange = _t === void 0 ? function () { } : _t;
    var imageRef = useRef(null);
    var stringSet = useContext(LocalizationContext).stringSet;
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
    var tokens = useMemo(function () {
        if (isMessageMentioned) {
            return tokenizeMessage({
                mentionedUsers: message === null || message === void 0 ? void 0 : message.mentionedUsers,
                messageText: message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate,
            });
        }
        return tokenizeMessage({
            messageText: message === null || message === void 0 ? void 0 : message.message,
        });
    }, [message === null || message === void 0 ? void 0 : message.updatedAt, message === null || message === void 0 ? void 0 : message.message]);
    return (React__default.createElement("div", { className: getClassName([
            className,
            'sendbird-og-message-item-body',
            isByMe ? 'outgoing' : 'incoming',
            mouseHover ? 'mouse-hover' : '',
            (isReactionEnabled && ((_d = message === null || message === void 0 ? void 0 : message.reactions) === null || _d === void 0 ? void 0 : _d.length) > 0) ? 'reactions' : '',
        ]) },
        React__default.createElement(Label, { type: LabelTypography.BODY_1, color: isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1 },
            React__default.createElement("div", { className: OG_MESSAGE_BODY_CLASSNAME },
                React__default.createElement(TextFragment, { tokens: tokens }),
                isEditedMessage(message) && (React__default.createElement(Label, { className: "sendbird-og-message-item-body__text-bubble__message", type: LabelTypography.BODY_1, color: isByMe ? LabelColors.ONCONTENT_2 : LabelColors.ONBACKGROUND_2 }, " ".concat(stringSet.MESSAGE_EDITED, " "))))),
        React__default.createElement("div", { ref: imageRef, className: "sendbird-og-message-item-body__og-thumbnail\n          ".concat(((_f = (_e = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _e === void 0 ? void 0 : _e.defaultImage) === null || _f === void 0 ? void 0 : _f.url) ? '' : 'sendbird-og-message-item-body__og-thumbnail__empty', "\n        "), onClick: openOGUrl },
            React__default.createElement(ImageRenderer, { className: "sendbird-og-message-item-body__og-thumbnail__image", url: ((_h = (_g = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _g === void 0 ? void 0 : _g.defaultImage) === null || _h === void 0 ? void 0 : _h.url) || '', alt: (_k = (_j = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _j === void 0 ? void 0 : _j.defaultImage) === null || _k === void 0 ? void 0 : _k.alt, width: "100%", onLoad: onMessageHeightChange, onError: function () {
                    var _a, _b;
                    try {
                        (_b = (_a = imageRef === null || imageRef === void 0 ? void 0 : imageRef.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.add('sendbird-og-message-item-body__og-thumbnail__empty');
                    }
                    catch (error) {
                        // do nothing
                    }
                }, defaultComponent: (React__default.createElement("div", { className: "sendbird-og-message-item-body__og-thumbnail__place-holder" },
                    React__default.createElement(Icon, { className: "sendbird-og-message-item-body__og-thumbnail__place-holder__icon", type: IconTypes.THUMBNAIL_NONE, width: "56px", height: "56px" }))) })),
        React__default.createElement("div", { className: "sendbird-og-message-item-body__description", onClick: openOGUrl },
            ((_l = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _l === void 0 ? void 0 : _l.title) && (React__default.createElement(Label, { className: "sendbird-og-message-item-body__description__title", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_1 }, message.ogMetaData.title)),
            ((_m = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _m === void 0 ? void 0 : _m.description) && (React__default.createElement(Label, { className: "sendbird-og-message-item-body__description__description", type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_1 }, message.ogMetaData.description)),
            ((_o = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _o === void 0 ? void 0 : _o.url) && (React__default.createElement(Label, { className: "sendbird-og-message-item-body__description__url", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, message.ogMetaData.url))),
        React__default.createElement("div", { className: "sendbird-og-message-item-body__cover" })));
}

export { OGMessageItemBody as default };
//# sourceMappingURL=OGMessageItemBody.js.map

import React__default, { useContext, useMemo } from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import { w as getClassName, e as isEditedMessage } from '../chunks/bundle-WrTlYypL.js';
import { L as LocalizationContext } from '../chunks/bundle-hS8Jw8F1.js';
import { t as tokenizeMessage } from '../chunks/bundle-coC6nc_5.js';
import { T as TextFragment } from '../chunks/bundle-1q5AhvE7.js';
import { T as TEXT_MESSAGE_BODY_CLASSNAME } from '../chunks/bundle-BInhYJCq.js';
import '../chunks/bundle-UnAcr6wX.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-UuydkZ4A.js';
import '../chunks/bundle-8u3PnqsX.js';
import '../Message/context.js';
import './MentionLabel.js';
import './ContextMenu.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-0Kp88b8b.js';
import './UserProfile.js';
import '../chunks/bundle-jDtVwIPR.js';
import '../sendbirdSelectors.js';
import '../chunks/bundle-7BSf_PUT.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle-LbQw2cVx.js';
import './ImageRenderer.js';
import '../chunks/bundle-fNigAmmf.js';
import './Icon.js';
import './Button.js';
import '../useSendbirdStateContext.js';
import '../withSendbird.js';
import './LinkLabel.js';

function TextMessageItemBody(_a) {
    var _b, _c, _d;
    var _e = _a.className, className = _e === void 0 ? '' : _e, message = _a.message, _f = _a.isByMe, isByMe = _f === void 0 ? false : _f, _g = _a.mouseHover, mouseHover = _g === void 0 ? false : _g, _h = _a.isMentionEnabled, isMentionEnabled = _h === void 0 ? false : _h, _j = _a.isReactionEnabled, isReactionEnabled = _j === void 0 ? false : _j;
    var stringSet = useContext(LocalizationContext).stringSet;
    var isMessageMentioned = isMentionEnabled
        && ((_b = message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate) === null || _b === void 0 ? void 0 : _b.length) > 0
        && ((_c = message === null || message === void 0 ? void 0 : message.mentionedUsers) === null || _c === void 0 ? void 0 : _c.length) > 0;
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
    return (React__default.createElement(Label, { type: LabelTypography.BODY_1, color: isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1 },
        React__default.createElement("div", { className: getClassName([
                className,
                TEXT_MESSAGE_BODY_CLASSNAME,
                isByMe ? 'outgoing' : 'incoming',
                mouseHover ? 'mouse-hover' : '',
                (isReactionEnabled && ((_d = message === null || message === void 0 ? void 0 : message.reactions) === null || _d === void 0 ? void 0 : _d.length) > 0) ? 'reactions' : '',
            ]) },
            React__default.createElement(TextFragment, { tokens: tokens }),
            isEditedMessage(message) && (React__default.createElement(Label, { className: "sendbird-text-message-item-body__message edited", type: LabelTypography.BODY_1, color: isByMe ? LabelColors.ONCONTENT_2 : LabelColors.ONBACKGROUND_2 }, " ".concat(stringSet.MESSAGE_EDITED, " "))))));
}

export { TextMessageItemBody as default };
//# sourceMappingURL=TextMessageItemBody.js.map

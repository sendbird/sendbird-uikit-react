import React__default from 'react';
import { a as LabelTypography } from '../chunks/bundle-kMMCn6GE.js';
import LinkLabel from './LinkLabel.js';
import { B as convertWordToStringObj, S as StringObjType } from '../chunks/bundle-ZnLsMTHr.js';
import MentionLabel from './MentionLabel.js';
import '../chunks/bundle-KMsJXUN2.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-LZemF1A7.js';
import './ContextMenu.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-4_6x-RiC.js';
import './UserProfile.js';
import '../chunks/bundle-msnuMA4R.js';
import '../chunks/bundle-CsWYoRVd.js';
import '../chunks/bundle-x78eEPy7.js';
import '../sendbirdSelectors.js';
import '../chunks/bundle-THTV9S18.js';
import '../chunks/bundle-7YRb7CRq.js';
import '../chunks/bundle-OJq071GK.js';
import './ImageRenderer.js';
import '../chunks/bundle-DhS-f2ZT.js';
import './Icon.js';
import './Button.js';
import '../useSendbirdStateContext.js';
import '../withSendbird.js';

/**
 * @deprecated  This component is deprecated and will be removed in the next major version.
 * Use TextFragment instead.
 */
// Word and StringObj will include types: normal, mention, url
function Word(props) {
    var word = props.word, message = props.message, _a = props.isByMe, isByMe = _a === void 0 ? false : _a, _b = props.mentionTemplate, mentionTemplate = _b === void 0 ? '@' : _b, _c = props.renderString, renderString = _c === void 0 ? null : _c;
    if (word === '') {
        return null;
    }
    return (React__default.createElement("span", { className: "sendbird-word" }, convertWordToStringObj(word, message === null || message === void 0 ? void 0 : message.mentionedUsers).map(function (stringObj, index) {
        var type = (stringObj === null || stringObj === void 0 ? void 0 : stringObj.type) || '';
        var value = (stringObj === null || stringObj === void 0 ? void 0 : stringObj.value) || '';
        var userId = (stringObj === null || stringObj === void 0 ? void 0 : stringObj.userId) || '';
        var key = "".concat(value, "-").concat(index);
        if (renderString && typeof renderString === 'function') {
            return renderString(stringObj);
        }
        if (type === StringObjType.mention) {
            return (React__default.createElement(MentionLabel, { key: key, mentionTemplate: mentionTemplate, mentionedUserId: userId, mentionedUserNickname: value, isByMe: isByMe }));
        }
        else if (type === StringObjType.url) {
            return (React__default.createElement(LinkLabel, { key: key, className: "sendbird-word__url", src: word, type: LabelTypography.BODY_1 }, value));
        }
        else {
            return value;
        }
    })));
}

export { Word as default };
//# sourceMappingURL=Word.js.map

import React__default from 'react';
import { K } from './bundle-AN6QCsUL.js';
import { T as TOKEN_TYPES, U as USER_MENTION_PREFIX, g as getWhiteSpacePreservedText } from './bundle-IqjS0ok_.js';
import { useMessageContext } from '../Message/context.js';
import MentionLabel from '../ui/MentionLabel.js';
import LinkLabel from '../ui/LinkLabel.js';
import { a as LabelTypography } from './bundle-sR62lMVk.js';

// this function is used to generate a unique key for token in message
// it changes with updated time and index
// messageUpdatedAt is the key part of this key generator
function keyGenerator(createdAt, messageUpdatedAt, index) {
    return "sb-msg_".concat(createdAt, "_").concat(messageUpdatedAt, "_").concat(index);
}

function TextFragment(_a) {
    var tokens = _a.tokens;
    var messageStore = useMessageContext();
    var message = messageStore === null || messageStore === void 0 ? void 0 : messageStore.message;
    var isByMe = messageStore === null || messageStore === void 0 ? void 0 : messageStore.isByMe;
    var updatedAt = message.updatedAt, createdAt = message.createdAt;
    return (React__default.createElement(React__default.Fragment, null, tokens === null || tokens === void 0 ? void 0 : tokens.map(function (token, idx) {
        var key = keyGenerator(createdAt, updatedAt, idx);
        return K(token.type)
            .with(TOKEN_TYPES.mention, function () { return (React__default.createElement("span", { className: "sendbird-word", key: key },
            React__default.createElement(MentionLabel, { mentionTemplate: USER_MENTION_PREFIX, 
                // @ts-ignore
                mentionedUserId: token.userId, mentionedUserNickname: token.value, isByMe: isByMe }))); })
            .with(TOKEN_TYPES.url, function () { return (React__default.createElement("span", { className: "sendbird-word", key: key },
            React__default.createElement(LinkLabel, { className: "sendbird-word__url", src: token.value, type: LabelTypography.BODY_1 }, token.value))); })
            .otherwise(function () { return React__default.createElement(React__default.Fragment, { key: key }, getWhiteSpacePreservedText(token.value)); });
    })));
}

export { TextFragment as T };
//# sourceMappingURL=bundle-wKuesro0.js.map

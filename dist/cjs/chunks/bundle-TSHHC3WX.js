'use strict';

var React = require('react');
var index = require('./bundle-3fb9w4KI.js');
var tokenize = require('./bundle-Q2J-7okW.js');
var Message_context = require('../Message/context.js');
var ui_MentionLabel = require('../ui/MentionLabel.js');
var ui_LinkLabel = require('../ui/LinkLabel.js');
var ui_Label = require('./bundle-26QzFMMl.js');

// this function is used to generate a unique key for token in message
// it changes with updated time and index
// messageUpdatedAt is the key part of this key generator
function keyGenerator(createdAt, messageUpdatedAt, index) {
    return "sb-msg_".concat(createdAt, "_").concat(messageUpdatedAt, "_").concat(index);
}

function TextFragment(_a) {
    var tokens = _a.tokens;
    var messageStore = Message_context.useMessageContext();
    var message = messageStore === null || messageStore === void 0 ? void 0 : messageStore.message;
    var isByMe = messageStore === null || messageStore === void 0 ? void 0 : messageStore.isByMe;
    var updatedAt = message.updatedAt, createdAt = message.createdAt;
    return (React.createElement(React.Fragment, null, tokens === null || tokens === void 0 ? void 0 : tokens.map(function (token, idx) {
        var key = keyGenerator(createdAt, updatedAt, idx);
        return index.K(token.type)
            .with(tokenize.TOKEN_TYPES.mention, function () { return (React.createElement("span", { className: "sendbird-word", key: key },
            React.createElement(ui_MentionLabel, { mentionTemplate: tokenize.USER_MENTION_PREFIX, 
                // @ts-ignore
                mentionedUserId: token.userId, mentionedUserNickname: token.value, isByMe: isByMe }))); })
            .with(tokenize.TOKEN_TYPES.url, function () { return (React.createElement("span", { className: "sendbird-word", key: key },
            React.createElement(ui_LinkLabel.default, { className: "sendbird-word__url", src: token.value, type: ui_Label.LabelTypography.BODY_1 }, token.value))); })
            .otherwise(function () { return React.createElement(React.Fragment, { key: key }, tokenize.getWhiteSpacePreservedText(token.value)); });
    })));
}

exports.TextFragment = TextFragment;
//# sourceMappingURL=bundle-TSHHC3WX.js.map

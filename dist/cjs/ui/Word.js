'use strict';

var React = require('react');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var ui_LinkLabel = require('./LinkLabel.js');
var index = require('../chunks/bundle-wzulmlgb.js');
var ui_MentionLabel = require('./MentionLabel.js');
require('../chunks/bundle-2dG9SU7T.js');
require('../chunks/bundle-eH49AisR.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');
require('./ContextMenu.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-Gzug-R-w.js');
require('./UserProfile.js');
require('../chunks/bundle-60kIt9Rq.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../chunks/bundle-DKcL-93i.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-LutGJd7y.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-OfFu3N1i.js');
require('./ImageRenderer.js');
require('../chunks/bundle-uGaTvmsl.js');
require('./Icon.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');

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
    return (React.createElement("span", { className: "sendbird-word" }, index.convertWordToStringObj(word, message === null || message === void 0 ? void 0 : message.mentionedUsers).map(function (stringObj, index$1) {
        var type = (stringObj === null || stringObj === void 0 ? void 0 : stringObj.type) || '';
        var value = (stringObj === null || stringObj === void 0 ? void 0 : stringObj.value) || '';
        var userId = (stringObj === null || stringObj === void 0 ? void 0 : stringObj.userId) || '';
        var key = "".concat(value, "-").concat(index$1);
        if (renderString && typeof renderString === 'function') {
            return renderString(stringObj);
        }
        if (type === index.StringObjType.mention) {
            return (React.createElement(ui_MentionLabel, { key: key, mentionTemplate: mentionTemplate, mentionedUserId: userId, mentionedUserNickname: value, isByMe: isByMe }));
        }
        else if (type === index.StringObjType.url) {
            return (React.createElement(ui_LinkLabel.default, { key: key, className: "sendbird-word__url", src: word, type: ui_Label.LabelTypography.BODY_1 }, value));
        }
        else {
            return value;
        }
    })));
}

module.exports = Word;
//# sourceMappingURL=Word.js.map

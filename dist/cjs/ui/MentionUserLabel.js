'use strict';

var React = require('react');
var consts = require('../chunks/bundle-h9YDQxpQ.js');

function MentionUserLabel(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, _c = _a.isReverse, isReverse = _c === void 0 ? false : _c, color = _a.color, userId = _a.userId;
    return (React.createElement("span", { className: "".concat(consts.MENTION_USER_LABEL_CLASSNAME, " ").concat(className, " ").concat(isReverse ? 'reverse' : '', " ").concat(color), contentEditable: false, "data-userid": userId, "data-sb-mention": true }, children));
}

module.exports = MentionUserLabel;
//# sourceMappingURL=MentionUserLabel.js.map

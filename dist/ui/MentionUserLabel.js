import React__default from 'react';
import { M as MENTION_USER_LABEL_CLASSNAME } from '../chunks/bundle-v7DbCTsH.js';

function MentionUserLabel(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, _c = _a.isReverse, isReverse = _c === void 0 ? false : _c, color = _a.color, userId = _a.userId;
    return (React__default.createElement("span", { className: "".concat(MENTION_USER_LABEL_CLASSNAME, " ").concat(className, " ").concat(isReverse ? 'reverse' : '', " ").concat(color), contentEditable: false, "data-userid": userId, "data-sb-mention": true }, children));
}

export { MentionUserLabel as default };
//# sourceMappingURL=MentionUserLabel.js.map

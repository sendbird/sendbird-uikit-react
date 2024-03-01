import React__default, { useState } from 'react';

var SuggestedReplies = function (_a) {
    var replyOptions = _a.replyOptions, onSendMessage = _a.onSendMessage;
    var _b = useState(false), replied = _b[0], setReplied = _b[1];
    var onClickReply = function (event, option) {
        event.preventDefault();
        onSendMessage({ message: option });
        setReplied(true);
    };
    if (replied) {
        return null;
    }
    return (React__default.createElement("div", { className: "sendbird-suggested-replies" }, replyOptions.map(function (option, index) {
        return (React__default.createElement("div", { className: "sendbird-suggested-replies__option", id: option, key: index + option, onClick: function (e) { return onClickReply(e, option); } }, option));
    })));
};

export { SuggestedReplies, SuggestedReplies as default };
//# sourceMappingURL=SuggestedReplies.js.map

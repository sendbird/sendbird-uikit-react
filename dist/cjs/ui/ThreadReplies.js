'use strict';

var React = require('react');
var ui_Avatar = require('../chunks/bundle-OfFu3N1i.js');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
require('../chunks/bundle-2dG9SU7T.js');
require('./ImageRenderer.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-uGaTvmsl.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');

function ThreadReplies(_a) {
    var _b;
    var className = _a.className, threadInfo = _a.threadInfo, onClick = _a.onClick;
    var _c = threadInfo.mostRepliedUsers, mostRepliedUsers = _c === void 0 ? [] : _c, replyCount = threadInfo.replyCount;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    return (React.createElement("div", { className: "sendbird-ui-thread-replies ".concat(className), role: "button", onClick: function (e) {
            onClick(e);
            e === null || e === void 0 ? void 0 : e.stopPropagation();
        }, onKeyDown: function (e) {
            onClick(e);
            e === null || e === void 0 ? void 0 : e.stopPropagation();
        } },
        React.createElement("div", { className: "sendbird-ui-thread-replies__user-profiles" },
            mostRepliedUsers.slice(0, 4).map(function (user) {
                return (React.createElement(ui_Avatar.Avatar, { key: user.userId, className: "sendbird-ui-thread-replies__user-profiles__avatar", src: user === null || user === void 0 ? void 0 : user.profileUrl, alt: "user profile", width: "20px", height: "20px" }));
            }),
            (mostRepliedUsers === null || mostRepliedUsers === void 0 ? void 0 : mostRepliedUsers.length) >= 5 && (React.createElement("div", { className: "sendbird-ui-thread-replies__user-profiles__avatar" },
                React.createElement(ui_Avatar.Avatar, { className: "sendbird-ui-thread-replies__user-profiles__avatar__image", src: (_b = mostRepliedUsers === null || mostRepliedUsers === void 0 ? void 0 : mostRepliedUsers[4]) === null || _b === void 0 ? void 0 : _b.profileUrl, alt: "user profile", width: "20px", height: "20px" }),
                React.createElement("div", { className: "sendbird-ui-thread-replies__user-profiles__avatar__cover" }),
                React.createElement("div", { className: "sendbird-ui-thread-replies__user-profiles__avatar__plus" },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.PLUS, fillColor: ui_Icon.IconColors.WHITE, width: "16px", height: "16px" }))))),
        React.createElement(ui_Label.Label, { className: "sendbird-ui-thread-replies__reply-counts", type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.PRIMARY }, replyCount === 1
            ? "".concat(replyCount, " ").concat(stringSet.CHANNEL__THREAD_REPLY)
            : "".concat(replyCount > 99 ? stringSet.CHANNEL__THREAD_OVER_MAX : replyCount, " ").concat(stringSet.CHANNEL__THREAD_REPLIES)),
        React.createElement(ui_Icon.default, { className: "sendbird-ui-thread-replies__icon", type: ui_Icon.IconTypes.CHEVRON_RIGHT, fillColor: ui_Icon.IconColors.PRIMARY, width: "16px", height: "16px" })));
}

module.exports = ThreadReplies;
//# sourceMappingURL=ThreadReplies.js.map

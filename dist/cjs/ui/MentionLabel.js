'use strict';

var React = require('react');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var ui_UserProfile = require('./UserProfile.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
require('../chunks/bundle-2dG9SU7T.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-Gzug-R-w.js');
require('../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');
require('../chunks/bundle-eH49AisR.js');
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
require('../withSendbird.js');

function MentionLabel(props) {
    var _a, _b, _c;
    var mentionTemplate = props.mentionTemplate, mentionedUserId = props.mentionedUserId, mentionedUserNickname = props.mentionedUserNickname, isByMe = props.isByMe;
    var mentionRef = React.useRef();
    var sendbirdState = useSendbirdStateContext.useSendbirdStateContext();
    var userId = (_a = sendbirdState === null || sendbirdState === void 0 ? void 0 : sendbirdState.config) === null || _a === void 0 ? void 0 : _a.userId;
    var sdk = (_c = (_b = sendbirdState === null || sendbirdState === void 0 ? void 0 : sendbirdState.stores) === null || _b === void 0 ? void 0 : _b.sdkStore) === null || _c === void 0 ? void 0 : _c.sdk;
    var amIBeingMentioned = userId === mentionedUserId;
    var _d = React.useState(), user = _d[0], setUser = _d[1];
    var fetchUser = React.useCallback(function (toggleDropdown) {
        if (user || !(sdk === null || sdk === void 0 ? void 0 : sdk.createApplicationUserListQuery)) {
            toggleDropdown();
            return;
        }
        var query = sdk === null || sdk === void 0 ? void 0 : sdk.createApplicationUserListQuery({
            userIdsFilter: [mentionedUserId],
        });
        query.next().then(function (members) {
            if ((members === null || members === void 0 ? void 0 : members.length) > 0) {
                setUser(members[0]);
            }
            toggleDropdown();
        });
    }, [sdk, mentionedUserId]);
    return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement("a", { className: "\n            sendbird-word__mention\n            ".concat(amIBeingMentioned ? 'sendbird-word__mention--me' : '', "\n          "), onClick: function () { return fetchUser(toggleDropdown); }, ref: mentionRef, "data-userid": mentionedUserId, "data-nickname": mentionedUserNickname, "data-sb-mention": true },
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.CAPTION_1, color: isByMe ? ui_Label.LabelColors.ONCONTENT_1 : ui_Label.LabelColors.ONBACKGROUND_1 }, "".concat(mentionTemplate).concat(mentionedUserNickname)))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems
        /**
        * parentRef: For catching location(x, y) of MenuItems
        * parentContainRef: For toggling more options(menus & reactions)
        */
        , { 
            /**
            * parentRef: For catching location(x, y) of MenuItems
            * parentContainRef: For toggling more options(menus & reactions)
            */
            parentRef: mentionRef, parentContainRef: mentionRef, closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
            React.createElement(ui_UserProfile, { user: user, onSuccess: closeDropdown, currentUserId: userId }))); } }));
}

module.exports = MentionLabel;
//# sourceMappingURL=MentionLabel.js.map

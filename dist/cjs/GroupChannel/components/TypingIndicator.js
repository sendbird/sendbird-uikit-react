'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var groupChannel = require('@sendbird/chat/groupChannel');
var ui_Label = require('../../chunks/bundle-26QzFMMl.js');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var uuid = require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-2dG9SU7T.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../withSendbird.js');

var TypingIndicatorText = function (_a) {
    var members = _a.members;
    function getText() {
        var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
        if (!members || members.length === 0) {
            return '';
        }
        if (members && members.length === 1) {
            return "".concat(members[0].nickname, " ").concat(stringSet.TYPING_INDICATOR__IS_TYPING);
        }
        if (members && members.length === 2) {
            return "".concat(members[0].nickname, " ").concat(stringSet.TYPING_INDICATOR__AND, " ").concat(members[1].nickname, " ").concat(stringSet.TYPING_INDICATOR__ARE_TYPING);
        }
        return stringSet.TYPING_INDICATOR__MULTIPLE_TYPING;
    }
    return React.createElement(React.Fragment, null, getText());
};
var TypingIndicator = function (_a) {
    var _b, _c, _d;
    var channelUrl = _a.channelUrl;
    var globalStore = useSendbirdStateContext.useSendbirdStateContext();
    var sb = (_c = (_b = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _b === void 0 ? void 0 : _b.sdkStore) === null || _c === void 0 ? void 0 : _c.sdk;
    var logger = (_d = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config) === null || _d === void 0 ? void 0 : _d.logger;
    var _e = React.useState(uuid.uuidv4()), handlerId = _e[0], setHandlerId = _e[1];
    var _f = React.useState([]), typingMembers = _f[0], setTypingMembers = _f[1];
    React.useEffect(function () {
        var _a;
        if ((_a = sb === null || sb === void 0 ? void 0 : sb.groupChannel) === null || _a === void 0 ? void 0 : _a.addGroupChannelHandler) {
            sb.groupChannel.removeGroupChannelHandler(handlerId);
            var newHandlerId = uuid.uuidv4();
            var handler = new groupChannel.GroupChannelHandler({
                onTypingStatusUpdated: function (groupChannel) {
                    // there is a possible warning in here - setState called after unmount
                    logger.info('Channel > Typing Indicator: onTypingStatusUpdated', groupChannel);
                    if (groupChannel.url === channelUrl) {
                        var members = groupChannel.getTypingUsers();
                        setTypingMembers(members);
                    }
                },
            });
            sb.groupChannel.addGroupChannelHandler(newHandlerId, handler);
            setHandlerId(newHandlerId);
        }
        return function () {
            var _a;
            setTypingMembers([]);
            if ((_a = sb === null || sb === void 0 ? void 0 : sb.groupChannel) === null || _a === void 0 ? void 0 : _a.removeGroupChannelHandler) {
                sb.groupChannel.removeGroupChannelHandler(handlerId);
            }
        };
    }, [channelUrl]);
    return (React.createElement(ui_Label.Label, { className: "sendbird-conversation__footer__typing-indicator__text", type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONBACKGROUND_2 },
        React.createElement(TypingIndicatorText, { members: typingMembers })));
};

exports.TypingIndicator = TypingIndicator;
exports.TypingIndicatorText = TypingIndicatorText;
exports.default = TypingIndicator;
//# sourceMappingURL=TypingIndicator.js.map

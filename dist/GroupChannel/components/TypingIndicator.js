import React__default, { useState, useEffect, useContext } from 'react';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as uuidv4 } from '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../withSendbird.js';

var TypingIndicatorText = function (_a) {
    var members = _a.members;
    function getText() {
        var stringSet = useContext(LocalizationContext).stringSet;
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
    return React__default.createElement(React__default.Fragment, null, getText());
};
var TypingIndicator = function (_a) {
    var _b, _c, _d;
    var channelUrl = _a.channelUrl;
    var globalStore = useSendbirdStateContext();
    var sb = (_c = (_b = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _b === void 0 ? void 0 : _b.sdkStore) === null || _c === void 0 ? void 0 : _c.sdk;
    var logger = (_d = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config) === null || _d === void 0 ? void 0 : _d.logger;
    var _e = useState(uuidv4()), handlerId = _e[0], setHandlerId = _e[1];
    var _f = useState([]), typingMembers = _f[0], setTypingMembers = _f[1];
    useEffect(function () {
        var _a;
        if ((_a = sb === null || sb === void 0 ? void 0 : sb.groupChannel) === null || _a === void 0 ? void 0 : _a.addGroupChannelHandler) {
            sb.groupChannel.removeGroupChannelHandler(handlerId);
            var newHandlerId = uuidv4();
            var handler = new GroupChannelHandler({
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
    return (React__default.createElement(Label, { className: "sendbird-conversation__footer__typing-indicator__text", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 },
        React__default.createElement(TypingIndicatorText, { members: typingMembers })));
};

export { TypingIndicator, TypingIndicatorText, TypingIndicator as default };
//# sourceMappingURL=TypingIndicator.js.map

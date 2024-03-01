import React__default from 'react';
import { g as getChannelTitle } from '../../chunks/bundle-GQ4rK0ER.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-msnuMA4R.js';
import { useGroupChannelListContext } from '../context.js';
import { G as GroupChannelListItemView } from '../../chunks/bundle-ExeMztFo.js';
import '../../chunks/bundle-KMsJXUN2.js';
import '../../chunks/bundle-vbGNKQpe.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-kMMCn6GE.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../chunks/bundle-vWrgNSvP.js';
import '../../chunks/bundle-SpfAN5pr.js';
import '../../withSendbird.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-tUgX2YQs.js';
import '@sendbird/chat';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-3iFqiLDd.js';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../GroupChannel/components/TypingIndicator.js';
import '../../ui/Badge.js';
import '../../ui/ChannelAvatar.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../chunks/bundle-E4eEah-U.js';
import '../../ui/MentionUserLabel.js';
import '../../chunks/bundle-qauKidkr.js';
import '../../chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nGuCRoDK.js';

var GroupChannelListItem = function (_a) {
    var _b, _c, _d;
    var channel = _a.channel, isSelected = _a.isSelected, isTyping = _a.isTyping, renderChannelAction = _a.renderChannelAction, onLeaveChannel = _a.onLeaveChannel, onClick = _a.onClick, tabIndex = _a.tabIndex;
    var config = useSendbirdStateContext().config;
    var stringSet = useLocalization().stringSet;
    var _e = useGroupChannelListContext(), _f = _e.isTypingIndicatorEnabled, isTypingIndicatorEnabled = _f === void 0 ? false : _f, _g = _e.isMessageReceiptStatusEnabled, isMessageReceiptStatusEnabled = _g === void 0 ? false : _g;
    var userId = config.userId;
    var isMessageStatusEnabled = isMessageReceiptStatusEnabled
        && (!((_b = channel.lastMessage) === null || _b === void 0 ? void 0 : _b.isAdminMessage()))
        && ((_d = (_c = channel.lastMessage) === null || _c === void 0 ? void 0 : _c.sender) === null || _d === void 0 ? void 0 : _d.userId) === userId;
    return (React__default.createElement(GroupChannelListItemView, { channel: channel, tabIndex: tabIndex, channelName: getChannelTitle(channel, userId, stringSet), isTyping: isTypingIndicatorEnabled && isTyping, isSelected: isSelected, isMessageStatusEnabled: isMessageStatusEnabled, onClick: onClick, onLeaveChannel: onLeaveChannel, renderChannelAction: renderChannelAction }));
};

export { GroupChannelListItem };
//# sourceMappingURL=GroupChannelListItem.js.map

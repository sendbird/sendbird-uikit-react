import React__default from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-msnuMA4R.js';
import { u as useChannelListContext } from '../../chunks/bundle-oeTiDy7Y.js';
import { g as getChannelTitle } from '../../chunks/bundle-GQ4rK0ER.js';
import { G as GroupChannelListItemView } from '../../chunks/bundle-ExeMztFo.js';
import '../../withSendbird.js';
import '../../chunks/bundle-KMsJXUN2.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-THTV9S18.js';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-9zSaTC1n.js';
import '../../chunks/bundle-vbGNKQpe.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-kMMCn6GE.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-vWrgNSvP.js';
import '../../chunks/bundle-SpfAN5pr.js';
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

var ChannelPreview = function (_a) {
    var _b, _c, _d, _e;
    var channel = _a.channel, _f = _a.isActive, isActive = _f === void 0 ? false : _f, _g = _a.isSelected, isSelected = _g === void 0 ? false : _g, _h = _a.isTyping, isTyping = _h === void 0 ? false : _h, renderChannelAction = _a.renderChannelAction, onLeaveChannel = _a.onLeaveChannel, onClick = _a.onClick, tabIndex = _a.tabIndex;
    var config = useSendbirdStateContext().config;
    var stringSet = useLocalization().stringSet;
    var _j = useChannelListContext(), _k = _j.isTypingIndicatorEnabled, isTypingIndicatorEnabled = _k === void 0 ? false : _k, _l = _j.isMessageReceiptStatusEnabled, isMessageReceiptStatusEnabled = _l === void 0 ? false : _l;
    var userId = config.userId;
    var isMessageStatusEnabled = isMessageReceiptStatusEnabled
        && (((_b = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _b === void 0 ? void 0 : _b.messageType) === 'user' || ((_c = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _c === void 0 ? void 0 : _c.messageType) === 'file')
        && ((_e = (_d = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _d === void 0 ? void 0 : _d.sender) === null || _e === void 0 ? void 0 : _e.userId) === userId;
    return (React__default.createElement(GroupChannelListItemView, { channel: channel, tabIndex: tabIndex, isTyping: isTypingIndicatorEnabled && isTyping, isSelected: isSelected !== null && isSelected !== void 0 ? isSelected : isActive, channelName: getChannelTitle(channel, userId, stringSet), isMessageStatusEnabled: isMessageStatusEnabled, onClick: onClick, onLeaveChannel: onLeaveChannel, renderChannelAction: renderChannelAction }));
};

export { ChannelPreview as default };
//# sourceMappingURL=ChannelPreview.js.map

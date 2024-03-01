import React__default from 'react';
import { g as getChannelTitle } from '../../chunks/bundle-FTNAU8Uq.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import { useGroupChannelListContext } from '../context.js';
import { G as GroupChannelListItemView } from '../../chunks/bundle-wPETx6j0.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-ePTRDi6d.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../withSendbird.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-TqITKNRx.js';
import '@sendbird/chat';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../GroupChannel/components/TypingIndicator.js';
import '../../ui/Badge.js';
import '../../ui/ChannelAvatar.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-k8wZLjPN.js';
import '../../ui/MentionUserLabel.js';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';

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

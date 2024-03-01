import React__default from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import { u as useChannelListContext } from '../../chunks/bundle-fD7gUgus.js';
import { g as getChannelTitle } from '../../chunks/bundle-FTNAU8Uq.js';
import { G as GroupChannelListItemView } from '../../chunks/bundle-wPETx6j0.js';
import '../../withSendbird.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-WrTlYypL.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-5c9A2KLX.js';
import '../../chunks/bundle-ePTRDi6d.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
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

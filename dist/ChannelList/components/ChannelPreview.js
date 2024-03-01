import React__default from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-1inZXcUV.js';
import { u as useChannelListContext } from '../../chunks/bundle-QyGU5px0.js';
import { g as getChannelTitle } from '../../chunks/bundle-Vt_Z-0RJ.js';
import { G as GroupChannelListItemView } from '../../chunks/bundle-SINrMyNB.js';
import '../../withSendbird.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-yarrTY_z.js';
import '../../chunks/bundle-BZ3hPsJ8.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-UKdN0Ihw.js';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-AN6QCsUL.js';
import '../../chunks/bundle-Jwc7mleJ.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-04HABYsS.js';
import '../../chunks/bundle-o-FVZr_e.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-sR62lMVk.js';
import '../../ui/Loader.js';
import '../../chunks/bundle--WYMGSfi.js';
import '../../chunks/bundle-RfBkMeJ1.js';
import '../../chunks/bundle-FgXHPuhY.js';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../GroupChannel/components/TypingIndicator.js';
import '../../ui/Badge.js';
import '../../ui/ChannelAvatar.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../chunks/bundle-gIGIUJq-.js';
import '../../ui/MentionUserLabel.js';
import '../../chunks/bundle-zp72gyE3.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nMxV4WMS.js';

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

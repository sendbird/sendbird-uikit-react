import React__default, { useContext, useState } from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useChannelSettingsContext } from '../context.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-sR62lMVk.js';
import { L as LocalizationContext } from '../../chunks/bundle-1inZXcUV.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import IconButton from '../../ui/IconButton.js';
import ChannelProfile from './ChannelProfile.js';
import AdminPannel from './ModerationPanel.js';
import LeaveChannel from './LeaveChannel.js';
import UserPanel from './UserPanel.js';
import '../../withSendbird.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-BZ3hPsJ8.js';
import '../../ui/Loader.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../ui/ChannelAvatar.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../chunks/bundle-gIGIUJq-.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nMxV4WMS.js';
import './EditDetailsModal.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../ui/Button.js';
import '../../ui/Input.js';
import '../../ui/Accordion.js';
import '../../ui/AccordionGroup.js';
import '../../chunks/bundle-jaRNBP5f.js';
import '../../ui/Badge.js';
import '../../ui/Toggle.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-Jwc7mleJ.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-AN6QCsUL.js';
import './UserListItem.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-yarrTY_z.js';
import '../../ui/UserListItem.js';
import '../../ui/Checkbox.js';
import '../../chunks/bundle-6LZJpmKF.js';
import '../../chunks/bundle-WP5dHmdm.js';
import '../../chunks/bundle-UKdN0Ihw.js';
import '../../chunks/bundle-LgR-0X7v.js';
import '@sendbird/chat/message';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-p0z4OS-3.js';

var ChannelSettingsUI = function (_a) {
    var _b, _c;
    var renderLeaveChannel = _a.renderLeaveChannel, renderChannelProfile = _a.renderChannelProfile, renderModerationPanel = _a.renderModerationPanel, renderPlaceholderError = _a.renderPlaceholderError, renderPlaceholderLoading = _a.renderPlaceholderLoading;
    var stringSet = useContext(LocalizationContext).stringSet;
    var state = useSendbirdStateContext();
    var _d = useChannelSettingsContext(), channel = _d.channel, invalidChannel = _d.invalidChannel, onCloseClick = _d.onCloseClick, loading = _d.loading;
    var _e = useState(false), showLeaveChannelModal = _e[0], setShowLeaveChannelModal = _e[1];
    var isOnline = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.isOnline;
    var logger = (_c = state === null || state === void 0 ? void 0 : state.config) === null || _c === void 0 ? void 0 : _c.logger;
    var renderHeaderArea = function () {
        return (React__default.createElement("div", { className: "sendbird-channel-settings__header" },
            React__default.createElement(Label, { type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__HEADER__TITLE),
            React__default.createElement("div", { className: "sendbird-channel-settings__header-icon" },
                React__default.createElement(IconButton, { width: "32px", height: "32px", onClick: function () {
                        logger.info('ChannelSettings: Click close');
                        onCloseClick === null || onCloseClick === void 0 ? void 0 : onCloseClick();
                    } },
                    React__default.createElement(Icon, { className: "sendbird-channel-settings__close-icon", type: IconTypes.CLOSE, height: "22px", width: "22px" })))));
    };
    if (loading) {
        if (renderPlaceholderLoading)
            return renderPlaceholderLoading();
        return React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.LOADING });
    }
    if (invalidChannel || !channel) {
        return (React__default.createElement("div", null,
            renderHeaderArea(),
            React__default.createElement("div", null, renderPlaceholderError ? renderPlaceholderError() : React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.WRONG }))));
    }
    return (React__default.createElement(React__default.Fragment, null,
        renderHeaderArea(),
        React__default.createElement("div", { className: "sendbird-channel-settings__scroll-area" },
            (renderChannelProfile === null || renderChannelProfile === void 0 ? void 0 : renderChannelProfile()) || React__default.createElement(ChannelProfile, null),
            (renderModerationPanel === null || renderModerationPanel === void 0 ? void 0 : renderModerationPanel()) || ((channel === null || channel === void 0 ? void 0 : channel.myRole) === 'operator' ? React__default.createElement(AdminPannel, null) : React__default.createElement(UserPanel, null)),
            (renderLeaveChannel === null || renderLeaveChannel === void 0 ? void 0 : renderLeaveChannel()) || (React__default.createElement("div", { className: [
                    'sendbird-channel-settings__panel-item',
                    'sendbird-channel-settings__leave-channel',
                    !isOnline ? 'sendbird-channel-settings__panel-item__disabled' : '',
                ].join(' '), role: "button", onKeyDown: function () {
                    if (!isOnline) {
                        return;
                    }
                    setShowLeaveChannelModal(true);
                }, onClick: function () {
                    if (!isOnline) {
                        return;
                    }
                    setShowLeaveChannelModal(true);
                }, tabIndex: 0 },
                React__default.createElement(Icon, { className: ['sendbird-channel-settings__panel-icon-left', 'sendbird-channel-settings__panel-icon__leave'].join(' '), type: IconTypes.LEAVE, fillColor: IconColors.ERROR, height: "24px", width: "24px" }),
                React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE))),
            showLeaveChannelModal && (React__default.createElement(LeaveChannel, { onCancel: function () {
                    setShowLeaveChannelModal(false);
                }, onSubmit: function () {
                    setShowLeaveChannelModal(false);
                    onCloseClick === null || onCloseClick === void 0 ? void 0 : onCloseClick();
                } })))));
};

export { ChannelSettingsUI as default };
//# sourceMappingURL=ChannelSettingsUI.js.map

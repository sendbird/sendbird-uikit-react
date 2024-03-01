import React__default from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import { A as Avatar } from '../../chunks/bundle-LbQw2cVx.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import '../../withSendbird.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/Icon.js';

var GroupChannelListHeader = function (_a) {
    var renderTitle = _a.renderTitle, renderIconButton = _a.renderIconButton, onEdit = _a.onEdit, allowProfileEdit = _a.allowProfileEdit;
    var stores = useSendbirdStateContext().stores;
    var user = stores.userStore.user;
    var stringSet = useLocalization().stringSet;
    return (React__default.createElement("div", { className: [
            'sendbird-channel-header',
            allowProfileEdit ? 'sendbird-channel-header--allow-edit' : '',
        ].join(' ') },
        (renderTitle === null || renderTitle === void 0 ? void 0 : renderTitle()) || (React__default.createElement("div", { className: "sendbird-channel-header__title", role: "button", onClick: function () {
                onEdit === null || onEdit === void 0 ? void 0 : onEdit();
            }, onKeyDown: function () {
                onEdit === null || onEdit === void 0 ? void 0 : onEdit();
            }, tabIndex: 0 },
            React__default.createElement("div", { className: "sendbird-channel-header__title__left" },
                React__default.createElement(Avatar, { width: "32px", height: "32px", src: user.profileUrl, alt: user.nickname })),
            React__default.createElement("div", { className: "sendbird-channel-header__title__right" },
                React__default.createElement(Label, { className: "sendbird-channel-header__title__right__name", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_1 }, user.nickname || stringSet.NO_NAME),
                React__default.createElement(Label, { className: "sendbird-channel-header__title__right__user-id", type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_2 }, user.userId)))),
        React__default.createElement("div", { className: "sendbird-channel-header__right-icon" }, renderIconButton === null || renderIconButton === void 0 ? void 0 : renderIconButton())));
};

export { GroupChannelListHeader, GroupChannelListHeader as default };
//# sourceMappingURL=GroupChannelListHeader.js.map

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var EditUserProfile_context = require('../context.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var actionTypes = require('../../chunks/bundle-BWsz2Xk-.js');
var ui_Modal = require('../../chunks/bundle-6hGNMML2.js');
require('../../chunks/bundle-xbdnJE9-.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var ui_Button = require('../../ui/Button.js');
var ui_Input = require('../../ui/Input.js');
var ui_Avatar = require('../../chunks/bundle--jUKLwRX.js');
var ui_TextButton = require('../../ui/TextButton.js');
var ui_Icon = require('../../ui/Icon.js');
require('../../withSendbird.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('react-dom');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../chunks/bundle-0uk8Bfy0.js');

var EditUserProfileUIView = function (_a) {
    var _b;
    var formRef = _a.formRef, inputRef = _a.inputRef, onThemeChange = _a.onThemeChange, setProfileImage = _a.setProfileImage;
    var _c = useSendbirdStateContext.useSendbirdStateContext(), stores = _c.stores, config = _c.config;
    var theme = config.theme, setCurrentTheme = config.setCurrentTheme;
    var user = (_b = stores.userStore) === null || _b === void 0 ? void 0 : _b.user;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var _d = React.useState(null), currentImg = _d[0], setCurrentImg = _d[1];
    var hiddenInputRef = React.useRef(null);
    return (React.createElement("form", { className: "sendbird-edit-user-profile", ref: formRef, onSubmit: function (e) { e.preventDefault(); } },
        React.createElement("section", { className: "sendbird-edit-user-profile__img" },
            React.createElement(ui_Input.InputLabel, null, stringSet.EDIT_PROFILE__IMAGE_LABEL),
            React.createElement("div", { className: "sendbird-edit-user-profile__img__avatar" },
                React.createElement(ui_Avatar.Avatar, { width: "80px", height: "80px", src: currentImg || (user === null || user === void 0 ? void 0 : user.profileUrl) })),
            React.createElement("input", { ref: hiddenInputRef, type: "file", accept: "image/gif, image/jpeg, image/png", style: { display: 'none' }, onChange: function (e) {
                    setCurrentImg(URL.createObjectURL(e.target.files[0]));
                    setProfileImage(e.target.files[0]);
                    hiddenInputRef.current.value = '';
                } }),
            React.createElement(ui_TextButton, { className: "sendbird-edit-user-profile__img__avatar-button", disableUnderline: true, onClick: function () { return hiddenInputRef.current.click(); } },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BUTTON_1, color: ui_Label.LabelColors.PRIMARY }, stringSet.EDIT_PROFILE__IMAGE_UPLOAD))),
        React.createElement("section", { className: "sendbird-edit-user-profile__name" },
            React.createElement(ui_Input.InputLabel, null, stringSet.EDIT_PROFILE__NICKNAME_LABEL),
            React.createElement(ui_Input.default, { required: (user === null || user === void 0 ? void 0 : user.nickname) !== '', name: "sendbird-edit-user-profile__name__input", ref: inputRef, value: user === null || user === void 0 ? void 0 : user.nickname, placeHolder: stringSet.EDIT_PROFILE__NICKNAME_PLACEHOLDER })),
        React.createElement("section", { className: "sendbird-edit-user-profile__userid" },
            React.createElement(ui_Input.InputLabel, null, stringSet.EDIT_PROFILE__USERID_LABEL),
            React.createElement(ui_Input.default, { disabled: true, name: "sendbird-edit-user-profile__userid__input", value: user === null || user === void 0 ? void 0 : user.userId })),
        React.createElement("section", { className: "sendbird-edit-user-profile__theme" },
            React.createElement(ui_Input.InputLabel, null, stringSet.EDIT_PROFILE__THEME_LABEL),
            React.createElement("div", { className: "sendbird-edit-user-profile__theme__theme-icon" }, theme === 'dark'
                ? (React.createElement(ui_Icon.default, { onClick: function () {
                        setCurrentTheme('light');
                        onThemeChange === null || onThemeChange === void 0 ? void 0 : onThemeChange('light');
                    }, type: ui_Icon.IconTypes.TOGGLE_ON, width: 44, height: 24 }))
                : (React.createElement(ui_Icon.default, { onClick: function () {
                        setCurrentTheme('dark');
                        onThemeChange === null || onThemeChange === void 0 ? void 0 : onThemeChange('dark');
                    }, type: ui_Icon.IconTypes.TOGGLE_OFF, width: 44, height: 24 }))))));
};

var handleUpdateUserInfo = function (_a) {
    var _b, _c, _d;
    var globalContext = _a.globalContext, formRef = _a.formRef, inputRef = _a.inputRef, profileImage = _a.profileImage, onEditProfile = _a.onEditProfile;
    var stores = globalContext.stores, dispatchers = globalContext.dispatchers;
    var sdk = stores.sdkStore.sdk;
    var user = stores.userStore.user;
    var userDispatcher = dispatchers.userDispatcher;
    if ((user === null || user === void 0 ? void 0 : user.nickname) !== '' && !inputRef.current.value) {
        (_c = (_b = formRef.current).reportValidity) === null || _c === void 0 ? void 0 : _c.call(_b); // might not work in explorer
        return;
    }
    sdk === null || sdk === void 0 ? void 0 : sdk.updateCurrentUserInfo({
        nickname: (_d = inputRef === null || inputRef === void 0 ? void 0 : inputRef.current) === null || _d === void 0 ? void 0 : _d.value,
        profileImage: profileImage,
    }).then(function (updatedUser) {
        userDispatcher({ type: actionTypes.USER_ACTIONS.UPDATE_USER_INFO, payload: updatedUser });
        onEditProfile === null || onEditProfile === void 0 ? void 0 : onEditProfile(updatedUser);
    });
};
var useEditUserProfileUISates = function (_a) {
    var onEditProfile = _a.onEditProfile;
    var globalContext = useSendbirdStateContext.useSendbirdStateContext();
    var inputRef = React.useRef(null);
    var formRef = React.useRef(null);
    var _b = React.useState(null), profileImage = _b[0], setProfileImage = _b[1];
    var updateUserInfo = function () {
        handleUpdateUserInfo({
            globalContext: globalContext,
            formRef: formRef,
            inputRef: inputRef,
            profileImage: profileImage,
            onEditProfile: onEditProfile,
        });
    };
    return {
        formRef: formRef,
        inputRef: inputRef,
        updateUserInfo: updateUserInfo,
        profileImage: profileImage,
        setProfileImage: setProfileImage,
    };
};
var EditUserProfileUI = function () {
    var editProfileContext = EditUserProfile_context.useEditUserProfileContext();
    var onEditProfile = editProfileContext.onEditProfile, onCancel = editProfileContext.onCancel, onThemeChange = editProfileContext.onThemeChange;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _a = useEditUserProfileUISates({ onEditProfile: onEditProfile }), formRef = _a.formRef, inputRef = _a.inputRef, updateUserInfo = _a.updateUserInfo, setProfileImage = _a.setProfileImage;
    return (React.createElement(ui_Modal.Modal, { titleText: stringSet.EDIT_PROFILE__TITLE, submitText: stringSet.BUTTON__SAVE, type: ui_Button.ButtonTypes.PRIMARY, onCancel: onCancel, isFullScreenOnMobile: true, onSubmit: updateUserInfo },
        React.createElement(EditUserProfileUIView, { formRef: formRef, inputRef: inputRef, setProfileImage: setProfileImage, onThemeChange: onThemeChange })));
};

exports.EditUserProfileUI = EditUserProfileUI;
exports.EditUserProfileUIView = EditUserProfileUIView;
exports.default = EditUserProfileUI;
exports.useEditUserProfileUISates = useEditUserProfileUISates;
//# sourceMappingURL=EditUserProfileUI.js.map

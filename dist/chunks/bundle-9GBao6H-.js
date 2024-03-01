import React__default from 'react';

/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
var UserProfileContext = React__default.createContext({
    disableUserProfile: true,
    isOpenChannel: false,
    renderUserProfile: null,
    onUserProfileMessage: null,
});
var UserProfileProvider = function (_a) {
    var _b = _a.isOpenChannel, isOpenChannel = _b === void 0 ? false : _b, _c = _a.disableUserProfile, disableUserProfile = _c === void 0 ? false : _c, _d = _a.renderUserProfile, renderUserProfile = _d === void 0 ? null : _d, _e = _a.onUserProfileMessage, onUserProfileMessage = _e === void 0 ? null : _e, children = _a.children;
    return (React__default.createElement(UserProfileContext.Provider, { value: {
            isOpenChannel: isOpenChannel,
            disableUserProfile: disableUserProfile,
            renderUserProfile: renderUserProfile,
            onUserProfileMessage: onUserProfileMessage,
        } }, children));
};

export { UserProfileProvider as U, UserProfileContext as a };
//# sourceMappingURL=bundle-9GBao6H-.js.map

'use strict';

var React = require('react');

/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
var UserProfileContext = React.createContext({
    disableUserProfile: true,
    isOpenChannel: false,
    renderUserProfile: null,
    onUserProfileMessage: null,
});
var UserProfileProvider = function (_a) {
    var _b = _a.isOpenChannel, isOpenChannel = _b === void 0 ? false : _b, _c = _a.disableUserProfile, disableUserProfile = _c === void 0 ? false : _c, _d = _a.renderUserProfile, renderUserProfile = _d === void 0 ? null : _d, _e = _a.onUserProfileMessage, onUserProfileMessage = _e === void 0 ? null : _e, children = _a.children;
    return (React.createElement(UserProfileContext.Provider, { value: {
            isOpenChannel: isOpenChannel,
            disableUserProfile: disableUserProfile,
            renderUserProfile: renderUserProfile,
            onUserProfileMessage: onUserProfileMessage,
        } }, children));
};

exports.UserProfileContext = UserProfileContext;
exports.UserProfileProvider = UserProfileProvider;
//# sourceMappingURL=bundle-HnlcCy36.js.map

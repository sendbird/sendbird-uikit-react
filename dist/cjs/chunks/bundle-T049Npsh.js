'use strict';

var DEFAULT_URL_PREFIX = 'https://static.sendbird.com/sample/cover/cover_';
var getOpenChannelAvatar = function (channel) {
    if (channel === null || channel === void 0 ? void 0 : channel.coverUrl) {
        return channel.coverUrl;
    }
};
var getChannelAvatarSource = function (channel, currentUserId) {
    if (channel === null || channel === void 0 ? void 0 : channel.coverUrl) {
        if (!(new RegExp("^".concat(DEFAULT_URL_PREFIX)).test(channel.coverUrl))) {
            return channel.coverUrl;
        }
    }
    return ((channel === null || channel === void 0 ? void 0 : channel.members) || [])
        .filter(function (member) { return member.userId !== currentUserId; })
        .map(function (_a) {
        var profileUrl = _a.profileUrl;
        return profileUrl;
    });
};
var generateDefaultAvatar = function (channel) {
    if (channel === null || channel === void 0 ? void 0 : channel.coverUrl) {
        if (new RegExp("^".concat(DEFAULT_URL_PREFIX)).test(channel.coverUrl)) {
            return true;
        }
        return false;
    }
    return true;
};

exports.generateDefaultAvatar = generateDefaultAvatar;
exports.getChannelAvatarSource = getChannelAvatarSource;
exports.getOpenChannelAvatar = getOpenChannelAvatar;
//# sourceMappingURL=bundle-T049Npsh.js.map

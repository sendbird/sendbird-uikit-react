'use strict';

var _tslib = require('../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var UserProfileContext = require('../chunks/bundle-uzKywAVp.js');
var uuid = require('../chunks/bundle-SOIkTCep.js');
require('../withSendbird.js');

function useAsyncRequest(request, options) {
    var _this = this;
    var _a = React.useState({ loading: true, response: undefined, error: undefined }), state = _a[0], setState = _a[1];
    var updateWithRequest = function () { return _tslib.__awaiter(_this, void 0, void 0, function () {
        var response_1, error_1;
        return _tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setState(function (prev) { return ({ loading: true, error: undefined, response: (options === null || options === void 0 ? void 0 : options.resetResponseOnRefresh) ? undefined : prev.response }); });
                    return [4 /*yield*/, request()];
                case 1:
                    response_1 = _a.sent();
                    setState(function (prev) { return (_tslib.__assign(_tslib.__assign({}, prev), { response: response_1, loading: false })); });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    setState(function (prev) { return (_tslib.__assign(_tslib.__assign({}, prev), { error: error_1, loading: false })); });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    React.useEffect(function () {
        updateWithRequest();
        return function () {
            if (request.cancel && typeof request.cancel === 'function') {
                request.cancel();
            }
        };
    }, []);
    return _tslib.__assign(_tslib.__assign({}, state), { refresh: updateWithRequest });
}

var ChannelSettingsContext = React.createContext(null);
var ChannelSettingsProvider = function (_a) {
    var children = _a.children, className = _a.className, channelUrl = _a.channelUrl, onCloseClick = _a.onCloseClick, onLeaveChannel = _a.onLeaveChannel, onChannelModified = _a.onChannelModified, overrideInviteUser = _a.overrideInviteUser, onBeforeUpdateChannel = _a.onBeforeUpdateChannel, queries = _a.queries, renderUserProfile = _a.renderUserProfile, disableUserProfile = _a.disableUserProfile;
    var _b = useSendbirdStateContext.useSendbirdStateContext(), config = _b.config, stores = _b.stores;
    var sdkStore = stores.sdkStore;
    var logger = config.logger, onUserProfileMessage = config.onUserProfileMessage;
    // hack to keep track of channel updates by triggering useEffect
    var _c = React.useState(function () { return uuid.uuidv4(); }), channelUpdateId = _c[0], setChannelUpdateId = _c[1];
    var forceUpdateUI = function () { return setChannelUpdateId(uuid.uuidv4()); };
    var _d = useAsyncRequest(function () { return _tslib.__awaiter(void 0, void 0, void 0, function () {
        var errorMessage;
        return _tslib.__generator(this, function (_a) {
            logger.info('ChannelSettings: fetching channel');
            if (!channelUrl) {
                errorMessage = 'channel url is required';
            }
            else if (!sdkStore.initialized || !sdkStore.sdk) {
                errorMessage = 'SDK is not initialized';
            }
            else if (!sdkStore.sdk.groupChannel) {
                errorMessage = 'GroupChannelModule is not specified in the SDK';
            }
            if (errorMessage) {
                logger.warning("ChannelSettings: ".concat(errorMessage));
                throw new Error(errorMessage);
            }
            return [2 /*return*/, sdkStore.sdk.groupChannel.getChannel(channelUrl)];
        });
    }); }, { resetResponseOnRefresh: true }), _e = _d.response, response = _e === void 0 ? null : _e, loading = _d.loading, error = _d.error, refresh = _d.refresh;
    React.useEffect(function () {
        refresh();
    }, [channelUrl, channelUpdateId]);
    return (React.createElement(ChannelSettingsContext.Provider, { value: {
            channelUrl: channelUrl,
            onCloseClick: onCloseClick,
            onLeaveChannel: onLeaveChannel,
            onChannelModified: onChannelModified,
            onBeforeUpdateChannel: onBeforeUpdateChannel,
            queries: queries,
            overrideInviteUser: overrideInviteUser,
            setChannelUpdateId: setChannelUpdateId,
            forceUpdateUI: forceUpdateUI,
            channel: response,
            loading: loading,
            invalidChannel: Boolean(error),
        } },
        React.createElement(UserProfileContext.UserProfileProvider, { renderUserProfile: renderUserProfile, disableUserProfile: disableUserProfile !== null && disableUserProfile !== void 0 ? disableUserProfile : config === null || config === void 0 ? void 0 : config.disableUserProfile, onUserProfileMessage: onUserProfileMessage },
            React.createElement("div", { className: "sendbird-channel-settings ".concat(className) }, children))));
};
var useChannelSettingsContext = function () { return React.useContext(ChannelSettingsContext); };

exports.ChannelSettingsProvider = ChannelSettingsProvider;
exports.useChannelSettingsContext = useChannelSettingsContext;
//# sourceMappingURL=context.js.map

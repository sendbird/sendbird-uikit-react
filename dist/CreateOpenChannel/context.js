import React__default, { useCallback } from 'react';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import '../withSendbird.js';
import '../chunks/bundle-xhjHZ041.js';

var CreateOpenChannelContext = React__default.createContext({
    sdk: null,
    sdkInitialized: false,
    logger: null,
    createNewOpenChannel: null,
});
var CreateOpenChannelProvider = function (_a) {
    var _b, _c;
    var className = _a.className, children = _a.children, onCreateChannel = _a.onCreateChannel, onBeforeCreateChannel = _a.onBeforeCreateChannel;
    var _d = useSendbirdStateContext(), stores = _d.stores, config = _d.config;
    var logger = config.logger;
    var sdk = ((_b = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk) || null;
    var sdkInitialized = ((_c = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _c === void 0 ? void 0 : _c.initialized) || false;
    var createNewOpenChannel = useCallback(function (params) {
        var _a;
        var name = params.name, coverUrlOrImage = params.coverUrlOrImage;
        if (sdkInitialized) {
            var params_1 = {};
            params_1.operatorUserIds = [(_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId];
            params_1.name = name;
            params_1.coverUrlOrImage = coverUrlOrImage;
            sdk.openChannel.createChannel((onBeforeCreateChannel === null || onBeforeCreateChannel === void 0 ? void 0 : onBeforeCreateChannel(params_1)) || params_1)
                .then(function (openChannel) {
                logger.info('CreateOpenChannel: Succeeded creating openChannel', openChannel);
                onCreateChannel(openChannel);
            })
                .catch(function (err) {
                logger.warning('CreateOpenChannel: Failed creating openChannel', err);
            });
        }
    }, [sdkInitialized, onBeforeCreateChannel, onCreateChannel]);
    return (React__default.createElement(CreateOpenChannelContext.Provider, { value: {
            // interface
            sdk: sdk,
            sdkInitialized: sdkInitialized,
            logger: logger,
            createNewOpenChannel: createNewOpenChannel,
        } },
        React__default.createElement("div", { className: "sendbird-create-open-channel ".concat(className) }, children)));
};
var useCreateOpenChannelContext = function () { return (React__default.useContext(CreateOpenChannelContext)); };

export { CreateOpenChannelProvider, useCreateOpenChannelContext };
//# sourceMappingURL=context.js.map

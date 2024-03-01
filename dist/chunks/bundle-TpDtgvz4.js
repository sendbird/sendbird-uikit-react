import React__default, { useCallback, useEffect, useContext, useMemo, useReducer } from 'react';
import { p as pubSubTopics } from './bundle-THTV9S18.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { _ as __assign, c as __spreadArray } from './bundle-KMsJXUN2.js';

var OpenChannelListFetchingStatus;
(function (OpenChannelListFetchingStatus) {
    OpenChannelListFetchingStatus["EMPTY"] = "EMPTY";
    OpenChannelListFetchingStatus["FETCHING"] = "FETCHING";
    OpenChannelListFetchingStatus["DONE"] = "DONE";
    OpenChannelListFetchingStatus["ERROR"] = "ERROR";
})(OpenChannelListFetchingStatus || (OpenChannelListFetchingStatus = {}));

var OpenChannelListActionTypes;
(function (OpenChannelListActionTypes) {
    // actions
    OpenChannelListActionTypes["INIT_OPEN_CHANNEL_LIST_START"] = "INIT_OPEN_CHANNEL_LIST_START";
    OpenChannelListActionTypes["INIT_OPEN_CHANNEL_LIST_SUCCESS"] = "INIT_OPEN_CHANNEL_LIST_SUCCESS";
    OpenChannelListActionTypes["INIT_OPEN_CHANNEL_LIST_FAILURE"] = "INIT_OPEN_CHANNEL_LIST_FAILURE";
    OpenChannelListActionTypes["RESET_OPEN_CHANNEL_LIST"] = "RESET_OPEN_CHANNEL_LIST";
    OpenChannelListActionTypes["FETCH_OPEN_CHANNEL_LIST_START"] = "FETCH_OPEN_CHANNEL_LIST_START";
    OpenChannelListActionTypes["FETCH_OPEN_CHANNEL_LIST_SUCCESS"] = "FETCH_OPEN_CHANNEL_LIST_SUCCESS";
    OpenChannelListActionTypes["FETCH_OPEN_CHANNEL_LIST_FAILURE"] = "FETCH_OPEN_CHANNEL_LIST_FAILURE";
    OpenChannelListActionTypes["CREATE_OPEN_CHANNEL"] = "CREATE_OPEN_CHANNEL";
    OpenChannelListActionTypes["SET_CURRENT_OPEN_CHANNEL"] = "SET_CURRENT_OPEN_CHANNEL";
    OpenChannelListActionTypes["UPDATE_OPEN_CHANNEL_LIST_QUERY"] = "UPDATE_OPEN_CHANNEL_LIST_QUERY";
    OpenChannelListActionTypes["UPDATE_OPEN_CHANNEL"] = "UPDATE_OPEN_CHANNEL";
})(OpenChannelListActionTypes || (OpenChannelListActionTypes = {}));
var OpenChannelListActionTypes$1 = OpenChannelListActionTypes;

function reducer(state, action) {
    var _a, _b;
    switch (action.type) {
        case OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_START: {
            return __assign(__assign({}, state), { fetchingStatus: OpenChannelListFetchingStatus.FETCHING });
        }
        case OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_SUCCESS: {
            var channelList = action.payload;
            return __assign(__assign({}, state), { allChannels: channelList, fetchingStatus: channelList.length > 0
                    ? OpenChannelListFetchingStatus.DONE
                    : OpenChannelListFetchingStatus.EMPTY });
        }
        case OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_FAILURE: {
            return __assign(__assign({}, state), { allChannels: [], fetchingStatus: OpenChannelListFetchingStatus.ERROR });
        }
        case OpenChannelListActionTypes$1.RESET_OPEN_CHANNEL_LIST: {
            return __assign(__assign({}, state), { allChannels: [], fetchingStatus: OpenChannelListFetchingStatus.EMPTY });
        }
        case OpenChannelListActionTypes$1.FETCH_OPEN_CHANNEL_LIST_START: {
            return state;
        }
        case OpenChannelListActionTypes$1.FETCH_OPEN_CHANNEL_LIST_SUCCESS: {
            return __assign(__assign({}, state), { allChannels: __spreadArray(__spreadArray([], state.allChannels, true), action.payload, true) });
        }
        case OpenChannelListActionTypes$1.FETCH_OPEN_CHANNEL_LIST_FAILURE: {
            return state;
        }
        case OpenChannelListActionTypes$1.CREATE_OPEN_CHANNEL: {
            return __assign(__assign({}, state), { currentChannel: action.payload, allChannels: __spreadArray([action.payload], state.allChannels, true) });
        }
        case OpenChannelListActionTypes$1.SET_CURRENT_OPEN_CHANNEL: {
            return __assign(__assign({}, state), { currentChannel: action.payload });
        }
        case OpenChannelListActionTypes$1.UPDATE_OPEN_CHANNEL_LIST_QUERY: {
            return __assign(__assign({}, state), { channelListQuery: action === null || action === void 0 ? void 0 : action.payload });
        }
        case OpenChannelListActionTypes$1.UPDATE_OPEN_CHANNEL: {
            return __assign(__assign({}, state), { allChannels: state.allChannels.map(function (channel) {
                    var _a;
                    return ((channel === null || channel === void 0 ? void 0 : channel.url) === ((_a = action.payload) === null || _a === void 0 ? void 0 : _a.url) ? action.payload : channel);
                }), currentChannel: (((_a = state.currentChannel) === null || _a === void 0 ? void 0 : _a.url) === ((_b = action === null || action === void 0 ? void 0 : action.payload) === null || _b === void 0 ? void 0 : _b.url))
                    ? state.currentChannel
                    : action.payload });
        }
        default: {
            return state;
        }
    }
}

var openChannelListInitialState = {
    allChannels: [],
    currentChannel: null,
    fetchingStatus: OpenChannelListFetchingStatus.EMPTY,
    channelListQuery: null,
};

function useFetchNextCallback(_a, _b) {
    var sdkInitialized = _a.sdkInitialized, openChannelListQuery = _a.openChannelListQuery;
    var logger = _b.logger, openChannelListDispatcher = _b.openChannelListDispatcher;
    return useCallback(function (callback) {
        if (sdkInitialized && (openChannelListQuery === null || openChannelListQuery === void 0 ? void 0 : openChannelListQuery.hasNext)) {
            logger.info('OpenChannelList|useFetchNextCallback : Fetch channels');
            openChannelListDispatcher({
                type: OpenChannelListActionTypes$1.FETCH_OPEN_CHANNEL_LIST_START,
                payload: null,
            });
            openChannelListQuery.next()
                .then(function (channelList) {
                callback(channelList, null);
                logger.info('OpenChannelList|useFetchNextCallback: Succeeded fetching channels', channelList);
                openChannelListDispatcher({
                    type: OpenChannelListActionTypes$1.FETCH_OPEN_CHANNEL_LIST_SUCCESS,
                    payload: channelList,
                });
            })
                .catch(function (err) {
                callback(null, err);
                logger.error('OpenChannelList|useFetchNextCallback: Failed fetching channels', err);
                openChannelListDispatcher({
                    type: OpenChannelListActionTypes$1.FETCH_OPEN_CHANNEL_LIST_FAILURE,
                    payload: null,
                });
            });
        }
        else {
            logger.info('OpenChannelList|useFetchNextCallback : There is no more channels');
        }
    }, [sdkInitialized, openChannelListQuery]);
}

function createChannelListQuery(_a) {
    var _b, _c;
    var sdk = _a.sdk, logMessage = _a.logMessage, openChannelListQuery = _a.openChannelListQuery, logger = _a.logger, openChannelListDispatcher = _a.openChannelListDispatcher;
    var params = {};
    params.limit = 20;
    params.includeFrozen = true;
    if (openChannelListQuery) {
        Object.keys(openChannelListQuery).forEach(function (key) {
            params[key] = openChannelListQuery[key];
        });
    }
    var channelListQuery = (_c = (_b = sdk === null || sdk === void 0 ? void 0 : sdk.openChannel) === null || _b === void 0 ? void 0 : _b.createOpenChannelListQuery) === null || _c === void 0 ? void 0 : _c.call(_b, params);
    logger.info(logMessage, channelListQuery);
    openChannelListDispatcher({
        type: OpenChannelListActionTypes$1.UPDATE_OPEN_CHANNEL_LIST_QUERY,
        payload: channelListQuery,
    });
    return channelListQuery;
}

function useSetupOpenChannelList(_a, _b) {
    var sdk = _a.sdk, sdkInitialized = _a.sdkInitialized, openChannelListQuery = _a.openChannelListQuery;
    var logger = _b.logger, openChannelListDispatcher = _b.openChannelListDispatcher;
    useEffect(function () {
        var _a;
        if (sdkInitialized) {
            if (sdk === null || sdk === void 0 ? void 0 : sdk.openChannel) {
                if ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.openChannel) === null || _a === void 0 ? void 0 : _a.createOpenChannelListQuery) {
                    logger.info('OpenChannelList|useSetupOpenChannelList: Setup OpenChannelList', { sdkInitialized: sdkInitialized });
                    var channelListQuery = createChannelListQuery({
                        sdk: sdk,
                        logger: logger,
                        openChannelListQuery: openChannelListQuery,
                        openChannelListDispatcher: openChannelListDispatcher,
                        logMessage: 'OpenChannelList|useSetupOpenChannelList: Succeeded create channelListQuery',
                    });
                    if (channelListQuery === null || channelListQuery === void 0 ? void 0 : channelListQuery.hasNext) {
                        logger.info('OpenChannelList|useSetupOpenChannelList: Fetch channels');
                        openChannelListDispatcher({
                            type: OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_START,
                            payload: null,
                        });
                        channelListQuery.next()
                            .then(function (channelList) {
                            logger.info('OpenChannelList|useSetupOpenChannelList: Succeeded fetching channels', channelList);
                            openChannelListDispatcher({
                                type: OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_SUCCESS,
                                payload: channelList,
                            });
                        })
                            .catch(function (err) {
                            logger.error('OpenChannelList|useSetupOpenChannelList: Failed fetching channels', err);
                            openChannelListDispatcher({
                                type: OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_FAILURE,
                                payload: null,
                            });
                        });
                    }
                    else {
                        logger.info('OpenChannelList|useSetupOpenChannelList: There is no more channels');
                    }
                }
                else {
                    logger.warning('OpenChannelList|useSetupOpenChannelList: createOpenChannelListQuery is not included in the openChannel', sdk.openChannel);
                }
            }
            else {
                logger.warning('OpenChannelList|useSetupOpenChannelList: openChannel is not included in the Chat SDK', sdk);
            }
        }
        else {
            logger.info('OpenChannelList|useSetupOpenChannelList: Reset OpenChannelList', { sdkInitialized: sdkInitialized });
            openChannelListDispatcher({
                type: OpenChannelListActionTypes$1.RESET_OPEN_CHANNEL_LIST,
                payload: null,
            });
        }
    }, [sdkInitialized, openChannelListQuery]);
}

function useRefreshOpenChannelList(_a, _b) {
    var sdk = _a.sdk, sdkInitialized = _a.sdkInitialized, openChannelListQuery = _a.openChannelListQuery;
    var logger = _b.logger, openChannelListDispatcher = _b.openChannelListDispatcher;
    return useCallback(function () {
        var _a;
        if (!sdkInitialized) {
            logger.info('OpenChannelList|useRefreshOpenChannelList: Reset OpenChannelList', { sdkInitialized: sdkInitialized });
            openChannelListDispatcher({
                type: OpenChannelListActionTypes$1.RESET_OPEN_CHANNEL_LIST,
                payload: null,
            });
            return;
        }
        if (!(sdk === null || sdk === void 0 ? void 0 : sdk.openChannel)) {
            logger.warning('OpenChannelList|useRefreshOpenChannelList: openChannel is not included in the Chat SDK', sdk);
            return;
        }
        if (!((_a = sdk === null || sdk === void 0 ? void 0 : sdk.openChannel) === null || _a === void 0 ? void 0 : _a.createOpenChannelListQuery)) {
            logger.warning('OpenChannelList|useRefreshOpenChannelList: createOpenChannelListQuery is not included in the openChannel', sdk.openChannel);
            return;
        }
        logger.info('OpenChannelList|useRefreshOpenChannelList: Setup OpenChannelList', { sdkInitialized: sdkInitialized });
        var channelListQuery = createChannelListQuery({
            sdk: sdk,
            logger: logger,
            openChannelListQuery: openChannelListQuery,
            openChannelListDispatcher: openChannelListDispatcher,
            logMessage: 'OpenChannelList|useRefreshOpenChannelList: Succeeded create channelListQuery',
        });
        if (channelListQuery.hasNext) {
            logger.info('OpenChannelList|useRefreshOpenChannelList: Fetch channels');
            openChannelListDispatcher({
                type: OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_START,
                payload: null,
            });
            channelListQuery.next()
                .then(function (channelList) {
                logger.info('OpenChannelList|useRefreshOpenChannelList: Succeeded fetching channels', channelList);
                openChannelListDispatcher({
                    type: OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_SUCCESS,
                    payload: channelList,
                });
            })
                .catch(function (err) {
                logger.error('OpenChannelList|useRefreshOpenChannelList: Failed fetching channels', err);
                openChannelListDispatcher({
                    type: OpenChannelListActionTypes$1.INIT_OPEN_CHANNEL_LIST_FAILURE,
                    payload: null,
                });
            });
        }
        else {
            logger.info('OpenChannelList|useRefreshOpenChannelList: There is no more channels');
        }
    }, [sdkInitialized, openChannelListQuery]);
}

var OpenChannelListContext = React__default.createContext({
    onChannelSelected: null,
    currentChannel: null,
    allChannels: [],
    fetchingStatus: OpenChannelListFetchingStatus.EMPTY,
    customOpenChannelListQuery: {},
    fetchNextChannels: null,
    refreshOpenChannelList: null,
    openChannelListDispatcher: null,
    logger: null,
});
function useOpenChannelListContext() {
    var context = useContext(OpenChannelListContext);
    return context;
}
var OpenChannelListProvider = function (_a) {
    var _b, _c;
    var className = _a.className, children = _a.children, queries = _a.queries, onChannelSelected = _a.onChannelSelected;
    // props
    var _d = useSendbirdStateContext(), stores = _d.stores, config = _d.config;
    var logger = config.logger, pubSub = config.pubSub;
    var sdk = ((_b = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk) || null;
    var sdkInitialized = ((_c = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _c === void 0 ? void 0 : _c.initialized) || false;
    var customOpenChannelListQuery = useMemo(function () {
        return (queries === null || queries === void 0 ? void 0 : queries.openChannelListQuery) || null;
    }, [queries === null || queries === void 0 ? void 0 : queries.openChannelListQuery]);
    // dux
    var _e = useReducer(reducer, openChannelListInitialState), openChannelListStore = _e[0], openChannelListDispatcher = _e[1];
    var allChannels = openChannelListStore.allChannels, currentChannel = openChannelListStore.currentChannel, fetchingStatus = openChannelListStore.fetchingStatus, channelListQuery = openChannelListStore.channelListQuery;
    // Initialize
    useSetupOpenChannelList({
        sdk: sdk,
        sdkInitialized: sdkInitialized,
        openChannelListQuery: customOpenChannelListQuery,
    }, {
        logger: logger,
        openChannelListDispatcher: openChannelListDispatcher,
    });
    // Events & PubSub
    useEffect(function () {
        var subscriber = (pubSub === null || pubSub === void 0 ? void 0 : pubSub.subscribe) ? new Map() : null;
        subscriber === null || subscriber === void 0 ? void 0 : subscriber.set(pubSubTopics.UPDATE_OPEN_CHANNEL, pubSub === null || pubSub === void 0 ? void 0 : pubSub.subscribe(pubSubTopics.UPDATE_OPEN_CHANNEL, function (channel) {
            openChannelListDispatcher({
                type: OpenChannelListActionTypes$1.UPDATE_OPEN_CHANNEL,
                payload: channel,
            });
        }));
        return function () {
            subscriber === null || subscriber === void 0 ? void 0 : subscriber.forEach(function (s) {
                try {
                    s.remove();
                }
                catch (_a) {
                    //
                }
            });
        };
    }, [sdkInitialized, pubSub]);
    // Fetch next channels by scroll event
    var fetchNextChannels = useFetchNextCallback({
        sdkInitialized: sdkInitialized,
        openChannelListQuery: channelListQuery,
    }, {
        logger: logger,
        openChannelListDispatcher: openChannelListDispatcher,
    });
    // Refresh channel list by click event of 'refresh button'
    var refreshOpenChannelList = useRefreshOpenChannelList({
        sdk: sdk,
        sdkInitialized: sdkInitialized,
        openChannelListQuery: customOpenChannelListQuery,
    }, {
        logger: logger,
        openChannelListDispatcher: openChannelListDispatcher,
    });
    return (React__default.createElement(OpenChannelListContext.Provider, { value: {
            // props
            onChannelSelected: onChannelSelected,
            customOpenChannelListQuery: customOpenChannelListQuery,
            // interface
            logger: logger,
            currentChannel: currentChannel,
            allChannels: allChannels,
            fetchingStatus: fetchingStatus,
            fetchNextChannels: fetchNextChannels,
            refreshOpenChannelList: refreshOpenChannelList,
            openChannelListDispatcher: openChannelListDispatcher,
        } },
        React__default.createElement("div", { className: "sendbird-open-channel-list ".concat(className) }, children)));
};
var OpenChannelListProvider$1 = {
    OpenChannelListProvider: OpenChannelListProvider,
    useOpenChannelListContext: useOpenChannelListContext,
};

export { OpenChannelListProvider as O, OpenChannelListFetchingStatus as a, OpenChannelListActionTypes$1 as b, OpenChannelListProvider$1 as c, useOpenChannelListContext as u };
//# sourceMappingURL=bundle-TpDtgvz4.js.map

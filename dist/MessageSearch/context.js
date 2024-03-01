import React__default, { useEffect, useCallback, useState, useReducer, useRef } from 'react';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { _ as __assign, c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import '../withSendbird.js';

var GET_SEARCHED_MESSAGES = 'GET_SEARCHED_MESSAGES';
var GET_NEXT_SEARCHED_MESSAGES = 'GET_NEXT_SEARCHED_MESSAGES';
var START_MESSAGE_SEARCH = 'START_MESSAGE_SEARCH';
var START_GETTING_SEARCHED_MESSAGES = 'START_GETTING_SEARCHED_MESSAGES';
var SET_QUERY_INVALID = 'SET_QUERY_INVALID';
var SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';
var CHANNEL_INVALID = 'CHANNEL_INVALID';
var RESET_SEARCH_STRING = 'RESET_SEARCH_STRING';

function reducer(state, action) {
    switch (action.type) {
        case SET_CURRENT_CHANNEL: {
            var currentChannel = action.payload;
            return __assign(__assign({}, state), { currentChannel: currentChannel, initialized: true });
        }
        case CHANNEL_INVALID: {
            return __assign(__assign({}, state), { currentChannel: null, initialized: false });
        }
        case GET_SEARCHED_MESSAGES: {
            var _a = action.payload, messages = _a.messages, createdQuery = _a.createdQuery;
            if (createdQuery
                && createdQuery.channelUrl === (state === null || state === void 0 ? void 0 : state.currentMessageSearchQuery).channelUrl
                && createdQuery.key === (state === null || state === void 0 ? void 0 : state.currentMessageSearchQuery).key) {
                return __assign(__assign({}, state), { loading: false, isInvalid: false, allMessages: __spreadArray([], messages, true), hasMoreResult: (state === null || state === void 0 ? void 0 : state.currentMessageSearchQuery).hasNext });
            }
            return __assign({}, state);
        }
        case SET_QUERY_INVALID: {
            return __assign(__assign({}, state), { isInvalid: true });
        }
        case START_MESSAGE_SEARCH: {
            return __assign(__assign({}, state), { isInvalid: false, loading: false });
        }
        case START_GETTING_SEARCHED_MESSAGES: {
            var currentMessageSearchQuery = action.payload;
            return __assign(__assign({}, state), { loading: true, currentMessageSearchQuery: currentMessageSearchQuery });
        }
        case GET_NEXT_SEARCHED_MESSAGES: {
            var messages = action.payload;
            return __assign(__assign({}, state), { allMessages: __spreadArray(__spreadArray([], state.allMessages, true), messages, true), hasMoreResult: (state === null || state === void 0 ? void 0 : state.currentMessageSearchQuery).hasNext });
        }
        case RESET_SEARCH_STRING: {
            return __assign(__assign({}, state), { allMessages: [] });
        }
        default: {
            return state;
        }
    }
}

var initialState = {
    allMessages: [],
    loading: false,
    isInvalid: false,
    initialized: false,
    currentChannel: null,
    currentMessageSearchQuery: null,
    hasMoreResult: false,
};

function useSetChannel(_a, _b) {
    var channelUrl = _a.channelUrl, sdkInit = _a.sdkInit;
    var sdk = _b.sdk, logger = _b.logger, messageSearchDispatcher = _b.messageSearchDispatcher;
    useEffect(function () {
        if (channelUrl && sdkInit && (sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel)) {
            sdk.groupChannel.getChannel(channelUrl).then(function (groupChannel) {
                logger.info('MessageSearch | useSetChannel group channel', groupChannel);
                messageSearchDispatcher({
                    type: SET_CURRENT_CHANNEL,
                    payload: groupChannel,
                });
            }).catch(function () {
                messageSearchDispatcher({
                    type: CHANNEL_INVALID,
                    payload: null,
                });
            });
        }
    }, [channelUrl, sdkInit]);
}

var MessageSearchOrder;
(function (MessageSearchOrder) {
    MessageSearchOrder["SCORE"] = "score";
    MessageSearchOrder["TIMESTAMP"] = "ts";
})(MessageSearchOrder || (MessageSearchOrder = {}));
function useGetSearchedMessages(_a, _b) {
    var currentChannel = _a.currentChannel, channelUrl = _a.channelUrl, requestString = _a.requestString, messageSearchQuery = _a.messageSearchQuery, onResultLoaded = _a.onResultLoaded, retryCount = _a.retryCount;
    var sdk = _b.sdk, logger = _b.logger, messageSearchDispatcher = _b.messageSearchDispatcher;
    useEffect(function () {
        messageSearchDispatcher({
            type: START_MESSAGE_SEARCH,
            payload: null,
        });
        if (sdk && channelUrl && sdk.createMessageSearchQuery && currentChannel) {
            if (requestString) {
                currentChannel.refresh()
                    .then(function (channel) {
                    var inputSearchMessageQueryObject = __assign({ order: MessageSearchOrder.TIMESTAMP, channelUrl: channelUrl, messageTimestampFrom: channel.invitedAt, keyword: requestString }, messageSearchQuery);
                    var createdQuery = sdk.createMessageSearchQuery(inputSearchMessageQueryObject);
                    createdQuery.next().then(function (messages) {
                        logger.info('MessageSearch | useGetSearchedMessages: succeeded getting messages', messages);
                        messageSearchDispatcher({
                            type: GET_SEARCHED_MESSAGES,
                            payload: {
                                messages: messages,
                                createdQuery: createdQuery,
                            },
                        });
                        if (onResultLoaded && typeof onResultLoaded === 'function') {
                            onResultLoaded(messages, null);
                        }
                    }).catch(function (error) {
                        logger.warning('MessageSearch | useGetSearchedMessages: failed getting search messages.', error);
                        messageSearchDispatcher({
                            type: SET_QUERY_INVALID,
                            payload: null,
                        });
                        if (onResultLoaded && typeof onResultLoaded === 'function') {
                            onResultLoaded(null, error);
                        }
                    });
                    messageSearchDispatcher({
                        type: START_GETTING_SEARCHED_MESSAGES,
                        payload: createdQuery,
                    });
                })
                    .catch(function (error) {
                    logger.warning('MessageSearch | useGetSearchedMessages: failed getting channel.', error);
                    messageSearchDispatcher({
                        type: SET_QUERY_INVALID,
                        payload: null,
                    });
                    if (onResultLoaded && typeof onResultLoaded === 'function') {
                        onResultLoaded(null, error);
                    }
                });
            }
            else {
                logger.info('MessageSearch | useGetSeasrchedMessages: search string is empty');
            }
        }
    }, [channelUrl, messageSearchQuery, requestString, currentChannel, retryCount]);
}

function useScrollCallback(_a, _b) {
    var currentMessageSearchQuery = _a.currentMessageSearchQuery, hasMoreResult = _a.hasMoreResult, onResultLoaded = _a.onResultLoaded;
    var logger = _b.logger, messageSearchDispatcher = _b.messageSearchDispatcher;
    return useCallback(function (cb) {
        if (!hasMoreResult) {
            logger.warning('MessageSearch | useScrollCallback: no more searched results', hasMoreResult);
        }
        if (currentMessageSearchQuery && currentMessageSearchQuery.hasNext) {
            currentMessageSearchQuery.next().then(function (messages) {
                logger.info('MessageSearch | useScrollCallback: succeeded getting searched messages', messages);
                messageSearchDispatcher({
                    type: GET_NEXT_SEARCHED_MESSAGES,
                    payload: messages,
                });
                cb(messages, null);
                if (onResultLoaded && typeof onResultLoaded === 'function') {
                    onResultLoaded(messages, null);
                }
            }).catch(function (error) {
                logger.warning('MessageSearch | useScrollCallback: failed getting searched messages', error);
                cb(null, error);
                if (onResultLoaded && typeof onResultLoaded === 'function') {
                    onResultLoaded(null, error);
                }
            });
        }
        else {
            logger.warning('MessageSearch | useScrollCallback: no currentMessageSearchQuery');
        }
    }, [currentMessageSearchQuery, hasMoreResult]);
}

var DEBOUNCING_TIME = 500;
function useSearchStringEffect(_a, _b) {
    var searchString = _a.searchString;
    var messageSearchDispatcher = _b.messageSearchDispatcher;
    var _c = useState(''), requestString = _c[0], setRequestString = _c[1];
    var _d = useState(null), debouncingTimer = _d[0], setDebouncingTimer = _d[1];
    useEffect(function () {
        clearTimeout(debouncingTimer);
        if (searchString) {
            setDebouncingTimer(setTimeout(function () {
                setRequestString(searchString);
            }, DEBOUNCING_TIME));
        }
        else {
            setRequestString('');
            messageSearchDispatcher({
                type: RESET_SEARCH_STRING,
                payload: '',
            });
        }
    }, [searchString]);
    return requestString;
}

var MessageSearchContext = React__default.createContext(undefined);
var MessageSearchProvider = function (props) {
    var _a, _b, _c, _d, _e;
    var 
    // message search props
    channelUrl = props.channelUrl, searchString = props.searchString, messageSearchQuery = props.messageSearchQuery, onResultLoaded = props.onResultLoaded, onResultClick = props.onResultClick;
    var globalState = useSendbirdStateContext();
    // hook variables
    var _f = useState(0), retryCount = _f[0], setRetryCount = _f[1]; // this is a trigger flag for activating useGetSearchMessages
    var _g = useState(0), selectedMessageId = _g[0], setSelectedMessageId = _g[1];
    var _h = useReducer(reducer, initialState), messageSearchStore = _h[0], messageSearchDispatcher = _h[1];
    var allMessages = messageSearchStore.allMessages, loading = messageSearchStore.loading, isInvalid = messageSearchStore.isInvalid, currentChannel = messageSearchStore.currentChannel, currentMessageSearchQuery = messageSearchStore.currentMessageSearchQuery, hasMoreResult = messageSearchStore.hasMoreResult;
    var logger = (_a = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _a === void 0 ? void 0 : _a.logger;
    var sdk = (_c = (_b = globalState === null || globalState === void 0 ? void 0 : globalState.stores) === null || _b === void 0 ? void 0 : _b.sdkStore) === null || _c === void 0 ? void 0 : _c.sdk;
    var sdkInit = (_e = (_d = globalState === null || globalState === void 0 ? void 0 : globalState.stores) === null || _d === void 0 ? void 0 : _d.sdkStore) === null || _e === void 0 ? void 0 : _e.initialized;
    var scrollRef = useRef(null);
    var handleOnScroll = function (e) {
        var scrollElement = e.target;
        var scrollTop = scrollElement.scrollTop, scrollHeight = scrollElement.scrollHeight, clientHeight = scrollElement.clientHeight;
        if (!hasMoreResult) {
            return;
        }
        if (scrollTop + clientHeight >= scrollHeight) {
            onScroll(function () {
                // after load more searched messages
            });
        }
    };
    useSetChannel({ channelUrl: channelUrl, sdkInit: sdkInit }, { sdk: sdk, logger: logger, messageSearchDispatcher: messageSearchDispatcher });
    var requestString = useSearchStringEffect({ searchString: searchString }, { messageSearchDispatcher: messageSearchDispatcher });
    useGetSearchedMessages({ currentChannel: currentChannel, channelUrl: channelUrl, requestString: requestString, messageSearchQuery: messageSearchQuery, onResultLoaded: onResultLoaded, retryCount: retryCount }, { sdk: sdk, logger: logger, messageSearchDispatcher: messageSearchDispatcher });
    var onScroll = useScrollCallback({ currentMessageSearchQuery: currentMessageSearchQuery, hasMoreResult: hasMoreResult, onResultLoaded: onResultLoaded }, { logger: logger, messageSearchDispatcher: messageSearchDispatcher });
    var handleRetryToConnect = function () {
        setRetryCount(retryCount + 1);
    };
    return (React__default.createElement(MessageSearchContext.Provider, { value: {
            channelUrl: channelUrl,
            searchString: searchString,
            requestString: requestString,
            messageSearchQuery: messageSearchQuery,
            onResultLoaded: onResultLoaded,
            onResultClick: onResultClick,
            retryCount: retryCount,
            setRetryCount: setRetryCount,
            selectedMessageId: selectedMessageId,
            setSelectedMessageId: setSelectedMessageId,
            messageSearchDispatcher: messageSearchDispatcher,
            allMessages: allMessages,
            loading: loading,
            isInvalid: isInvalid,
            currentChannel: currentChannel,
            currentMessageSearchQuery: currentMessageSearchQuery,
            hasMoreResult: hasMoreResult,
            onScroll: onScroll,
            scrollRef: scrollRef,
            handleRetryToConnect: handleRetryToConnect,
            handleOnScroll: handleOnScroll,
        } }, props === null || props === void 0 ? void 0 : props.children));
};
var useMessageSearchContext = function () { return React__default.useContext(MessageSearchContext); };

export { MessageSearchProvider, useMessageSearchContext };
//# sourceMappingURL=context.js.map

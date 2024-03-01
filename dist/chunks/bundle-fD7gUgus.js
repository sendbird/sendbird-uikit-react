import { _ as __assign, c as __spreadArray, a as __awaiter, b as __generator } from './bundle-UnAcr6wX.js';
import React__default, { useEffect, useCallback, useReducer, useState, useMemo, useContext } from 'react';
import { GroupChannelHandler, GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import { p as pubSubTopics } from './bundle-7BSf_PUT.js';
import { u as uuidv4 } from './bundle-0Kp88b8b.js';
import { n as noop } from './bundle-CRwhglru.js';
import { D as DELIVERY_RECEIPT$1 } from './bundle-1CfFFBx9.js';
import { U as UserProfileProvider } from './bundle-jDtVwIPR.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { K, S } from './bundle-UuydkZ4A.js';
import { R as filterChannelListParams, T as getChannelsWithUpsertedChannel } from './bundle-WrTlYypL.js';
import { u as useReconnectOnIdle } from './bundle-5c9A2KLX.js';

var RESET_CHANNEL_LIST = 'RESET_CHANNEL_LIST';
var CREATE_CHANNEL = 'CREATE_CHANNEL';
var LEAVE_CHANNEL_SUCCESS = 'LEAVE_CHANNEL_SUCCESS';
var SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';
var FETCH_CHANNELS_START = 'FETCH_CHANNELS_START';
var FETCH_CHANNELS_SUCCESS = 'FETCH_CHANNELS_SUCCESS';
var FETCH_CHANNELS_FAILURE = 'FETCH_CHANNELS_FAILURE';
var INIT_CHANNELS_START = 'INIT_CHANNELS_START';
var INIT_CHANNELS_SUCCESS = 'INIT_CHANNELS_SUCCESS';
var REFRESH_CHANNELS_SUCCESS = 'REFRESH_CHANNELS_SUCCESS';
var INIT_CHANNELS_FAILURE = 'INIT_CHANNELS_FAILURE';
var ON_USER_JOINED = 'ON_USER_JOINED';
var ON_CHANNEL_DELETED = 'ON_CHANNEL_DELETED';
var ON_LAST_MESSAGE_UPDATED = 'ON_LAST_MESSAGE_UPDATED';
var ON_USER_LEFT = 'ON_USER_LEFT';
var ON_CHANNEL_CHANGED = 'ON_CHANNEL_CHANGED';
var ON_CHANNEL_ARCHIVED = 'ON_CHANNEL_ARCHIVED';
var ON_CHANNEL_FROZEN = 'ON_CHANNEL_FROZEN';
var ON_CHANNEL_UNFROZEN = 'ON_CHANNEL_UNFROZEN';
var ON_READ_RECEIPT_UPDATED = 'ON_READ_RECEIPT_UPDATED';
var ON_DELIVERY_RECEIPT_UPDATED = 'ON_DELIVERY_RECEIPT_UPDATED';
var CHANNEL_LIST_PARAMS_UPDATED = 'CHANNEL_LIST_PARAMS_UPDATED';

var DELIVERY_RECEIPT = 'delivery_receipt';
var createEventHandler = function (_a) {
    var sdk = _a.sdk, sdkChannelHandlerId = _a.sdkChannelHandlerId, channelListDispatcher = _a.channelListDispatcher, logger = _a.logger;
    var ChannelHandler = new GroupChannelHandler({
        onChannelChanged: function (channel) {
            if (channel.isGroupChannel()) {
                logger.info('ChannelList: onChannelChanged', channel);
                channelListDispatcher({
                    type: ON_CHANNEL_CHANGED,
                    payload: channel,
                });
            }
        },
        onChannelDeleted: function (channelUrl) {
            logger.info('ChannelList: onChannelDeleted', channelUrl);
            channelListDispatcher({
                type: ON_CHANNEL_DELETED,
                payload: channelUrl,
            });
        },
        onUserJoined: function (channel) {
            logger.info('ChannelList: onUserJoined', channel);
            channelListDispatcher({
                type: ON_USER_JOINED,
                payload: channel,
            });
        },
        onUserBanned: function (channel, user) {
            var _a;
            if (channel.isGroupChannel()) {
                logger.info('Channel: onUserBanned', channel);
                var isMe = user.userId === ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId);
                channelListDispatcher({
                    type: ON_USER_LEFT,
                    payload: { channel: channel, isMe: isMe },
                });
            }
        },
        onUserLeft: function (channel, user) {
            var _a;
            logger.info('ChannelList: onUserLeft', channel);
            var isMe = user.userId === ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId);
            channelListDispatcher({
                type: ON_USER_LEFT,
                payload: { channel: channel, isMe: isMe },
            });
        },
        onUnreadMemberStatusUpdated: function (channel) {
            logger.info('ChannelList: onUnreadMemberStatusUpdated', channel);
            channelListDispatcher({
                type: ON_READ_RECEIPT_UPDATED,
                payload: channel,
            });
        },
        onUndeliveredMemberStatusUpdated: function (channel) {
            logger.info('ChannelList: onUndeliveredMemberStatusUpdated', channel);
            if (channel.lastMessage) {
                channelListDispatcher({
                    type: ON_DELIVERY_RECEIPT_UPDATED,
                    payload: channel,
                });
            }
        },
        onMessageUpdated: function (channel, message) {
            if (channel.isGroupChannel() && channel.lastMessage.isEqual(message)) {
                logger.info('ChannelList: onMessageUpdated', channel);
                channelListDispatcher({
                    type: ON_LAST_MESSAGE_UPDATED,
                    payload: channel,
                });
            }
        },
        onChannelHidden: function (channel) {
            logger.info('ChannelList: onChannelHidden', channel);
            channelListDispatcher({
                type: ON_CHANNEL_ARCHIVED,
                payload: channel,
            });
        },
        onChannelFrozen: function (channel) {
            if (channel.isGroupChannel()) {
                logger.info('ChannelList: onChannelFrozen', channel);
                channelListDispatcher({
                    type: ON_CHANNEL_FROZEN,
                    payload: channel,
                });
            }
        },
        onChannelUnfrozen: function (channel) {
            if (channel.isGroupChannel()) {
                logger.info('ChannelList: onChannelUnfrozen', channel);
                channelListDispatcher({
                    type: ON_CHANNEL_UNFROZEN,
                    payload: channel,
                });
            }
        },
    });
    logger.info('ChannelList: Added channelHandler');
    sdk.groupChannel.addGroupChannelHandler(sdkChannelHandlerId, ChannelHandler);
};
var createChannelListQuery = function (_a) {
    var sdk = _a.sdk, _b = _a.userFilledChannelListQuery, userFilledChannelListQuery = _b === void 0 ? {} : _b;
    var params = {
        includeEmpty: false,
        limit: 20,
        order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
    };
    if (userFilledChannelListQuery) {
        Object.keys(userFilledChannelListQuery).forEach(function (key) {
            params[key] = userFilledChannelListQuery[key];
        });
    }
    return sdk.groupChannel.createMyGroupChannelListQuery(params);
};
function setupChannelList(_a) {
    var _b, _c, _d, _e;
    var sdk = _a.sdk, sdkChannelHandlerId = _a.sdkChannelHandlerId, channelListDispatcher = _a.channelListDispatcher, setChannelSource = _a.setChannelSource, onChannelSelect = _a.onChannelSelect, userFilledChannelListQuery = _a.userFilledChannelListQuery, logger = _a.logger, sortChannelList = _a.sortChannelList, disableAutoSelect = _a.disableAutoSelect, markAsDeliveredScheduler = _a.markAsDeliveredScheduler, disableMarkAsDelivered = _a.disableMarkAsDelivered;
    if (sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) {
        createEventHandler({
            sdk: sdk,
            channelListDispatcher: channelListDispatcher,
            sdkChannelHandlerId: sdkChannelHandlerId,
            logger: logger,
        });
    }
    else {
        logger.warning('ChannelList - createEventHandler: sdk or sdk.ChannelHandler does not exist', sdk);
    }
    logger.info('ChannelList - creating query', { userFilledChannelListQuery: userFilledChannelListQuery });
    var channelListQuery = createChannelListQuery({ sdk: sdk, userFilledChannelListQuery: userFilledChannelListQuery });
    logger.info('ChannelList - created query', channelListQuery);
    setChannelSource(channelListQuery);
    channelListDispatcher({
        type: INIT_CHANNELS_START,
        payload: {
            currentUserId: (_c = (_b = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _b === void 0 ? void 0 : _b.userId) !== null && _c !== void 0 ? _c : '',
        },
    });
    if (userFilledChannelListQuery) {
        logger.info('ChannelList - setting up channelListQuery', channelListQuery);
        channelListDispatcher({
            type: CHANNEL_LIST_PARAMS_UPDATED,
            payload: {
                channelListQuery: channelListQuery,
                currentUserId: (_e = (_d = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _d === void 0 ? void 0 : _d.userId) !== null && _e !== void 0 ? _e : '',
            },
        });
    }
    logger.info('ChannelList - fetching channels');
    if (channelListQuery.hasNext) {
        channelListQuery
            .next()
            .then(function (channelList) {
            var _a, _b;
            logger.info('ChannelList - fetched channels', channelList);
            // select first channel
            logger.info('ChannelList - highlight channel', channelList[0]);
            var sortedChannelList = channelList;
            if (sortChannelList && typeof sortChannelList === 'function') {
                sortedChannelList = sortChannelList(channelList);
                logger.info('ChannelList - channel list sorted', sortedChannelList);
            }
            if (!disableAutoSelect) {
                onChannelSelect === null || onChannelSelect === void 0 ? void 0 : onChannelSelect(sortedChannelList[0]);
            }
            channelListDispatcher({
                type: INIT_CHANNELS_SUCCESS,
                payload: {
                    channelList: sortedChannelList,
                    disableAutoSelect: disableAutoSelect,
                },
            });
            var canSetMarkAsDelivered = (_b = (_a = sdk === null || sdk === void 0 ? void 0 : sdk.appInfo) === null || _a === void 0 ? void 0 : _a.premiumFeatureList) === null || _b === void 0 ? void 0 : _b.find(function (feature) { return feature === DELIVERY_RECEIPT; });
            if (canSetMarkAsDelivered && !disableMarkAsDelivered) {
                sortedChannelList.forEach(function (channel) {
                    markAsDeliveredScheduler.push(channel);
                });
            }
        })
            .catch(function (err) {
            if (err) {
                logger.error('ChannelList - couldnt fetch channels', err);
                channelListDispatcher({
                    type: INIT_CHANNELS_FAILURE,
                });
            }
        });
    }
    else {
        logger.info('ChannelList - there are no more channels');
    }
}
var pubSubHandleRemover = function (subscriber) {
    subscriber.forEach(function (s) {
        try {
            s.remove();
        }
        catch (_a) {
            //
        }
    });
};
var pubSubHandler = function (pubSub, channelListDispatcher) {
    var subscriber = new Map();
    if (!pubSub)
        return subscriber;
    subscriber.set(pubSubTopics.CREATE_CHANNEL, pubSub.subscribe(pubSubTopics.CREATE_CHANNEL, function (msg) {
        var channel = msg.channel;
        channelListDispatcher({
            type: CREATE_CHANNEL,
            payload: channel,
        });
    }));
    subscriber.set(pubSubTopics.UPDATE_USER_MESSAGE, pubSub.subscribe(pubSubTopics.UPDATE_USER_MESSAGE, function (_a) {
        var _b;
        var channel = _a.channel, message = _a.message;
        if (channel.isGroupChannel() && ((_b = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _b === void 0 ? void 0 : _b.messageId) === message.messageId) {
            channel.lastMessage = message;
            channelListDispatcher({
                type: ON_LAST_MESSAGE_UPDATED,
                payload: channel,
            });
        }
    }));
    subscriber.set(pubSubTopics.LEAVE_CHANNEL, pubSub.subscribe(pubSubTopics.LEAVE_CHANNEL, function (msg) {
        var channel = msg.channel;
        channelListDispatcher({
            type: LEAVE_CHANNEL_SUCCESS,
            payload: channel === null || channel === void 0 ? void 0 : channel.url,
        });
    }));
    return subscriber;
};

/**
 * NOTICE: Use this function IF the current channel is removed from allChannels.
 * This function will give you the next currentChannel value.
 */
var getNextChannel = function (_a) {
    var channel = _a.channel, currentChannel = _a.currentChannel, allChannels = _a.allChannels, disableAutoSelect = _a.disableAutoSelect;
    var nextChannel = null;
    if ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) === channel.url) {
        if (!disableAutoSelect && allChannels.length > 0) {
            var firstChannel = allChannels[0], _b = allChannels[1], secondChannel = _b === void 0 ? null : _b;
            nextChannel = firstChannel.url === channel.url ? secondChannel : firstChannel;
        }
    }
    else {
        nextChannel = currentChannel;
    }
    return nextChannel;
};

var initialState = {
    // we might not need this initialized state -> should remove
    initialized: false,
    loading: true,
    allChannels: [],
    currentChannel: null,
    channelListQuery: null,
    currentUserId: '',
    disableAutoSelect: false,
};

function channelListReducer(state, action) {
    return (K(action)
        .with({ type: INIT_CHANNELS_START }, function (_a) {
        var payload = _a.payload;
        return (__assign(__assign({}, state), { loading: true, currentUserId: payload.currentUserId }));
    })
        .with({ type: RESET_CHANNEL_LIST }, function () {
        return initialState;
    })
        .with({ type: INIT_CHANNELS_SUCCESS }, function (action) {
        var _a = action.payload, channelList = _a.channelList, disableAutoSelect = _a.disableAutoSelect;
        return __assign(__assign({}, state), { initialized: true, loading: false, allChannels: channelList, disableAutoSelect: disableAutoSelect, currentChannel: !disableAutoSelect && channelList && channelList.length && channelList.length > 0 ? channelList[0] : state.currentChannel });
    })
        .with({ type: REFRESH_CHANNELS_SUCCESS }, function (action) {
        var _a = action.payload, channelList = _a.channelList, currentChannel = _a.currentChannel;
        return __assign(__assign({}, state), { loading: false, allChannels: channelList, currentChannel: currentChannel });
    })
        .with({ type: FETCH_CHANNELS_SUCCESS }, function (action) {
        var currentChannels = state.allChannels.map(function (c) { return c.url; });
        var filteredChannels = action.payload.filter(function (_a) {
            var url = _a.url;
            return !currentChannels.find(function (c) { return c === url; });
        });
        return __assign(__assign({}, state), { allChannels: __spreadArray(__spreadArray([], state.allChannels, true), filteredChannels, true) });
    })
        .with({ type: CREATE_CHANNEL }, function (action) {
        var _a;
        var channel = action.payload;
        var allChannels = state.allChannels, currentUserId = state.currentUserId, channelListQuery = state.channelListQuery;
        if (channelListQuery) {
            if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
                // Good to add to the ChannelList
                return __assign(__assign({}, state), { currentChannel: channel, allChannels: getChannelsWithUpsertedChannel(allChannels, channel, (_a = state.channelListQuery) === null || _a === void 0 ? void 0 : _a.order) });
            }
            // Do not add to the ChannelList
            return __assign(__assign({}, state), { currentChannel: channel });
        }
        // No channelListQuery
        // Add to the top of the ChannelList
        return __assign(__assign({}, state), { currentChannel: channel, allChannels: __spreadArray([channel], allChannels.filter(function (ch) { return ch.url !== (channel === null || channel === void 0 ? void 0 : channel.url); }), true) });
    })
        // A hidden channel will be unhidden when getting new message
        .with({ type: ON_CHANNEL_ARCHIVED }, function (action) {
        var _a;
        var channel = action.payload;
        var allChannels = state.allChannels, currentUserId = state.currentUserId, currentChannel = state.currentChannel, channelListQuery = state.channelListQuery, disableAutoSelect = state.disableAutoSelect;
        if (channelListQuery) {
            if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
                // Good to [add to/keep in] the ChannelList
                return __assign(__assign({}, state), { allChannels: getChannelsWithUpsertedChannel(allChannels, channel, (_a = state.channelListQuery) === null || _a === void 0 ? void 0 : _a.order) });
            }
            // * Remove the channel from the ChannelList: because the channel is filtered
        }
        // No channelListQuery
        // * Remove the channel from the ChannelList: because the channel is hidden
        // Replace the currentChannel if it's filtered or hidden
        var nextChannel = getNextChannel({
            channel: channel,
            currentChannel: currentChannel,
            allChannels: allChannels,
            disableAutoSelect: disableAutoSelect,
        });
        return __assign(__assign({}, state), { currentChannel: nextChannel, allChannels: allChannels.filter(function (_a) {
                var url = _a.url;
                return url !== (channel === null || channel === void 0 ? void 0 : channel.url);
            }) });
    })
        .with({ type: S.union(LEAVE_CHANNEL_SUCCESS, ON_CHANNEL_DELETED) }, function (action) {
        var _a;
        var channelUrl = action.payload;
        var allChannels = state.allChannels.filter(function (_a) {
            var url = _a.url;
            return url !== channelUrl;
        });
        return __assign(__assign({}, state), { currentChannel: channelUrl === ((_a = state.currentChannel) === null || _a === void 0 ? void 0 : _a.url) ? allChannels[0] : state.currentChannel, allChannels: allChannels });
    })
        .with({ type: ON_USER_LEFT }, function (action) {
        var _a;
        var _b = action.payload, channel = _b.channel, isMe = _b.isMe;
        var allChannels = state.allChannels, currentUserId = state.currentUserId, currentChannel = state.currentChannel, channelListQuery = state.channelListQuery, disableAutoSelect = state.disableAutoSelect;
        var nextChannels = __spreadArray([], allChannels, true);
        var nextChannel = channel;
        /**
         * 1. If I left channel:
         *   - Remove the channel from channel list
         *   - Replace currentChannel with the next ordered channel
         * 2. If other member left channel:
         *   2-1. If query is given:
         *     2-1-1. If channel no longer matches the query
         *       - Same as step 1
         *     2-1-2. If channel matches the query:
         *       - Upsert channel list with the channel
         *       - Replace currentChannel IFF url is same
         *   2-2. If query is not given,
         *     - Same as step 2-1-2
         */
        /* `1` and `2-1-1` */
        if (isMe || (channelListQuery && !filterChannelListParams(channelListQuery, channel, currentUserId))) {
            var channelAt = allChannels.findIndex(function (ch) { return ch.url === channel.url; });
            if (channelAt > -1) {
                nextChannels.splice(channelAt, 1);
                nextChannel = getNextChannel({
                    channel: channel,
                    currentChannel: currentChannel,
                    allChannels: allChannels,
                    disableAutoSelect: disableAutoSelect,
                });
            }
        }
        else {
            /* `2-1-2` and `2-2` */
            nextChannels = getChannelsWithUpsertedChannel(allChannels, channel, (_a = state.channelListQuery) === null || _a === void 0 ? void 0 : _a.order);
            if ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url) === channel.url) {
                nextChannel = channel;
            }
        }
        return __assign(__assign({}, state), { currentChannel: nextChannel, allChannels: nextChannels });
    })
        .with({
        type: S.union(ON_USER_JOINED, ON_CHANNEL_CHANGED, ON_READ_RECEIPT_UPDATED, ON_DELIVERY_RECEIPT_UPDATED),
    }, function (action) {
        var _a, _b, _c;
        var channel = action.payload;
        var _d = state.allChannels, allChannels = _d === void 0 ? [] : _d, currentUserId = state.currentUserId, currentChannel = state.currentChannel, channelListQuery = state.channelListQuery, disableAutoSelect = state.disableAutoSelect;
        var unreadMessageCount = channel.unreadMessageCount;
        if (channelListQuery) {
            if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
                // Good to [add to/keep in] the ChannelList
                return __assign(__assign({}, state), { allChannels: getChannelsWithUpsertedChannel(allChannels, channel, (_a = state.channelListQuery) === null || _a === void 0 ? void 0 : _a.order) });
            }
            // Filter the channel from the ChannelList
            // Replace the currentChannel if it's filtered channel
            var nextChannel = getNextChannel({
                channel: channel,
                currentChannel: currentChannel,
                allChannels: allChannels,
                disableAutoSelect: disableAutoSelect,
            });
            return __assign(__assign({}, state), { currentChannel: nextChannel, allChannels: allChannels.filter(function (_a) {
                    var url = _a.url;
                    return url !== (channel === null || channel === void 0 ? void 0 : channel.url);
                }) });
        }
        if (
        // When marking as read the channel
        unreadMessageCount === 0
            // @ts-ignore - When sending a message by the current peer
            && ((_c = (_b = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _b === void 0 ? void 0 : _b.sender) === null || _c === void 0 ? void 0 : _c.userId) !== currentUserId) {
            // Don't move to the top
            return __assign(__assign({}, state), { allChannels: allChannels.map(function (ch) { return (ch.url === (channel === null || channel === void 0 ? void 0 : channel.url) ? channel : ch); }) });
        }
        // Move to the top
        return __assign(__assign({}, state), { allChannels: __spreadArray([channel], allChannels.filter(function (_a) {
                var url = _a.url;
                return url !== channel.url;
            }), true) });
    })
        .with({ type: SET_CURRENT_CHANNEL }, function (action) {
        return __assign(__assign({}, state), { currentChannel: action.payload });
    })
        .with({ type: ON_LAST_MESSAGE_UPDATED }, function (action) {
        return __assign(__assign({}, state), { allChannels: state.allChannels.map(function (channel) { return (channel === null || channel === void 0 ? void 0 : channel.url) === action.payload.url ? action.payload : channel; }) });
    })
        .with({ type: ON_CHANNEL_FROZEN }, function (action) {
        var _a;
        var channel = action.payload;
        var allChannels = state.allChannels, currentUserId = state.currentUserId, currentChannel = state.currentChannel, channelListQuery = state.channelListQuery, disableAutoSelect = state.disableAutoSelect;
        if (channelListQuery) {
            if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
                // Good to [add to/keep in] the ChannelList
                return __assign(__assign({}, state), { allChannels: getChannelsWithUpsertedChannel(allChannels, channel, (_a = state.channelListQuery) === null || _a === void 0 ? void 0 : _a.order) });
            }
            // Filter the channel from the ChannelList
            // Replace the currentChannel if it's filtered channel
            var nextChannel = getNextChannel({
                channel: channel,
                currentChannel: currentChannel,
                allChannels: allChannels,
                disableAutoSelect: disableAutoSelect,
            });
            return __assign(__assign({}, state), { currentChannel: nextChannel, allChannels: allChannels.filter(function (_a) {
                    var url = _a.url;
                    return url !== (channel === null || channel === void 0 ? void 0 : channel.url);
                }) });
        }
        return __assign(__assign({}, state), { allChannels: allChannels.map(function (ch) {
                if (ch.url === (channel === null || channel === void 0 ? void 0 : channel.url)) {
                    // eslint-disable-next-line no-param-reassign
                    ch.isFrozen = true;
                    return ch;
                }
                return ch;
            }) });
    })
        .with({ type: ON_CHANNEL_UNFROZEN }, function (action) {
        var _a;
        var channel = action.payload;
        var allChannels = state.allChannels, currentUserId = state.currentUserId, currentChannel = state.currentChannel, channelListQuery = state.channelListQuery, disableAutoSelect = state.disableAutoSelect;
        if (channelListQuery) {
            if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
                // Good to [add to/keep in] the ChannelList
                return __assign(__assign({}, state), { allChannels: getChannelsWithUpsertedChannel(allChannels, channel, (_a = state.channelListQuery) === null || _a === void 0 ? void 0 : _a.order) });
            }
            // Filter the channel from the ChannelList
            // Replace the currentChannel if it's filtered channel
            var nextChannel = getNextChannel({
                channel: channel,
                currentChannel: currentChannel,
                allChannels: allChannels,
                disableAutoSelect: disableAutoSelect,
            });
            return __assign(__assign({}, state), { currentChannel: nextChannel, allChannels: allChannels.filter(function (_a) {
                    var url = _a.url;
                    return url !== (channel === null || channel === void 0 ? void 0 : channel.url);
                }) });
        }
        // No channelListQuery
        return __assign(__assign({}, state), { allChannels: allChannels.map(function (ch) {
                if (ch.url === (channel === null || channel === void 0 ? void 0 : channel.url)) {
                    // eslint-disable-next-line no-param-reassign
                    ch.isFrozen = false;
                    return ch;
                }
                return ch;
            }) });
    })
        .with({ type: CHANNEL_LIST_PARAMS_UPDATED }, function (action) { return (__assign(__assign({}, state), { channelListQuery: action.payload.channelListQuery, currentUserId: action.payload.currentUserId })); })
        .otherwise(function () { return state; }));
}

function useActiveChannelUrl(_a, _b) {
    var activeChannelUrl = _a.activeChannelUrl, channels = _a.channels, sdk = _a.sdk;
    var logger = _b.logger, channelListDispatcher = _b.channelListDispatcher;
    return useEffect(function () {
        var _a;
        if (activeChannelUrl) {
            logger.info('ChannelListProvider: looking for active channel', { activeChannelUrl: activeChannelUrl });
            var activeChannel = channels === null || channels === void 0 ? void 0 : channels.find(function (channel) { return channel.url === activeChannelUrl; });
            if (activeChannel) {
                channelListDispatcher({
                    type: SET_CURRENT_CHANNEL,
                    payload: activeChannel,
                });
            }
            else {
                logger.info('ChannelListProvider: searching backend for active channel', { activeChannelUrl: activeChannelUrl });
                (_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.getChannel(activeChannelUrl).then(function (channel) {
                    channelListDispatcher({
                        type: FETCH_CHANNELS_SUCCESS,
                        payload: [channel],
                    });
                    channelListDispatcher({
                        type: SET_CURRENT_CHANNEL,
                        payload: channel,
                    });
                }).catch(function () {
                    logger.warning('ChannelListProvider: Active channel not found');
                });
            }
        }
    }, [activeChannelUrl]);
}

var useFetchChannelList = function (_a, _b) {
    var channelSource = _a.channelSource, disableMarkAsDelivered = _a.disableMarkAsDelivered;
    var channelListDispatcher = _b.channelListDispatcher, logger = _b.logger, markAsDeliveredScheduler = _b.markAsDeliveredScheduler;
    return useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var channelList, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(channelSource === null || channelSource === void 0 ? void 0 : channelSource.hasNext)) {
                        logger.info('ChannelList: not able to fetch');
                        return [2 /*return*/];
                    }
                    logger.info('ChannelList: starting fetch');
                    channelListDispatcher({
                        type: FETCH_CHANNELS_START,
                        payload: null,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, channelSource.next()];
                case 2:
                    channelList = _a.sent();
                    logger.info('ChannelList: succeeded fetch', { channelList: channelList });
                    channelListDispatcher({
                        type: FETCH_CHANNELS_SUCCESS,
                        payload: channelList,
                    });
                    if (!disableMarkAsDelivered) {
                        logger.info('ChannelList: mark as delivered to fetched channels');
                        // eslint-disable-next-line no-unused-expressions
                        channelList === null || channelList === void 0 ? void 0 : channelList.forEach(function (channel) {
                            if ((channel === null || channel === void 0 ? void 0 : channel.unreadMessageCount) > 0) {
                                markAsDeliveredScheduler.push(channel);
                            }
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger.error('ChannelList: failed fetch', { error: error_1 });
                    channelListDispatcher({
                        type: FETCH_CHANNELS_FAILURE,
                        payload: error_1,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [
        channelSource,
        disableMarkAsDelivered,
    ]);
};

function useHandleReconnectForChannelList(_a) {
    var isOnline = _a.isOnline, reconnectOnIdle = _a.reconnectOnIdle, logger = _a.logger, sdk = _a.sdk, currentGroupChannel = _a.currentGroupChannel, channelListDispatcher = _a.channelListDispatcher, setChannelSource = _a.setChannelSource, userFilledChannelListQuery = _a.userFilledChannelListQuery, sortChannelList = _a.sortChannelList, disableAutoSelect = _a.disableAutoSelect, markAsDeliveredScheduler = _a.markAsDeliveredScheduler, disableMarkAsDelivered = _a.disableMarkAsDelivered;
    var shouldReconnect = useReconnectOnIdle(isOnline, currentGroupChannel, reconnectOnIdle).shouldReconnect;
    useEffect(function () {
        return function () {
            var _a, _b, _c, _d;
            // state changed from offline to online AND tab is visible
            if (shouldReconnect) {
                logger.info('ChannelList refresh - creating query', { userFilledChannelListQuery: userFilledChannelListQuery });
                var channelListQuery = createChannelListQuery({ sdk: sdk, userFilledChannelListQuery: userFilledChannelListQuery });
                logger.info('ChannelList refresh - created query', channelListQuery);
                setChannelSource(channelListQuery);
                channelListDispatcher({
                    type: INIT_CHANNELS_START,
                    payload: {
                        currentUserId: (_b = (_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : '',
                    },
                });
                if (userFilledChannelListQuery) {
                    logger.info('ChannelList refresh - setting up channelListQuery', channelListQuery);
                    channelListDispatcher({
                        type: CHANNEL_LIST_PARAMS_UPDATED,
                        payload: {
                            channelListQuery: channelListQuery,
                            currentUserId: (_d = (_c = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _c === void 0 ? void 0 : _c.userId) !== null && _d !== void 0 ? _d : '',
                        },
                    });
                }
                logger.info('ChannelList refresh - fetching channels');
                if (channelListQuery.hasNext) {
                    channelListQuery
                        .next()
                        .then(function (channelList) {
                        var _a, _b;
                        logger.info('ChannelList refresh - fetched channels', channelList);
                        var sortedChannelList = channelList;
                        if (sortChannelList && typeof sortChannelList === 'function') {
                            sortedChannelList = sortChannelList(channelList);
                            logger.info('ChannelList refresh - channel list sorted', sortedChannelList);
                        }
                        // select first channel
                        var newCurrentChannel = !disableAutoSelect ? sortedChannelList[0] : null;
                        if (currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url) {
                            var foundChannel = sortedChannelList.find(function (channel) { return (channel.url === currentGroupChannel.url); });
                            if (foundChannel) {
                                newCurrentChannel = foundChannel;
                            }
                        }
                        logger.info('ChannelList refresh - highlight channel', newCurrentChannel);
                        channelListDispatcher({
                            type: REFRESH_CHANNELS_SUCCESS,
                            payload: {
                                channelList: sortedChannelList,
                                currentChannel: newCurrentChannel,
                            },
                        });
                        var canSetMarkAsDelivered = (_b = (_a = sdk === null || sdk === void 0 ? void 0 : sdk.appInfo) === null || _a === void 0 ? void 0 : _a.premiumFeatureList) === null || _b === void 0 ? void 0 : _b.find(function (feature) { return feature === DELIVERY_RECEIPT$1; });
                        if (canSetMarkAsDelivered && !disableMarkAsDelivered) {
                            sortedChannelList.forEach(function (channel) {
                                markAsDeliveredScheduler.push(channel);
                            });
                        }
                    })
                        .catch(function (err) {
                        if (err) {
                            logger.error('ChannelList refresh - could not fetch channels', err);
                            channelListDispatcher({
                                type: INIT_CHANNELS_FAILURE,
                            });
                        }
                    });
                }
                else {
                    logger.info('ChannelList refresh - there are no more channels');
                }
            }
        };
    }, [shouldReconnect]);
}

var ChannelListContext = React__default.createContext({
    disableUserProfile: true,
    allowProfileEdit: true,
    onBeforeCreateChannel: null,
    onThemeChange: null,
    onProfileEditSuccess: null,
    onChannelSelect: null,
    queries: {},
    className: null,
    initialized: false,
    loading: false,
    allChannels: [],
    currentChannel: null,
    channelListQuery: {},
    currentUserId: null,
    channelListDispatcher: null,
    channelSource: null,
    typingChannels: [],
    fetchChannelList: noop,
    reconnectOnIdle: true,
});
var ChannelListProvider = function (props) {
    var _a, _b;
    // destruct props
    var children = props.children, className = props.className, disableUserProfile = props.disableUserProfile, allowProfileEdit = props.allowProfileEdit, queries = props.queries, onProfileEditSuccess = props.onProfileEditSuccess, onThemeChange = props.onThemeChange, onBeforeCreateChannel = props.onBeforeCreateChannel, sortChannelList = props.sortChannelList, overrideInviteUser = props.overrideInviteUser, activeChannelUrl = props.activeChannelUrl, _c = props.isTypingIndicatorEnabled, isTypingIndicatorEnabled = _c === void 0 ? null : _c, _d = props.isMessageReceiptStatusEnabled, isMessageReceiptStatusEnabled = _d === void 0 ? null : _d, reconnectOnIdle = props.reconnectOnIdle;
    // disable autoselect, if activeChannelUrl is provided
    // useActiveChannelUrl should be executed when activeChannelUrl is present
    var disableAutoSelect = (props === null || props === void 0 ? void 0 : props.disableAutoSelect) || !!activeChannelUrl;
    var onChannelSelect = (props === null || props === void 0 ? void 0 : props.onChannelSelect) || noop;
    // fetch store from <SendbirdProvider />
    var globalStore = useSendbirdStateContext();
    var config = globalStore.config, stores = globalStore.stores;
    var sdkStore = stores.sdkStore;
    var pubSub = config.pubSub, logger = config.logger, onUserProfileMessage = config.onUserProfileMessage;
    var markAsDeliveredScheduler = config.markAsDeliveredScheduler, _e = config.disableMarkAsDelivered, disableMarkAsDelivered = _e === void 0 ? false : _e, _f = config.isTypingIndicatorEnabledOnChannelList, isTypingIndicatorEnabledOnChannelList = _f === void 0 ? false : _f, _g = config.isMessageReceiptStatusEnabledOnChannelList, isMessageReceiptStatusEnabledOnChannelList = _g === void 0 ? false : _g, isOnline = config.isOnline;
    var sdk = sdkStore === null || sdkStore === void 0 ? void 0 : sdkStore.sdk;
    var _h = ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.appInfo) !== null && _a !== void 0 ? _a : {}).premiumFeatureList, premiumFeatureList = _h === void 0 ? [] : _h;
    // derive some variables
    // enable if it is true atleast once(both are flase by default)
    var userDefinedDisableUserProfile = disableUserProfile || (config === null || config === void 0 ? void 0 : config.disableUserProfile);
    var userDefinedRenderProfile = config === null || config === void 0 ? void 0 : config.renderUserProfile;
    var enableEditProfile = allowProfileEdit || (config === null || config === void 0 ? void 0 : config.allowProfileEdit);
    var userFilledChannelListQuery = queries === null || queries === void 0 ? void 0 : queries.channelListQuery;
    var userFilledApplicationUserListQuery = queries === null || queries === void 0 ? void 0 : queries.applicationUserListQuery;
    var sdkIntialized = sdkStore === null || sdkStore === void 0 ? void 0 : sdkStore.initialized;
    var _j = useReducer(channelListReducer, initialState), channelListStore = _j[0], channelListDispatcher = _j[1];
    var currentChannel = channelListStore.currentChannel;
    var _k = useState(null), channelSource = _k[0], setChannelSource = _k[1];
    var _l = useState([]), typingChannels = _l[0], setTypingChannels = _l[1];
    useEffect(function () {
        var subscriber = pubSubHandler(pubSub, channelListDispatcher);
        return function () {
            pubSubHandleRemover(subscriber);
        };
    }, [sdkIntialized]);
    useEffect(function () {
        var _a;
        var sdkChannelHandlerId = uuidv4();
        if (sdkIntialized) {
            logger.info('ChannelList: Setup channelHandlers');
            setupChannelList({
                sdk: sdk,
                sdkChannelHandlerId: sdkChannelHandlerId,
                channelListDispatcher: channelListDispatcher,
                setChannelSource: setChannelSource,
                onChannelSelect: onChannelSelect,
                userFilledChannelListQuery: userFilledChannelListQuery,
                logger: logger,
                sortChannelList: sortChannelList,
                disableAutoSelect: disableAutoSelect,
                markAsDeliveredScheduler: markAsDeliveredScheduler,
                disableMarkAsDelivered: disableMarkAsDelivered,
            });
        }
        else {
            logger.info('ChannelList: Removing channelHandlers');
            // remove previous channelHandlers
            if ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.removeGroupChannelHandler) {
                sdk.groupChannel.removeGroupChannelHandler(sdkChannelHandlerId);
            }
            // remove channelSource
            setChannelSource(null);
            // cleanup
            channelListDispatcher({
                type: RESET_CHANNEL_LIST,
                payload: null,
            });
        }
        return function () {
            var _a, _b;
            logger.info('ChannelList: Removing channelHandlers');
            if ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.removeGroupChannelHandler) {
                (_b = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _b === void 0 ? void 0 : _b.removeGroupChannelHandler(sdkChannelHandlerId);
            }
        };
    }, [
        sdkIntialized,
        sortChannelList,
        Object.entries(userFilledChannelListQuery !== null && userFilledChannelListQuery !== void 0 ? userFilledChannelListQuery : {}).map(function (_a) {
            var key = _a[0], value = _a[1];
            return key + value;
        }).join(),
    ]);
    useEffect(function () {
        var _a, _b;
        var typingHandlerId = '';
        if ((_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.addGroupChannelHandler) {
            typingHandlerId = uuidv4();
            var handler = new GroupChannelHandler({
                onTypingStatusUpdated: function (channel) {
                    var _a;
                    var typingMemberCount = (_a = channel === null || channel === void 0 ? void 0 : channel.getTypingUsers()) === null || _a === void 0 ? void 0 : _a.length;
                    var channelList = typingChannels.filter(function (ch) { return ch.url !== channel.url; });
                    if (typingMemberCount > 0) {
                        setTypingChannels(__spreadArray(__spreadArray([], channelList, true), [channel], false));
                    }
                    else {
                        setTypingChannels(channelList);
                    }
                },
                onUnreadMemberStatusUpdated: function (channel) {
                    channelListDispatcher({
                        type: ON_LAST_MESSAGE_UPDATED,
                        payload: channel,
                    });
                },
                onUndeliveredMemberStatusUpdated: function (channel) {
                    channelListDispatcher({
                        type: ON_LAST_MESSAGE_UPDATED,
                        payload: channel,
                    });
                },
                onMessageUpdated: function (channel) {
                    if (channel.isGroupChannel()) {
                        channelListDispatcher({
                            type: ON_LAST_MESSAGE_UPDATED,
                            payload: channel,
                        });
                        sdk.groupChannel.getChannelWithoutCache(channel.url).then(function (ch) {
                            channelListDispatcher({
                                type: ON_LAST_MESSAGE_UPDATED,
                                payload: ch,
                            });
                        });
                    }
                },
                onMentionReceived: function (channel) {
                    if (channel.isGroupChannel()) {
                        channelListDispatcher({
                            type: ON_LAST_MESSAGE_UPDATED,
                            payload: channel,
                        });
                        sdk.groupChannel.getChannelWithoutCache(channel.url).then(function (ch) {
                            channelListDispatcher({
                                type: ON_LAST_MESSAGE_UPDATED,
                                payload: ch,
                            });
                        });
                    }
                },
            });
            (_b = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _b === void 0 ? void 0 : _b.addGroupChannelHandler(typingHandlerId, handler);
        }
        return function () {
            var _a;
            if (((_a = sdk === null || sdk === void 0 ? void 0 : sdk.groupChannel) === null || _a === void 0 ? void 0 : _a.removeGroupChannelHandler) && typingHandlerId !== '') {
                sdk.groupChannel.removeGroupChannelHandler(typingHandlerId);
            }
        };
    }, [(_b = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _b === void 0 ? void 0 : _b.userId]);
    var queries_ = useMemo(function () {
        return {
            applicationUserListQuery: userFilledApplicationUserListQuery,
            channelListQuery: userFilledChannelListQuery,
        };
    }, [userFilledApplicationUserListQuery, userFilledChannelListQuery]);
    var allChannels = channelListStore.allChannels;
    var sortedChannels = sortChannelList && typeof sortChannelList === 'function' ? sortChannelList(allChannels) : allChannels;
    if (sortedChannels.length !== allChannels.length) {
        var warning = "ChannelList: You have removed/added extra channels on sortChannelList\n      this could cause unexpected problems";
        // eslint-disable-next-line no-console
        console.warn(warning, { before: allChannels, after: sortedChannels });
        logger.warning(warning, { before: allChannels, after: sortedChannels });
    }
    // Set current channel (by on_channel_selected event)
    useEffect(function () {
        if (!sdk || !sdk.groupChannel) {
            return;
        }
        // When leaving a channel, tell consumers that the prior channel is no longer selected
        if (!(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url)) {
            onChannelSelect(null);
            return;
        }
        sdk.groupChannel.getChannel(currentChannel.url).then(function (groupChannel) {
            if (groupChannel) {
                onChannelSelect(groupChannel);
            }
            else {
                onChannelSelect(null);
            }
        });
    }, [currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url]);
    // Set active channel (by url)
    useActiveChannelUrl({
        activeChannelUrl: activeChannelUrl,
        channels: sortedChannels,
        sdk: sdk,
    }, {
        logger: logger,
        channelListDispatcher: channelListDispatcher,
    });
    useHandleReconnectForChannelList({
        isOnline: isOnline,
        reconnectOnIdle: reconnectOnIdle,
        logger: logger,
        sdk: sdk,
        currentGroupChannel: currentChannel,
        channelListDispatcher: channelListDispatcher,
        setChannelSource: setChannelSource,
        userFilledChannelListQuery: userFilledChannelListQuery,
        sortChannelList: sortChannelList,
        disableAutoSelect: disableAutoSelect,
        markAsDeliveredScheduler: markAsDeliveredScheduler,
        disableMarkAsDelivered: disableMarkAsDelivered,
    });
    var fetchChannelList = useFetchChannelList({
        channelSource: channelSource,
        disableMarkAsDelivered: disableMarkAsDelivered || !premiumFeatureList.some(function (feature) { return feature === DELIVERY_RECEIPT$1; }),
    }, {
        channelListDispatcher: channelListDispatcher,
        logger: logger,
        markAsDeliveredScheduler: markAsDeliveredScheduler,
    });
    return (React__default.createElement(ChannelListContext.Provider, { value: __assign(__assign({ className: className, disableUserProfile: disableUserProfile, queries: queries_, onProfileEditSuccess: onProfileEditSuccess, onThemeChange: onThemeChange, onBeforeCreateChannel: onBeforeCreateChannel, overrideInviteUser: overrideInviteUser, onChannelSelect: onChannelSelect, sortChannelList: sortChannelList, allowProfileEdit: enableEditProfile, channelListDispatcher: channelListDispatcher, channelSource: channelSource }, channelListStore), { allChannels: sortedChannels, typingChannels: typingChannels, isTypingIndicatorEnabled: isTypingIndicatorEnabled !== null ? isTypingIndicatorEnabled : isTypingIndicatorEnabledOnChannelList, isMessageReceiptStatusEnabled: isMessageReceiptStatusEnabled !== null
                ? isMessageReceiptStatusEnabled
                : isMessageReceiptStatusEnabledOnChannelList, fetchChannelList: fetchChannelList }) },
        React__default.createElement(UserProfileProvider, { disableUserProfile: userDefinedDisableUserProfile !== null && userDefinedDisableUserProfile !== void 0 ? userDefinedDisableUserProfile : config === null || config === void 0 ? void 0 : config.disableUserProfile, renderUserProfile: userDefinedRenderProfile, onUserProfileMessage: onUserProfileMessage },
            React__default.createElement("div", { className: "sendbird-channel-list ".concat(className) }, children))));
};
function useChannelListContext() {
    var context = useContext(ChannelListContext);
    return context;
}

export { ChannelListProvider as C, LEAVE_CHANNEL_SUCCESS as L, SET_CURRENT_CHANNEL as S, useChannelListContext as u };
//# sourceMappingURL=bundle-fD7gUgus.js.map

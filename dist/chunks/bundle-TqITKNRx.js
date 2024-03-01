import { ConnectionHandler } from '@sendbird/chat';
import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { u as uuidv4 } from './bundle-0Kp88b8b.js';
import { a as __awaiter, b as __generator } from './bundle-UnAcr6wX.js';

function useOnlineStatus(sdk, logger) {
    var _a, _b;
    var _c = useState(
    // window is undefined in SSR env
    typeof window !== 'undefined'
        ? ((_b = (_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.onLine) !== null && _b !== void 0 ? _b : true)
        : true), isOnline = _c[0], setIsOnline = _c[1];
    useEffect(function () {
        var uniqueHandlerId = uuidv4();
        try {
            logger.warning('sdk changed', uniqueHandlerId);
            var handler = new ConnectionHandler({
                onDisconnected: function () {
                    setIsOnline(false);
                    logger.warning('onDisconnected', { isOnline: isOnline });
                },
                onReconnectStarted: function () {
                    setIsOnline(false);
                    logger.warning('onReconnectStarted', { isOnline: isOnline });
                },
                onReconnectSucceeded: function () {
                    setIsOnline(true);
                    logger.warning('onReconnectSucceeded', { isOnline: isOnline });
                },
                onReconnectFailed: function () {
                    sdk.reconnect();
                    logger.warning('onReconnectFailed');
                },
            });
            if (sdk === null || sdk === void 0 ? void 0 : sdk.addConnectionHandler) {
                // workaround -> addConnectionHandler invalidates session handler
                // provided through configureSession
                sdk.addConnectionHandler(uniqueHandlerId, handler);
                logger.info('Added ConnectionHandler', uniqueHandlerId);
            }
        }
        catch (_a) {
            //
        }
        return function () {
            try {
                sdk.removeConnectionHandler(uniqueHandlerId);
                logger.info('Removed ConnectionHandler', uniqueHandlerId);
            }
            catch (_a) {
                //
            }
        };
    }, [sdk]);
    useEffect(function () {
        var tryReconnect = function () {
            try {
                logger.warning('Try reconnecting SDK');
                if (sdk.connectionState !== 'OPEN') { // connection is not broken yet
                    sdk.reconnect();
                }
            }
            catch (_a) {
                //
            }
        };
        // addEventListener version
        window.addEventListener('online', tryReconnect);
        return function () {
            window.removeEventListener('online', tryReconnect);
        };
    }, [sdk]);
    // add offline-class to body
    useEffect(function () {
        var body = document.querySelector('body');
        if (!isOnline && !(sdk === null || sdk === void 0 ? void 0 : sdk.isCacheEnabled)) {
            try {
                body.classList.add('sendbird__offline');
                logger.info('Added class sendbird__offline to body');
            }
            catch (e) {
                //
            }
        }
        else {
            try {
                body.classList.remove('sendbird__offline');
                logger.info('Removed class sendbird__offline from body');
            }
            catch (e) {
                //
            }
        }
    }, [isOnline, sdk === null || sdk === void 0 ? void 0 : sdk.isCacheEnabled]);
    return isOnline;
}

var TIMEOUT = 2000;
/*
  * This is a factory function that returns a scheduler.
  * The scheduler is a queue that calls the callback function on intervals.
  * If interval is empty, the callback function is called immediately.
  * If interval is not empty, the callback function is called after the interval.
*/
function schedulerFactory(_a) {
    var logger = _a.logger, timeout = _a.timeout, cb = _a.cb;
    var queue = [];
    var interval = null;
    var push = function (channel) {
        var channelPresent = queue.find(function (c) { return c.url === channel.url; });
        if (!channelPresent) {
            queue.push(channel);
        }
        else {
            logger.info('Channel: Mark as read already in queue', { channel: channel });
        }
        // start the interval if it's not already running
        if (interval) {
            return;
        }
        var item = queue.shift();
        if (item) {
            cb(item);
        }
        interval = setInterval(function () {
            if (queue.length === 0 && interval) {
                clearInterval(interval);
                interval = null;
                return;
            }
            var item = queue.shift();
            if (item) {
                cb(item);
            }
        }, (timeout || TIMEOUT));
    };
    var clear = function () {
        queue = [];
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    };
    return {
        push: push,
        clear: clear,
        getQueue: function () { return queue; },
    };
}

// this hook accepts a callback to run component is unmounted
function useUnmount(callback, deps) {
    if (deps === void 0) { deps = []; }
    useLayoutEffect(function () {
        return function () {
            callback();
        };
    }, deps);
}

function useMarkAsDeliveredScheduler(_a, _b) {
    var _this = this;
    var isConnected = _a.isConnected;
    var logger = _b.logger;
    var markAsDeliveredScheduler = useMemo(function () { return schedulerFactory({
        logger: logger,
        cb: function (channel) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, channel.markAsDelivered()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger.warning('Channel: Mark as delivered failed', { channel: channel, error: error_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    }); }, []);
    useEffect(function () {
        // for simplicity, we clear the queue when the connection is lost
        if (!isConnected) {
            markAsDeliveredScheduler.clear();
        }
    }, [isConnected]);
    useUnmount(function () { markAsDeliveredScheduler.clear(); });
    return markAsDeliveredScheduler;
}

export { useMarkAsDeliveredScheduler as a, useUnmount as b, schedulerFactory as s, useOnlineStatus as u };
//# sourceMappingURL=bundle-TqITKNRx.js.map

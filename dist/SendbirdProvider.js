import { _ as __assign, a as __awaiter, b as __generator, c as __spreadArray } from './chunks/bundle-xhjHZ041.js';
import React__default, { useLayoutEffect, useRef, useEffect, useCallback, useMemo, useState, useReducer } from 'react';
import { UIKitConfigProvider, useUIKitConfig } from '@sendbird/uikit-tools';
import { SendbirdSdkContext } from './withSendbird.js';
import cssVars from 'css-vars-ponyfill';
import { K } from './chunks/bundle-AN6QCsUL.js';
import { U as USER_ACTIONS } from './chunks/bundle-OGlqvU-C.js';
import { s as schedulerFactory, b as useUnmount, u as useOnlineStatus, a as useMarkAsDeliveredScheduler } from './chunks/bundle-6vSqxMNU.js';
import SendbirdChat, { SendbirdProduct, SendbirdPlatform, DeviceOsPlatform } from '@sendbird/chat';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { W as isTextuallyNull } from './chunks/bundle-Jwc7mleJ.js';
import { n as noop } from './chunks/bundle-IDH-OOHE.js';
import { p as pubSubFactory } from './chunks/bundle-ycx-QBOb.js';
import { b as VoicePlayerProvider } from './chunks/bundle-JkSXeub7.js';
import { VoiceRecorderProvider } from './VoiceRecorder/context.js';
import { a as LocalizationProvider } from './chunks/bundle-1inZXcUV.js';
import { u as useMediaQueryContext, M as MediaQueryProvider } from './chunks/bundle-pjLq9qJd.js';
import { g as getStringSet } from './chunks/bundle--MbN9aKT.js';
import { m as DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT, n as VOICE_RECORDER_DEFAULT_MAX, f as VOICE_RECORDER_DEFAULT_MIN } from './chunks/bundle-UKdN0Ihw.js';
import { g as getCaseResolvedReplyType, a as getCaseResolvedThreadReplySelectType } from './chunks/bundle-2FjmmgQK.js';
import { GlobalModalProvider } from './hooks/useModal.js';
export { useSendbirdStateContext } from './useSendbirdStateContext.js';
import './chunks/bundle-BZ3hPsJ8.js';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import './ui/IconButton.js';
import './ui/Button.js';
import './chunks/bundle-sR62lMVk.js';
import './ui/Icon.js';
import './chunks/bundle-V_fO-GlK.js';

var isEmpty = function (obj) {
    if (obj === null || obj === undefined) {
        return true;
    }
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
};
var useTheme = function (overrides) {
    useLayoutEffect(function () {
        if (!isEmpty(overrides)) {
            cssVars({
                variables: __assign({
                    '--sendbird-dark-primary-500': '#4d2aa6',
                    '--sendbird-dark-primary-400': '#6440C4',
                    '--sendbird-dark-primary-300': '#7B53EF',
                    '--sendbird-dark-primary-200': '#9E8CF5',
                    '--sendbird-dark-primary-100': '#E2DFFF',
                    '--sendbird-dark-secondary-500': '#007A7A',
                    '--sendbird-dark-secondary-400': '#189A8D',
                    '--sendbird-dark-secondary-300': '#2EBA9F',
                    '--sendbird-dark-secondary-200': '#6FD6BE',
                    '--sendbird-dark-secondary-100': '#AEF2DC',
                    '--sendbird-dark-information-100': '#b2d9ff',
                    '--sendbird-dark-error-500': '#A30E2D',
                    '--sendbird-dark-error-400': '#C11F41',
                    '--sendbird-dark-error-300': '#E53157',
                    '--sendbird-dark-error-200': '#FF6183',
                    '--sendbird-dark-error-100': '#FFABBD',
                    '--sendbird-dark-background-700': '#000000',
                    '--sendbird-dark-background-600': '#161616',
                    '--sendbird-dark-background-500': '#2C2C2C',
                    '--sendbird-dark-background-400': '#393939',
                    '--sendbird-dark-background-300': '#A8A8A8',
                    '--sendbird-dark-background-200': '#D9D9D9',
                    '--sendbird-dark-background-100': '#F0F0F0',
                    '--sendbird-dark-background-50': '#FFFFFF',
                    '--sendbird-dark-overlay': 'rgba(0, 0, 0, 0.32)',
                    '--sendbird-dark-onlight-01': 'rgba(0, 0, 0, 0.88)',
                    '--sendbird-dark-onlight-02': 'rgba(0, 0, 0, 0.50)',
                    '--sendbird-dark-onlight-03': 'rgba(0, 0, 0, 0.38)',
                    '--sendbird-dark-onlight-04': 'rgba(0, 0, 0, 0.12)',
                    '--sendbird-dark-ondark-01': 'rgba(255, 255, 255, 0.88)',
                    '--sendbird-dark-ondark-02': 'rgba(255, 255, 255, 0.50)',
                    '--sendbird-dark-ondark-03': 'rgba(255, 255, 255, 0.38)',
                    '--sendbird-dark-ondark-04': 'rgba(255, 255, 255, 0.12)',
                    '--sendbird-dark-shadow-01': '0 1px 5px 0 rgba(33, 34, 66, 0.04), 0 0 3px 0 rgba(0, 0, 0, 0.08), 0 2px 1px 0 rgba(0, 0, 0, 0.12)',
                    '--sendbird-dark-shadow-02': '0 3px 5px -3px rgba(33, 34, 66, 0.04), 0 3px 14px 2px rgba(0, 0, 0, 0.08), 0 8px 10px 1px rgba(0, 0, 0, 0.12)',
                    '--sendbird-dark-shadow-03': '0 6px 10px -5px rgba(0, 0, 0, 0.04), 0 6px 30px 5px rgba(0, 0, 0, 0.08), 0 16px 24px 2px rgba(0, 0, 0, 0.12)',
                    '--sendbird-dark-shadow-04': '0 9px 15px -7px rgba(0, 0, 0, 0.04), 0 9px 46px 8px rgba(0, 0, 0, 0.08), 0 24px 38px 3px rgba(0, 0, 0, 0.12)',
                    '--sendbird-dark-shadow-message-input': '0 1px 5px 0 rgba(33, 34, 66, 0.12), 0 0 1px 0 rgba(33, 34, 66, 0.16), 0 2px 1px 0 rgba(33, 34, 66, 0.08), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
                    '--sendbird-light-primary-500': '#4d2aa6',
                    '--sendbird-light-primary-400': '#6440C4',
                    '--sendbird-light-primary-300': '#7B53EF',
                    '--sendbird-light-primary-200': '#9E8CF5',
                    '--sendbird-light-primary-100': '#E2DFFF',
                    '--sendbird-light-secondary-500': '#007A7A',
                    '--sendbird-light-secondary-400': '#189A8D',
                    '--sendbird-light-secondary-300': '#2EBA9F',
                    '--sendbird-light-secondary-200': '#6FD6BE',
                    '--sendbird-light-secondary-100': '#AEF2DC',
                    '--sendbird-light-information-100': '#b2d9ff',
                    '--sendbird-light-error-500': '#A30E2D',
                    '--sendbird-light-error-400': '#C11F41',
                    '--sendbird-light-error-300': '#E53157',
                    '--sendbird-light-error-200': '#FF6183',
                    '--sendbird-light-error-100': '#FFABBD',
                    '--sendbird-light-background-700': '#000000',
                    '--sendbird-light-background-600': '#161616',
                    '--sendbird-light-background-500': '#2C2C2C',
                    '--sendbird-light-background-400': '#393939',
                    '--sendbird-light-background-300': '#A8A8A8',
                    '--sendbird-light-background-200': '#D9D9D9',
                    '--sendbird-light-background-100': '#F0F0F0',
                    '--sendbird-light-background-50': ' #FFFFFF',
                    '--sendbird-light-overlay': 'rgba(0, 0, 0, 0.32)',
                    '--sendbird-light-onlight-01': 'rgba(0, 0, 0, 0.88)',
                    '--sendbird-light-onlight-02': 'rgba(0, 0, 0, 0.50)',
                    '--sendbird-light-onlight-03': 'rgba(0, 0, 0, 0.38)',
                    '--sendbird-light-onlight-04': 'rgba(0, 0, 0, 0.12)',
                    '--sendbird-light-ondark-01': 'rgba(255, 255, 255, 0.88)',
                    '--sendbird-light-ondark-02': 'rgba(255, 255, 255, 0.50)',
                    '--sendbird-light-ondark-03': 'rgba(255, 255, 255, 0.38)',
                    '--sendbird-light-ondark-04': 'rgba(255, 255, 255, 0.12)',
                    '--sendbird-light-shadow-01': '0 1px 5px 0 rgba(33, 34, 66, 0.04), 0 0 3px 0 rgba(0, 0, 0, 0.08), 0 2px 1px 0 rgba(0, 0, 0, 0.12)',
                    '--sendbird-light-shadow-02': '0 3px 5px -3px rgba(33, 34, 66, 0.04), 0 3px 14px 2px rgba(0, 0, 0, 0.08), 0 8px 10px 1px rgba(0, 0, 0, 0.12)',
                    '--sendbird-light-shadow-03': '0 6px 10px -5px rgba(0, 0, 0, 0.04), 0 6px 30px 5px rgba(0, 0, 0, 0.08), 0 16px 24px 2px rgba(0, 0, 0, 0.12)',
                    '--sendbird-light-shadow-04': '0 9px 15px -7px rgba(0, 0, 0, 0.04), 0 9px 46px 8px rgba(0, 0, 0, 0.08), 0 24px 38px 3px rgba(0, 0, 0, 0.12)',
                    '--sendbird-light-shadow-message-input': '0 1px 5px 0 rgba(33, 34, 66, 0.12), 0 0 1px 0 rgba(33, 34, 66, 0.16), 0 2px 1px 0 rgba(33, 34, 66, 0.08), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
                }, overrides),
            });
        }
    }, [overrides]);
};

var SDK_ACTIONS = {
    INIT_SDK: 'INIT_SDK',
    SET_SDK_LOADING: 'SET_SDK_LOADING',
    RESET_SDK: 'RESET_SDK',
    SDK_ERROR: 'SDK_ERROR',
};

var initialState$1 = {
    initialized: false,
    loading: false,
    sdk: {},
    error: false,
};

function reducer$1(state, action) {
    return K(action)
        .with({ type: SDK_ACTIONS.SET_SDK_LOADING }, function (_a) {
        var payload = _a.payload;
        return __assign(__assign({}, state), { initialized: false, loading: payload });
    })
        .with({ type: SDK_ACTIONS.SDK_ERROR }, function () {
        return __assign(__assign({}, state), { initialized: false, loading: false, error: true });
    })
        .with({ type: SDK_ACTIONS.INIT_SDK }, function (_a) {
        var payload = _a.payload;
        return {
            sdk: payload,
            initialized: true,
            loading: false,
            error: false,
        };
    })
        .with({ type: SDK_ACTIONS.RESET_SDK }, function () {
        return initialState$1;
    })
        .otherwise(function () {
        return state;
    });
}

var initialState = {
    initialized: false,
    loading: false,
    user: {},
};

function reducer(state, action) {
    return K(action)
        .with({ type: USER_ACTIONS.INIT_USER }, function (_a) {
        var payload = _a.payload;
        return {
            initialized: true,
            loading: false,
            user: payload,
        };
    })
        .with({ type: USER_ACTIONS.RESET_USER }, function () {
        return initialState;
    })
        .with({ type: USER_ACTIONS.UPDATE_USER_INFO }, function (_a) {
        var payload = _a.payload;
        return __assign(__assign({}, state), { user: payload });
    })
        .otherwise(function () {
        return state;
    });
}

function disconnectSdk(_a) {
    var sdkDispatcher = _a.sdkDispatcher, userDispatcher = _a.userDispatcher, sdk = _a.sdk;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, new Promise(function (resolve) {
                    sdkDispatcher({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
                    if (sdk === null || sdk === void 0 ? void 0 : sdk.disconnect) {
                        sdk.disconnect()
                            .then(function () {
                            sdkDispatcher({ type: SDK_ACTIONS.RESET_SDK });
                            userDispatcher({ type: USER_ACTIONS.RESET_USER });
                        })
                            .finally(function () {
                            resolve(true);
                        });
                    }
                    else {
                        resolve(true);
                    }
                })];
        });
    });
}

var APP_VERSION_STRING = '3.12.1';
var INIT_SDK = SDK_ACTIONS.INIT_SDK, SET_SDK_LOADING = SDK_ACTIONS.SET_SDK_LOADING, RESET_SDK = SDK_ACTIONS.RESET_SDK, SDK_ERROR = SDK_ACTIONS.SDK_ERROR;
var INIT_USER = USER_ACTIONS.INIT_USER, UPDATE_USER_INFO = USER_ACTIONS.UPDATE_USER_INFO, RESET_USER = USER_ACTIONS.RESET_USER;
function getMissingParamError(_a) {
    var userId = _a.userId, appId = _a.appId;
    return "SendbirdProvider | useConnect/setupConnection/Connection failed UserId: ".concat(userId, " or appId: ").concat(appId, " missing");
}
function getConnectSbError(error) {
    return "SendbirdProvider | useConnect/setupConnection/Connection failed. ".concat((error === null || error === void 0 ? void 0 : error.code) || '', " ").concat((error === null || error === void 0 ? void 0 : error.message) || '');
}
function setUpParams(_a) {
    var appId = _a.appId, customApiHost = _a.customApiHost, customWebSocketHost = _a.customWebSocketHost, _b = _a.sdkInitParams, sdkInitParams = _b === void 0 ? {} : _b;
    var params = Object.assign(sdkInitParams, {
        appId: appId,
        modules: [new GroupChannelModule(), new OpenChannelModule()],
        newInstance: true,
        localCacheEnabled: true,
    });
    if (customApiHost)
        params.customApiHost = customApiHost;
    if (customWebSocketHost)
        params.customWebSocketHost = customWebSocketHost;
    return SendbirdChat.init(params);
}
// Steps
// 1. Check if minimum userID/appID is provided
//  1.a. If not, throw error > !reject
//  1.b. If yes, continue
// 2. Set up params with custom host if provided
// 3. Set up session handler if provided
// 4. Set up version
// 5. Connect to Sendbird -> either using user ID or (user ID + access token)
// 6. If connected, connectCbSucess
//  6.a check if nickname is to be updated -> no > !resolve immediately
//  6.b check if nickname is to be updated -> yes > update nickname > !resolve
// 7. If not connected, connectCbError > !reject
function setUpConnection(_a) {
    var logger = _a.logger, sdkDispatcher = _a.sdkDispatcher, userDispatcher = _a.userDispatcher, initDashboardConfigs = _a.initDashboardConfigs, userId = _a.userId, appId = _a.appId, customApiHost = _a.customApiHost, customWebSocketHost = _a.customWebSocketHost, configureSession = _a.configureSession, nickname = _a.nickname, profileUrl = _a.profileUrl, accessToken = _a.accessToken, isUserIdUsedForNickname = _a.isUserIdUsedForNickname, sdkInitParams = _a.sdkInitParams, customExtensionParams = _a.customExtensionParams, _b = _a.isMobile, isMobile = _b === void 0 ? false : _b, eventHandlers = _a.eventHandlers;
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_c) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                    (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/setupConnection/init', { userId: userId, appId: appId });
                    var onConnectionFailed = (_b = eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.connection) === null || _b === void 0 ? void 0 : _b.onFailed;
                    sdkDispatcher({ type: SET_SDK_LOADING, payload: true });
                    if (userId && appId) {
                        var newSdk_1 = setUpParams({
                            appId: appId,
                            customApiHost: customApiHost,
                            customWebSocketHost: customWebSocketHost,
                            sdkInitParams: sdkInitParams,
                        });
                        if (configureSession && typeof configureSession === 'function') {
                            var sessionHandler = configureSession(newSdk_1);
                            (_c = logger === null || logger === void 0 ? void 0 : logger.info) === null || _c === void 0 ? void 0 : _c.call(logger, 'SendbirdProvider | useConnect/setupConnection/configureSession', sessionHandler);
                            newSdk_1.setSessionHandler(sessionHandler);
                        }
                        (_d = logger === null || logger === void 0 ? void 0 : logger.info) === null || _d === void 0 ? void 0 : _d.call(logger, 'SendbirdProvider | useConnect/setupConnection/setVersion', { version: APP_VERSION_STRING });
                        /**
                         * Keep optional chaining to the addSendbirdExtensions
                         * for supporting the ChatSDK v4.9.5 or less
                         */
                        (_e = newSdk_1 === null || newSdk_1 === void 0 ? void 0 : newSdk_1.addSendbirdExtensions) === null || _e === void 0 ? void 0 : _e.call(newSdk_1, [
                            {
                                product: (_f = SendbirdProduct === null || SendbirdProduct === void 0 ? void 0 : SendbirdProduct.UIKIT_CHAT) !== null && _f !== void 0 ? _f : 'uikit-chat',
                                version: APP_VERSION_STRING,
                                platform: (_g = SendbirdPlatform === null || SendbirdPlatform === void 0 ? void 0 : SendbirdPlatform.JS) !== null && _g !== void 0 ? _g : 'js',
                            },
                        ], {
                            platform: (isMobile
                                ? (_h = DeviceOsPlatform === null || DeviceOsPlatform === void 0 ? void 0 : DeviceOsPlatform.MOBILE_WEB) !== null && _h !== void 0 ? _h : 'mobile_web'
                                : (_j = DeviceOsPlatform === null || DeviceOsPlatform === void 0 ? void 0 : DeviceOsPlatform.WEB) !== null && _j !== void 0 ? _j : 'web'),
                        }, customExtensionParams);
                        newSdk_1.addExtension('sb_uikit', APP_VERSION_STRING);
                        var connectCbSucess_1 = function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/setupConnection/connectCbSucess', user);
                                sdkDispatcher({ type: INIT_SDK, payload: newSdk_1 });
                                userDispatcher({ type: INIT_USER, payload: user });
                                initDashboardConfigs(newSdk_1)
                                    .then(function (config) {
                                    var _a;
                                    (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration success', {
                                        config: config,
                                    });
                                })
                                    .catch(function (error) {
                                    var _a;
                                    (_a = logger === null || logger === void 0 ? void 0 : logger.error) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration failed', {
                                        error: error,
                                    });
                                });
                                // use nickname/profileUrl if provided
                                // or set userID as nickname
                                if ((nickname !== user.nickname || profileUrl !== user.profileUrl)
                                    && !(isTextuallyNull(nickname) && isTextuallyNull(profileUrl))) {
                                    (_b = logger === null || logger === void 0 ? void 0 : logger.info) === null || _b === void 0 ? void 0 : _b.call(logger, 'SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo', {
                                        nickname: nickname,
                                        profileUrl: profileUrl,
                                    });
                                    newSdk_1.updateCurrentUserInfo({
                                        nickname: nickname || user.nickname || (isUserIdUsedForNickname ? user.userId : ''),
                                        profileUrl: profileUrl || user.profileUrl,
                                    }).then(function (namedUser) {
                                        var _a;
                                        (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo success', {
                                            nickname: nickname,
                                            profileUrl: profileUrl,
                                        });
                                        userDispatcher({ type: UPDATE_USER_INFO, payload: namedUser });
                                    }).finally(function () {
                                        resolve();
                                    });
                                }
                                else {
                                    resolve();
                                }
                                return [2 /*return*/];
                            });
                        }); };
                        var connectCbError_1 = function (e) {
                            var _a;
                            var errorMessage = getConnectSbError(e);
                            (_a = logger === null || logger === void 0 ? void 0 : logger.error) === null || _a === void 0 ? void 0 : _a.call(logger, errorMessage, {
                                e: e,
                                appId: appId,
                                userId: userId,
                            });
                            sdkDispatcher({ type: RESET_SDK });
                            userDispatcher({ type: RESET_USER });
                            sdkDispatcher({ type: SDK_ERROR });
                            onConnectionFailed === null || onConnectionFailed === void 0 ? void 0 : onConnectionFailed(e);
                            // exit promise with error
                            reject(errorMessage);
                        };
                        (_k = logger === null || logger === void 0 ? void 0 : logger.info) === null || _k === void 0 ? void 0 : _k.call(logger, "SendbirdProvider | useConnect/setupConnection/connect connecting using ".concat(accessToken !== null && accessToken !== void 0 ? accessToken : userId));
                        newSdk_1.connect(userId, accessToken)
                            .then(function (res) { return connectCbSucess_1(res); })
                            .catch(function (err) { return connectCbError_1(err); });
                    }
                    else {
                        var errorMessage = getMissingParamError({ userId: userId, appId: appId });
                        sdkDispatcher({ type: SDK_ERROR });
                        onConnectionFailed === null || onConnectionFailed === void 0 ? void 0 : onConnectionFailed({ message: errorMessage });
                        (_l = logger === null || logger === void 0 ? void 0 : logger.error) === null || _l === void 0 ? void 0 : _l.call(logger, errorMessage);
                        // exit promise with error
                        reject(errorMessage);
                    }
                })];
        });
    });
}

function connect(_a) {
    var logger = _a.logger, sdkDispatcher = _a.sdkDispatcher, userDispatcher = _a.userDispatcher, initDashboardConfigs = _a.initDashboardConfigs, userId = _a.userId, appId = _a.appId, customApiHost = _a.customApiHost, customWebSocketHost = _a.customWebSocketHost, configureSession = _a.configureSession, nickname = _a.nickname, profileUrl = _a.profileUrl, accessToken = _a.accessToken, sdk = _a.sdk, sdkInitParams = _a.sdkInitParams, customExtensionParams = _a.customExtensionParams, isMobile = _a.isMobile, eventHandlers = _a.eventHandlers, isUserIdUsedForNickname = _a.isUserIdUsedForNickname;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, disconnectSdk({
                        logger: logger,
                        sdkDispatcher: sdkDispatcher,
                        userDispatcher: userDispatcher,
                        sdk: sdk,
                    })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, setUpConnection({
                            logger: logger,
                            sdkDispatcher: sdkDispatcher,
                            userDispatcher: userDispatcher,
                            initDashboardConfigs: initDashboardConfigs,
                            userId: userId,
                            appId: appId,
                            customApiHost: customApiHost,
                            customWebSocketHost: customWebSocketHost,
                            configureSession: configureSession,
                            nickname: nickname,
                            profileUrl: profileUrl,
                            accessToken: accessToken,
                            sdkInitParams: sdkInitParams,
                            customExtensionParams: customExtensionParams,
                            isMobile: isMobile,
                            eventHandlers: eventHandlers,
                            isUserIdUsedForNickname: isUserIdUsedForNickname,
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}

function useConnect(triggerTypes, staticTypes) {
    var _this = this;
    var _a;
    var userId = triggerTypes.userId, appId = triggerTypes.appId, accessToken = triggerTypes.accessToken, isMobile = triggerTypes.isMobile, isUserIdUsedForNickname = triggerTypes.isUserIdUsedForNickname;
    var logger = staticTypes.logger, nickname = staticTypes.nickname, profileUrl = staticTypes.profileUrl, configureSession = staticTypes.configureSession, customApiHost = staticTypes.customApiHost, customWebSocketHost = staticTypes.customWebSocketHost, sdk = staticTypes.sdk, sdkDispatcher = staticTypes.sdkDispatcher, userDispatcher = staticTypes.userDispatcher, initDashboardConfigs = staticTypes.initDashboardConfigs, sdkInitParams = staticTypes.sdkInitParams, customExtensionParams = staticTypes.customExtensionParams, eventHandlers = staticTypes.eventHandlers;
    (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect', __assign(__assign({}, triggerTypes), staticTypes));
    // Note: This is a workaround to prevent the creation of multiple SDK instances when React strict mode is enabled.
    var connectDeps = useRef({
        appId: '',
        userId: '',
    });
    useEffect(function () {
        var _a;
        (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/useEffect', { userId: userId, appId: appId, accessToken: accessToken });
        if (connectDeps.current.appId === appId && connectDeps.current.userId === userId) {
            return;
        }
        else {
            connectDeps.current = { appId: appId, userId: userId };
        }
        connect({
            userId: userId,
            appId: appId,
            accessToken: accessToken,
            logger: logger,
            nickname: nickname,
            profileUrl: profileUrl,
            configureSession: configureSession,
            customApiHost: customApiHost,
            customWebSocketHost: customWebSocketHost,
            sdk: sdk,
            sdkDispatcher: sdkDispatcher,
            userDispatcher: userDispatcher,
            initDashboardConfigs: initDashboardConfigs,
            isUserIdUsedForNickname: isUserIdUsedForNickname,
            sdkInitParams: sdkInitParams,
            customExtensionParams: customExtensionParams,
            isMobile: isMobile,
            eventHandlers: eventHandlers,
        }).catch(function (error) {
            var _a;
            (_a = logger === null || logger === void 0 ? void 0 : logger.error) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/useEffect', error);
        });
    }, [userId, appId]);
    var reconnect = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'SendbirdProvider | useConnect/reconnect/useCallback', { sdk: sdk });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, connect({
                            userId: userId,
                            appId: appId,
                            accessToken: accessToken,
                            logger: logger,
                            nickname: nickname,
                            profileUrl: profileUrl,
                            configureSession: configureSession,
                            customApiHost: customApiHost,
                            customWebSocketHost: customWebSocketHost,
                            sdk: sdk,
                            sdkDispatcher: sdkDispatcher,
                            userDispatcher: userDispatcher,
                            initDashboardConfigs: initDashboardConfigs,
                            isUserIdUsedForNickname: isUserIdUsedForNickname,
                            sdkInitParams: sdkInitParams,
                            customExtensionParams: customExtensionParams,
                            isMobile: isMobile,
                            eventHandlers: eventHandlers,
                        })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    (_b = logger === null || logger === void 0 ? void 0 : logger.error) === null || _b === void 0 ? void 0 : _b.call(logger, 'SendbirdProvider | useConnect/reconnect/useCallback', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [sdk]);
    return reconnect;
}

// Logger, pretty much explains it
// in SendbirdProvider
// const [logger, setLogger] = useState(LoggerFactory(logLevel));
var LOG_LEVELS = {
    DEBUG: 'debug',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
    ALL: 'all',
};
var colorLog = function (level) {
    switch (level) {
        case LOG_LEVELS.WARNING:
            return ('color: Orange');
        case LOG_LEVELS.ERROR:
            return ('color: Red');
        default:
            return ('color: Gray');
    }
};
var printLog = function (_a) {
    var level = _a.level, title = _a.title, _b = _a.description, description = _b === void 0 ? '' : _b, _c = _a.payload, payload = _c === void 0 ? [] : _c;
    // eslint-disable-next-line no-console
    console.log.apply(console, __spreadArray(["%c SendbirdUIKit | ".concat(level, " | ").concat(new Date().toISOString(), " | ").concat(title, " ").concat(description && '|'), colorLog(level), description], payload, false));
};
var getDefaultLogger = function () { return ({
    info: noop,
    error: noop,
    warning: noop,
}); };
var LoggerFactory = function (lvl, customInterface) {
    var logInterface = customInterface || printLog;
    var lvlArray = Array.isArray(lvl) ? lvl : [lvl];
    var applyLog = function (lgLvl) { return function (title, description) {
        var payload = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            payload[_i - 2] = arguments[_i];
        }
        return logInterface({
            level: lgLvl,
            title: title,
            description: description,
            payload: payload,
        });
    }; };
    return lvlArray.reduce(function (accumulator, currentLvl) {
        if (currentLvl === LOG_LEVELS.DEBUG || currentLvl === LOG_LEVELS.ALL) {
            return (__assign(__assign({}, accumulator), { info: applyLog(LOG_LEVELS.INFO), error: applyLog(LOG_LEVELS.ERROR), warning: applyLog(LOG_LEVELS.WARNING) }));
        }
        if (currentLvl === LOG_LEVELS.INFO) {
            return (__assign(__assign({}, accumulator), { info: applyLog(LOG_LEVELS.INFO) }));
        }
        if (currentLvl === LOG_LEVELS.ERROR) {
            return (__assign(__assign({}, accumulator), { error: applyLog(LOG_LEVELS.ERROR) }));
        }
        if (currentLvl === LOG_LEVELS.WARNING) {
            return (__assign(__assign({}, accumulator), { warning: applyLog(LOG_LEVELS.WARNING) }));
        }
        return __assign({}, accumulator);
    }, getDefaultLogger());
};
// TODO: Make this to hook, useLogger

function useAppendDomNode(ids, rootSelector) {
    if (ids === void 0) { ids = []; }
    if (rootSelector === void 0) { rootSelector = 'unknown'; }
    useEffect(function () {
        var root = document.querySelector(rootSelector);
        if (root) {
            ids.forEach(function (id) {
                var elem = document.createElement('div');
                elem.setAttribute('id', id);
                root.appendChild(elem);
            });
        }
        return function () {
            if (root) {
                ids.forEach(function (id) {
                    var target = document.getElementById(id);
                    if (target)
                        root.removeChild(target);
                });
            }
        };
    }, []);
}

var VoiceMessageProvider = function (_a) {
    var children = _a.children;
    return (React__default.createElement(VoicePlayerProvider, null,
        React__default.createElement(VoiceRecorderProvider, null, children)));
};

function uikitConfigMapper(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    var legacyConfig = _a.legacyConfig, _4 = _a.uikitOptions, uikitOptions = _4 === void 0 ? {} : _4;
    var replyType = legacyConfig.replyType, isMentionEnabled = legacyConfig.isMentionEnabled, isReactionEnabled = legacyConfig.isReactionEnabled, disableUserProfile = legacyConfig.disableUserProfile, isVoiceMessageEnabled = legacyConfig.isVoiceMessageEnabled, isTypingIndicatorEnabledOnChannelList = legacyConfig.isTypingIndicatorEnabledOnChannelList, isMessageReceiptStatusEnabledOnChannelList = legacyConfig.isMessageReceiptStatusEnabledOnChannelList, showSearchIcon = legacyConfig.showSearchIcon;
    return {
        common: {
            enableUsingDefaultUserProfile: (_c = (_b = uikitOptions.common) === null || _b === void 0 ? void 0 : _b.enableUsingDefaultUserProfile) !== null && _c !== void 0 ? _c : (typeof disableUserProfile === 'boolean'
                ? !disableUserProfile
                : undefined),
        },
        groupChannel: {
            enableOgtag: (_d = uikitOptions.groupChannel) === null || _d === void 0 ? void 0 : _d.enableOgtag,
            enableMention: (_f = (_e = uikitOptions.groupChannel) === null || _e === void 0 ? void 0 : _e.enableMention) !== null && _f !== void 0 ? _f : isMentionEnabled,
            enableReactions: (_h = (_g = uikitOptions.groupChannel) === null || _g === void 0 ? void 0 : _g.enableReactions) !== null && _h !== void 0 ? _h : isReactionEnabled,
            enableTypingIndicator: (_j = uikitOptions.groupChannel) === null || _j === void 0 ? void 0 : _j.enableTypingIndicator,
            enableVoiceMessage: (_l = (_k = uikitOptions.groupChannel) === null || _k === void 0 ? void 0 : _k.enableVoiceMessage) !== null && _l !== void 0 ? _l : isVoiceMessageEnabled,
            replyType: (_o = (_m = uikitOptions.groupChannel) === null || _m === void 0 ? void 0 : _m.replyType) !== null && _o !== void 0 ? _o : (replyType != null ? getCaseResolvedReplyType(replyType).lowerCase : undefined),
            threadReplySelectType: (_p = uikitOptions.groupChannel) === null || _p === void 0 ? void 0 : _p.threadReplySelectType,
            input: {
                enableDocument: (_r = (_q = uikitOptions.groupChannel) === null || _q === void 0 ? void 0 : _q.input) === null || _r === void 0 ? void 0 : _r.enableDocument,
            },
            typingIndicatorTypes: (_s = uikitOptions.groupChannel) === null || _s === void 0 ? void 0 : _s.typingIndicatorTypes,
            enableFeedback: (_t = uikitOptions.groupChannel) === null || _t === void 0 ? void 0 : _t.enableFeedback,
            enableSuggestedReplies: (_u = uikitOptions.groupChannel) === null || _u === void 0 ? void 0 : _u.enableSuggestedReplies,
        },
        groupChannelList: {
            enableTypingIndicator: (_w = (_v = uikitOptions.groupChannelList) === null || _v === void 0 ? void 0 : _v.enableTypingIndicator) !== null && _w !== void 0 ? _w : isTypingIndicatorEnabledOnChannelList,
            enableMessageReceiptStatus: (_y = (_x = uikitOptions.groupChannelList) === null || _x === void 0 ? void 0 : _x.enableMessageReceiptStatus) !== null && _y !== void 0 ? _y : isMessageReceiptStatusEnabledOnChannelList,
        },
        groupChannelSettings: {
            enableMessageSearch: (_0 = (_z = uikitOptions.groupChannelSettings) === null || _z === void 0 ? void 0 : _z.enableMessageSearch) !== null && _0 !== void 0 ? _0 : showSearchIcon,
        },
        openChannel: {
            enableOgtag: (_1 = uikitOptions.openChannel) === null || _1 === void 0 ? void 0 : _1.enableOgtag,
            input: {
                enableDocument: (_3 = (_2 = uikitOptions.openChannel) === null || _2 === void 0 ? void 0 : _2.input) === null || _3 === void 0 ? void 0 : _3.enableDocument,
            },
        },
    };
}

function useMarkAsReadScheduler(_a, _b) {
    var isConnected = _a.isConnected;
    var logger = _b.logger;
    var markAsReadScheduler = useMemo(function () { return schedulerFactory({
        logger: logger,
        cb: function (channel) {
            try {
                channel.markAsRead();
            }
            catch (error) {
                logger.warning('Channel: Mark as delivered failed', { channel: channel, error: error });
            }
        },
    }); }, []);
    useEffect(function () {
        // for simplicity, we clear the queue when the connection is lost
        if (!isConnected) {
            markAsReadScheduler.clear();
        }
    }, [isConnected]);
    useUnmount(function () { markAsReadScheduler.clear(); });
    return markAsReadScheduler;
}

var EmojiManager = /** @class */ (function () {
    function EmojiManager(props) {
        var _this = this;
        var _a;
        var sdk = props.sdk, logger = props.logger;
        (_a = sdk === null || sdk === void 0 ? void 0 : sdk.getAllEmoji) === null || _a === void 0 ? void 0 : _a.call(sdk).then(function (emojiContainer) {
            _this._emojiContainer = emojiContainer;
            logger === null || logger === void 0 ? void 0 : logger.info('EmojiManager | Succeeded getting all emojis. ', emojiContainer);
        }).catch(function () {
            logger === null || logger === void 0 ? void 0 : logger.warning('EmojiManager | Failed getting all emojis.');
        });
    }
    Object.defineProperty(EmojiManager.prototype, "AllEmojisAsArray", {
        get: function () {
            return this._emojiContainer.emojiCategories.flatMap(function (category) { return category.emojis; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmojiManager.prototype, "AllEmojisAsMap", {
        get: function () {
            return this._emojiContainer.emojiCategories
                .flatMap(function (category) { return category.emojis; })
                .reduce(function (map, emoji) {
                map.set(emoji.key, emoji.url);
                return map;
            }, new Map());
        },
        enumerable: false,
        configurable: true
    });
    EmojiManager.prototype.getAllEmojis = function (type) {
        var _this = this;
        return K(type)
            .when(function (type) { return ['array', 'arr'].includes(type); }, function () { return _this.AllEmojisAsArray; })
            .when(function (type) { return ['map'].includes(type); }, function () { return _this.AllEmojisAsMap; })
            .otherwise(function () { return _this.AllEmojisAsArray; });
    };
    EmojiManager.prototype.getEmojiUrl = function (reactionKey) {
        var _a;
        return (_a = this.AllEmojisAsArray.find(function (emoji) { return emoji.key === reactionKey; }).url) !== null && _a !== void 0 ? _a : '';
    };
    Object.defineProperty(EmojiManager.prototype, "emojiContainer", {
        get: function () {
            return this._emojiContainer;
        },
        enumerable: false,
        configurable: true
    });
    return EmojiManager;
}());

var uikitConfigStorage = {
    getItem: function (key) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = localStorage.getItem(key)) !== null && _a !== void 0 ? _a : null];
            });
        });
    },
    setItem: function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, localStorage.setItem(key, value)];
            });
        });
    },
};

function SendbirdProvider(props) {
    var localConfigs = uikitConfigMapper({
        legacyConfig: {
            replyType: props.replyType,
            isMentionEnabled: props.isMentionEnabled,
            isReactionEnabled: props.isReactionEnabled,
            disableUserProfile: props.disableUserProfile,
            isVoiceMessageEnabled: props.isVoiceMessageEnabled,
            isTypingIndicatorEnabledOnChannelList: props.isTypingIndicatorEnabledOnChannelList,
            isMessageReceiptStatusEnabledOnChannelList: props.isMessageReceiptStatusEnabledOnChannelList,
            showSearchIcon: props.showSearchIcon,
        },
        uikitOptions: props.uikitOptions,
    });
    return (React__default.createElement(UIKitConfigProvider, { storage: uikitConfigStorage, localConfigs: {
            common: localConfigs === null || localConfigs === void 0 ? void 0 : localConfigs.common,
            groupChannel: {
                channel: localConfigs === null || localConfigs === void 0 ? void 0 : localConfigs.groupChannel,
                channelList: localConfigs === null || localConfigs === void 0 ? void 0 : localConfigs.groupChannelList,
                setting: localConfigs === null || localConfigs === void 0 ? void 0 : localConfigs.groupChannelSettings,
            },
            openChannel: {
                channel: localConfigs === null || localConfigs === void 0 ? void 0 : localConfigs.openChannel,
            },
        } },
        React__default.createElement(SendbirdSDK, __assign({}, props))));
}
var SendbirdSDK = function (_a) {
    var _b, _c, _d;
    var appId = _a.appId, userId = _a.userId, children = _a.children, accessToken = _a.accessToken, customApiHost = _a.customApiHost, customWebSocketHost = _a.customWebSocketHost, _e = _a.configureSession, configureSession = _e === void 0 ? null : _e, _f = _a.theme, theme = _f === void 0 ? 'light' : _f, _g = _a.config, config = _g === void 0 ? {} : _g, _h = _a.nickname, nickname = _h === void 0 ? '' : _h, _j = _a.colorSet, colorSet = _j === void 0 ? null : _j, _k = _a.stringSet, stringSet = _k === void 0 ? null : _k, _l = _a.dateLocale, dateLocale = _l === void 0 ? null : _l, _m = _a.profileUrl, profileUrl = _m === void 0 ? '' : _m, voiceRecord = _a.voiceRecord, _o = _a.userListQuery, userListQuery = _o === void 0 ? null : _o, _p = _a.imageCompression, imageCompression = _p === void 0 ? {} : _p, _q = _a.allowProfileEdit, allowProfileEdit = _q === void 0 ? false : _q, _r = _a.disableMarkAsDelivered, disableMarkAsDelivered = _r === void 0 ? false : _r, _s = _a.renderUserProfile, renderUserProfile = _s === void 0 ? null : _s, _t = _a.onUserProfileMessage, onUserProfileMessage = _t === void 0 ? null : _t, _u = _a.breakpoint, breakpoint = _u === void 0 ? false : _u, _v = _a.isUserIdUsedForNickname, isUserIdUsedForNickname = _v === void 0 ? true : _v, sdkInitParams = _a.sdkInitParams, customExtensionParams = _a.customExtensionParams, _w = _a.isMultipleFilesMessageEnabled, isMultipleFilesMessageEnabled = _w === void 0 ? false : _w, eventHandlers = _a.eventHandlers;
    var _x = config.logLevel, logLevel = _x === void 0 ? '' : _x, _y = config.userMention, userMention = _y === void 0 ? {} : _y, _z = config.isREMUnitEnabled, isREMUnitEnabled = _z === void 0 ? false : _z, customPubSub = config.pubSub;
    var isMobile = useMediaQueryContext().isMobile;
    var _0 = useState(LoggerFactory(logLevel)), logger = _0[0], setLogger = _0[1];
    var pubSub = useState(function () { return customPubSub !== null && customPubSub !== void 0 ? customPubSub : pubSubFactory(); })[0];
    var _1 = useReducer(reducer$1, initialState$1), sdkStore = _1[0], sdkDispatcher = _1[1];
    var _2 = useReducer(reducer, initialState), userStore = _2[0], userDispatcher = _2[1];
    var _3 = useUIKitConfig(), configs = _3.configs, configsWithAppAttr = _3.configsWithAppAttr, initDashboardConfigs = _3.initDashboardConfigs;
    var sdkInitialized = sdkStore.initialized;
    var sdk = sdkStore === null || sdkStore === void 0 ? void 0 : sdkStore.sdk;
    var _4 = (_b = sdk === null || sdk === void 0 ? void 0 : sdk.appInfo) !== null && _b !== void 0 ? _b : {}, uploadSizeLimit = _4.uploadSizeLimit, multipleFilesMessageFileCountLimit = _4.multipleFilesMessageFileCountLimit;
    useTheme(colorSet);
    var reconnect = useConnect({
        appId: appId,
        userId: userId,
        accessToken: accessToken,
        isUserIdUsedForNickname: isUserIdUsedForNickname,
        isMobile: isMobile,
    }, {
        logger: logger,
        nickname: nickname,
        profileUrl: profileUrl,
        configureSession: configureSession,
        customApiHost: customApiHost,
        customWebSocketHost: customWebSocketHost,
        sdkInitParams: sdkInitParams,
        customExtensionParams: customExtensionParams,
        sdk: sdk,
        sdkDispatcher: sdkDispatcher,
        userDispatcher: userDispatcher,
        initDashboardConfigs: initDashboardConfigs,
        eventHandlers: eventHandlers,
    });
    useUnmount(function () {
        if (typeof sdk.disconnect === 'function') {
            disconnectSdk({
                logger: logger,
                sdkDispatcher: sdkDispatcher,
                userDispatcher: userDispatcher,
                sdk: sdk,
            });
        }
    }, [sdk.disconnect]);
    // to create a pubsub to communicate between parent and child
    useEffect(function () {
        setLogger(LoggerFactory(logLevel));
    }, [logLevel]);
    useAppendDomNode([
        'sendbird-modal-root',
        'sendbird-dropdown-portal',
        'sendbird-emoji-list-portal',
    ], 'body');
    // should move to reducer
    var _5 = useState(theme), currentTheme = _5[0], setCurrentTheme = _5[1];
    useEffect(function () {
        setCurrentTheme(theme);
    }, [theme]);
    useEffect(function () {
        var body = document.querySelector('body');
        body.classList.remove('sendbird-experimental__rem__units');
        if (isREMUnitEnabled) {
            body.classList.add('sendbird-experimental__rem__units');
        }
    }, [isREMUnitEnabled]);
    // add-remove theme from body
    useEffect(function () {
        logger.info('Setup theme', "Theme: ".concat(currentTheme));
        try {
            var body = document.querySelector('body');
            body.classList.remove('sendbird-theme--light');
            body.classList.remove('sendbird-theme--dark');
            body.classList.add("sendbird-theme--".concat(currentTheme || 'light'));
            logger.info('Finish setup theme');
            // eslint-disable-next-line no-empty
        }
        catch (e) {
            logger.warning('Setup theme failed', "".concat(e));
        }
        return function () {
            try {
                var body = document.querySelector('body');
                body.classList.remove('sendbird-theme--light');
                body.classList.remove('sendbird-theme--dark');
                // eslint-disable-next-line no-empty
            }
            catch (_a) { }
        };
    }, [currentTheme]);
    var isOnline = useOnlineStatus(sdkStore.sdk, logger);
    var markAsReadScheduler = useMarkAsReadScheduler({ isConnected: isOnline }, { logger: logger });
    var markAsDeliveredScheduler = useMarkAsDeliveredScheduler({ isConnected: isOnline }, { logger: logger });
    var localeStringSet = React__default.useMemo(function () {
        if (!stringSet) {
            return getStringSet('en');
        }
        return __assign(__assign({}, getStringSet('en')), stringSet);
    }, [stringSet]);
    /**
     * Feature Configuration - TODO
     * This will be moved into the UIKitConfigProvider, aftering Dashboard applies
     */
    var uikitMultipleFilesMessageLimit = useMemo(function () {
        return Math.min(DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT, multipleFilesMessageFileCountLimit !== null && multipleFilesMessageFileCountLimit !== void 0 ? multipleFilesMessageFileCountLimit : Number.MAX_SAFE_INTEGER);
    }, [multipleFilesMessageFileCountLimit]);
    var uikitUploadSizeLimit = useMemo(function () {
        return uploadSizeLimit;
    }, [uploadSizeLimit]);
    // Emoji Manager
    var emojiManager = useMemo(function () {
        return new EmojiManager({
            sdk: sdk,
            logger: logger,
        });
    }, [sdkStore.initialized]);
    return (React__default.createElement(SendbirdSdkContext.Provider, { value: {
            stores: {
                sdkStore: sdkStore,
                userStore: userStore,
            },
            dispatchers: {
                sdkDispatcher: sdkDispatcher,
                userDispatcher: userDispatcher,
                reconnect: reconnect,
            },
            config: {
                disableMarkAsDelivered: disableMarkAsDelivered,
                renderUserProfile: renderUserProfile,
                onUserProfileMessage: onUserProfileMessage,
                allowProfileEdit: allowProfileEdit,
                isOnline: isOnline,
                userId: userId,
                appId: appId,
                accessToken: accessToken,
                theme: currentTheme,
                setCurrentTheme: setCurrentTheme,
                setCurrenttheme: setCurrentTheme,
                isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled,
                uikitUploadSizeLimit: uikitUploadSizeLimit,
                uikitMultipleFilesMessageLimit: uikitMultipleFilesMessageLimit,
                userListQuery: userListQuery,
                logger: logger,
                pubSub: pubSub,
                imageCompression: __assign({ compressionRate: 0.7 }, imageCompression),
                voiceRecord: {
                    maxRecordingTime: (_c = voiceRecord === null || voiceRecord === void 0 ? void 0 : voiceRecord.maxRecordingTime) !== null && _c !== void 0 ? _c : VOICE_RECORDER_DEFAULT_MAX,
                    minRecordingTime: (_d = voiceRecord === null || voiceRecord === void 0 ? void 0 : voiceRecord.minRecordingTime) !== null && _d !== void 0 ? _d : VOICE_RECORDER_DEFAULT_MIN,
                },
                userMention: {
                    maxMentionCount: (userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount) || 10,
                    maxSuggestionCount: (userMention === null || userMention === void 0 ? void 0 : userMention.maxSuggestionCount) || 15,
                },
                markAsReadScheduler: markAsReadScheduler,
                markAsDeliveredScheduler: markAsDeliveredScheduler,
                // From UIKitConfigProvider.localConfigs
                disableUserProfile: !configs.common.enableUsingDefaultUserProfile,
                isReactionEnabled: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactions,
                isMentionEnabled: configs.groupChannel.channel.enableMention,
                isVoiceMessageEnabled: configs.groupChannel.channel.enableVoiceMessage,
                replyType: getCaseResolvedReplyType(configs.groupChannel.channel.replyType).upperCase,
                isTypingIndicatorEnabledOnChannelList: configs.groupChannel.channelList.enableTypingIndicator,
                isMessageReceiptStatusEnabledOnChannelList: configs.groupChannel.channelList.enableMessageReceiptStatus,
                showSearchIcon: sdkInitialized && configsWithAppAttr(sdk).groupChannel.setting.enableMessageSearch,
                // Remote configs set from dashboard by UIKit feature configuration
                groupChannel: {
                    enableOgtag: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableOgtag,
                    enableTypingIndicator: configs.groupChannel.channel.enableTypingIndicator,
                    enableDocument: configs.groupChannel.channel.input.enableDocument,
                    enableReactions: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactions,
                    replyType: configs.groupChannel.channel.replyType,
                    threadReplySelectType: getCaseResolvedThreadReplySelectType(configs.groupChannel.channel.threadReplySelectType).lowerCase,
                    typingIndicatorTypes: configs.groupChannel.channel.typingIndicatorTypes,
                    enableFeedback: configs.groupChannel.channel.enableFeedback,
                    enableSuggestedReplies: configs.groupChannel.channel.enableSuggestedReplies,
                },
                openChannel: {
                    enableOgtag: sdkInitialized && configsWithAppAttr(sdk).openChannel.channel.enableOgtag,
                    enableDocument: configs.openChannel.channel.input.enableDocument,
                },
            },
            eventHandlers: eventHandlers,
            emojiManager: emojiManager,
        } },
        React__default.createElement(MediaQueryProvider, { logger: logger, breakpoint: breakpoint },
            React__default.createElement(LocalizationProvider, { stringSet: localeStringSet, dateLocale: dateLocale },
                React__default.createElement(VoiceMessageProvider, null,
                    React__default.createElement(GlobalModalProvider, null, children))))));
};

export { SendbirdProvider, SendbirdProvider as default };
//# sourceMappingURL=SendbirdProvider.js.map

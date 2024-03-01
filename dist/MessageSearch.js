import React__default, { useState, useContext, useEffect } from 'react';
import { MessageSearchUI } from './MessageSearch/components/MessageSearchUI.js';
import { L as LocalizationContext } from './chunks/bundle-msnuMA4R.js';
import Icon, { IconTypes, IconColors } from './ui/Icon.js';
import IconButton from './ui/IconButton.js';
import { L as Label, a as LabelTypography, b as LabelColors } from './chunks/bundle-kMMCn6GE.js';
import Loader from './ui/Loader.js';
import { MessageSearchProvider } from './MessageSearch/context.js';
import './ui/MessageSearchItem.js';
import './chunks/bundle-KMsJXUN2.js';
import './chunks/bundle-vbGNKQpe.js';
import './chunks/bundle-CsWYoRVd.js';
import './chunks/bundle-vWrgNSvP.js';
import './chunks/bundle-SpfAN5pr.js';
import './chunks/bundle-OJq071GK.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-7YRb7CRq.js';
import './chunks/bundle-DhS-f2ZT.js';
import './ui/PlaceHolder.js';
import './ui/MessageSearchFileItem.js';
import './chunks/bundle-ZnLsMTHr.js';
import '@sendbird/chat/groupChannel';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-LZemF1A7.js';
import './chunks/bundle--jWawO0i.js';
import './chunks/bundle-Tg3CrpQU.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';

var COMPONENT_CLASS_NAME = 'sendbird-message-search-pannel';
function MessageSearchPannel(props) {
    var channelUrl = props.channelUrl, onResultClick = props.onResultClick, onCloseClick = props.onCloseClick, messageSearchQuery = props.messageSearchQuery, renderPlaceHolderError = props.renderPlaceHolderError, renderPlaceHolderLoading = props.renderPlaceHolderLoading, renderPlaceHolderNoString = props.renderPlaceHolderNoString, renderPlaceHolderEmptyList = props.renderPlaceHolderEmptyList, renderSearchItem = props.renderSearchItem;
    var _a = useState(''), searchString = _a[0], setSearchString = _a[1];
    var _b = useState(''), inputString = _b[0], setInputString = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var timeout = null;
    useEffect(function () {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            setSearchString(inputString);
            setLoading(true);
            timeout = null;
        }, 500);
    }, [inputString]);
    var handleOnChangeInputString = function (e) {
        setInputString(e.target.value);
    };
    var handleOnResultLoaded = function () {
        setLoading(false);
    };
    var handleOnClickResetStringButton = function (e) {
        e.stopPropagation();
        setInputString('');
        setSearchString('');
    };
    return (React__default.createElement("div", { className: COMPONENT_CLASS_NAME },
        React__default.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__header") },
            React__default.createElement(Label, { className: "".concat(COMPONENT_CLASS_NAME, "__header__title"), type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.SEARCH_IN_CHANNEL),
            React__default.createElement(IconButton, { className: "".concat(COMPONENT_CLASS_NAME, "__header__close-button"), width: "32px", height: "32px", onClick: onCloseClick },
                React__default.createElement(Icon, { type: IconTypes.CLOSE, fillColor: IconColors.ON_BACKGROUND_1, width: "22px", height: "22px" }))),
        React__default.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__input") },
            React__default.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__input__container") },
                React__default.createElement(Icon, { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__search-icon"), type: IconTypes.SEARCH, fillColor: IconColors.ON_BACKGROUND_3, width: "24px", height: "24px" }),
                React__default.createElement("input", { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__input-area"), placeholder: stringSet.SEARCH, value: inputString, onChange: handleOnChangeInputString }),
                inputString && loading && (React__default.createElement(Loader, { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__spinner"), width: "20px", height: "20px" },
                    React__default.createElement(Icon, { type: IconTypes.SPINNER, fillColor: IconColors.PRIMARY, width: "20px", height: "20px" }))),
                !loading && inputString && (React__default.createElement(Icon, { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__reset-input-button"), type: IconTypes.REMOVE, fillColor: IconColors.ON_BACKGROUND_3, width: "20px", height: "20px", onClick: handleOnClickResetStringButton })))),
        React__default.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__message-search") },
            React__default.createElement(MessageSearchProvider, { channelUrl: channelUrl, searchString: searchString, onResultClick: onResultClick, onResultLoaded: handleOnResultLoaded, messageSearchQuery: messageSearchQuery },
                React__default.createElement(MessageSearchUI, { renderPlaceHolderError: renderPlaceHolderError, renderPlaceHolderLoading: renderPlaceHolderLoading, renderPlaceHolderNoString: renderPlaceHolderNoString, renderPlaceHolderEmptyList: renderPlaceHolderEmptyList, renderSearchItem: renderSearchItem })))));
}

export { MessageSearchPannel as default };
//# sourceMappingURL=MessageSearch.js.map

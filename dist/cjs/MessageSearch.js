'use strict';

var React = require('react');
var MessageSearch_components_MessageSearchUI = require('./MessageSearch/components/MessageSearchUI.js');
var LocalizationContext = require('./chunks/bundle-60kIt9Rq.js');
var ui_Icon = require('./ui/Icon.js');
var ui_IconButton = require('./ui/IconButton.js');
var ui_Label = require('./chunks/bundle-26QzFMMl.js');
var ui_Loader = require('./ui/Loader.js');
var MessageSearch_context = require('./MessageSearch/context.js');
require('./ui/MessageSearchItem.js');
require('./chunks/bundle-2dG9SU7T.js');
require('./chunks/bundle-Ny3NKw-X.js');
require('./chunks/bundle-gDA5XZ0C.js');
require('./chunks/bundle-Z1maM5mk.js');
require('./chunks/bundle-LQQkMjKl.js');
require('./chunks/bundle-OfFu3N1i.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-QStqvuCY.js');
require('./chunks/bundle-uGaTvmsl.js');
require('./ui/PlaceHolder.js');
require('./ui/MessageSearchFileItem.js');
require('./chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-3fb9w4KI.js');
require('./chunks/bundle-38g4arE5.js');
require('./chunks/bundle-eH49AisR.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');

var COMPONENT_CLASS_NAME = 'sendbird-message-search-pannel';
function MessageSearchPannel(props) {
    var channelUrl = props.channelUrl, onResultClick = props.onResultClick, onCloseClick = props.onCloseClick, messageSearchQuery = props.messageSearchQuery, renderPlaceHolderError = props.renderPlaceHolderError, renderPlaceHolderLoading = props.renderPlaceHolderLoading, renderPlaceHolderNoString = props.renderPlaceHolderNoString, renderPlaceHolderEmptyList = props.renderPlaceHolderEmptyList, renderSearchItem = props.renderSearchItem;
    var _a = React.useState(''), searchString = _a[0], setSearchString = _a[1];
    var _b = React.useState(''), inputString = _b[0], setInputString = _b[1];
    var _c = React.useState(false), loading = _c[0], setLoading = _c[1];
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var timeout = null;
    React.useEffect(function () {
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
    return (React.createElement("div", { className: COMPONENT_CLASS_NAME },
        React.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__header") },
            React.createElement(ui_Label.Label, { className: "".concat(COMPONENT_CLASS_NAME, "__header__title"), type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.SEARCH_IN_CHANNEL),
            React.createElement(ui_IconButton, { className: "".concat(COMPONENT_CLASS_NAME, "__header__close-button"), width: "32px", height: "32px", onClick: onCloseClick },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CLOSE, fillColor: ui_Icon.IconColors.ON_BACKGROUND_1, width: "22px", height: "22px" }))),
        React.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__input") },
            React.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__input__container") },
                React.createElement(ui_Icon.default, { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__search-icon"), type: ui_Icon.IconTypes.SEARCH, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "24px", height: "24px" }),
                React.createElement("input", { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__input-area"), placeholder: stringSet.SEARCH, value: inputString, onChange: handleOnChangeInputString }),
                inputString && loading && (React.createElement(ui_Loader, { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__spinner"), width: "20px", height: "20px" },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.SPINNER, fillColor: ui_Icon.IconColors.PRIMARY, width: "20px", height: "20px" }))),
                !loading && inputString && (React.createElement(ui_Icon.default, { className: "".concat(COMPONENT_CLASS_NAME, "__input__container__reset-input-button"), type: ui_Icon.IconTypes.REMOVE, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "20px", height: "20px", onClick: handleOnClickResetStringButton })))),
        React.createElement("div", { className: "".concat(COMPONENT_CLASS_NAME, "__message-search") },
            React.createElement(MessageSearch_context.MessageSearchProvider, { channelUrl: channelUrl, searchString: searchString, onResultClick: onResultClick, onResultLoaded: handleOnResultLoaded, messageSearchQuery: messageSearchQuery },
                React.createElement(MessageSearch_components_MessageSearchUI.MessageSearchUI, { renderPlaceHolderError: renderPlaceHolderError, renderPlaceHolderLoading: renderPlaceHolderLoading, renderPlaceHolderNoString: renderPlaceHolderNoString, renderPlaceHolderEmptyList: renderPlaceHolderEmptyList, renderSearchItem: renderSearchItem })))));
}

module.exports = MessageSearchPannel;
//# sourceMappingURL=MessageSearch.js.map

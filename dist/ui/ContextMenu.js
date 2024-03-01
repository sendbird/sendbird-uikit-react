import React__default, { useState, useRef, useEffect } from 'react';
import { e as __extends, _ as __assign } from '../chunks/bundle-KMsJXUN2.js';
import { createPortal } from 'react-dom';
import SortByRow from './SortByRow.js';
import { w as getClassName } from '../chunks/bundle-ZnLsMTHr.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-kMMCn6GE.js';
import '../chunks/bundle-4_6x-RiC.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-LZemF1A7.js';
import '../chunks/bundle-Tg3CrpQU.js';

// padding to handle height of last item in message-list
var HEIGHT_PADDING = 60;
var MenuItems$1 = /** @class */ (function (_super) {
    __extends(MenuItems, _super);
    function MenuItems(props) {
        var _this = _super.call(this, props) || this;
        _this.menuRef = React__default.createRef();
        _this.setupEvents = function () {
            var closeDropdown = _this.props.closeDropdown;
            var menuRef = _this.menuRef;
            var handleClickOutside = function (event) {
                var _a, _b;
                if ((menuRef === null || menuRef === void 0 ? void 0 : menuRef.current) && !((_b = (_a = menuRef === null || menuRef === void 0 ? void 0 : menuRef.current) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, event.target))) {
                    closeDropdown === null || closeDropdown === void 0 ? void 0 : closeDropdown();
                }
            };
            _this.setState({
                handleClickOutside: handleClickOutside,
            });
            document.addEventListener('mousedown', handleClickOutside);
        };
        _this.cleanUpEvents = function () {
            var handleClickOutside = _this.state.handleClickOutside;
            document.removeEventListener('mousedown', handleClickOutside);
        };
        _this.getMenuPosition = function () {
            var _a, _b;
            var _c = _this.props, parentRef = _c.parentRef, openLeft = _c.openLeft;
            var parentRect = (_b = (_a = parentRef === null || parentRef === void 0 ? void 0 : parentRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
            var x = (parentRect === null || parentRect === void 0 ? void 0 : parentRect.x) || (parentRect === null || parentRect === void 0 ? void 0 : parentRect.left) || 0;
            var y = (parentRect === null || parentRect === void 0 ? void 0 : parentRect.y) || (parentRect === null || parentRect === void 0 ? void 0 : parentRect.top) || 0;
            var menuStyle = {
                top: y,
                left: x,
            };
            if (!_this.menuRef.current)
                return menuStyle;
            var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
            var rect = _this.menuRef.current.getBoundingClientRect();
            if (y + rect.height + HEIGHT_PADDING > innerHeight) {
                menuStyle.top -= rect.height;
            }
            if (x + rect.width > innerWidth && !openLeft) {
                menuStyle.left -= rect.width;
            }
            if (menuStyle.top < 0) {
                menuStyle.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
            }
            menuStyle.top += 32;
            if (openLeft) {
                var padding = Number.isNaN(rect.width - 30)
                    ? 108 // default
                    : rect.width - 30;
                menuStyle.left -= padding;
            }
            // warning: this section has to be executed after the openLeft is calculated
            // menu is outside viewport
            if (menuStyle.left < 0) {
                menuStyle.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
            }
            _this.setState({ menuStyle: menuStyle });
            return menuStyle;
        };
        _this.state = {
            menuStyle: {},
            handleClickOutside: function () { },
        };
        return _this;
    }
    MenuItems.prototype.componentDidMount = function () {
        this.setupEvents();
        this.getMenuPosition();
    };
    MenuItems.prototype.componentWillUnmount = function () {
        this.cleanUpEvents();
    };
    MenuItems.prototype.render = function () {
        var _a;
        var menuStyle = this.state.menuStyle;
        var _b = this.props, children = _b.children, style = _b.style, _c = _b.className, className = _c === void 0 ? '' : _c;
        return (createPortal((React__default.createElement("div", { className: (_a = this.props) === null || _a === void 0 ? void 0 : _a.className },
            React__default.createElement("div", { className: "sendbird-dropdown__menu-backdrop" }),
            React__default.createElement("ul", { className: "".concat(className, " sendbird-dropdown__menu"), ref: this.menuRef, style: __assign({ display: 'inline-block', position: 'fixed', left: "".concat(Math.round(menuStyle.left), "px"), top: "".concat(Math.round(menuStyle.top), "px") }, style) }, children))), document.getElementById('sendbird-dropdown-portal')));
    };
    return MenuItems;
}(React__default.Component));

var defaultParentRect = { x: 0, y: 0, left: 0, top: 0, height: 0 };
var EmojiListItems$1 = function (_a) {
    var children = _a.children, parentRef = _a.parentRef, parentContainRef = _a.parentContainRef, _b = _a.spaceFromTrigger, spaceFromTrigger = _b === void 0 ? { x: 0, y: 0 } : _b, closeDropdown = _a.closeDropdown;
    var _c = useState({ left: 0, top: 0 }), reactionStyle = _c[0], setReactionStyle = _c[1];
    var reactionRef = useRef(null);
    /* showParent & hideParent */
    useEffect(function () {
        if (parentContainRef && (parentContainRef === null || parentContainRef === void 0 ? void 0 : parentContainRef.current)) {
            parentContainRef.current.classList.add('sendbird-reactions--pressed');
        }
        return function () {
            if (parentContainRef && (parentContainRef === null || parentContainRef === void 0 ? void 0 : parentContainRef.current)) {
                parentContainRef.current.classList.remove('sendbird-reactions--pressed');
            }
        };
    }, []);
    /* setupEvents & cleanupEvents */
    useEffect(function () {
        var handleClickOutSide = function (event) {
            var _a, _b;
            if ((reactionRef === null || reactionRef === void 0 ? void 0 : reactionRef.current) && !((_b = (_a = reactionRef === null || reactionRef === void 0 ? void 0 : reactionRef.current) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, event.target))) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutSide);
        return function () {
            document.removeEventListener('mousedown', handleClickOutSide);
        };
    }, []);
    /* getBarPosition */
    useEffect(function () {
        var _a, _b, _c;
        var spaceFromTriggerX = (spaceFromTrigger === null || spaceFromTrigger === void 0 ? void 0 : spaceFromTrigger.x) || 0;
        var spaceFromTriggerY = (spaceFromTrigger === null || spaceFromTrigger === void 0 ? void 0 : spaceFromTrigger.y) || 0;
        var parentRect = (_b = (_a = parentRef === null || parentRef === void 0 ? void 0 : parentRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) !== null && _b !== void 0 ? _b : defaultParentRect;
        var x = parentRect.x || parentRect.left;
        var y = parentRect.y || parentRect.top;
        var reactionStyle = {
            top: y,
            left: x,
        };
        if (!(reactionRef === null || reactionRef === void 0 ? void 0 : reactionRef.current)) {
            setReactionStyle(reactionStyle);
        }
        else {
            var rect = (_c = reactionRef === null || reactionRef === void 0 ? void 0 : reactionRef.current) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect();
            if (reactionStyle.top < rect.height) {
                reactionStyle.top += parentRect.height;
                reactionStyle.top += spaceFromTriggerY;
            }
            else {
                reactionStyle.top -= rect.height;
                reactionStyle.top -= spaceFromTriggerY;
            }
            reactionStyle.left -= rect.width / 2;
            reactionStyle.left += (parentRect.height / 2) - 2;
            reactionStyle.left += spaceFromTriggerX;
            var maximumLeft = window.innerWidth - rect.width;
            if (maximumLeft < reactionStyle.left) {
                reactionStyle.left = maximumLeft;
            }
            if (reactionStyle.left < 0) {
                reactionStyle.left = 0;
            }
            setReactionStyle(reactionStyle);
        }
    }, []);
    var rootElement = document.getElementById('sendbird-emoji-list-portal');
    if (rootElement) {
        return (createPortal(React__default.createElement(React__default.Fragment, null,
            React__default.createElement("div", { className: "sendbird-dropdown__menu-backdrop" }),
            React__default.createElement("ul", { className: "sendbird-dropdown__reaction-bar", ref: reactionRef, style: {
                    display: 'inline-block',
                    position: 'fixed',
                    left: "".concat(Math.round(reactionStyle.left), "px"),
                    top: "".concat(Math.round(reactionStyle.top), "px"),
                } },
                React__default.createElement(SortByRow, { className: "sendbird-dropdown__reaction-bar__row", maxItemCount: 8, itemWidth: 44, itemHeight: 40 }, children))), rootElement));
    }
    return null;
};

var ENTER_KEY = 13;
var MenuItems = MenuItems$1;
var EmojiListItems = EmojiListItems$1;
var MenuItem = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, onClick = _a.onClick, _c = _a.disable, disable = _c === void 0 ? false : _c, _d = _a.dataSbId, dataSbId = _d === void 0 ? '' : _d;
    var handleClickEvent = function (e) {
        if (!disable && onClick) {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
        }
    };
    return (React__default.createElement("li", { className: getClassName([className, 'sendbird-dropdown__menu-item', disable ? 'disable' : '']), role: "menuitem", "aria-disabled": disable ? true : false, onClick: handleClickEvent, onKeyPress: function (e) { if (e.keyCode === ENTER_KEY)
            handleClickEvent(e); }, tabIndex: 0, "data-sb-id": dataSbId },
        React__default.createElement(Label, { className: "sendbird-dropdown__menu-item__text", type: LabelTypography.SUBTITLE_2, color: disable ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1 }, children)));
};
var MenuRoot = function () { return (React__default.createElement("div", { id: "sendbird-dropdown-portal", className: "sendbird-dropdown-portal" })); };
// For the test environment
var EmojiReactionListRoot = function () { return React__default.createElement("div", { id: "sendbird-emoji-list-portal" }); };
function ContextMenu(_a) {
    var menuTrigger = _a.menuTrigger, menuItems = _a.menuItems, isOpen = _a.isOpen, onClick = _a.onClick;
    var _b = useState(false), showMenu = _b[0], setShowMenu = _b[1];
    return (React__default.createElement("div", { className: "sendbird-context-menu", style: { display: 'inline' }, onClick: onClick }, menuTrigger === null || menuTrigger === void 0 ? void 0 :
        menuTrigger(function () { return setShowMenu(!showMenu); }),
        (showMenu || isOpen) && menuItems(function () { return setShowMenu(false); })));
}

export { EmojiListItems, EmojiReactionListRoot, MenuItem, MenuItems, MenuRoot, ContextMenu as default };
//# sourceMappingURL=ContextMenu.js.map

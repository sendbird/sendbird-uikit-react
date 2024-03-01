'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var ui_Icon = require('./Icon.js');
var ui_AccordionGroup = require('./AccordionGroup.js');
var context = require('../chunks/bundle-o6ZMXHG_.js');
require('../chunks/bundle-Xwl4gw4D.js');

function Accordion(_a) {
    var className = _a.className, id = _a.id, renderTitle = _a.renderTitle, renderContent = _a.renderContent, renderFooter = _a.renderFooter;
    var _b = React.useState(false), showAccordion = _b[0], setShowAccordion = _b[1];
    return (React.createElement(context.Consumer, null, 
    // Function is considered like a react component
    function (value) {
        var opened = value.opened, setOpened = value.setOpened; // props from Provider
        if (id === opened) {
            setShowAccordion(true);
        }
        else {
            setShowAccordion(false);
        }
        var handleClick = function () {
            if (showAccordion) {
                setOpened('');
            }
            else {
                setOpened(id);
            }
        };
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                    'sendbird-accordion__panel-header',
                ], false).join(' '), id: id, role: "switch", "aria-checked": false, onClick: handleClick, onKeyDown: handleClick, tabIndex: 0 },
                renderTitle(),
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CHEVRON_RIGHT, className: [
                        'sendbird-accordion__panel-icon-right',
                        'sendbird-accordion__panel-icon--chevron',
                        (showAccordion ? 'sendbird-accordion__panel-icon--open' : ''),
                    ].join(' '), height: "24px", width: "24px" })),
            showAccordion && (React.createElement("div", { className: "sendbird-accordion" },
                React.createElement("div", { className: "sendbird-accordion__list" }, renderContent()),
                renderFooter && (React.createElement("div", { className: "sendbird-accordion__footer" }, renderFooter()))))));
    }));
}
var AccordionGroup = ui_AccordionGroup;

exports.AccordionGroup = AccordionGroup;
exports.default = Accordion;
//# sourceMappingURL=Accordion.js.map

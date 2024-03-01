import { c as __spreadArray } from '../chunks/bundle-KMsJXUN2.js';
import React__default, { useState } from 'react';
import Icon, { IconTypes } from './Icon.js';
import AccordionGroup$1 from './AccordionGroup.js';
import { C as Consumer } from '../chunks/bundle-JjzC7gJ9.js';
import '../chunks/bundle-7YRb7CRq.js';

function Accordion(_a) {
    var className = _a.className, id = _a.id, renderTitle = _a.renderTitle, renderContent = _a.renderContent, renderFooter = _a.renderFooter;
    var _b = useState(false), showAccordion = _b[0], setShowAccordion = _b[1];
    return (React__default.createElement(Consumer, null, 
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
        return (React__default.createElement(React__default.Fragment, null,
            React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                    'sendbird-accordion__panel-header',
                ], false).join(' '), id: id, role: "switch", "aria-checked": false, onClick: handleClick, onKeyDown: handleClick, tabIndex: 0 },
                renderTitle(),
                React__default.createElement(Icon, { type: IconTypes.CHEVRON_RIGHT, className: [
                        'sendbird-accordion__panel-icon-right',
                        'sendbird-accordion__panel-icon--chevron',
                        (showAccordion ? 'sendbird-accordion__panel-icon--open' : ''),
                    ].join(' '), height: "24px", width: "24px" })),
            showAccordion && (React__default.createElement("div", { className: "sendbird-accordion" },
                React__default.createElement("div", { className: "sendbird-accordion__list" }, renderContent()),
                renderFooter && (React__default.createElement("div", { className: "sendbird-accordion__footer" }, renderFooter()))))));
    }));
}
var AccordionGroup = AccordionGroup$1;

export { AccordionGroup, Accordion as default };
//# sourceMappingURL=Accordion.js.map

import { d as __spreadArray } from './LocalizationContext-67c61679.js';
import React__default, { useState } from 'react';
import { I as Icon, c as IconTypes } from './index-9c03380e.js';
import { n as noop } from './index-58bfa752.js';

var Context = /*#__PURE__*/React__default.createContext({
  opened: '',
  setOpened: noop
});
var Consumer = Context.Consumer;
var Provider = Context.Provider;

// Wraps all the accordions in an accordion set
function AccordionGroup$1(_a) {
  var children = _a.children,
      _b = _a.className,
      className = _b === void 0 ? '' : _b;

  var _c = useState(''),
      opened = _c[0],
      setOpened = _c[1];

  return /*#__PURE__*/React__default.createElement(Provider, {
    value: {
      opened: opened,
      setOpened: setOpened
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: className
  }, children));
}

function Accordion(_a) {
  var className = _a.className,
      id = _a.id,
      renderTitle = _a.renderTitle,
      renderContent = _a.renderContent,
      renderFooter = _a.renderFooter;

  var _b = useState(false),
      showAccordion = _b[0],
      setShowAccordion = _b[1];

  return /*#__PURE__*/React__default.createElement(Consumer, null, // Function is considered like a react component
  function (value) {
    var opened = value.opened,
        setOpened = value.setOpened; // props from Provider

    if (id === opened) {
      setShowAccordion(true);
    } else {
      setShowAccordion(false);
    }

    var handleClick = function handleClick() {
      if (showAccordion) {
        setOpened('');
      } else {
        setOpened(id);
      }
    };

    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      className: __spreadArray(__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-accordion__panel-header'], false).join(' '),
      id: id,
      role: "switch",
      "aria-checked": false,
      onClick: handleClick,
      onKeyDown: handleClick,
      tabIndex: 0
    }, renderTitle(), /*#__PURE__*/React__default.createElement(Icon, {
      type: IconTypes.CHEVRON_RIGHT,
      className: ['sendbird-accordion__panel-icon-right', 'sendbird-accordion__panel-icon--chevron', showAccordion ? 'sendbird-accordion__panel-icon--open' : ''].join(' '),
      height: "24px",
      width: "24px"
    })), showAccordion && /*#__PURE__*/React__default.createElement("div", {
      className: "sendbird-accordion"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sendbird-accordion__list"
    }, renderContent()), renderFooter && /*#__PURE__*/React__default.createElement("div", {
      className: "sendbird-accordion__footer"
    }, renderFooter())));
  });
}
var AccordionGroup = AccordionGroup$1;

export { AccordionGroup as A, Accordion as a };
//# sourceMappingURL=index-1741f6e9.js.map

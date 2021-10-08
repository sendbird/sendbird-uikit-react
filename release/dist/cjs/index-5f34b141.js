'use strict';

var LocalizationContext = require('./LocalizationContext-2e2551bf.js');
var React = require('react');
var index$1 = require('./index-55e4848c.js');
var index = require('./index-015b255c.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Context = /*#__PURE__*/React__default["default"].createContext({
  opened: '',
  setOpened: index.noop
});
var Consumer = Context.Consumer;
var Provider = Context.Provider;

// Wraps all the accordions in an accordion set
function AccordionGroup$1(_a) {
  var children = _a.children,
      _b = _a.className,
      className = _b === void 0 ? '' : _b;

  var _c = React.useState(''),
      opened = _c[0],
      setOpened = _c[1];

  return /*#__PURE__*/React__default["default"].createElement(Provider, {
    value: {
      opened: opened,
      setOpened: setOpened
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: className
  }, children));
}

function Accordion(_a) {
  var className = _a.className,
      id = _a.id,
      renderTitle = _a.renderTitle,
      renderContent = _a.renderContent,
      renderFooter = _a.renderFooter;

  var _b = React.useState(false),
      showAccordion = _b[0],
      setShowAccordion = _b[1];

  return /*#__PURE__*/React__default["default"].createElement(Consumer, null, // Function is considered like a react component
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

    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-accordion__panel-header'], false).join(' '),
      id: id,
      role: "switch",
      "aria-checked": false,
      onClick: handleClick,
      onKeyDown: handleClick,
      tabIndex: 0
    }, renderTitle(), /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
      type: index$1.IconTypes.CHEVRON_RIGHT,
      className: ['sendbird-accordion__panel-icon-right', 'sendbird-accordion__panel-icon--chevron', showAccordion ? 'sendbird-accordion__panel-icon--open' : ''].join(' '),
      height: "24px",
      width: "24px"
    })), showAccordion && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-accordion"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-accordion__list"
    }, renderContent()), renderFooter && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-accordion__footer"
    }, renderFooter())));
  });
}
var AccordionGroup = AccordionGroup$1;

exports.Accordion = Accordion;
exports.AccordionGroup = AccordionGroup;
//# sourceMappingURL=index-5f34b141.js.map

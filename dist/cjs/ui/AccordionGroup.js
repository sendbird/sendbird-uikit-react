'use strict';

var React = require('react');
var context = require('../chunks/bundle-pJROJet0.js');
require('../chunks/bundle-QStqvuCY.js');

// Wraps all the accordions in an accordion set
// keep one accordion open at a time
function AccordionGroup(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = React.useState(''), opened = _c[0], setOpened = _c[1];
    return (React.createElement(context.Provider, { value: { opened: opened, setOpened: setOpened } },
        React.createElement("div", { className: className }, children)));
}

module.exports = AccordionGroup;
//# sourceMappingURL=AccordionGroup.js.map

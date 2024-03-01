import React__default, { useState } from 'react';
import { P as Provider } from '../chunks/bundle-0AnE5qN8.js';
import '../chunks/bundle-CRwhglru.js';

// Wraps all the accordions in an accordion set
// keep one accordion open at a time
function AccordionGroup(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState(''), opened = _c[0], setOpened = _c[1];
    return (React__default.createElement(Provider, { value: { opened: opened, setOpened: setOpened } },
        React__default.createElement("div", { className: className }, children)));
}

export { AccordionGroup as default };
//# sourceMappingURL=AccordionGroup.js.map

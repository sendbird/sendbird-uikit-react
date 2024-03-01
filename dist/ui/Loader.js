import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import Icon, { IconTypes } from './Icon.js';
import '../chunks/bundle-CRwhglru.js';

function Loader(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.width, width = _c === void 0 ? '26px' : _c, _d = _a.height, height = _d === void 0 ? '26px' : _d, children = _a.children;
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-loader',
        ], false).join(' '), style: {
            width: typeof width === 'string' ? width : "".concat(width, "px"),
            height: typeof height === 'string' ? height : "".concat(height, "px"),
        } }, children
        || (React__default.createElement(Icon, { type: IconTypes.SPINNER, width: "26px", height: "26px" }))));
}

export { Loader as default };
//# sourceMappingURL=Loader.js.map

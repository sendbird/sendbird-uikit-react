import { c as __spreadArray } from '../chunks/bundle-xhjHZ041.js';
import React__default from 'react';
import { u as uuidv4 } from '../chunks/bundle-BZ3hPsJ8.js';

var componentClassName = 'sendbird-sort-by-row';
function SortByRow(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, maxItemCount = _a.maxItemCount, itemWidth = _a.itemWidth, itemHeight = _a.itemHeight, children = _a.children;
    if (Array.isArray(children) && children.length > maxItemCount) {
        var result = [];
        for (var i = 0; i < children.length; i += maxItemCount) {
            result.push(React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                    componentClassName,
                ], false).join(' '), key: uuidv4(), style: {
                    width: itemWidth * maxItemCount,
                    height: itemHeight,
                } }, children.slice(i, i + maxItemCount)));
        }
        return React__default.createElement(React__default.Fragment, null, result);
    }
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            componentClassName,
        ], false).join(' '), style: {
            width: itemWidth * (Array.isArray(children) ? children.length : 1),
            height: itemHeight,
        } }, children));
}

export { SortByRow as default };
//# sourceMappingURL=SortByRow.js.map

import { _ as __assign, c as __spreadArray } from '../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { u as useLongPress } from '../chunks/bundle-3iFqiLDd.js';
import { n as noop } from '../chunks/bundle-7YRb7CRq.js';
import '../chunks/bundle-ZTmwWu_-.js';

var ReactionButton = React__default.forwardRef(function (props, ref) {
    var className = props.className, width = props.width, height = props.height, selected = props.selected, _a = props.dataSbId, dataSbId = _a === void 0 ? '' : _a, onClick = props.onClick, children = props.children;
    var onClickHandler = useLongPress({
        onLongPress: noop,
        onClick: onClick,
    }, {
        shouldPreventDefault: true,
        shouldStopPropagation: true,
    });
    return (React__default.createElement("div", __assign({ className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            "sendbird-reaction-button".concat(selected ? '--selected' : ''),
        ], false).join(' '), ref: ref, role: "button", style: { width: width, height: height } }, onClickHandler, { tabIndex: 0, "data-sb-id": dataSbId }),
        React__default.createElement("div", { className: "sendbird-reaction-button__inner" }, children)));
});

export { ReactionButton as default };
//# sourceMappingURL=ReactionButton.js.map

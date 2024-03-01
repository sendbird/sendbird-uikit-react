import React__default, { useRef } from 'react';
import { createPortal } from 'react-dom';
import '../hooks/useModal.js';
import { a as MODAL_ROOT } from '../chunks/bundle-O8mkJ7az.js';
import '../chunks/bundle-KMsJXUN2.js';
import '../chunks/bundle-LZemF1A7.js';
import '../chunks/bundle-7YRb7CRq.js';
import '../chunks/bundle-msnuMA4R.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '../chunks/bundle-CsWYoRVd.js';
import '../chunks/bundle-ZTmwWu_-.js';
import './IconButton.js';
import './Button.js';
import '../chunks/bundle-kMMCn6GE.js';
import './Icon.js';

var BottomSheet = function (props) {
    var _a = props.className, className = _a === void 0 ? '' : _a, children = props.children, onBackdropClick = props.onBackdropClick;
    // https://github.com/testing-library/react-testing-library/issues/62#issuecomment-438653348
    var portalRoot = useRef();
    portalRoot.current = document.getElementById(MODAL_ROOT);
    if (!portalRoot.current) {
        portalRoot.current = document.createElement('div');
        portalRoot.current.setAttribute('id', MODAL_ROOT);
        document.body.appendChild(portalRoot.current);
    }
    return createPortal(React__default.createElement("div", { className: "".concat(className, " sendbird-bottomsheet") },
        React__default.createElement("div", { className: 'sendbird-bottomsheet__content', role: 'dialog', "aria-modal": 'true', "aria-expanded": 'true' }, children),
        React__default.createElement("div", { className: "\n          sendbird-bottomsheet__backdrop\n        ", onClick: function (e) {
                e === null || e === void 0 ? void 0 : e.stopPropagation();
                onBackdropClick();
            } })), portalRoot.current);
};

export { BottomSheet as default };
//# sourceMappingURL=BottomSheet.js.map

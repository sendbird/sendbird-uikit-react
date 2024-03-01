'use strict';

var React = require('react');
var reactDom = require('react-dom');
require('../hooks/useModal.js');
var ui_Modal = require('../chunks/bundle-CfdtYkhL.js');
require('../chunks/bundle-2dG9SU7T.js');
require('../chunks/bundle-3fb9w4KI.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-60kIt9Rq.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../chunks/bundle-MZHOyRuu.js');
require('./IconButton.js');
require('./Button.js');
require('../chunks/bundle-26QzFMMl.js');
require('./Icon.js');

var BottomSheet = function (props) {
    var _a = props.className, className = _a === void 0 ? '' : _a, children = props.children, onBackdropClick = props.onBackdropClick;
    // https://github.com/testing-library/react-testing-library/issues/62#issuecomment-438653348
    var portalRoot = React.useRef();
    portalRoot.current = document.getElementById(ui_Modal.MODAL_ROOT);
    if (!portalRoot.current) {
        portalRoot.current = document.createElement('div');
        portalRoot.current.setAttribute('id', ui_Modal.MODAL_ROOT);
        document.body.appendChild(portalRoot.current);
    }
    return reactDom.createPortal(React.createElement("div", { className: "".concat(className, " sendbird-bottomsheet") },
        React.createElement("div", { className: 'sendbird-bottomsheet__content', role: 'dialog', "aria-modal": 'true', "aria-expanded": 'true' }, children),
        React.createElement("div", { className: "\n          sendbird-bottomsheet__backdrop\n        ", onClick: function (e) {
                e === null || e === void 0 ? void 0 : e.stopPropagation();
                onBackdropClick();
            } })), portalRoot.current);
};

module.exports = BottomSheet;
//# sourceMappingURL=BottomSheet.js.map

'use strict';

var React = require('react');
var reactDom = require('react-dom');
require('../hooks/useModal.js');
var ui_Modal = require('../chunks/bundle-NeYvE4zX.js');
require('../chunks/bundle-zYqQA3cT.js');
require('../chunks/bundle-8G36Z6Or.js');
require('../chunks/bundle-Xwl4gw4D.js');
require('../chunks/bundle-Nz6fSUye.js');
require('../chunks/bundle-xYV6cL9E.js');
require('../chunks/bundle-eyiJykZ-.js');
require('../chunks/bundle-37dz9yoi.js');
require('./IconButton.js');
require('./Button.js');
require('../chunks/bundle-2Pq38lvD.js');
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

'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var index = require('../chunks/bundle-3fb9w4KI.js');
var utils = require('../chunks/bundle-QStqvuCY.js');
var ui_Modal = require('../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../chunks/bundle-60kIt9Rq.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../chunks/bundle-MZHOyRuu.js');
require('../ui/IconButton.js');
require('../ui/Button.js');
require('../chunks/bundle-26QzFMMl.js');
require('../ui/Icon.js');

var GlobalModalContext = React.createContext({
    openModal: utils.noop,
});
var GlobalModalProvider = function (_a) {
    var children = _a.children;
    // Idea from https://dev.to/nurislamov/simple-modals-queue-in-react-4g6c
    var _b = React.useState([]), globalModalQueue = _b[0], setGlobalModalQueue = _b[1];
    var openModal = React.useCallback(function (props) {
        setGlobalModalQueue(function (currentQue) { return _tslib.__spreadArray(_tslib.__spreadArray([], currentQue, true), [props], false); });
    }, []);
    var closeModal = React.useCallback(function () {
        setGlobalModalQueue(function (currentQue) { return currentQue.slice(1); });
    }, []);
    var ModalComponent = React.useMemo(function () { return function () {
        return index.K(globalModalQueue)
            .when(function (q) { return q.length === 0; }, function () {
            return React.createElement(React.Fragment, null);
        })
            .otherwise(function () {
            var _a = globalModalQueue[0], modalProps = _a.modalProps, childElement = _a.childElement;
            return (React.createElement(ui_Modal.Modal, _tslib.__assign({}, modalProps, { className: "sendbird-global-modal ".concat(modalProps === null || modalProps === void 0 ? void 0 : modalProps.className), onClose: function () {
                    var _a;
                    (_a = modalProps === null || modalProps === void 0 ? void 0 : modalProps.onClose) === null || _a === void 0 ? void 0 : _a.call(modalProps);
                    closeModal();
                } }), childElement({
                closeModal: closeModal,
            })));
        });
    }; }, [globalModalQueue]);
    return (React.createElement(GlobalModalContext.Provider, { value: {
            openModal: openModal,
        } },
        React.createElement(ModalComponent, null),
        children));
};
var useGlobalModalContext = function () { return React.useContext(GlobalModalContext); };

exports.MODAL_ROOT = ui_Modal.MODAL_ROOT;
exports.ModalRoot = ui_Modal.ModalRoot;
exports.GlobalModalProvider = GlobalModalProvider;
exports.useGlobalModalContext = useGlobalModalContext;
//# sourceMappingURL=useModal.js.map

import { c as __spreadArray, _ as __assign } from '../chunks/bundle-UnAcr6wX.js';
import React__default, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { K } from '../chunks/bundle-UuydkZ4A.js';
import { n as noop } from '../chunks/bundle-CRwhglru.js';
import { M as Modal } from '../chunks/bundle--BlhOpUS.js';
export { a as MODAL_ROOT, b as ModalRoot } from '../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../chunks/bundle-hS8Jw8F1.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '../chunks/bundle-8u3PnqsX.js';
import '../chunks/bundle-qlkGlvyT.js';
import '../ui/IconButton.js';
import '../ui/Button.js';
import '../chunks/bundle-ljRDDTki.js';
import '../ui/Icon.js';

var GlobalModalContext = createContext({
    openModal: noop,
});
var GlobalModalProvider = function (_a) {
    var children = _a.children;
    // Idea from https://dev.to/nurislamov/simple-modals-queue-in-react-4g6c
    var _b = useState([]), globalModalQueue = _b[0], setGlobalModalQueue = _b[1];
    var openModal = useCallback(function (props) {
        setGlobalModalQueue(function (currentQue) { return __spreadArray(__spreadArray([], currentQue, true), [props], false); });
    }, []);
    var closeModal = useCallback(function () {
        setGlobalModalQueue(function (currentQue) { return currentQue.slice(1); });
    }, []);
    var ModalComponent = useMemo(function () { return function () {
        return K(globalModalQueue)
            .when(function (q) { return q.length === 0; }, function () {
            return React__default.createElement(React__default.Fragment, null);
        })
            .otherwise(function () {
            var _a = globalModalQueue[0], modalProps = _a.modalProps, childElement = _a.childElement;
            return (React__default.createElement(Modal, __assign({}, modalProps, { className: "sendbird-global-modal ".concat(modalProps === null || modalProps === void 0 ? void 0 : modalProps.className), onClose: function () {
                    var _a;
                    (_a = modalProps === null || modalProps === void 0 ? void 0 : modalProps.onClose) === null || _a === void 0 ? void 0 : _a.call(modalProps);
                    closeModal();
                } }), childElement({
                closeModal: closeModal,
            })));
        });
    }; }, [globalModalQueue]);
    return (React__default.createElement(GlobalModalContext.Provider, { value: {
            openModal: openModal,
        } },
        React__default.createElement(ModalComponent, null),
        children));
};
var useGlobalModalContext = function () { return useContext(GlobalModalContext); };

export { GlobalModalProvider, useGlobalModalContext };
//# sourceMappingURL=useModal.js.map

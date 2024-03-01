import React__default from 'react';
import BottomSheet from './BottomSheet.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import { u as useLocalization } from '../chunks/bundle-hS8Jw8F1.js';
import 'react-dom';
import '../hooks/useModal.js';
import '../chunks/bundle-UnAcr6wX.js';
import '../chunks/bundle-UuydkZ4A.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle--BlhOpUS.js';
import '../chunks/bundle-qlkGlvyT.js';
import './IconButton.js';
import './Button.js';
import './Icon.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '../chunks/bundle-8u3PnqsX.js';

function MobileFeedbackMenu(props) {
    var hideMenu = props.hideMenu, onEditFeedback = props.onEditFeedback, onRemoveFeedback = props.onRemoveFeedback;
    var stringSet = useLocalization().stringSet;
    return (React__default.createElement(BottomSheet, { onBackdropClick: hideMenu },
        React__default.createElement("div", { className: 'sendbird-message__bottomsheet--feedback-options-menu' },
            React__default.createElement("div", { className: 'sendbird-message__bottomsheet--feedback-option', onClick: function () {
                    hideMenu();
                    onEditFeedback();
                } },
                React__default.createElement(Label, { type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.EDIT_COMMENT)),
            React__default.createElement("div", { className: 'sendbird-message__bottomsheet--feedback-option', onClick: function () {
                    hideMenu();
                    onRemoveFeedback();
                } },
                React__default.createElement(Label, { type: LabelTypography.BODY_1, color: LabelColors.ERROR }, stringSet.REMOVE_FEEDBACK)))));
}

export { MobileFeedbackMenu as default };
//# sourceMappingURL=MobileFeedbackMenu.js.map

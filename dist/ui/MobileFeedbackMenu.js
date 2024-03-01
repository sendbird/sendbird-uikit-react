import React__default from 'react';
import BottomSheet from './BottomSheet.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-kMMCn6GE.js';
import { u as useLocalization } from '../chunks/bundle-msnuMA4R.js';
import 'react-dom';
import '../hooks/useModal.js';
import '../chunks/bundle-KMsJXUN2.js';
import '../chunks/bundle-LZemF1A7.js';
import '../chunks/bundle-7YRb7CRq.js';
import '../chunks/bundle-O8mkJ7az.js';
import '../chunks/bundle-ZTmwWu_-.js';
import './IconButton.js';
import './Button.js';
import './Icon.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '../chunks/bundle-CsWYoRVd.js';

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

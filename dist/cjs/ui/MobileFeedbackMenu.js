'use strict';

var React = require('react');
var ui_BottomSheet = require('./BottomSheet.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
require('react-dom');
require('../hooks/useModal.js');
require('../chunks/bundle-2dG9SU7T.js');
require('../chunks/bundle-3fb9w4KI.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-CfdtYkhL.js');
require('../chunks/bundle-MZHOyRuu.js');
require('./IconButton.js');
require('./Button.js');
require('./Icon.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');

function MobileFeedbackMenu(props) {
    var hideMenu = props.hideMenu, onEditFeedback = props.onEditFeedback, onRemoveFeedback = props.onRemoveFeedback;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    return (React.createElement(ui_BottomSheet, { onBackdropClick: hideMenu },
        React.createElement("div", { className: 'sendbird-message__bottomsheet--feedback-options-menu' },
            React.createElement("div", { className: 'sendbird-message__bottomsheet--feedback-option', onClick: function () {
                    hideMenu();
                    onEditFeedback();
                } },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.EDIT_COMMENT)),
            React.createElement("div", { className: 'sendbird-message__bottomsheet--feedback-option', onClick: function () {
                    hideMenu();
                    onRemoveFeedback();
                } },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ERROR }, stringSet.REMOVE_FEEDBACK)))));
}

module.exports = MobileFeedbackMenu;
//# sourceMappingURL=MobileFeedbackMenu.js.map

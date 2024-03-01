'use strict';

var React = require('react');
var ui_BottomSheet = require('./BottomSheet.js');
var ui_Label = require('../chunks/bundle-KkCwxjVN.js');
var LocalizationContext = require('../chunks/bundle-WKa05h0_.js');
require('react-dom');
require('../hooks/useModal.js');
require('../chunks/bundle-xbdnJE9-.js');
require('../chunks/bundle-tNuJSOqI.js');
require('../chunks/bundle-jCTpndN0.js');
require('../chunks/bundle-6hGNMML2.js');
require('../chunks/bundle-4WvE40Un.js');
require('./IconButton.js');
require('./Button.js');
require('./Icon.js');
require('../chunks/bundle-Yzhiyr0t.js');
require('../chunks/bundle-HY8cubCp.js');

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

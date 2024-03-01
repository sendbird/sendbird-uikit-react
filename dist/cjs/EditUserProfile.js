'use strict';

var React = require('react');
var EditUserProfile_context = require('./EditUserProfile/context.js');
var EditUserProfile_components_EditUserProfileUI = require('./EditUserProfile/components/EditUserProfileUI.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-2dG9SU7T.js');
require('./chunks/bundle-60kIt9Rq.js');
require('./chunks/bundle-eH49AisR.js');
require('./chunks/bundle-gDA5XZ0C.js');
require('./chunks/bundle-IRVkjbHt.js');
require('./chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('./chunks/bundle-QStqvuCY.js');
require('./chunks/bundle-MZHOyRuu.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./chunks/bundle-26QzFMMl.js');
require('./ui/Icon.js');
require('./ui/Input.js');
require('./chunks/bundle-OfFu3N1i.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-uGaTvmsl.js');
require('./ui/TextButton.js');
require('./chunks/bundle-KNt569rP.js');

var EditUserProfile = function (props) {
    var onEditProfile = props.onEditProfile, onCancel = props.onCancel, onThemeChange = props.onThemeChange;
    return (React.createElement(EditUserProfile_context.EditUserProfileProvider, { onEditProfile: onEditProfile, onCancel: onCancel, onThemeChange: onThemeChange },
        React.createElement(EditUserProfile_components_EditUserProfileUI.EditUserProfileUI, null)));
};

module.exports = EditUserProfile;
//# sourceMappingURL=EditUserProfile.js.map

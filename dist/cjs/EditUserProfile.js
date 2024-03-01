'use strict';

var React = require('react');
var EditUserProfile_context = require('./EditUserProfile/context.js');
var EditUserProfile_components_EditUserProfileUI = require('./EditUserProfile/components/EditUserProfileUI.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-xbdnJE9-.js');
require('./chunks/bundle-WKa05h0_.js');
require('./chunks/bundle-Yzhiyr0t.js');
require('./chunks/bundle-HY8cubCp.js');
require('./chunks/bundle-BWsz2Xk-.js');
require('./chunks/bundle-6hGNMML2.js');
require('react-dom');
require('./chunks/bundle-jCTpndN0.js');
require('./chunks/bundle-4WvE40Un.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./chunks/bundle-KkCwxjVN.js');
require('./ui/Icon.js');
require('./ui/Input.js');
require('./chunks/bundle--jUKLwRX.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-kftX5Dbs.js');
require('./ui/TextButton.js');
require('./chunks/bundle-0uk8Bfy0.js');

var EditUserProfile = function (props) {
    var onEditProfile = props.onEditProfile, onCancel = props.onCancel, onThemeChange = props.onThemeChange;
    return (React.createElement(EditUserProfile_context.EditUserProfileProvider, { onEditProfile: onEditProfile, onCancel: onCancel, onThemeChange: onThemeChange },
        React.createElement(EditUserProfile_components_EditUserProfileUI.EditUserProfileUI, null)));
};

module.exports = EditUserProfile;
//# sourceMappingURL=EditUserProfile.js.map

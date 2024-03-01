'use strict';

var React = require('react');
var EditUserProfile_context = require('./EditUserProfile/context.js');
var EditUserProfile_components_EditUserProfileUI = require('./EditUserProfile/components/EditUserProfileUI.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-zYqQA3cT.js');
require('./chunks/bundle-Nz6fSUye.js');
require('./chunks/bundle-xYV6cL9E.js');
require('./chunks/bundle-eyiJykZ-.js');
require('./chunks/bundle-sHU9iRBT.js');
require('./chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('./chunks/bundle-Xwl4gw4D.js');
require('./chunks/bundle-37dz9yoi.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./chunks/bundle-2Pq38lvD.js');
require('./ui/Icon.js');
require('./ui/Input.js');
require('./chunks/bundle-PoiZwjvJ.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-5mXB6h1C.js');
require('./ui/TextButton.js');
require('./chunks/bundle-oaDSLq17.js');

var EditUserProfile = function (props) {
    var onEditProfile = props.onEditProfile, onCancel = props.onCancel, onThemeChange = props.onThemeChange;
    return (React.createElement(EditUserProfile_context.EditUserProfileProvider, { onEditProfile: onEditProfile, onCancel: onCancel, onThemeChange: onThemeChange },
        React.createElement(EditUserProfile_components_EditUserProfileUI.EditUserProfileUI, null)));
};

module.exports = EditUserProfile;
//# sourceMappingURL=EditUserProfile.js.map

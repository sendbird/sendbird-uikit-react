'use strict';

var React = require('react');

var EditUserProfileProviderContext = React.createContext(undefined);
var EditUserProfileProvider = function (props) {
    var children = props.children, onEditProfile = props.onEditProfile, onCancel = props.onCancel, onThemeChange = props.onThemeChange;
    var value = React.useMemo(function () {
        return {
            onEditProfile: onEditProfile,
            onCancel: onCancel,
            onThemeChange: onThemeChange,
        };
    }, []);
    return (React.createElement(EditUserProfileProviderContext.Provider, { value: value }, children));
};
var useEditUserProfileContext = function () { return (React.useContext(EditUserProfileProviderContext)); };

exports.EditUserProfileProvider = EditUserProfileProvider;
exports.useEditUserProfileContext = useEditUserProfileContext;
//# sourceMappingURL=context.js.map

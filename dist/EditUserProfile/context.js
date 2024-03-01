import React__default, { useMemo } from 'react';

var EditUserProfileProviderContext = React__default.createContext(undefined);
var EditUserProfileProvider = function (props) {
    var children = props.children, onEditProfile = props.onEditProfile, onCancel = props.onCancel, onThemeChange = props.onThemeChange;
    var value = useMemo(function () {
        return {
            onEditProfile: onEditProfile,
            onCancel: onCancel,
            onThemeChange: onThemeChange,
        };
    }, []);
    return (React__default.createElement(EditUserProfileProviderContext.Provider, { value: value }, children));
};
var useEditUserProfileContext = function () { return (React__default.useContext(EditUserProfileProviderContext)); };

export { EditUserProfileProvider, useEditUserProfileContext };
//# sourceMappingURL=context.js.map

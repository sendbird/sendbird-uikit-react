import React__default from 'react';
import { g as getStringSet } from './bundle--MbN9aKT.js';
import { d as defaultLocale } from './bundle-V_fO-GlK.js';

var LocalizationContext = React__default.createContext({
    stringSet: getStringSet('en'),
    dateLocale: defaultLocale,
});
var LocalizationProvider = function (props) {
    var children = props.children;
    return (React__default.createElement(LocalizationContext.Provider, { value: props }, children));
};
var useLocalization = function () { return React__default.useContext(LocalizationContext); };

export { LocalizationContext as L, LocalizationProvider as a, useLocalization as u };
//# sourceMappingURL=bundle-1inZXcUV.js.map

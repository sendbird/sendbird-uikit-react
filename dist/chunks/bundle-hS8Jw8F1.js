import React__default from 'react';
import { g as getStringSet } from './bundle-PIrj5Rm1.js';
import { d as defaultLocale } from './bundle-8u3PnqsX.js';

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
//# sourceMappingURL=bundle-hS8Jw8F1.js.map

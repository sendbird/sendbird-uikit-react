import React__default from 'react';
import { g as getStringSet } from './bundle-Tg3CrpQU.js';
import { d as defaultLocale } from './bundle-CsWYoRVd.js';

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
//# sourceMappingURL=bundle-msnuMA4R.js.map

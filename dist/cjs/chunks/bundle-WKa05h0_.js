'use strict';

var React = require('react');
var stringSet = require('./bundle-Yzhiyr0t.js');
var index = require('./bundle-HY8cubCp.js');

var LocalizationContext = React.createContext({
    stringSet: stringSet.getStringSet('en'),
    dateLocale: index.defaultLocale,
});
var LocalizationProvider = function (props) {
    var children = props.children;
    return (React.createElement(LocalizationContext.Provider, { value: props }, children));
};
var useLocalization = function () { return React.useContext(LocalizationContext); };

exports.LocalizationContext = LocalizationContext;
exports.LocalizationProvider = LocalizationProvider;
exports.useLocalization = useLocalization;
//# sourceMappingURL=bundle-WKa05h0_.js.map

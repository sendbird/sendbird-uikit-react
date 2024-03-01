import { _ as __assign } from './chunks/bundle-xhjHZ041.js';
import React__default from 'react';

var SendbirdSdkContext = React__default.createContext(null);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var withSendbirdContext = function (OriginalComponent, mapStoreToProps) {
    var ContextAwareComponent = function (props) { return (React__default.createElement(SendbirdSdkContext.Consumer, null, function (context) {
        if (mapStoreToProps && typeof mapStoreToProps !== 'function') {
            // eslint-disable-next-line no-console
            console.warn('Second parameter to withSendbirdContext must be a pure function');
        }
        var mergedProps = (mapStoreToProps && typeof mapStoreToProps === 'function')
            ? __assign(__assign({}, mapStoreToProps(context)), props) : __assign(__assign({}, context), props);
        // eslint-disable-next-line react/jsx-props-no-spreading
        return React__default.createElement(OriginalComponent, __assign({}, mergedProps));
    })); };
    var componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
    ContextAwareComponent.displayName = "SendbirdAware".concat(componentName);
    return ContextAwareComponent;
};

export { SendbirdSdkContext, withSendbirdContext as default };
//# sourceMappingURL=withSendbird.js.map

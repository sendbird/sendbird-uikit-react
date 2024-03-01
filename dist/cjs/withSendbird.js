'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('./chunks/bundle-xbdnJE9-.js');
var React = require('react');

var SendbirdSdkContext = React.createContext(null);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var withSendbirdContext = function (OriginalComponent, mapStoreToProps) {
    var ContextAwareComponent = function (props) { return (React.createElement(SendbirdSdkContext.Consumer, null, function (context) {
        if (mapStoreToProps && typeof mapStoreToProps !== 'function') {
            // eslint-disable-next-line no-console
            console.warn('Second parameter to withSendbirdContext must be a pure function');
        }
        var mergedProps = (mapStoreToProps && typeof mapStoreToProps === 'function')
            ? _tslib.__assign(_tslib.__assign({}, mapStoreToProps(context)), props) : _tslib.__assign(_tslib.__assign({}, context), props);
        // eslint-disable-next-line react/jsx-props-no-spreading
        return React.createElement(OriginalComponent, _tslib.__assign({}, mergedProps));
    })); };
    var componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
    ContextAwareComponent.displayName = "SendbirdAware".concat(componentName);
    return ContextAwareComponent;
};

exports.SendbirdSdkContext = SendbirdSdkContext;
exports.default = withSendbirdContext;
//# sourceMappingURL=withSendbird.js.map

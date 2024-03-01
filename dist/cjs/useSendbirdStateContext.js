'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var withSendbird = require('./withSendbird.js');
require('./chunks/bundle-2dG9SU7T.js');

/**
 * Example:
 * const MyComponent = () => {
 *  const context = useSendbirdStateContext();
 *  const sdk = sendbirdSelectors.getSdk(context);
 *  return (<div>...</div>);
 * }
 */
var NO_CONTEXT_ERROR = 'No sendbird state value available. Make sure you are rendering `<SendbirdProvider>` at the top of your app.';
function useSendbirdStateContext() {
    var context = React.useContext(withSendbird.SendbirdSdkContext);
    if (!context)
        throw new Error(NO_CONTEXT_ERROR);
    return context;
}

exports.default = useSendbirdStateContext;
exports.useSendbirdStateContext = useSendbirdStateContext;
//# sourceMappingURL=useSendbirdStateContext.js.map

import { useContext } from 'react';
import { SendbirdSdkContext } from './withSendbird.js';
import './chunks/bundle-UnAcr6wX.js';

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
    var context = useContext(SendbirdSdkContext);
    if (!context)
        throw new Error(NO_CONTEXT_ERROR);
    return context;
}

export { useSendbirdStateContext as default, useSendbirdStateContext };
//# sourceMappingURL=useSendbirdStateContext.js.map

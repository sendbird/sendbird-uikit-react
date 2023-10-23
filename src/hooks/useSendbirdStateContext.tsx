/**
 * Example:
 * const MyComponent = () => {
 *  const context = useSendbirdStateContext();
 *  const sdk = sendbirdSelectors.getSdk(context);
 *  return (<div>...</div>);
 * }
 */
import { useContext } from 'react';

import { SendbirdSdkContext } from '../lib/SendbirdSdkContext';
import { SendBirdState } from '../lib/types';

const NO_CONTEXT_ERROR = 'No sendbird state value available. Make sure you are rendering `<SendbirdProvider>` at the top of your app.';

export function useSendbirdStateContext(): SendBirdState {
  const context = useContext(SendbirdSdkContext);
  if (!context) throw new Error(NO_CONTEXT_ERROR);
  return context;
}

export default useSendbirdStateContext;

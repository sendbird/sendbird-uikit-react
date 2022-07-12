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
import { SendbirdState } from '../lib/types';

function useSendbirdStateContext (): SendbirdState {
  const context: SendbirdState = useContext(SendbirdSdkContext);
  return context;
}

export default useSendbirdStateContext;

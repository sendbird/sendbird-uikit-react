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
import { SendBirdState } from '../index';

function useSendbirdStateContext (): SendBirdState {
  const context: SendBirdState = useContext(SendbirdSdkContext);
  return context;
}

export default useSendbirdStateContext;
